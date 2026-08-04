import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { checkBotId } from "botid/server";
import { loadGuests, loadResponses, isClosed } from "@/lib/sheets";
import { RSVP_COOKIE, hasProvenParty } from "@/lib/rsvp-cookie";
import {
  findParty,
  latestResponsesForParty,
  namesInMultipleParties,
  decodePlusOneName,
  normalize,
  MIN_QUERY_LENGTH,
  type Party,
  type ResponseRecord,
} from "@/lib/rsvp";

/*
 * Guest lookup for the RSVP modal. Takes a typed name and returns only the
 * matching parties (never the whole list) plus any prior response for prefill.
 * Node runtime + dynamic: reads the request body and hits Sheets.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* Per-instance rate limit — blunts guest-list enumeration. Best-effort only
 * (serverless spreads requests across instances), which is fine here. */
const HITS = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_HITS = 40;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (HITS.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  HITS.set(ip, recent);
  return recent.length > MAX_HITS;
}

type Prefill = {
  people: Record<string, { attending: string; dietary: string }>; // by member name
  plusOnes: Record<string, { name: string; attending: string; dietary: string }>; // by host name
  email: string;
  message: string;
  submittedAt: string; // raw Timestamp cell of the latest submission
};

/** Rebuild the modal's prefill shape from a party's stored rows. Rows carry
 *  no guestId — people are matched back to the party's current members by
 *  normalized name, and a plus-one's host by decoding its Name suffix. */
function buildPrefill(rows: ResponseRecord[], party: Party): Prefill | null {
  if (!rows.length) return null;
  const people: Prefill["people"] = {};
  const plusOnes: Prefill["plusOnes"] = {};
  let email = "";
  let message = "";
  const byNormalizedName = new Map(
    party.members.map((m) => [normalize(m.name), m]),
  );
  for (const r of rows) {
    if (r.email) email = r.email;
    if (r.message) message = r.message;
    const plus = decodePlusOneName(r.name);
    if (plus) {
      const host = byNormalizedName.get(normalize(plus.hostName));
      if (host) {
        plusOnes[host.name] = {
          name: plus.name,
          attending: r.attending,
          dietary: r.dietary,
        };
      }
      continue;
    }
    const host = byNormalizedName.get(normalize(r.name));
    if (host) {
      people[host.name] = { attending: r.attending, dietary: r.dietary };
    }
  }
  // All rows of the latest submission share one Timestamp (appended together).
  return { people, plusOnes, email, message, submittedAt: rows[0].timestamp };
}

export async function POST(request: Request) {
  if (isClosed()) return NextResponse.json({ closed: true });

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Too many attempts." }, { status: 429 });
  }

  /* Invisible bot challenge, before any Sheets read. The per-instance limiter
   * above only slows a scripted client down; this is what stops it. */
  if ((await checkBotId()).isBot) {
    return NextResponse.json({ error: "Access denied." }, { status: 403 });
  }

  let query = "";
  try {
    const body = (await request.json()) as { query?: string };
    query = (body.query ?? "").trim();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (query.length < MIN_QUERY_LENGTH) {
    return NextResponse.json({ matches: [] });
  }

  try {
    const guests = await loadGuests();
    const found = findParty(guests, query);
    if (found.status === "none") return NextResponse.json({ matches: [] });
    // One full name, two households: disclose neither.
    if (found.status === "ambiguous") {
      return NextResponse.json({ matches: [], ambiguous: true });
    }
    const party = found.party;

    const responses = await loadResponses();
    /* A name owned by two households can't be attributed to either, so its
     * stored rows are ignored for prefill rather than shown to the wrong
     * family. loadGuests logs these; see namesInMultipleParties. */
    const rows = latestResponsesForParty(
      responses,
      party,
      namesInMultipleParties(guests),
    );

    /* Prior answers go ONLY to the browser that submitted them. Anyone else who
     * knows this name learns that a response exists and when — not who's
     * coming, dietary notes, the email, or the message. */
    const proven = hasProvenParty(
      (await cookies()).get(RSVP_COOKIE)?.value,
      party.partyId,
    );
    const existing = proven ? buildPrefill(rows, party) : null;
    const responded = rows.length ? { submittedAt: rows[0].timestamp } : null;

    return NextResponse.json({
      matches: [
        {
          partyId: party.partyId,
          partyLabel: party.partyLabel,
          members: party.members,
          existing,
          responded,
        },
      ],
    });
  } catch (err) {
    console.error("RSVP lookup failed", err);
    return NextResponse.json({ error: "Lookup failed." }, { status: 500 });
  }
}

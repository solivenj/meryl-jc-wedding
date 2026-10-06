import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { checkBotId } from "botid/server";
import { loadGuests, loadResponses, appendResponses, isClosed } from "@/lib/sheets";
import { hasProvenParty, buildPartyCookie } from "@/lib/rsvp-cookie";
import type { RsvpEvent } from "@/lib/rsvp-events";
import {
  findParty,
  latestResponsesForParty,
  namesInMultipleParties,
  decodePlusOneName,
  normalize,
  validateSubmission,
  buildParties,
  buildEditNote,
  MIN_QUERY_LENGTH,
  type Party,
  type ResponseRecord,
  type SubmissionPayload,
} from "@/lib/rsvp";

/*
 * The two RSVP route handlers, built per event (lib/rsvp-events.ts) so the
 * save-the-date and the Italy wedding share one implementation against their
 * own sheets and cookies. The route files under app/api/ are one-liners that
 * bind an event and declare the Node runtime.
 */

/* ---------------------------------------------------------------- lookup */

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

/**
 * Guest lookup for the RSVP modal. Takes a typed name and returns only the
 * matching parties (never the whole list) plus any prior response for prefill.
 */
export function makeLookupHandler(event: RsvpEvent) {
  return (request: Request) => lookup(event, request);
}

async function lookup(event: RsvpEvent, request: Request) {
  if (isClosed(event)) return NextResponse.json({ closed: true });

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
    const guests = await loadGuests(event);
    const found = findParty(guests, query);
    if (found.status === "none") return NextResponse.json({ matches: [] });
    // One full name, two households: disclose neither.
    if (found.status === "ambiguous") {
      return NextResponse.json({ matches: [], ambiguous: true });
    }
    const party = found.party;

    const responses = await loadResponses(event);
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
      (await cookies()).get(event.cookieName)?.value,
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

/* ---------------------------------------------------------------- submit */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * RSVP submission. Accepts a whole party's answers, re-validates every person
 * and every +1 against the authoritative guest list (the client is never
 * trusted — see validateSubmission), then appends one Responses row per person.
 */
export function makeSubmitHandler(event: RsvpEvent) {
  return (request: Request) => submit(event, request);
}

async function submit(event: RsvpEvent, request: Request) {
  if (isClosed(event)) {
    return NextResponse.json({ error: "RSVPs are closed." }, { status: 403 });
  }

  if ((await checkBotId()).isBot) {
    return NextResponse.json({ error: "Access denied." }, { status: 403 });
  }

  let body: SubmissionPayload;
  try {
    body = (await request.json()) as SubmissionPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: pretend success so bots don't learn they were caught, write nothing.
  if (body._hp && String(body._hp).trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const email = (body.email ?? "").trim();
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  try {
    const guests = await loadGuests(event);
    const result = validateSubmission(guests, body);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const party = buildParties(guests).get(body.partyId);
    const priorResponses = await loadResponses(event);
    // Same fail-safe as the lookup route: a name shared by two households can't
    // mark either one as a resubmission.
    const hadPriorResponse =
      !!party &&
      latestResponsesForParty(
        priorResponses,
        party,
        namesInMultipleParties(guests),
      ).length > 0;
    const now = new Date();

    await appendResponses(
      result.rows,
      {
        timestamp: now.toISOString(),
        email,
        message: (body.message ?? "").trim(),
        notes: buildEditNote(hadPriorResponse, now),
      },
      event,
    );

    /* Remember that THIS browser answered for this party — the lookup route
     * hands prior answers back only to a browser holding this proof, so a guest
     * can edit from their own phone while a stranger who knows the same name
     * sees nothing but a date. Appends, so one phone can answer for two
     * households. Null when RSVP_COOKIE_SECRET is unset (then nobody ever gets
     * prefill, which is the safe direction to fail). */
    const store = await cookies();
    const cookieValue = buildPartyCookie(
      body.partyId,
      store.get(event.cookieName)?.value,
    );
    if (cookieValue) {
      store.set(event.cookieName, cookieValue, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 180, // through the wedding and a little past it
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("RSVP submit failed", err);
    return NextResponse.json(
      { error: "Could not save your RSVP." },
      { status: 500 },
    );
  }
}

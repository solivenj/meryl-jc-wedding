import { NextResponse } from "next/server";
import { loadGuests, loadResponses, appendResponses, isClosed } from "@/lib/sheets";
import {
  validateSubmission,
  buildParties,
  latestResponsesForParty,
  buildEditNote,
  type SubmissionPayload,
} from "@/lib/rsvp";

/*
 * RSVP submission. Accepts a whole party's answers, re-validates every person
 * and every +1 against the authoritative guest list (the client is never
 * trusted — see validateSubmission), then appends one Responses row per person.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  if (isClosed()) {
    return NextResponse.json({ error: "RSVPs are closed." }, { status: 403 });
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
    const guests = await loadGuests();
    const result = validateSubmission(guests, body);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const party = buildParties(guests).get(body.partyId);
    const priorResponses = await loadResponses();
    const hadPriorResponse =
      !!party && latestResponsesForParty(priorResponses, party).length > 0;
    const now = new Date();

    await appendResponses(result.rows, {
      timestamp: now.toISOString(),
      email,
      message: (body.message ?? "").trim(),
      notes: buildEditNote(hadPriorResponse, now),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("RSVP submit failed", err);
    return NextResponse.json(
      { error: "Could not save your RSVP." },
      { status: 500 },
    );
  }
}

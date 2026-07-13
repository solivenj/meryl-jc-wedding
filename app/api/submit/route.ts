import { NextResponse } from "next/server";
import { auth, sheets } from "@googleapis/sheets";

/*
 * RSVP submission handler. The site is otherwise prerendered; this is the one
 * request-time endpoint. The Google client needs Node (not Edge), and each POST
 * reads the request body, so keep it dynamic on the Node runtime.
 *
 * Uses @googleapis/sheets (the Sheets-only client) rather than the monolithic
 * `googleapis` package: same vendor and same API, but the monolith ships types
 * for every Google service and OOMs the build's TypeScript pass.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RsvpBody = {
  name?: string;
  email?: string;
  attending?: string;
  guests?: string;
  dietary?: string;
  message?: string;
  /* Honeypot — real users never fill this; bots do. */
  _hp?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: RsvpBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: pretend success so bots don't learn they were caught, but write nothing.
  if (body._hp && body._hp.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const attending = body.attending?.trim() ?? "";
  const guests = body.guests?.trim() ?? "";
  const dietary = body.dietary?.trim() ?? "";
  const message = body.message?.trim() ?? "";

  if (!name || !email || !attending) {
    return NextResponse.json(
      { error: "Please fill in your name, email, and whether you'll attend." },
      { status: 400 },
    );
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  const {
    GOOGLE_SERVICE_ACCOUNT_EMAIL,
    GOOGLE_PRIVATE_KEY,
    GOOGLE_SHEET_ID,
  } = process.env;

  if (!GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY || !GOOGLE_SHEET_ID) {
    console.error("RSVP: missing Google Sheets env vars");
    return NextResponse.json(
      { error: "Could not save your RSVP." },
      { status: 500 },
    );
  }

  try {
    const jwt = new auth.JWT({
      email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
      // Handle keys stored with literal "\n" (Vercel) or real newlines (.env.local).
      key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const client = sheets({ version: "v4", auth: jwt });

    await client.spreadsheets.values.append({
      spreadsheetId: GOOGLE_SHEET_ID,
      // Appends below the last row that has data (the header row included),
      // so the sheet's header stays put. INSERT_ROWS rather than the default
      // OVERWRITE so anything living further down the sheet is never clobbered.
      range: "Sheet1!A:F",
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        // Order must match the sheet header: timestamp | name | email | attending | dietary | message
        values: [
          [new Date().toISOString(), name, email, attending, dietary, message],
        ],
      },
    });

    // guests is intentionally not written yet (RSVP_SHOW_GUEST_COUNT is off).
    // When re-enabling: add a "guests" column to the sheet + this row, and widen the range.
    void guests;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("RSVP: sheet append failed", err);
    return NextResponse.json(
      { error: "Could not save your RSVP." },
      { status: 500 },
    );
  }
}

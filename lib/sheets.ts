import { auth, sheets } from "@googleapis/sheets";
import {
  parseGuests,
  parseResponses,
  encodePlusOneName,
  type Guest,
  type ResponseRecord,
  type ResolvedRow,
} from "./rsvp";
import { FIXTURE_GUESTS } from "./guests-fixture";
import { RSVP_DEADLINE } from "./config";

/*
 * Server-only Google Sheets access for the RSVP flow. Shared by the lookup and
 * submit routes. Falls back to an in-repo fixture when credentials are absent
 * (or RSVP_FIXTURE=1), so the whole flow is testable without the real sheet and
 * without writing to it.
 */

const GUESTS_TAB = "Guests";
const RESPONSES_TAB = "Responses";
const GUESTS_TTL_MS = 60_000; // cache the guest list per instance for a minute

export function isFixtureMode(): boolean {
  if (process.env.RSVP_FIXTURE === "1") return true;
  return !(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    process.env.GOOGLE_PRIVATE_KEY &&
    process.env.GOOGLE_SHEET_ID
  );
}

/** True once the configured RSVP deadline has passed. */
export function isClosed(now = Date.now()): boolean {
  if (!RSVP_DEADLINE) return false;
  const t = new Date(RSVP_DEADLINE).getTime();
  return Number.isFinite(t) && now > t;
}

let client: ReturnType<typeof sheets> | null = null;
function getClient() {
  if (client) return client;
  const jwt = new auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    // Handle keys stored with literal "\n" (Vercel) or real newlines (.env.local).
    key: (process.env.GOOGLE_PRIVATE_KEY ?? "").replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  client = sheets({ version: "v4", auth: jwt });
  return client;
}

let guestCache: { at: number; guests: Guest[] } | null = null;

/** The guest list — cached briefly so keystroke lookups don't hammer Sheets. */
export async function loadGuests(): Promise<Guest[]> {
  if (isFixtureMode()) return FIXTURE_GUESTS;
  if (guestCache && Date.now() - guestCache.at < GUESTS_TTL_MS) {
    return guestCache.guests;
  }
  const res = await getClient().spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: `${GUESTS_TAB}!A:Z`,
  });
  const guests = parseGuests(res.data.values as string[][] | undefined ?? []);
  guestCache = { at: Date.now(), guests };
  return guests;
}

/** All prior responses (for edit prefill / latest-wins). Empty in fixture mode. */
export async function loadResponses(): Promise<ResponseRecord[]> {
  if (isFixtureMode()) return [];
  const res = await getClient().spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: `${RESPONSES_TAB}!A:Z`,
  });
  return parseResponses(res.data.values as string[][] | undefined ?? []);
}

/** Append one row per resolved person to the Responses tab. No-op in fixture mode. */
export async function appendResponses(
  rows: ResolvedRow[],
  meta: {
    timestamp: string;
    email: string;
    message: string;
    notes: string;
  },
): Promise<void> {
  if (isFixtureMode()) {
    console.info("RSVP fixture mode — would append", rows.length, "rows");
    return;
  }
  const values = rows.map((r) => [
    meta.timestamp,
    r.isPlusOne ? encodePlusOneName(r.name, r.plusOneOf) : r.name,
    meta.email,
    r.attending,
    r.dietary,
    meta.message,
    meta.notes,
  ]);
  await getClient().spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    // Columns match the Responses header (fixed by the couple's sheet):
    // Timestamp | Name | Email | Yes/No? | Dietary Needs | Additional Messages | Notes
    //
    // Anchored to the header row (A1:G1), not an open-ended "A:G" column
    // range: append() infers the table's width from the range you pass, and
    // an open column range lets it shrink-wrap to however many columns
    // already have data. Pinning the range to row 1 forces it to always
    // treat all 7 columns as the table, so every new row starts clean at
    // column A instead of spilling into extra columns on the next row.
    range: `${RESPONSES_TAB}!A1:G1`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values },
  });
}

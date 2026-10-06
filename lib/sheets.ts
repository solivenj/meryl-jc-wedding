import { auth, sheets } from "@googleapis/sheets";
import {
  parseGuests,
  parseResponses,
  encodePlusOneName,
  auditGuestList,
  type Guest,
  type ResponseRecord,
  type ResolvedRow,
} from "./rsvp";
import { SAVE_THE_DATE_EVENT, type RsvpEvent } from "./rsvp-events";

/*
 * Server-only Google Sheets access for the RSVP flow. Shared by the lookup and
 * submit routes. Falls back to an in-repo fixture when credentials are absent
 * (or RSVP_FIXTURE=1), so the whole flow is testable without the real sheet and
 * without writing to it.
 *
 * Every function takes the RSVP event (save-the-date or italy — see
 * lib/rsvp-events.ts), defaulting to the save-the-date so existing callers read
 * and write exactly what they always have.
 */

const GUESTS_TTL_MS = 60_000; // cache the guest list per instance for a minute

function sheetId(event: RsvpEvent): string | undefined {
  return process.env[event.sheetIdEnv];
}

export function isFixtureMode(event: RsvpEvent = SAVE_THE_DATE_EVENT): boolean {
  if (process.env.RSVP_FIXTURE === "1") return true;
  return !(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    process.env.GOOGLE_PRIVATE_KEY &&
    sheetId(event)
  );
}

/** True once the event's configured RSVP deadline has passed. */
export function isClosed(
  event: RsvpEvent = SAVE_THE_DATE_EVENT,
  now = Date.now(),
): boolean {
  if (!event.deadline) return false;
  const t = new Date(event.deadline).getTime();
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

/* Keyed by event — each event has its own guest list. */
const guestCache = new Map<string, { at: number; guests: Guest[] }>();

/** The guest list — cached briefly so keystroke lookups don't hammer Sheets. */
export async function loadGuests(
  event: RsvpEvent = SAVE_THE_DATE_EVENT,
): Promise<Guest[]> {
  const cached = guestCache.get(event.key);
  if (cached && Date.now() - cached.at < GUESTS_TTL_MS) {
    return cached.guests;
  }
  let guests: Guest[];
  if (isFixtureMode(event)) {
    guests = event.fixture;
  } else {
    const res = await getClient().spreadsheets.values.get({
      spreadsheetId: sheetId(event),
      range: `${event.guestsTab}!A:Z`,
    });
    guests = parseGuests(res.data.values as string[][] | undefined ?? []);
  }
  /* Report data-entry problems the guest-facing flow can't fix itself. Runs on
   * the cache-miss path only, so the TTL throttles it to once a minute per
   * instance rather than once per keystroke. Fixtures go through the same path
   * so the checks are exercised locally. Never fatal. */
  for (const w of auditGuestList(guests)) {
    console.error(`Guest list (${event.key}) [${w.kind}] ${w.detail}`);
  }
  guestCache.set(event.key, { at: Date.now(), guests });
  return guests;
}

/** All prior responses (for edit prefill / latest-wins). Empty in fixture mode. */
export async function loadResponses(
  event: RsvpEvent = SAVE_THE_DATE_EVENT,
): Promise<ResponseRecord[]> {
  if (isFixtureMode(event)) return [];
  const res = await getClient().spreadsheets.values.get({
    spreadsheetId: sheetId(event),
    range: `${event.responsesTab}!A:Z`,
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
  event: RsvpEvent = SAVE_THE_DATE_EVENT,
): Promise<void> {
  if (isFixtureMode(event)) {
    console.info(`RSVP fixture mode (${event.key}) — would append`, rows.length, "rows");
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
    spreadsheetId: sheetId(event),
    // Columns match the Responses header (fixed by the couple's sheet):
    // Timestamp | Name | Email | Yes/No? | Dietary Needs | Additional Messages | Notes
    //
    // Anchored to the header row (A1:G1), not an open-ended "A:G" column
    // range: append() infers the table's width from the range you pass, and
    // an open column range lets it shrink-wrap to however many columns
    // already have data. Pinning the range to row 1 forces it to always
    // treat all 7 columns as the table, so every new row starts clean at
    // column A instead of spilling into extra columns on the next row.
    range: `${event.responsesTab}!A1:G1`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values },
  });
}

import type { Guest } from "./rsvp";
import { FIXTURE_GUESTS } from "./guests-fixture";
import { FIXTURE_GUESTS_ITALY } from "./guests-fixture-italy";
import { RSVP_DEADLINE, ITALY_RSVP_DEADLINE } from "./config";

/*
 * One RSVP flow, two events. Each event has its own guest list + responses
 * (its own spreadsheet), its own proof cookie, and its own deadline. The two
 * sheets' party ids can overlap ("the diaz family 1" in both), so a browser's
 * proof for one event must never unlock prefill in the other — hence separate
 * cookie names. The Google service account is shared: share both sheets with it.
 *
 * Server-only (the sheet id env name is read by lib/sheets.ts).
 */
export type RsvpEvent = {
  key: string;
  /** Name of the env var holding this event's spreadsheet id. */
  sheetIdEnv: string;
  guestsTab: string;
  responsesTab: string;
  cookieName: string;
  deadline: string | null;
  /** Sample list used in fixture mode (creds or sheet id missing). */
  fixture: Guest[];
};

export const SAVE_THE_DATE_EVENT: RsvpEvent = {
  key: "save-the-date",
  sheetIdEnv: "GOOGLE_SHEET_ID",
  guestsTab: "Guests",
  responsesTab: "Responses",
  cookieName: "rsvp_party",
  deadline: RSVP_DEADLINE,
  fixture: FIXTURE_GUESTS,
};

export const ITALY_EVENT: RsvpEvent = {
  key: "italy",
  sheetIdEnv: "ITALY_GOOGLE_SHEET_ID",
  guestsTab: "Guests",
  responsesTab: "Responses",
  cookieName: "rsvp_party_italy",
  deadline: ITALY_RSVP_DEADLINE,
  fixture: FIXTURE_GUESTS_ITALY,
};

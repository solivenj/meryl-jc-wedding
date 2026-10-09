import { cookies } from "next/headers";
import { loadGuests, loadResponses } from "@/lib/sheets";
import { ITALY_EVENT } from "@/lib/rsvp-events";
import { provenParties } from "@/lib/rsvp-cookie";
import {
  buildParties,
  latestResponsesForParty,
  namesInMultipleParties,
} from "@/lib/rsvp";

/*
 * Who may see the accommodation details.
 *
 * The room block is covered for guests who are actually coming, and saying so
 * publicly invites RSVPs for the lodging. So the page is reachable only by a
 * browser that (a) holds the signed proof it submitted an Italy RSVP, and
 * (b) whose latest submission for that party includes at least one "yes".
 *
 * Reads the Italy proof cookie specifically, never the save-the-date one:
 * party ids can collide between the two sheets, and proof for one wedding
 * must not unlock the other.
 *
 * Server-only — next/headers and the Sheets client both require it.
 */

export type AccessState =
  /** Replied, and someone in the party is coming. */
  | { state: "attending" }
  /** No proof, or replied no. Show the "please reply first" page. */
  | { state: "denied" }
  /** Sheets threw. Never tell an attending guest they haven't replied. */
  | { state: "unavailable" };

export async function accommodationsAccess(): Promise<AccessState> {
  const raw = (await cookies()).get(ITALY_EVENT.cookieName)?.value;
  const proven = provenParties(raw);
  if (proven.length === 0) return { state: "denied" };

  try {
    const guests = await loadGuests(ITALY_EVENT);
    const parties = buildParties(guests);
    const responses = await loadResponses(ITALY_EVENT);
    const ambiguous = namesInMultipleParties(guests);

    for (const partyId of proven) {
      const party = parties.get(partyId);
      if (!party) continue;
      const latest = latestResponsesForParty(responses, party, ambiguous);
      /* parseResponses lowercases attending, so a bare compare is right.
         Any one yes in the household opens it — a party can be mixed. */
      if (latest.some((r) => r.attending === "yes")) return { state: "attending" };
    }
    return { state: "denied" };
  } catch (err) {
    console.error("Accommodations access check failed:", err);
    return { state: "unavailable" };
  }
}

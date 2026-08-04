import type { Guest } from "./rsvp";

/*
 * Sample guest list used ONLY in fixture mode — when the Google env vars are
 * missing, or RSVP_FIXTURE=1 — so the whole lookup → party → submit flow (and
 * its Playwright checks) runs locally without touching the real sheet. Never
 * used once real credentials are present.
 *
 * Shaped to exercise every branch: a multi-person family, a mixed household
 * with one +1-eligible adult and one child, a solo guest, and — mirroring the
 * real sheet — two unrelated households sharing one party_label, kept apart by
 * a party_id of "1" / "2". Note "Bianca Diaz" appears in BOTH Diaz households:
 * that's deliberate, so the shared-name audit warning and the prefill fail-safe
 * (see namesInMultipleParties) are exercised locally.
 */
export const FIXTURE_GUESTS: Guest[] = [
  g("The Diaz Family", "Aaron", "Diaz", { plusOne: true, partyId: "1" }),
  g("The Diaz Family", "Bianca", "Diaz", { partyId: "1" }),
  g("The Diaz Family", "Cody", "Diaz", { kid: true, partyId: "1" }),
  g("The Diaz Family", "Bianca", "Diaz", { plusOne: true, partyId: "2" }),
  g("The Diaz Family", "Rafael", "Diaz", { partyId: "2" }),
  g("Maria & Sam", "Maria", "Cruz", { plusOne: true }),
  g("Maria & Sam", "Sam", "Reyes"),
  g("", "Jordan", "Lee"), // solo — party of one via blank label
];

function g(
  partyLabel: string,
  firstName: string,
  lastName: string,
  opts: { plusOne?: boolean; kid?: boolean; partyId?: string } = {},
): Guest {
  return {
    partyLabel,
    firstName,
    lastName,
    displayName: "",
    plusOneAllowed: !!opts.plusOne,
    isKid: !!opts.kid,
    partyIdExplicit: opts.partyId ?? "",
    guestIdExplicit: "",
  };
}

import type { Guest } from "./rsvp";

/*
 * Sample guest list used ONLY in fixture mode — when the Google env vars are
 * missing, or RSVP_FIXTURE=1 — so the whole lookup → party → submit flow (and
 * its Playwright checks) runs locally without touching the real sheet. Never
 * used once real credentials are present.
 *
 * Shaped to exercise every branch: a multi-person family, a mixed household
 * with one +1-eligible adult and one child, and a solo guest.
 */
export const FIXTURE_GUESTS: Guest[] = [
  g("The Diaz Family", "Aaron", "Diaz", { plusOne: true }),
  g("The Diaz Family", "Bianca", "Diaz"),
  g("The Diaz Family", "Cody", "Diaz", { kid: true }),
  g("Maria & Sam", "Maria", "Cruz", { plusOne: true }),
  g("Maria & Sam", "Sam", "Reyes"),
  g("", "Jordan", "Lee"), // solo — party of one via blank label
];

function g(
  partyLabel: string,
  firstName: string,
  lastName: string,
  opts: { plusOne?: boolean; kid?: boolean } = {},
): Guest {
  return {
    partyLabel,
    firstName,
    lastName,
    displayName: "",
    plusOneAllowed: !!opts.plusOne,
    isKid: !!opts.kid,
    partyIdExplicit: "",
    guestIdExplicit: "",
  };
}

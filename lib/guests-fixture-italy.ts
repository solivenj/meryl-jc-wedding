import type { Guest } from "./rsvp";

/*
 * Sample Italy guest list — fixture mode only (until ITALY_GOOGLE_SHEET_ID is
 * set). Deliberately different names from the save-the-date fixture so it's
 * obvious at a glance which list a lookup hit.
 */
export const FIXTURE_GUESTS_ITALY: Guest[] = [
  g("The Rossi Family", "Marco", "Rossi", { plusOne: true }),
  g("The Rossi Family", "Giulia", "Rossi"),
  g("The Rossi Family", "Luca", "Rossi", { kid: true }),
  g("Ana & Ben", "Ana", "Santos", { plusOne: true }),
  g("Ana & Ben", "Ben", "Park"),
  g("", "Elena", "Conti"), // solo — party of one via blank label
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

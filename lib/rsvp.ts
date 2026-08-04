/*
 * Guest-list RSVP core — pure, framework-free, and the single source of truth
 * for how the sheet is read, how parties/ids are derived, how names match, and
 * how a submission is validated. Kept free of React and googleapis so every
 * rule here is unit-testable with plain fixtures (see the countdown helper for
 * the same approach). Both API routes import from this file.
 *
 * Sheet reads are HEADER-DRIVEN: we map columns by their header name, not by
 * position, so the couple's tab can carry extra/legacy columns (guest_id,
 * party_id, side, table…) in any order without breaking anything.
 */

export type Guest = {
  partyLabel: string; // as typed by the couple; "" ⇒ party of one
  firstName: string;
  lastName: string;
  displayName: string; // effective name shown to guests
  plusOneAllowed: boolean;
  isKid: boolean;
  partyIdExplicit: string; // honored if the sheet has a filled party_id column
  guestIdExplicit: string; // honored if the sheet has a filled guest_id column
};

export type PartyMember = {
  guestId: string;
  name: string;
  plusOneAllowed: boolean;
  isKid: boolean;
};

export type Party = {
  partyId: string;
  partyLabel: string;
  members: PartyMember[];
};

/**
 * One person's line as stored in / read back from the Responses tab. The
 * sheet's real columns (fixed by the couple, not chosen by us): Timestamp |
 * Name | Email | Yes/No? | Dietary Needs | Additional Messages | Notes — no
 * submission_id or party_label column, so grouping/linking (below) is derived
 * rather than stored directly.
 */
export type ResponseRecord = {
  timestamp: string;
  name: string; // a plus-one's name is PLUS_ONE_SEP-encoded with their host's name
  attending: string; // "yes" | "no"
  dietary: string;
  email: string;
  message: string;
  notes: string; // edit-audit note, e.g. "Resubmitted <date>"
};

export type SubmissionPayload = {
  partyId: string;
  email: string;
  message: string;
  people: { guestId: string; attending: string; dietary: string }[];
  plusOnes: {
    hostGuestId: string;
    name: string;
    attending: string;
    dietary: string;
  }[];
  _hp?: string;
};

/** A person resolved against the guest list, ready to become a sheet row. */
export type ResolvedRow = {
  partyLabel: string;
  name: string;
  attending: string;
  isKid: boolean;
  isPlusOne: boolean;
  plusOneOf: string;
  dietary: string;
};

export const MIN_QUERY_LENGTH = 2;

/** A lookup needs a first AND last name. Requiring the whole name — not a
 *  prefix or substring — is what stops this endpoint being walked for the
 *  guest list; see findParty. */
export const MIN_NAME_PARTS = 2;

/** Lowercase, strip accents/punctuation, collapse whitespace. */
export function normalize(s: string): string {
  return (s ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // diacritics
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function truthy(s: string): boolean {
  return /^(true|yes|y|1|x)$/i.test((s ?? "").trim());
}

function effectiveName(g: Guest): string {
  const dn = g.displayName.trim();
  if (dn) return dn;
  return `${g.firstName} ${g.lastName}`.replace(/\s+/g, " ").trim();
}

/**
 * Stable, position-independent ids, derived from the party label (or the
 * person's own name when the label is blank — a party of one).
 *
 * A filled party_id column exists to separate two households that share a
 * label, so it QUALIFIES the label rather than replacing it: a bare "1" in the
 * sheet can't then collide with a "1" written under an unrelated label. With no
 * label there's nothing to scope under and grouping-by-id is the only sensible
 * reading, so an explicit id stays global there. A filled guest_id always wins
 * outright — it names one person, not a grouping.
 */
export function deriveIds(g: Guest): { partyId: string; guestId: string } {
  const label = g.partyLabel.trim();
  const explicit = g.partyIdExplicit.trim();
  const base = label
    ? normalize(label)
    : normalize(`${g.firstName} ${g.lastName}`);
  const partyId = explicit
    ? label
      ? normalize(`${base}|${explicit}`)
      : normalize(explicit)
    : base;
  const guestId = g.guestIdExplicit.trim()
    ? normalize(g.guestIdExplicit)
    : normalize(`${partyId}|${g.firstName}|${g.lastName}`);
  return { partyId, guestId };
}

function partyLabelOf(g: Guest): string {
  return g.partyLabel.trim() || effectiveName(g);
}

/*
 * The Responses sheet has no plus_one_of column, so a plus-one's host is
 * encoded right into the Name cell — human-readable in the sheet, and
 * parseable back out for prefill/edit-detection.
 */
const PLUS_ONE_SEP = " — guest of ";

export function encodePlusOneName(name: string, hostName: string): string {
  return `${name}${PLUS_ONE_SEP}${hostName}`;
}

export function decodePlusOneName(
  raw: string,
): { name: string; hostName: string } | null {
  const idx = raw.indexOf(PLUS_ONE_SEP);
  if (idx === -1) return null;
  return {
    name: raw.slice(0, idx).trim(),
    hostName: raw.slice(idx + PLUS_ONE_SEP.length).trim(),
  };
}

/* ---------- header-driven sheet parsing ---------- */

/** Map header cells → column index, matching on normalized header text. */
function headerIndex(header: string[]): (name: string) => number {
  const map = new Map<string, number>();
  header.forEach((h, i) => map.set(normalize(h), i));
  return (name: string) => map.get(normalize(name)) ?? -1;
}

/** Parse the Guests tab (rows[0] = header) into Guest objects. */
export function parseGuests(rows: string[][]): Guest[] {
  if (!rows.length) return [];
  const at = headerIndex(rows[0]);
  const iLabel = at("party_label");
  const iFirst = at("first_name");
  const iLast = at("last_name");
  const iDisplay = at("display_name");
  const iPlus = at("plus_one_allowed");
  const iKid = at("is_kid");
  const iPartyId = at("party_id");
  const iGuestId = at("guest_id");
  const cell = (row: string[], i: number) => (i >= 0 ? (row[i] ?? "") : "");

  const out: Guest[] = [];
  for (const row of rows.slice(1)) {
    const first = cell(row, iFirst).trim();
    const last = cell(row, iLast).trim();
    if (!first && !last) continue; // skip blank rows
    out.push({
      partyLabel: cell(row, iLabel).trim(),
      firstName: first,
      lastName: last,
      displayName: cell(row, iDisplay).trim(),
      plusOneAllowed: truthy(cell(row, iPlus)),
      isKid: truthy(cell(row, iKid)),
      partyIdExplicit: cell(row, iPartyId).trim(),
      guestIdExplicit: cell(row, iGuestId).trim(),
    });
  }
  return out;
}

/** Parse the Responses tab (rows[0] = header) into ResponseRecords. */
export function parseResponses(rows: string[][]): ResponseRecord[] {
  if (!rows.length) return [];
  const at = headerIndex(rows[0]);
  const iTime = at("Timestamp");
  const iName = at("Name");
  const iEmail = at("Email");
  const iAtt = at("Yes/No?");
  const iDiet = at("Dietary Needs");
  const iMsg = at("Additional Messages");
  const iNotes = at("Notes");
  const cell = (row: string[], i: number) => (i >= 0 ? (row[i] ?? "") : "");

  const out: ResponseRecord[] = [];
  for (const row of rows.slice(1)) {
    const name = cell(row, iName).trim();
    if (!name) continue;
    out.push({
      timestamp: cell(row, iTime).trim(),
      name,
      attending: cell(row, iAtt).trim().toLowerCase(),
      dietary: cell(row, iDiet).trim(),
      email: cell(row, iEmail).trim(),
      message: cell(row, iMsg).trim(),
      notes: cell(row, iNotes).trim(),
    });
  }
  return out;
}

/* ---------- lookup ---------- */

/** Group guests into parties by derived partyId. */
export function buildParties(guests: Guest[]): Map<string, Party> {
  const parties = new Map<string, Party>();
  for (const g of guests) {
    const { partyId, guestId } = deriveIds(g);
    let party = parties.get(partyId);
    if (!party) {
      party = { partyId, partyLabel: partyLabelOf(g), members: [] };
      parties.set(partyId, party);
    }
    party.members.push({
      guestId,
      name: effectiveName(g),
      plusOneAllowed: g.plusOneAllowed,
      isKid: g.isKid,
    });
  }
  return parties;
}

/**
 * Normalized member names that appear in more than one party. A stored response
 * row's only identity is the person's Name cell (the Responses tab has no
 * party column — see appendResponses), so a name owned by two households can't
 * be attributed to either one. A duplicate name *inside* a single party isn't
 * ambiguous in this sense; `auditGuestList` reports that separately.
 */
export function namesInMultipleParties(guests: Guest[]): Set<string> {
  const owner = new Map<string, string>(); // normalized name → first partyId seen
  const ambiguous = new Set<string>();
  for (const party of buildParties(guests).values()) {
    for (const m of party.members) {
      const key = normalize(m.name);
      const seen = owner.get(key);
      if (seen === undefined) owner.set(key, party.partyId);
      else if (seen !== party.partyId) ambiguous.add(key);
    }
  }
  return ambiguous;
}

export type GuestListWarning = {
  kind: "duplicate-name" | "shared-name" | "partial-party-id" | "oversized-party";
  partyId: string;
  detail: string;
};

/**
 * Data-entry problems in the Guests tab that the guest-facing flow can't
 * recover from on its own. Pure and side-effect free — the caller decides how
 * loudly to report (see `loadGuests`).
 *
 * Deliberately NO "duplicate party_label" check: one large family and two
 * merged families are indistinguishable from the label alone, so it would be
 * pure noise. The checks here are the ones that are actually decidable.
 */
export function auditGuestList(
  guests: Guest[],
  maxPartySize = 8,
): GuestListWarning[] {
  const out: GuestListWarning[] = [];

  for (const party of buildParties(guests).values()) {
    const seen = new Set<string>();
    for (const m of party.members) {
      const key = normalize(m.name);
      if (seen.has(key)) {
        out.push({
          kind: "duplicate-name",
          partyId: party.partyId,
          detail: `"${m.name}" appears twice in "${party.partyLabel}" — two households probably share a party_label without distinct party_ids.`,
        });
      }
      seen.add(key);
    }
    if (party.members.length > maxPartySize) {
      out.push({
        kind: "oversized-party",
        partyId: party.partyId,
        detail: `"${party.partyLabel}" has ${party.members.length} members (over ${maxPartySize}) — worth confirming it's one household.`,
      });
    }
  }

  for (const name of namesInMultipleParties(guests)) {
    out.push({
      kind: "shared-name",
      partyId: "",
      detail: `"${name}" belongs to more than one party — any prior RSVP under that name is unattributable and will be ignored for prefill.`,
    });
  }

  /* A label where some rows carry a party_id and others don't: the blank rows
   * fall back to the bare label and split into a party of their own, which the
   * name checks above can't see. */
  const tally = new Map<string, { withId: number; without: number }>();
  for (const g of guests) {
    const label = normalize(g.partyLabel);
    if (!label) continue; // blank label is a party of one by design
    const t = tally.get(label) ?? { withId: 0, without: 0 };
    if (g.partyIdExplicit.trim()) t.withId++;
    else t.without++;
    tally.set(label, t);
  }
  for (const [label, t] of tally) {
    if (t.withId && t.without) {
      out.push({
        kind: "partial-party-id",
        partyId: label,
        detail: `party_label "${label}" has ${t.withId} row(s) with a party_id and ${t.without} without — fill it on every row of every household sharing the label.`,
      });
    }
  }

  return out;
}

/** A name reduced to its normalized tokens, sorted — so "Bianca Diaz" and
 *  "Diaz Bianca" produce the same key. Order-insensitivity costs nothing here:
 *  the whole name is still required. */
function nameKey(s: string): string {
  return normalize(s).split(" ").filter(Boolean).sort().join(" ");
}

/**
 * partyId → the name keys that identify one of its members. Both the effective
 * name (display_name when the couple set one) and the plain first+last are
 * accepted, so a nickname in the sheet doesn't lock out a guest typing their
 * legal name.
 */
function nameKeysByParty(guests: Guest[]): Map<string, Set<string>> {
  const out = new Map<string, Set<string>>();
  for (const g of guests) {
    const { partyId } = deriveIds(g);
    const keys = out.get(partyId) ?? new Set<string>();
    keys.add(nameKey(effectiveName(g)));
    keys.add(nameKey(`${g.firstName} ${g.lastName}`));
    out.set(partyId, keys);
  }
  return out;
}

export type LookupMatch =
  | { status: "none" }
  | { status: "ambiguous" } // one full name, two households — never disclose either
  | { status: "match"; party: Party };

/**
 * The single party a guest belongs to, found by their WHOLE name.
 *
 * This is the endpoint's main privacy control, so it is deliberately strict.
 * The query must carry at least MIN_NAME_PARTS tokens and match a member's full
 * name exactly — no substrings, no prefixes, no "did you mean". A substring
 * search over a guest list is a list-enumeration endpoint: two-letter probes
 * walk the whole list, which is the documented complaint against The Knot and
 * why Zola and RSVPify both match on a full name instead.
 *
 * When one full name legitimately belongs to two households we return
 * `ambiguous` WITHOUT assembling either member list, rather than showing a
 * searcher both families (same fail-safe stance as namesInMultipleParties).
 */
export function findParty(guests: Guest[], query: string): LookupMatch {
  const key = nameKey(query);
  if (key.split(" ").filter(Boolean).length < MIN_NAME_PARTS) {
    return { status: "none" };
  }
  const keysByParty = nameKeysByParty(guests);
  let found: Party | null = null;
  for (const party of buildParties(guests).values()) {
    if (!keysByParty.get(party.partyId)?.has(key)) continue;
    if (found) return { status: "ambiguous" }; // bail before exposing a second party
    found = party;
  }
  return found ? { status: "match", party: found } : { status: "none" };
}

/** True if a stored response row (its Name, possibly plus-one-encoded)
 *  belongs to this party — its name matches a current member, or it's a
 *  plus-one tagged as belonging to one.
 *
 *  Names in `ambiguousNames` (see `namesInMultipleParties`) are treated as
 *  belonging to NO party: showing one household another's answers is worse
 *  than showing an empty form, so we fail safe rather than guess. */
function responseBelongsToParty(
  r: ResponseRecord,
  party: Party,
  ambiguousNames?: Set<string>,
): boolean {
  const memberNames = new Set(party.members.map((m) => normalize(m.name)));
  const rowName = normalize(r.name);
  if (memberNames.has(rowName)) return !ambiguousNames?.has(rowName);
  const plus = decodePlusOneName(r.name);
  if (!plus) return false;
  const hostName = normalize(plus.hostName);
  return memberNames.has(hostName) && !ambiguousNames?.has(hostName);
}

/**
 * The newest submission's rows for a party, for prefilling an edit. There's
 * no submission_id column to group by, but every row of one submission is
 * appended in the same call with one shared timestamp (see
 * `appendResponses`), so the max timestamp among a party's matching rows
 * identifies "the latest submission" and its full row set.
 */
export function latestResponsesForParty(
  responses: ResponseRecord[],
  party: Party,
  ambiguousNames?: Set<string>,
): ResponseRecord[] {
  const mine = responses.filter((r) =>
    responseBelongsToParty(r, party, ambiguousNames),
  );
  if (!mine.length) return [];
  const latestTimestamp = mine.reduce(
    (max, r) => (r.timestamp > max ? r.timestamp : max),
    mine[0].timestamp,
  );
  return mine.filter((r) => r.timestamp === latestTimestamp);
}

/** Notes-column note for a submission: blank for a party's first response, a
 *  human-readable "resubmitted" stamp when prior responses already existed. */
export function buildEditNote(hadPriorResponse: boolean, when: Date): string {
  if (!hadPriorResponse) return "";
  const formatted = when.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
  return `Resubmitted ${formatted}`;
}

/* ---------- submission validation (the trust boundary) ---------- */

export type ValidationResult =
  | { ok: true; partyLabel: string; rows: ResolvedRow[] }
  | { ok: false; error: string };

/**
 * Re-derive everything from the authoritative guest list and reject anything
 * the client shouldn't be able to do: unknown guests, guests from another
 * party, or a +1 on someone not flagged for one. The client is never trusted.
 */
export function validateSubmission(
  guests: Guest[],
  payload: SubmissionPayload,
): ValidationResult {
  const parties = buildParties(guests);
  const party = parties.get(payload.partyId);
  if (!party) return { ok: false, error: "We couldn't find your party." };

  const byId = new Map(party.members.map((m) => [m.guestId, m]));
  const rows: ResolvedRow[] = [];

  if (!payload.people?.length) {
    return { ok: false, error: "No guests were selected." };
  }

  for (const p of payload.people) {
    const member = byId.get(p.guestId);
    if (!member) {
      return { ok: false, error: "That guest isn't part of this party." };
    }
    if (p.attending !== "yes" && p.attending !== "no") {
      return { ok: false, error: `Please answer for ${member.name}.` };
    }
    rows.push({
      partyLabel: party.partyLabel,
      name: member.name,
      attending: p.attending,
      isKid: member.isKid,
      isPlusOne: false,
      plusOneOf: "",
      dietary: (p.dietary ?? "").trim(),
    });
  }

  const seenHosts = new Set<string>();
  for (const plus of payload.plusOnes ?? []) {
    const host = byId.get(plus.hostGuestId);
    if (!host) {
      return { ok: false, error: "Invalid guest for the additional person." };
    }
    if (!host.plusOneAllowed) {
      return {
        ok: false,
        error: `${host.name} isn't able to bring an additional guest.`,
      };
    }
    if (seenHosts.has(plus.hostGuestId)) {
      return { ok: false, error: `Only one additional guest per person.` };
    }
    seenHosts.add(plus.hostGuestId);
    const name = (plus.name ?? "").trim();
    if (!name) {
      return { ok: false, error: "Please name your additional guest." };
    }
    if (plus.attending !== "yes" && plus.attending !== "no") {
      return { ok: false, error: `Please answer for ${name}.` };
    }
    rows.push({
      partyLabel: party.partyLabel,
      name,
      attending: plus.attending,
      isKid: false,
      isPlusOne: true,
      plusOneOf: host.name,
      dietary: (plus.dietary ?? "").trim(),
    });
  }

  return { ok: true, partyLabel: party.partyLabel, rows };
}

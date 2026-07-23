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
 * Stable, position-independent ids. Precedence: an explicit id column wins;
 * otherwise derive from the party label (or the person's own name when the
 * label is blank — a party of one).
 */
export function deriveIds(g: Guest): { partyId: string; guestId: string } {
  const label = g.partyLabel.trim();
  const partyId = g.partyIdExplicit.trim()
    ? normalize(g.partyIdExplicit)
    : label
      ? normalize(label)
      : normalize(`${g.firstName} ${g.lastName}`);
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
 * Parties with any member whose name matches the query. Returns only matches
 * (never the whole list), capped, so the endpoint can't be used to dump the
 * guest list. Empty when the query is too short.
 */
export function matchParties(
  guests: Guest[],
  query: string,
  limit = 8,
): Party[] {
  const q = normalize(query);
  if (q.length < MIN_QUERY_LENGTH) return [];
  const parties = buildParties(guests);
  const hits: Party[] = [];
  for (const party of parties.values()) {
    const matched = party.members.some((m) => normalize(m.name).includes(q));
    if (matched) hits.push(party);
    if (hits.length >= limit) break;
  }
  return hits;
}

/** True if a stored response row (its Name, possibly plus-one-encoded)
 *  belongs to this party — its name matches a current member, or it's a
 *  plus-one tagged as belonging to one. */
function responseBelongsToParty(r: ResponseRecord, party: Party): boolean {
  const memberNames = new Set(party.members.map((m) => normalize(m.name)));
  if (memberNames.has(normalize(r.name))) return true;
  const plus = decodePlusOneName(r.name);
  return !!plus && memberNames.has(normalize(plus.hostName));
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
): ResponseRecord[] {
  const mine = responses.filter((r) => responseBelongsToParty(r, party));
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

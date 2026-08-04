import { createHmac, timingSafeEqual } from "node:crypto";

/*
 * Proof that THIS browser submitted an RSVP for a given party.
 *
 * The lookup endpoint is public and matches on a guest's name, so anyone who
 * knows a full name could otherwise read that household's answers — who's
 * coming, dietary notes, their email, their message. Prior answers are
 * therefore only returned to a browser holding a cookie it could only have got
 * by submitting. Everyone else gets a bare "already responded" date.
 *
 * Deliberately stateless: an HMAC over the partyId, no session store, no email
 * provider. Kept out of lib/rsvp.ts because that module commits to staying pure
 * and framework-free (node:crypto would break it) — this half only ever runs in
 * the two Node-runtime API routes.
 */

export const RSVP_COOKIE = "rsvp_party";

/** Distinct parties one browser may hold proof for — a parent RSVPing for two
 *  households is normal; an unbounded list is a cookie-stuffing vector. */
const MAX_PARTIES = 8;

function secret(): string | null {
  return process.env.RSVP_COOKIE_SECRET?.trim() || null;
}

function sign(partyId: string, key: string): string {
  return createHmac("sha256", key).update(partyId).digest("base64url");
}

/* partyIds are normalize()d, so they contain spaces ("the diaz family 1") —
 * which is not a legal cookie-value octet. Encode rather than trusting it. */
function encodeId(partyId: string): string {
  return Buffer.from(partyId, "utf8").toString("base64url");
}

function decodeId(encoded: string): string {
  return Buffer.from(encoded, "base64url").toString("utf8");
}

/** Constant-time compare of two base64url digests of equal expected length. */
function sameDigest(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

/**
 * The cookie value to set after a successful submission: the parties this
 * browser has proven, newest first, each as `partyId.signature`.
 *
 * Returns null when RSVP_COOKIE_SECRET is unset — no secret means no cookie is
 * issued and no prefill is ever handed out. Failing closed degrades to "nobody
 * gets prefill", never to "everybody does".
 */
export function buildPartyCookie(
  partyId: string,
  existingCookie: string | undefined,
): string | null {
  const key = secret();
  if (!key) return null;
  const kept = provenParties(existingCookie).filter((id) => id !== partyId);
  return [partyId, ...kept]
    .slice(0, MAX_PARTIES)
    .map((id) => `${encodeId(id)}.${sign(id, key)}`)
    .join("~");
}

/** The partyIds this cookie legitimately proves. Unsigned, tampered, or
 *  foreign entries are dropped rather than trusted. */
export function provenParties(cookieValue: string | undefined): string[] {
  const key = secret();
  if (!key || !cookieValue) return [];
  const out: string[] = [];
  for (const entry of cookieValue.split("~").slice(0, MAX_PARTIES)) {
    const cut = entry.lastIndexOf(".");
    if (cut <= 0) continue;
    let id: string;
    try {
      id = decodeId(entry.slice(0, cut));
    } catch {
      continue; // malformed encoding — treat as no proof at all
    }
    if (sameDigest(entry.slice(cut + 1), sign(id, key))) out.push(id);
  }
  return out;
}

export function hasProvenParty(
  cookieValue: string | undefined,
  partyId: string,
): boolean {
  return provenParties(cookieValue).includes(partyId);
}

import { createHash, createHmac, timingSafeEqual } from "node:crypto";

/*
 * Which of the two sites this browser has unlocked.
 *
 * The bare domain asks for the word printed on the invitation; each word
 * grants one section and leaves any grant already held intact, so someone
 * invited to both weddings can enter both words over time. Nothing in the UI
 * admits a second word exists — a guest who holds one simply types it.
 *
 * Same shape as lib/rsvp-cookie.ts on purpose: stateless HMAC, no session
 * store, one entry per grant so grants accumulate independently. Kept apart
 * from that module because the two sign different things with different
 * secrets, and a gate signature must never be mistakable for RSVP proof.
 *
 * This is a privacy measure, not security. It keeps the site off the open web
 * and out of search results. It does not protect anything that would be
 * damaging to leak, and the passwords will be shared among guests by design.
 */

export const GATE_COOKIE = "site_access";

export type GateSection = "italy" | "church";

const SECTIONS: GateSection[] = ["italy", "church"];

/** Where each section's gate sends a guest once they're through. */
export const SECTION_HOME: Record<GateSection, string> = {
  italy: "/italy-wedding",
  church: "/church-save-the-date",
};

function secret(): string | null {
  return process.env.SITE_GATE_SECRET?.trim() || null;
}

function sign(section: string, key: string): string {
  return createHmac("sha256", key).update(section).digest("base64url");
}

/** Constant-time compare of two base64url digests of equal expected length. */
function sameDigest(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

/*
 * Passwords are compared as SHA-256 digests rather than raw strings:
 * timingSafeEqual throws on length mismatch, and feeding it the raw values
 * would leak the expected length through that throw. Digests are always 32
 * bytes, so every comparison takes the same path.
 */
function samePassword(typed: string, expected: string): boolean {
  const a = createHash("sha256").update(typed).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

/**
 * The section a typed word unlocks, or null. Compared case-insensitively and
 * trimmed — it's a word off a printed card, not a personal secret, and a
 * capitalised first letter from a phone keyboard shouldn't lock anyone out.
 */
export function matchPassword(typed: string): GateSection | null {
  const input = typed.trim().toLowerCase();
  if (!input) return null;

  const expected: Record<GateSection, string | undefined> = {
    italy: process.env.GATE_PASSWORD_ITALY?.trim().toLowerCase(),
    church: process.env.GATE_PASSWORD_CHURCH?.trim().toLowerCase(),
  };

  /* Every candidate is checked even after a hit, so the time taken doesn't
     reveal which word was entered. */
  let found: GateSection | null = null;
  for (const section of SECTIONS) {
    const want = expected[section];
    if (want && samePassword(input, want)) found = section;
  }
  return found;
}

/**
 * The cookie value to set after a correct word: every section this browser has
 * unlocked, newest first, each as `section.signature`.
 *
 * Returns null when SITE_GATE_SECRET is unset. Unlike the RSVP cookie, this
 * fails closed in a way guests notice — nobody gets into either site — so the
 * caller should log it rather than let it look like a wrong password.
 */
export function buildGateCookie(
  section: GateSection,
  existingCookie: string | undefined,
): string | null {
  const key = secret();
  if (!key) return null;
  const kept = grantedSections(existingCookie).filter((s) => s !== section);
  return [section, ...kept]
    .slice(0, SECTIONS.length)
    .map((s) => `${Buffer.from(s, "utf8").toString("base64url")}.${sign(s, key)}`)
    .join("~");
}

/** The sections this cookie legitimately proves. Unsigned, tampered or
 *  unrecognised entries are dropped rather than trusted. */
export function grantedSections(cookieValue: string | undefined): GateSection[] {
  const key = secret();
  if (!key || !cookieValue) return [];
  const out: GateSection[] = [];
  for (const entry of cookieValue.split("~").slice(0, SECTIONS.length)) {
    const cut = entry.lastIndexOf(".");
    if (cut <= 0) continue;
    let section: string;
    try {
      section = Buffer.from(entry.slice(0, cut), "base64url").toString("utf8");
    } catch {
      continue; // malformed encoding — treat as no grant at all
    }
    if (!SECTIONS.includes(section as GateSection)) continue;
    if (sameDigest(entry.slice(cut + 1), sign(section, key))) {
      out.push(section as GateSection);
    }
  }
  return out;
}

export function hasGrant(
  cookieValue: string | undefined,
  section: GateSection,
): boolean {
  return grantedSections(cookieValue).includes(section);
}

/**
 * The section a path belongs to, or null when it isn't gated.
 * Used by proxy.ts to decide which grant a request needs.
 */
export function sectionForPath(pathname: string): GateSection | null {
  if (pathname === "/italy-wedding" || pathname.startsWith("/italy-wedding/")) {
    return "italy";
  }
  if (
    pathname === "/church-save-the-date" ||
    pathname.startsWith("/church-save-the-date/")
  ) {
    return "church";
  }
  /* The RSVP endpoints answer questions about real guests by name, so they
     need the same grant as the pages that call them. */
  if (pathname.startsWith("/api/italy/")) return "italy";
  if (pathname.startsWith("/api/guests/") || pathname === "/api/submit") {
    return "church";
  }
  return null;
}

/**
 * A safe post-unlock destination. Only same-site paths inside a gated section
 * are allowed through; anything else (absolute URLs, protocol-relative "//"
 * hosts, arbitrary paths) falls back to the section's home.
 */
export function safeNext(next: string | undefined, section: GateSection): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return SECTION_HOME[section];
  }
  return sectionForPath(next) === section ? next : SECTION_HOME[section];
}

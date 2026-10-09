import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  GATE_COOKIE,
  buildGateCookie,
  matchPassword,
  safeNext,
} from "@/lib/site-gate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/*
 * Checks the word from the invitation and, if it's right, records the grant.
 *
 * Deliberately NOT BotID-protected. This is the first endpoint a guest ever
 * touches, and a false positive here would lock a real guest out of the whole
 * site — a worse failure than the one it would prevent. If it's ever added,
 * register "/api/gate" in instrumentation-client.ts at the same time, or the
 * checkBotId() call fails on the server.
 *
 * The limiter below is per-instance and best-effort on serverless, so it is
 * not real brute-force protection. A long multi-word passphrase is.
 */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 10;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_HITS;
}

function clientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: Request) {
  if (rateLimited(clientIp(request))) {
    return NextResponse.json(
      { error: "Too many tries. Give it a minute, then try again." },
      { status: 429 },
    );
  }

  let body: { password?: string; next?: string };
  try {
    body = (await request.json()) as { password?: string; next?: string };
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const section = matchPassword(body.password ?? "");
  if (!section) {
    /* One message for every miss. Never reveal which word was closer, or that
       there is more than one word to be close to. */
    return NextResponse.json(
      { error: "That’s not the one — try again." },
      { status: 401 },
    );
  }

  const store = await cookies();
  const value = buildGateCookie(section, store.get(GATE_COOKIE)?.value);
  if (!value) {
    console.error(
      "Site gate: SITE_GATE_SECRET is unset, so no grant can be issued and nobody can get in.",
    );
    return NextResponse.json(
      { error: "We can’t open the door just now. Please email us." },
      { status: 503 },
    );
  }

  store.set(GATE_COOKIE, value, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    /* ~400 days: browsers cap cookie lifetime there, and the wedding is well
       inside it, so a guest enters the word once and not again. */
    maxAge: 60 * 60 * 24 * 400,
  });

  return NextResponse.json({ ok: true, redirect: safeNext(body.next, section) });
}

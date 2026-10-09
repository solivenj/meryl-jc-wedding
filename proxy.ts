import { NextResponse, type NextRequest } from "next/server";
import { GATE_COOKIE, hasGrant, sectionForPath } from "@/lib/site-gate";

/*
 * The password gate for both weddings.
 *
 * This is `proxy.ts`, not `middleware.ts` — Next 16 deprecated and renamed
 * that convention. A middleware.ts here may simply not run, and a gate that
 * doesn't run fails open, so don't reintroduce one.
 *
 * It lives here rather than in the two layouts because layouts don't re-render
 * on client-side navigation (Partial Rendering), so a layout check fires once
 * on first load and never again, and prefetched payloads can slip past it.
 * Proxy also covers the API routes, which a layout cannot reach at all, and
 * leaves the pages statically prerendered.
 *
 * Cookie-only check, no I/O: proxy runs on every matched request including
 * prefetches, so anything that reads a sheet belongs in a page, not here. The
 * one thing genuinely worth protecting — the accommodation details — does its
 * own check against the RSVP responses in app/italy-wedding/accommodations.
 *
 * Do NOT add `export const runtime` to this file; Next throws on it. Proxy is
 * already Node.js, which is what lets it share lib/site-gate's node:crypto.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const section = sectionForPath(pathname);
  if (!section) return NextResponse.next();

  if (hasGrant(request.cookies.get(GATE_COOKIE)?.value, section)) {
    return NextResponse.next();
  }

  /* API calls get a status, not a redirect to an HTML page — the RSVP form
     reads JSON and would choke on the gate markup. */
  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Access denied." }, { status: 403 });
  }

  const gate = new URL("/", request.url);
  gate.searchParams.set("next", `${pathname}${search}`);
  return NextResponse.redirect(gate);
}

export const config = {
  /* An inclusion list, deliberately: the usual "everything except..." regex
     also catches BotID's injected proxy rewrites and the gate page itself.
     Naming the gated paths cannot. */
  matcher: [
    "/italy-wedding/:path*",
    "/church-save-the-date/:path*",
    "/api/italy/:path*",
    "/api/guests/:path*",
    "/api/submit",
  ],
};

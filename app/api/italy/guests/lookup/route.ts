import { makeLookupHandler } from "@/lib/rsvp-handlers";
import { ITALY_EVENT } from "@/lib/rsvp-events";

/* Italy wedding guest lookup. Logic lives in lib/rsvp-handlers.ts.
 * Node runtime + dynamic: reads the request body and hits Sheets. */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const POST = makeLookupHandler(ITALY_EVENT);

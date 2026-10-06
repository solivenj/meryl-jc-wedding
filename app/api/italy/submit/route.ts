import { makeSubmitHandler } from "@/lib/rsvp-handlers";
import { ITALY_EVENT } from "@/lib/rsvp-events";

/* Italy wedding RSVP submission. Logic lives in lib/rsvp-handlers.ts. */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const POST = makeSubmitHandler(ITALY_EVENT);

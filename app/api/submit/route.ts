import { makeSubmitHandler } from "@/lib/rsvp-handlers";
import { SAVE_THE_DATE_EVENT } from "@/lib/rsvp-events";

/* Save-the-date RSVP submission. Logic lives in lib/rsvp-handlers.ts. */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const POST = makeSubmitHandler(SAVE_THE_DATE_EVENT);

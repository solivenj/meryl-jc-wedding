import type { Metadata } from "next";
import Link from "next/link";
import { Band } from "@/components/italy/Band";
import { DetailBlocks } from "@/components/italy/DetailBlocks";
import { Motif } from "@/components/italy/Art";
import { Eyebrow, Prose, ScriptTitle, SmallCaps, capsLinkClass } from "@/components/italy/Type";
import { accommodationsAccess } from "@/lib/accommodations-access";
import { ITALY_ACCOMMODATION } from "@/lib/italy-content";
import { RSVP } from "@/lib/content";

/*
 * Reachable only from a yes-RSVP — there is no link to it in ITALY_NAV, and
 * the content is gated on the RSVP proof cookie plus an actual "yes" in the
 * sheet. The deny state is deliberately a real page rather than a 404: a 404
 * tells a guest the page doesn't exist, when in fact it is waiting for them.
 *
 * Nothing about the room block appears in the deny state or in the metadata.
 */
export const metadata: Metadata = {
  title: "Accommodation",
  robots: { index: false, follow: false },
};

// Reads cookies and the responses sheet, so it can never be prerendered.
export const dynamic = "force-dynamic";

const A = ITALY_ACCOMMODATION;

export default async function AccommodationsPage() {
  const access = await accommodationsAccess();

  /* Sheets threw — say so. Telling an attending guest they haven't replied
     because of an API blip is the worst thing this page can do. */
  if (access.state === "unavailable") {
    return (
      <Band tone="cream" width="prose">
        <h1 className="sr-only">Accommodation</h1>
        <ScriptTitle>{A.unavailable.title}</ScriptTitle>
        <div className="mt-6 flex flex-col items-center">
          <Prose>
            {A.unavailable.body}{" "}
            <a href={`mailto:${RSVP.mailtoFallback}`} className="underline underline-offset-4">
              {RSVP.mailtoFallback}
            </a>
            .
          </Prose>
        </div>
      </Band>
    );
  }

  if (access.state === "denied") {
    return (
      <Band tone="cream" width="prose">
        <h1 className="sr-only">Accommodation</h1>
        <ScriptTitle>{A.deny.title}</ScriptTitle>
        <div className="mt-6 flex flex-col items-center gap-6">
          <Prose>{A.deny.body}</Prose>
          <Link href={A.deny.cta.href} className={capsLinkClass}>
            {A.deny.cta.label}
          </Link>
        </div>
      </Band>
    );
  }

  return (
    <Band tone="cream" width="wide">
      <h1 className="sr-only">Accommodation</h1>
      <Eyebrow>{A.eyebrow}</Eyebrow>

      <div className="mt-[42px] flex w-full max-w-[640px] flex-col items-center gap-7">
        <ScriptTitle>{A.title}</ScriptTitle>
        <Prose>{A.intro}</Prose>

        {/* Side by side on desktop so "covering" and "not covering" are read
            as one pair rather than one after the other. */}
        <div className="mt-2 grid w-full gap-5 sm:grid-cols-2">
          <DetailBlocks bordered blocks={[A.covered]} />
          <DetailBlocks bordered blocks={[A.notCovered]} />
        </div>

        <DetailBlocks bordered className="mt-2" blocks={[A.howTo]} />

        <Motif name="rings" size={92} className="mt-4 text-ink" />
      </div>
    </Band>
  );
}

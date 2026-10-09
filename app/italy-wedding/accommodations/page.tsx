import type { Metadata } from "next";
import Link from "next/link";
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

function Panel({ label, lines }: { label: string; lines: string[] }) {
  return (
    <div className="flex w-full flex-col items-start gap-3 border border-rule p-6 text-left sm:p-7">
      <SmallCaps>{label}</SmallCaps>
      <ul className="flex flex-col gap-2.5 font-body text-[17.5px] leading-[1.65] font-light text-ink-soft">
        {lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </div>
  );
}

export default async function AccommodationsPage() {
  const access = await accommodationsAccess();

  /* Sheets threw — say so. Telling an attending guest they haven't replied
     because of an API blip is the worst thing this page can do. */
  if (access.state === "unavailable") {
    return (
      <div className="flex flex-col items-center px-4 pt-10 text-center">
        <h1 className="sr-only">Accommodation</h1>
        <ScriptTitle>{A.unavailable.title}</ScriptTitle>
        <div className="mt-6 flex max-w-[29rem] flex-col items-center">
          <Prose>
            {A.unavailable.body}{" "}
            <a href={`mailto:${RSVP.mailtoFallback}`} className="underline underline-offset-4">
              {RSVP.mailtoFallback}
            </a>
            .
          </Prose>
        </div>
      </div>
    );
  }

  if (access.state === "denied") {
    return (
      <div className="flex flex-col items-center px-4 pt-10 text-center">
        <h1 className="sr-only">Accommodation</h1>
        <ScriptTitle>{A.deny.title}</ScriptTitle>
        <div className="mt-6 flex max-w-[29rem] flex-col items-center gap-6">
          <Prose>{A.deny.body}</Prose>
          <Link href={A.deny.cta.href} className={capsLinkClass}>
            {A.deny.cta.label}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center px-4 pt-10">
      <h1 className="sr-only">Accommodation</h1>
      <Eyebrow>{A.eyebrow}</Eyebrow>

      <div className="mt-[42px] flex w-full max-w-[640px] flex-col items-center gap-7">
        <ScriptTitle>{A.title}</ScriptTitle>
        <Prose>{A.intro}</Prose>

        {/* Side by side on desktop so "covering" and "not covering" are read
            as one pair rather than one after the other. */}
        <div className="mt-2 grid w-full gap-5 sm:grid-cols-2">
          <Panel label={A.covered.label} lines={A.covered.lines} />
          <Panel label={A.notCovered.label} lines={A.notCovered.lines} />
        </div>

        <div className="mt-2 w-full">
          <Panel label={A.howTo.label} lines={A.howTo.lines} />
        </div>

        <Motif name="rings" size={92} className="mt-4 text-ink" />
      </div>
    </div>
  );
}

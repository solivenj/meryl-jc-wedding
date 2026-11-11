import type { Metadata } from "next";
import { Motif } from "@/components/italy/Art";
import type { MotifName } from "@/components/italy/sketches";
import { Band } from "@/components/italy/Band";
import { MarginSections, type MarginMotif } from "@/components/italy/MarginSections";
import { capsLinkClass } from "@/components/italy/Type";
import { ITALY_RSVP, ITALY_TRAVEL } from "@/lib/italy-content";

export const metadata: Metadata = { title: "Travel" };

const SECTION_MOTIFS: Record<string, MarginMotif[]> = {
  entering: [
    { name: "swallow", side: "left", jitter: -20, top: 60, size: 88, rot: -6 },
    { name: "arch", side: "right", jitter: -15, top: 120, size: 86, rot: 3 },
  ],
  arriving: [
    { name: "vespa", side: "left", jitter: -20, top: 30, size: 84, rot: -5 },
    { name: "lemon", side: "left", jitter: -15, top: 330, size: 90, rot: -4 },
    { name: "olive", side: "right", jitter: -20, top: 90, size: 92, rot: 5 },
    { name: "boat", side: "right", jitter: 20, top: 420, size: 80, rot: -4 },
  ],
  accommodation: [
    { name: "moon", side: "left", jitter: 30, top: 40, size: 56, rot: 0 },
    { name: "hat", side: "right", jitter: 30, top: 20, size: 94, rot: -3 },
  ],
};

const MOBILE_ROW: MotifName[] = ["vespa", "lemon", "olive", "boat", "swallow"];

export default function TravelPage() {
  return (
    <>
      <MarginSections
        heading="Getting to Todi"
        eyebrow={ITALY_TRAVEL.eyebrow}
        sections={ITALY_TRAVEL.sections}
        motifs={SECTION_MOTIFS}
      />

      <Band tone="cream" pad="tight" className="gap-5">
        <div
          aria-hidden="true"
          className="flex flex-wrap justify-center gap-5 text-ink min-[901px]:hidden"
        >
          {MOBILE_ROW.map((m) => (
            <Motif key={m} name={m} size={46} />
          ))}
        </div>

        {/* The band has to stay cream so it does not merge into the deep
            footer, and until now it held only the motif row above, which is
            hidden over 900px — so every desktop ended on an empty strip. */}
        <p className="max-w-[42ch] font-body text-[calc(17px*var(--fs-scale))] leading-[1.6] font-light text-ink-soft">
          {ITALY_TRAVEL.closing.body}
        </p>
        <a href={`mailto:${ITALY_RSVP.mailtoFallback}`} className={capsLinkClass}>
          {ITALY_TRAVEL.closing.cta}
        </a>
      </Band>
    </>
  );
}

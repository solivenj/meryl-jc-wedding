import type { Metadata } from "next";
import Link from "next/link";
import { Motif } from "@/components/italy/Art";
import type { MotifName } from "@/components/italy/sketches";
import { Band } from "@/components/italy/Band";
import { MarginSections, type MarginMotif } from "@/components/italy/MarginSections";
import { TodiWeather } from "@/components/italy/TodiWeather";
import { capsLinkClass } from "@/components/italy/Type";
import { ITALY_EXPLORE } from "@/lib/italy-content";

export const metadata: Metadata = { title: "Italy" };

const SECTION_MOTIFS: Record<string, MarginMotif[]> = {
  weather: [
    { name: "sun", side: "left", jitter: -10, top: 70, size: 80, rot: -4 },
    { name: "hat", side: "right", jitter: 20, top: 140, size: 90, rot: 4 },
  ],
  nearby: [
    { name: "coupe", side: "left", jitter: 30, top: 60, size: 64, rot: 4 },
    { name: "espresso", side: "left", jitter: 25, top: 330, size: 62, rot: 6 },
    { name: "gelato", side: "left", jitter: -25, top: 600, size: 84, rot: -4 },
    { name: "flowers", side: "right", jitter: -15, top: 150, size: 92, rot: 3 },
    { name: "pizza", side: "right", jitter: -10, top: 440, size: 72, rot: 6 },
    { name: "wineglass", side: "right", jitter: 20, top: 690, size: 64, rot: 5 },
  ],
};

const MOBILE_ROW: MotifName[] = ["sun", "gelato", "coupe", "flowers", "pizza", "espresso", "wineglass"];

export default function ExplorePage() {
  return (
    <>
      <MarginSections
        heading="Italy: the weather and the places we love"
        eyebrow={ITALY_EXPLORE.eyebrow}
        sections={ITALY_EXPLORE.sections}
        motifs={SECTION_MOTIFS}
        leads={{ weather: <TodiWeather /> }}
      />

      {/* Same closing band as Travel, for the same reason: cream so it does
          not merge into the deep footer, and copy so desktop does not end on
          the empty strip the mobile-only motif row leaves. */}
      <Band tone="cream" pad="tight" className="gap-5">
        <div
          aria-hidden="true"
          className="flex flex-wrap justify-center gap-5 text-ink min-[901px]:hidden"
        >
          {MOBILE_ROW.map((m) => (
            <Motif key={m} name={m} size={46} />
          ))}
        </div>
        <p className="max-w-[42ch] font-body text-[calc(17px*var(--fs-scale))] leading-[1.6] font-light text-ink-soft">
          {ITALY_EXPLORE.closing.body}
        </p>
        <Link href={ITALY_EXPLORE.closing.cta.href} className={capsLinkClass}>
          {ITALY_EXPLORE.closing.cta.label}
        </Link>
      </Band>
    </>
  );
}

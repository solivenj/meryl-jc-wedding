import type { Metadata } from "next";
import Link from "next/link";
import { Motif } from "@/components/italy/Art";
import type { MotifName } from "@/components/italy/sketches";
import { Band } from "@/components/italy/Band";
import { MarginSections, type MarginMotif } from "@/components/italy/MarginSections";
import { TodiWeather } from "@/components/italy/TodiWeather";
import { Prose, ScriptTitle, SmallCaps, capsLinkClass } from "@/components/italy/Type";
import { ITALY_EXPLORE } from "@/lib/italy-content";

export const metadata: Metadata = { title: "Italy" };

/* The weather band has no margin sketches: its two columns take the width
   the sketches would sit in. */
const SECTION_MOTIFS: Record<string, MarginMotif[]> = {
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
  const { weather } = ITALY_EXPLORE;
  return (
    <>
      {/* Weather: the live tracker beside what late April is usually like
          and what to bring. Two columns from 960px, where the tracker gets
          room to lay its current conditions and the day's stats side by side;
          below that the notes stack under it. */}
      <Band tone="cream" width="wide" id="weather" className="gap-5">
        <h1 className="sr-only">Italy: the weather and the places we love</h1>
        <ScriptTitle>{weather.title}</ScriptTitle>
        <div className="mt-6 grid w-full gap-10 text-left min-[960px]:grid-cols-[minmax(0,38rem)_minmax(0,1fr)] min-[960px]:gap-14">
          <TodiWeather />
          <div className="flex min-w-0 flex-col gap-[30px] min-[960px]:pt-2">
            <div className="flex flex-col gap-2.5">
              <SmallCaps>{weather.april.label}</SmallCaps>
              <Prose>{weather.april.body}</Prose>
            </div>
            <div className="flex flex-col gap-2.5">
              <SmallCaps>{weather.pack.label}</SmallCaps>
              <ul className="flex flex-col gap-2 font-body text-[calc(18px*var(--fs-scale))] leading-[1.7] font-light text-ink-soft">
                {weather.pack.lines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Band>

      <MarginSections sections={ITALY_EXPLORE.sections} motifs={SECTION_MOTIFS} startIndex={1} />

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

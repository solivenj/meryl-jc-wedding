import type { Metadata } from "next";
import { Motif } from "@/components/italy/Art";
import type { MotifName } from "@/components/italy/sketches";
import { Eyebrow, ScriptTitle } from "@/components/italy/Type";
import { ITALY_STAY } from "@/lib/italy-content";

export const metadata: Metadata = { title: "Stay" };

/*
 * Scattered margin illustrations (desktop only, >900px). Each sits roughly
 * halfway between the centred text column (~200px either side of centre) and
 * the viewport edge, nudged by `jitter` so the columns don't look ruled.
 */
const MARGIN: { name: MotifName; side: "left" | "right"; jitter: number; top: number; size: number; rot: number }[] = [
  { name: "vespa", side: "left", jitter: -20, top: 40, size: 84, rot: -5 },
  { name: "coupe", side: "left", jitter: 30, top: 240, size: 64, rot: 4 },
  { name: "lemon", side: "left", jitter: -30, top: 440, size: 72, rot: -3 },
  { name: "espresso", side: "left", jitter: 25, top: 640, size: 62, rot: 6 },
  { name: "swallow", side: "left", jitter: -15, top: 840, size: 90, rot: -4 },
  { name: "moon", side: "left", jitter: 30, top: 1040, size: 56, rot: 0 },
  { name: "gelato", side: "left", jitter: -25, top: 1220, size: 84, rot: -4 },
  { name: "wineglass", side: "left", jitter: 20, top: 1440, size: 64, rot: 5 },
  { name: "olive", side: "right", jitter: -20, top: 100, size: 92, rot: 5 },
  { name: "hat", side: "right", jitter: 30, top: 320, size: 94, rot: -3 },
  { name: "bottle", side: "right", jitter: -30, top: 520, size: 60, rot: 3 },
  { name: "boat", side: "right", jitter: 20, top: 700, size: 80, rot: -4 },
  { name: "flowers", side: "right", jitter: -15, top: 900, size: 92, rot: 3 },
  { name: "arch", side: "right", jitter: 30, top: 1130, size: 64, rot: 4 },
  { name: "pizza", side: "right", jitter: -10, top: 1380, size: 72, rot: 6 },
];

const MOBILE_ROW: MotifName[] = ["vespa", "gelato", "coupe", "flowers", "pizza", "boat", "swallow"];

export default function StayPage() {
  return (
    <div className="relative px-4 pt-10">
      <div aria-hidden="true" className="hidden min-[901px]:block">
        {MARGIN.map((m) => (
          <Motif
            key={m.name}
            name={m.name}
            size={m.size}
            className="absolute text-ink"
            style={{
              [m.side]: `calc(25% - 100px - ${m.size / 2}px + ${m.jitter}px)`,
              top: m.top,
              transform: `rotate(${m.rot}deg)`,
            }}
          />
        ))}
      </div>

      <div className="relative flex flex-col items-center text-center">
        <h1 className="sr-only">Where to stay</h1>
        <Eyebrow>{ITALY_STAY.eyebrow}</Eyebrow>

        <div className="mt-5 flex flex-col items-center">
          {ITALY_STAY.groups.map((g) => (
            <section key={g.title} className="flex flex-col items-center gap-[18px] py-[34px]">
              <ScriptTitle>{g.title}</ScriptTitle>
              <ul className="font-body text-[18px] leading-[2.1] font-light text-ink-soft">
                {g.lines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div aria-hidden="true" className="flex flex-wrap justify-center gap-5 pt-4 text-ink min-[901px]:hidden">
          {MOBILE_ROW.map((m) => (
            <Motif key={m} name={m} size={46} />
          ))}
        </div>
      </div>
    </div>
  );
}

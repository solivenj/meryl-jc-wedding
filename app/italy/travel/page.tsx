import type { Metadata } from "next";
import Link from "next/link";
import { Motif } from "@/components/italy/Art";
import type { MotifName } from "@/components/italy/sketches";
import { Eyebrow, Prose, ScriptTitle, SmallCaps, capsLinkClass } from "@/components/italy/Type";
import { ITALY_TRAVEL } from "@/lib/italy-content";

export const metadata: Metadata = { title: "Travel" };

/*
 * Scattered margin illustrations (desktop only, >900px). Each sits roughly
 * halfway between the centred text column (~200px either side of centre) and
 * the viewport edge, nudged by `jitter` so the columns don't look ruled.
 *
 * These are keyed BY SECTION and positioned within it, not against the page
 * root at absolute pixel offsets — an earlier version pinned fifteen motifs to
 * hardcoded tops from 40px to 1440px, which silently desynced from the text
 * the moment anyone edited a line of copy. `top` here is an offset inside the
 * section that owns it, so the art travels with its own content.
 */
type MarginMotif = {
  name: MotifName;
  side: "left" | "right";
  jitter: number;
  top: number;
  size: number;
  rot: number;
};

const SECTION_MOTIFS: Record<string, MarginMotif[]> = {
  arriving: [
    { name: "vespa", side: "left", jitter: -20, top: 30, size: 84, rot: -5 },
    { name: "swallow", side: "left", jitter: -15, top: 330, size: 90, rot: -4 },
    { name: "olive", side: "right", jitter: -20, top: 90, size: 92, rot: 5 },
    { name: "boat", side: "right", jitter: 20, top: 420, size: 80, rot: -4 },
  ],
  accommodation: [
    { name: "moon", side: "left", jitter: 30, top: 40, size: 56, rot: 0 },
    { name: "hat", side: "right", jitter: 30, top: 20, size: 94, rot: -3 },
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

const MOBILE_ROW: MotifName[] = ["vespa", "gelato", "coupe", "flowers", "pizza", "boat", "swallow"];

function MarginArt({ id }: { id: string }) {
  const motifs = SECTION_MOTIFS[id];
  if (!motifs) return null;
  return (
    <div aria-hidden="true" className="hidden min-[901px]:block">
      {motifs.map((m) => (
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
  );
}

export default function TravelPage() {
  return (
    <div className="px-4 pt-10">
      <div className="flex flex-col items-center text-center">
        <h1 className="sr-only">Getting to Todi</h1>
        <Eyebrow>{ITALY_TRAVEL.eyebrow}</Eyebrow>
      </div>

      <div className="mt-5 flex flex-col items-center">
        {ITALY_TRAVEL.sections.map((s) => (
          <section
            key={s.id}
            className="relative flex w-full flex-col items-center gap-[18px] py-[34px] text-center"
          >
            <MarginArt id={s.id} />

            <ScriptTitle>{s.title}</ScriptTitle>

            {/* One measure for the whole section so the intro and the lists
                share a left edge. Everything here is left-aligned inside a
                centred column: the entries run to two and three lines, and
                centring them leaves an unreadable rag. */}
            <div className="flex w-full max-w-[29rem] flex-col items-start gap-[30px] text-left">
              {s.body && <Prose>{s.body}</Prose>}

              {"blocks" in s &&
                s.blocks?.map((b) => (
                  <div key={b.label} className="flex w-full flex-col items-start gap-2.5">
                    <SmallCaps>{b.label}</SmallCaps>
                    <ul className="flex flex-col gap-2 font-body text-[18px] leading-[1.7] font-light text-ink-soft">
                      {b.lines.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  </div>
                ))}
            </div>

            {"cta" in s && s.cta && (
              <Link href={s.cta.href} className={`${capsLinkClass} mt-1`}>
                {s.cta.label}
              </Link>
            )}
          </section>
        ))}
      </div>

      <div
        aria-hidden="true"
        className="flex flex-wrap justify-center gap-5 pt-4 text-ink min-[901px]:hidden"
      >
        {MOBILE_ROW.map((m) => (
          <Motif key={m} name={m} size={46} />
        ))}
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { Motif } from "@/components/italy/Art";
import type { MotifName } from "@/components/italy/sketches";
import { Band } from "@/components/italy/Band";
import { Eyebrow, Prose, ScriptTitle, SmallCaps, capsLinkClass } from "@/components/italy/Type";
import { ITALY_RSVP, ITALY_TRAVEL } from "@/lib/italy-content";

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
    <>
      {/* width="full" matters here: MarginArt positions its motifs at
          calc(25% - ...) against their own relative section, so capping the
          Band measure would make that 25% of 1080px instead of the viewport
          and pull the art in over the text. The inner column keeps its own
          max-w-[29rem]. The relative <section> also has to stay - it is the
          containing block, and being a grandchild of the .linen element is
          what keeps the direct-child rule away from the absolute motifs. */}
      {ITALY_TRAVEL.sections.map((s, i) => (
        <Band
          key={s.id}
          tone={i % 2 === 0 ? "cream" : "band"}
          width="full"
          className={i === 0 ? "gap-5" : ""}
        >
          {/* The page heading and eyebrow ride inside the first section rather
              than in a band of their own: two stacked bands put their padding
              end to end and left a void between the label and the first word. */}
          {i === 0 && (
            <>
              <h1 className="sr-only">Getting to Todi</h1>
              <Eyebrow>{ITALY_TRAVEL.eyebrow}</Eyebrow>
            </>
          )}
          <section className="relative flex w-full flex-col items-center gap-[18px] text-center">
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
                    <ul className="flex flex-col gap-2 font-body text-[calc(18px*var(--fs-scale))] leading-[1.7] font-light text-ink-soft">
                      {b.lines.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  </div>
                ))}

              {/* The section note: where a block of copy has a shelf life,
                  the date it was last checked travels with it. */}
              {"note" in s && s.note && (
                <p className="font-body text-[calc(15px*var(--fs-scale))] leading-[1.6] font-light text-ink-soft italic">
                  {s.note}
                </p>
              )}
            </div>

            {"cta" in s && s.cta && (
              <Link href={s.cta.href} className={`${capsLinkClass} mt-1`}>
                {s.cta.label}
              </Link>
            )}
          </section>
        </Band>
      ))}

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

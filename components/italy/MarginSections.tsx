import type { ReactNode } from "react";
import Link from "next/link";
import { Motif } from "@/components/italy/Art";
import type { MotifName } from "@/components/italy/sketches";
import { Band } from "@/components/italy/Band";
import { Eyebrow, Prose, ScriptTitle, SmallCaps, capsLinkClass } from "@/components/italy/Type";

/*
 * The long-read layout shared by Travel and Italy: a run of alternating
 * bands, each a script title over left-aligned blocks of short lines, with
 * sketches scattered in the margins on desktop.
 *
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
export type MarginMotif = {
  name: MotifName;
  side: "left" | "right";
  jitter: number;
  top: number;
  size: number;
  rot: number;
};

export type SectionBlock = {
  label: string;
  lines: readonly string[];
  /* Outbound references, set under the lines as caps links. External, so
     they open in a new tab rather than taking the guest off the site. */
  links?: readonly { label: string; href: string }[];
};

export type MarginSection = {
  id: string;
  title: string;
  body?: string;
  blocks?: readonly SectionBlock[];
  note?: string;
  cta?: { label: string; href: string };
};

function MarginArt({ motifs }: { motifs?: MarginMotif[] }) {
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

export function MarginSections({
  heading,
  eyebrow,
  sections,
  motifs,
  leads = {},
}: {
  /* Screen-reader page title; the visible lead is the eyebrow. */
  heading: string;
  eyebrow: string;
  sections: readonly MarginSection[];
  motifs: Record<string, MarginMotif[]>;
  /* Anything a section needs beyond copy, keyed by section id and set
     straight under its title. A little wider than the text column, and no
     wider: at 901px the margin sketches start about 200px in from the edge. */
  leads?: Record<string, ReactNode>;
}) {
  /* width="full" matters here: MarginArt positions its motifs at
     calc(25% - ...) against their own relative section, so capping the
     Band measure would make that 25% of 1080px instead of the viewport
     and pull the art in over the text. The inner column keeps its own
     max-w-[29rem]. The relative <section> also has to stay - it is the
     containing block, and being a grandchild of the .linen element is
     what keeps the direct-child rule away from the absolute motifs. */
  return sections.map((s, i) => (
    <Band
      key={s.id}
      id={s.id}
      tone={i % 2 === 0 ? "cream" : "band"}
      width="full"
      className={i === 0 ? "gap-5" : ""}
    >
      {/* The page heading and eyebrow ride inside the first section rather
          than in a band of their own: two stacked bands put their padding
          end to end and left a void between the label and the first word. */}
      {i === 0 && (
        <>
          <h1 className="sr-only">{heading}</h1>
          <Eyebrow>{eyebrow}</Eyebrow>
        </>
      )}
      <section className="relative flex w-full flex-col items-center gap-[18px] text-center">
        <MarginArt motifs={motifs[s.id]} />

        <ScriptTitle>{s.title}</ScriptTitle>

        {leads[s.id] && <div className="mb-4 w-full max-w-[32rem]">{leads[s.id]}</div>}

        {/* One measure for the whole section so the intro and the lists
            share a left edge. Everything here is left-aligned inside a
            centred column: the entries run to two and three lines, and
            centring them leaves an unreadable rag. */}
        <div className="flex w-full max-w-[29rem] flex-col items-start gap-[30px] text-left">
          {s.body && <Prose>{s.body}</Prose>}

          {s.blocks?.map((b) => (
            <div key={b.label} className="flex w-full flex-col items-start gap-2.5">
              <SmallCaps>{b.label}</SmallCaps>
              <ul className="flex flex-col gap-2 font-body text-[calc(18px*var(--fs-scale))] leading-[1.7] font-light text-ink-soft">
                {b.lines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              {b.links && (
                <ul className="mt-1 flex flex-col items-start gap-3">
                  {b.links.map((l) => (
                    <li key={l.href}>
                      <a href={l.href} target="_blank" rel="noopener noreferrer" className={capsLinkClass}>
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          {/* The section note: where a block of copy has a shelf life,
              the date it was last checked travels with it. */}
          {s.note && (
            <p className="font-body text-[calc(15px*var(--fs-scale))] leading-[1.6] font-light text-ink-soft italic">
              {s.note}
            </p>
          )}
        </div>

        {s.cta && (
          <Link href={s.cta.href} className={`${capsLinkClass} mt-1`}>
            {s.cta.label}
          </Link>
        )}
      </section>
    </Band>
  ));
}

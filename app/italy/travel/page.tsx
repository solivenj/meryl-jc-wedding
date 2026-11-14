import type { Metadata } from "next";
import Link from "next/link";
import { Motif } from "@/components/italy/Art";
import type { MotifName } from "@/components/italy/sketches";
import { Band } from "@/components/italy/Band";
import { Scatter, type Placed } from "@/components/italy/Scatter";
import { Prose, ScriptTitle, capsLinkClass } from "@/components/italy/Type";
import { ITALY_RSVP, ITALY_TRAVEL } from "@/lib/italy-content";

export const metadata: Metadata = { title: "Travel" };

/*
 * Travel, laid out "at a glance": the answers most guests want in four
 * cards, then the border, the three ways in, and where to stay.
 *
 * The scattered line art sits in the margins above 900px only, positioned
 * inside the section that owns it so it moves with its own copy. Below that
 * it would land on the text, so phones get a small row in the hero instead.
 */

const HERO_ART: Placed[] = [
  { name: "swallow", size: 92, rot: -6, style: { left: "6%", top: 0 } },
  { name: "olive", size: 70, rot: 8, style: { right: "7%", top: -16 } },
];
const BORDER_ART: Placed[] = [{ name: "hat", size: 96, rot: -4, style: { right: "-2%", top: -24 } }];
const ARRIVING_ART: Placed[] = [
  { name: "vespa", size: 92, rot: -5, style: { left: "-1%", top: -10 } },
  { name: "boat", size: 84, rot: -4, style: { right: "0%", top: -6 } },
];
const STAY_ART: Placed[] = [
  { name: "wineglass", size: 64, rot: -8, style: { left: "10%", top: 0 } },
  { name: "espresso", size: 68, rot: 6, style: { right: "10%", top: 20 } },
];
const MOBILE_ROW: MotifName[] = ["swallow", "vespa", "olive", "boat"];

/* The section kicker: "01 · Before you book". Caps, no rule under it. */
function Kicker({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`font-caps text-[calc(10px*var(--fs-scale))] uppercase tracking-[0.24em] text-ink-soft ${className}`}>
      {children}
    </p>
  );
}

function BlockLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-caps text-[calc(11.5px*var(--fs-scale))] uppercase tracking-[0.16em] text-ink">{children}</h3>
  );
}

const body = "font-body text-[calc(17.5px*var(--fs-scale))] leading-[1.6] font-light";

export default function TravelPage() {
  const { glance, border, arriving, stay } = ITALY_TRAVEL;
  return (
    <>
      <Band tone="cream" className="gap-0">
        <div className="relative flex w-full flex-col items-center gap-3.5 text-center">
          <Scatter items={HERO_ART} />
          <Kicker>{ITALY_TRAVEL.eyebrow}</Kicker>
          <h1 className="font-display text-[calc(clamp(52px,6.4vw,76px)*var(--fs-scale))] leading-[1.05] font-normal text-ink">
            {ITALY_TRAVEL.title}
          </h1>
          <Prose align="center" className="max-w-[34em]">
            {ITALY_TRAVEL.intro}
          </Prose>
          <div aria-hidden="true" className="mt-2 flex justify-center gap-5 text-ink min-[901px]:hidden">
            {MOBILE_ROW.map((m) => (
              <Motif key={m} name={m} size={40} />
            ))}
          </div>
        </div>

        <ul
          aria-label="At a glance"
          className="mt-[clamp(36px,5vw,56px)] grid w-full grid-cols-1 gap-4 text-left min-[560px]:grid-cols-2 min-[1000px]:grid-cols-4"
        >
          {glance.map((c) => (
            <li
              key={c.title}
              className="flex flex-col gap-2 border border-rule bg-[rgb(255_252_245/0.75)] px-[22px] py-6"
            >
              <Kicker>{c.kicker}</Kicker>
              <p className="font-display text-[calc(32px*var(--fs-scale))] leading-[1.1] text-ink">{c.title}</p>
              <p className="font-body text-[calc(16px*var(--fs-scale))] leading-[1.55] font-light text-ink-soft">
                {c.body}
              </p>
            </li>
          ))}
        </ul>

        {/* Same band as the cards: as a band of its own, the two paddings
            stacked into an empty strip above the rule. The id and scroll
            margin move here so links to #entering still land on it. */}
        <div
          id={border.id}
          className="relative mt-[clamp(56px,7vw,88px)] w-full scroll-mt-[60px] border-t border-rule pt-[clamp(48px,6vw,72px)] text-left"
        >
          <Scatter items={BORDER_ART} />
          <div className="grid w-full gap-10 min-[900px]:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] min-[900px]:gap-16">
            <div className="flex flex-col gap-3">
              <Kicker>{border.kicker}</Kicker>
              <ScriptTitle size="lead">{border.title}</ScriptTitle>
              <p className={`${body} text-ink-soft`}>{border.intro}</p>
              <p className="mt-1 font-body text-[calc(15px*var(--fs-scale))] leading-[1.6] font-light text-ink-soft italic">
                {border.note}
              </p>
            </div>
            <div className="grid gap-x-10 gap-y-9 min-[640px]:grid-cols-2">
              {border.blocks.map((b) => (
                <div key={b.label} className="flex flex-col gap-2">
                  <BlockLabel>{b.label}</BlockLabel>
                  <p className={`${body} text-ink-soft`}>{b.body}</p>
                </div>
              ))}
              <div className="flex flex-col gap-3">
                <BlockLabel>{border.links.label}</BlockLabel>
                <ul className="flex flex-col gap-2.5">
                  {border.links.items.map((l) => (
                    <li key={l.href}>
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${body} text-forest underline decoration-forest/30 underline-offset-4 hover:decoration-forest`}
                      >
                        {l.label} <span aria-hidden="true">→</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Band>

      <Band tone="band" id={arriving.id}>
        <div className="relative flex w-full flex-col gap-10">
          <Scatter items={ARRIVING_ART} />
          <div className="flex flex-col items-center gap-2.5 text-center">
            <Kicker>{arriving.kicker}</Kicker>
            <ScriptTitle size="lead">{arriving.title}</ScriptTitle>
          </div>
          <div className="grid gap-5 text-left min-[820px]:grid-cols-3">
            {arriving.ways.map((w) => (
              <div key={w.label} className="flex flex-col gap-2.5 border border-rule px-[26px] py-7">
                <BlockLabel>{w.label}</BlockLabel>
                <p className={`${body} text-ink`}>{w.body}</p>
                <p className="font-body text-[calc(16px*var(--fs-scale))] leading-[1.55] font-light text-ink-soft">
                  {w.aside}
                </p>
              </div>
            ))}
          </div>
          <div className="grid gap-6 border-t border-rule pt-8 text-left min-[820px]:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] min-[820px]:gap-12">
            <h3 className="font-display text-[calc(36px*var(--fs-scale))] leading-[1.1] font-normal text-ink">
              {arriving.drive.title}
            </h3>
            <ul className={`grid list-disc gap-x-9 gap-y-3 pl-[1.1em] min-[640px]:grid-cols-2 ${body} text-ink`}>
              {arriving.drive.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </Band>

      {/* The last band stays cream: the footer is the deep ground, and two
          deep surfaces meeting read as one slab. */}
      <Band tone="cream" id={stay.id}>
        <div className="relative flex w-full flex-col items-center gap-3.5 text-center">
          <Scatter items={STAY_ART} />
          <Kicker>{stay.kicker}</Kicker>
          <ScriptTitle size="lead">{stay.title}</ScriptTitle>
          <Prose align="center" className="max-w-[30em]">
            {stay.body}
          </Prose>
          <Link
            href={stay.cta.href}
            className="mt-2.5 inline-flex min-h-11 items-center rounded-full border border-ink px-7 font-caps text-[calc(11px*var(--fs-scale))] uppercase tracking-[0.22em] text-ink transition-colors hover:bg-ink hover:text-ivory"
          >
            {stay.cta.label}
          </Link>
          <p className="mt-10 font-body text-[calc(16px*var(--fs-scale))] font-light text-ink-soft">
            {stay.closing.prompt}{" "}
            <a href={`mailto:${ITALY_RSVP.mailtoFallback}`} className={capsLinkClass}>
              {stay.closing.cta}
            </a>
          </p>
        </div>
      </Band>
    </>
  );
}

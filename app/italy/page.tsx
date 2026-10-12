import Link from "next/link";
import { Motif } from "@/components/italy/Art";
import { Band } from "@/components/italy/Band";
import { DetailBlocks } from "@/components/italy/DetailBlocks";
import { PhotoCarousel } from "@/components/italy/PhotoCarousel";
import { PolaroidStack } from "@/components/italy/PolaroidStack";
import { ProgramTimeline } from "@/components/italy/ProgramTimeline";
import { Label, Prose, Rule, ScriptTitle, SmallCaps, capsLinkClass } from "@/components/italy/Type";
import { RsvpReply } from "@/components/italy/RsvpReply";
import type { MotifName } from "@/components/italy/sketches";
import {
  ITALY,
  ITALY_DETAILS,
  ITALY_HOME,
  ITALY_PROGRAM,
  ITALY_SCHEDULE,
} from "@/lib/italy-content";

/*
 * The home page carries the invitation. Everything a guest needs in order to
 * turn up is here, in order; the tabs hold what is optional.
 *
 * Bands alternate cream and the deep ground. The last one before the footer
 * is deliberately cream — the footer is the deep ground, and two deep
 * surfaces meeting reads as one slab.
 */

/* TBD — swap for chosen photographs. Any file in public/italy/photos also
   feeds the hero carousel, so these are picked from that set rather than
   added to it. */
const WELCOME_PHOTOS = [
  { src: "/italy/photos/IMG_7083.JPG", alt: "Meryl and John", rotate: -5 },
  { src: "/italy/photos/IMG_7098.JPG", alt: "Meryl and John", rotate: 4 },
];

export default function ItalyHome() {
  return (
    <>
      {/* Hero. The h1 lives here and must stay filled — it is the page's only
          heading, and it sat empty while the script was commented out. */}
      <PhotoCarousel>
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="font-flourish text-[clamp(46px,10.4vw,150px)] leading-none text-ivory [text-shadow:0_2px_26px_rgba(30,20,10,.42)]">
            {ITALY.names}
          </h1>
          <p className="font-caps text-[10px] uppercase tracking-[0.28em] text-ivory/90 [text-shadow:0_1px_14px_rgba(30,20,10,.5)]">
            {ITALY_HOME.hero.tagline}
          </p>
        </div>
      </PhotoCarousel>

      {/* Welcome — blurb beside the photographs */}
      <Band tone="band" width="wide" align="left">
        <div className="grid w-full items-center gap-12 min-[900px]:grid-cols-[1fr_auto] min-[900px]:gap-16">
          <div className="flex flex-col items-start gap-6 text-left">
            <ScriptTitle>{ITALY_HOME.welcome.script}</ScriptTitle>
            <Prose>{ITALY_HOME.welcome.body}</Prose>
            <Prose>{ITALY_HOME.welcome.body2}</Prose>
            <div className="mt-2">
              <RsvpReply label={ITALY_HOME.welcome.button} />
            </div>
          </div>
          <PolaroidStack
            items={WELCOME_PHOTOS}
            note={`Join us as we say “I do”
${ITALY.dates}`}
            className="whitespace-pre-line min-[900px]:w-[320px]"
          />
        </div>
      </Band>

      {/* About — the three columns */}
      <Band tone="cream" width="wide">
        <ScriptTitle>{ITALY_HOME.about.title}</ScriptTitle>
        <div className="mt-12 grid w-full gap-12 min-[800px]:grid-cols-3 min-[800px]:gap-8">
          {ITALY_HOME.about.columns.map((c) => (
            <div key={c.title} className="flex flex-col items-center gap-4 text-center">
              <Motif name={c.motif as MotifName} size={74} className="text-ink" />
              <Label>{c.title}</Label>
              <p className="max-w-[34ch] font-body text-[17px] leading-[1.7] font-light text-ink-soft">
                {c.body}
              </p>
              {c.href && (
                <Link href={c.href} className={capsLinkClass}>
                  See the dress code
                </Link>
              )}
            </div>
          ))}
        </div>
      </Band>

      {/* The three days */}
      <Band tone="band" width="wide">
        <ScriptTitle>{ITALY_HOME.days.title}</ScriptTitle>
        <div className="mt-12 grid w-full gap-12 min-[800px]:grid-cols-3 min-[800px]:gap-10">
          {ITALY_SCHEDULE.days.map((d) => (
            <div key={d.day} className="flex flex-col items-center gap-3.5 text-center">
              <SmallCaps>{d.day}</SmallCaps>
              <ScriptTitle as="h3">{d.title}</ScriptTitle>
              <p className="font-body text-[17px] leading-[1.6] font-light text-ink-soft italic">
                “{d.quote}”
              </p>
              <p className="font-body text-[16.5px] leading-[1.6] font-light text-ink-soft">
                {d.time}
              </p>
              {"place" in d && (
                <p className="font-body text-[16.5px] leading-[1.6] font-light text-ink-soft">
                  {d.place}
                </p>
              )}
              <Rule className="mt-1" />
              <SmallCaps>Dress code · {d.dress}</SmallCaps>
            </div>
          ))}
        </div>
      </Band>

      {/* Program + Details */}
      <Band tone="cream" width="wide">
        <div className="grid w-full gap-14 min-[800px]:grid-cols-2 min-[800px]:gap-20">
          <ProgramTimeline
            title={ITALY_PROGRAM.title}
            rows={ITALY_PROGRAM.rows}
            note={ITALY_PROGRAM.note}
          />
          <div className="w-full text-left">
            <h3 className="font-caps text-[12px] uppercase tracking-[0.2em] text-ink">
              {ITALY_DETAILS.title}
            </h3>
            <DetailBlocks className="mt-6" blocks={ITALY_DETAILS.blocks} />
          </div>
        </div>
      </Band>

      {/* The reply. Cream, because the footer below it is the deep ground. */}
      <Band tone="cream" width="prose" className="gap-6">
        <ScriptTitle>{ITALY_HOME.rsvp.script}</ScriptTitle>
        <Motif name="rings" size={92} className="text-ink" />
        <p className="font-caps text-[10px] uppercase tracking-[0.24em] text-ink-soft">
          {ITALY_HOME.rsvp.replyBy}
        </p>
        <RsvpReply label={ITALY_HOME.rsvp.button} />
        {/* RSVP has no nav tab, so this is the only route to the registry. */}
        <Link href="/italy/rsvp" className={capsLinkClass}>
          {ITALY_HOME.rsvp.registryLink}
        </Link>
      </Band>
    </>
  );
}

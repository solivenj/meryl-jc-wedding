import Link from "next/link";
import { Motif } from "@/components/italy/Art";
import { Band } from "@/components/italy/Band";
import { DetailBlocks } from "@/components/italy/DetailBlocks";
import { PhotoCarousel } from "@/components/italy/PhotoCarousel";
import { PolaroidStack } from "@/components/italy/PolaroidStack";
import { Prose, Rule, ScriptTitle, SmallCaps, capsLinkClass } from "@/components/italy/Type";
import { RsvpReply } from "@/components/italy/RsvpReply";
import type { MotifName } from "@/components/italy/sketches";
import { ITALY, ITALY_DETAILS, ITALY_HOME, ITALY_SCHEDULE } from "@/lib/italy-content";

/*
 * The home page carries the invitation. Everything a guest needs in order to
 * turn up is here, in order; the tabs hold what is optional.
 *
 * Bands alternate cream and the deep ground. The last one before the footer
 * is deliberately cream — the footer is the deep ground, and two deep
 * surfaces meeting reads as one slab.
 *
 * The run of show is not here. It covered Thursday only and repeated the two
 * hours the days section already gives, so it is parked in ITALY_PROGRAM
 * until the replies are in; see the three-day layouts before putting it back.
 */

/* TBD — swap for chosen photographs. Any file in public/italy/photos also
   feeds the hero carousel, so these are picked from that set rather than
   added to it. */
/* The three motifs are drawn at different scales inside their own boxes:
   the rings are wide and shallow, the coupe is tall, and the sun is a sketch
   that only fills about three quarters of its viewBox. Sized by eye so the
   three read as the same weight rather than the same number. */
const MOTIF_SIZE: Record<string, number> = { coupe: 64, rings: 80, sun: 74 };

const WELCOME_PHOTOS = [
  { src: "/italy/photos/IMG_7083.JPG", alt: "Meryl and John", rotate: -5 },
  { src: "/italy/photos/0U1A5834.jpg", alt: "Meryl and John", rotate: 4 },
];

export default function ItalyHome() {
  return (
    <>
      {/* Hero. Nothing is set over the photographs now, but the h1 has to
          stay — it is the page's only heading, and the page shipped without one
          once already. The names lockup in the header carries it visually. */}
      <h1 className="sr-only">{ITALY.names}</h1>
      <PhotoCarousel />

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
            note={`Celebrate our love with us
${ITALY.dates}`}
            className="whitespace-pre-line min-[900px]:w-[320px]"
          />
        </div>
      </Band>

      {/* The three days. Cream: it follows the deep welcome band and leads
          the deep Details band below it. */}
      <Band tone="cream" width="wide">
        <ScriptTitle>{ITALY_HOME.days.title}</ScriptTitle>
        <div className="mt-12 grid w-full gap-12 min-[800px]:grid-cols-3 min-[800px]:gap-10">
          {ITALY_SCHEDULE.days.map((d) => (
            <div key={d.day} className="flex flex-col items-center gap-3.5 text-center">
              {/* A fixed box so the three names start on the same line: the
                  motifs are different shapes and sizes, and left to itself
                  each column would set its own top edge. */}
              <span className="flex h-[76px] items-end justify-center">
                <Motif name={d.motif as MotifName} size={MOTIF_SIZE[d.motif]} className="text-ink" />
              </span>
              <SmallCaps>{d.day}</SmallCaps>
              <ScriptTitle as="h3">{d.title}</ScriptTitle>
              <p className="font-body text-[calc(17px*var(--fs-scale))] leading-[1.6] font-light text-ink-soft italic">
                “{d.quote}”
              </p>
              <p className="font-body text-[calc(16.5px*var(--fs-scale))] leading-[1.6] font-light text-ink-soft">
                {d.time}
              </p>
              {"place" in d && (
                <p className="font-body text-[calc(16.5px*var(--fs-scale))] leading-[1.6] font-light text-ink-soft">
                  {d.place}
                </p>
              )}
              <Rule className="mt-1" />
              <SmallCaps>Dress code · {d.dress}</SmallCaps>
            </div>
          ))}
        </div>
      </Band>

      {/* Details. Prose width holds the column at roughly what it measured
          as half of the old two-up grid, so the lines do not get longer now
          that the program is no longer beside it. */}
      <Band tone="band" width="prose">
        <div className="w-full text-left">
          <h3 className="font-caps text-[calc(12px*var(--fs-scale))] uppercase tracking-[0.2em] text-ink">
            {ITALY_DETAILS.title}
          </h3>
          <DetailBlocks className="mt-6" blocks={ITALY_DETAILS.blocks} />
        </div>
      </Band>

      {/* The reply. Cream, because the footer below it is the deep ground. */}
      <Band tone="cream" width="prose" className="gap-6">
        <ScriptTitle>{ITALY_HOME.rsvp.script}</ScriptTitle>
        <Motif name="rings" size={92} className="text-ink" />
        <p className="font-caps text-[calc(10px*var(--fs-scale))] uppercase tracking-[0.24em] text-ink-soft">
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

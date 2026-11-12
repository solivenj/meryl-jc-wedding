import Link from "next/link";
import { Motif } from "@/components/italy/Art";
import { Band } from "@/components/italy/Band";
import { DetailCollage } from "@/components/italy/DetailCollage";
import { ItalyCountdown } from "@/components/italy/ItalyCountdown";
import { PhotoCarousel } from "@/components/italy/PhotoCarousel";
/* `Rule` goes back in the import when the parked day links below return. */
import { Prose, ScriptTitle, SmallCaps, capsLinkClass } from "@/components/italy/Type";
import { RsvpReply } from "@/components/italy/RsvpReply";
import type { MotifName } from "@/components/italy/sketches";
import { ITALY, ITALY_HOME, ITALY_SCHEDULE } from "@/lib/italy-content";

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

/* All three are our own drawings, trimmed to their ink, so one size reads
   as one weight. Kept as a map so any one can be nudged by eye. */
const MOTIF_SIZE: Record<string, number> = { cheers: 80, rings: 80, luggage: 80 };

export default function ItalyHome() {
  return (
    <>
      {/* Hero. Nothing is set over the photographs now, but the h1 has to
          stay — it is the page's only heading, and the page shipped without one
          once already. The names lockup in the header carries it visually. */}
      <h1 className="sr-only">{ITALY.names}</h1>
      <PhotoCarousel />

      {/* The collage and the welcome share ONE olive band, rather than taking
          one each. Two reasons. The page alternates olive and cream and has to
          end cream before the olive footer; a sixth band breaks that parity and
          lands the RSVP band olive against an olive footer. And the two belong
          together anyway — the facts, then the greeting, as one opening
          movement instead of two olive slabs in a row.

          The welcome's old PolaroidStack is gone with it: the collage carries
          photographs now, and two polaroid groups in one band is one too many. */}
      <Band tone="band" width="wide">
        <DetailCollage />
        <div className="mt-[clamp(36px,5vw,64px)] flex flex-col items-center gap-6">
          <ScriptTitle size="lead">{ITALY_HOME.welcome.script}</ScriptTitle>
          <Prose align="center">{ITALY_HOME.welcome.body}</Prose>
          {/* No reply button here: the RSVP band at the foot of the page
              is the one place to answer. */}
          <Prose align="center">{ITALY_HOME.welcome.body2}</Prose>
        </div>
      </Band>

      {/* The three days. Cream: it follows the deep welcome band and leads
          the deep countdown band below it. */}
      <Band tone="cream" width="wide">
        <ScriptTitle>{ITALY_HOME.days.title}</ScriptTitle>
        <div className="mt-12 grid w-full gap-12 min-[800px]:grid-cols-3 min-[800px]:gap-10">
          {ITALY_SCHEDULE.days.map((d) => (
            /* h-full + mt-auto on the footer below: grid rows stretch, so the
               three rules sit on one line however many lines a title takes.
               Thursday's wraps to two and the others do not. */
            <div key={d.day} className="flex h-full flex-col items-center gap-3.5 text-center">
              {/* A fixed box so the three names start on the same line: the
                  motifs are different shapes and sizes, and left to itself
                  each column would set its own top edge. */}
              <span className="flex h-[76px] items-end justify-center">
                <Motif name={d.motif as MotifName} size={MOTIF_SIZE[d.motif]} className="text-ink" />
              </span>
              {/* The start times are off for now; each day still carries
                  `start` in ITALY_SCHEDULE for when they come back. */}
              <SmallCaps>{d.day}</SmallCaps>
              <ScriptTitle as="h3" size="compact">
                {d.title}
              </ScriptTitle>
              {/* <p className="font-body text-[calc(17px*var(--fs-scale))] leading-[1.6] font-light text-ink-soft italic">
                “{d.quote}”
              </p> */}
              {/* {"place" in d && (
                <p className="font-body text-[calc(16.5px*var(--fs-scale))] leading-[1.6] font-light text-ink-soft">
                  {d.place}
                </p>
              )} */}
              {/* Parked, not dropped — the hrefs are still on each day in
                  ITALY_SCHEDULE (`link`), so putting these back is just
                  uncommenting. The rule goes with them: on its own under the
                  title it reads as a stray line rather than a separator.
                  The h-full/mt-auto pair above is what pins this row flush
                  across the three columns, so leave it in place for the
                  return. */}
              {/* <div className="mt-auto flex flex-col items-center gap-3.5 pt-1">
                <Rule />
                <Link href={d.link.href} className={capsLinkClass}>
                  {d.link.label}
                </Link>
              </div> */}
            </div>
          ))}
        </div>
      </Band>

      {/* The countdown takes the olive slot the Details band held. Details
          is parked until the date is closer: the copy is still in
          ITALY_DETAILS, and putting it back is this band again with
          <ScriptTitle as="h3">{ITALY_DETAILS.title}</ScriptTitle> over
          <DetailBlocks blocks={ITALY_DETAILS.blocks} /> at width="prose".
          Wide here so the four figures get room. */}
      <Band tone="band" width="wide">
        <ItalyCountdown />
      </Band>

      {/* The reply. Cream because the footer below it is the deep ground.
          Almost no top padding: the doves hang just under the countdown band.
          The bottom keeps the normal Band padding above the footer. */}
      <Band tone="cream" width="wide" pad="none" className="gap-6 pt-5 pb-[clamp(56px,8vw,96px)]">
        <Motif name="doves" size={288} className="text-ink" />
        <ScriptTitle>{ITALY_HOME.rsvp.script}</ScriptTitle>
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

import Link from "next/link";
import { Motif } from "@/components/italy/Art";
import { Band } from "@/components/italy/Band";
import { DetailBlocks } from "@/components/italy/DetailBlocks";
import { DetailCollage } from "@/components/italy/DetailCollage";
import { ItalyCountdown } from "@/components/italy/ItalyCountdown";
import { PhotoCarousel } from "@/components/italy/PhotoCarousel";
/* `Rule` goes back in the import when the parked day links below return. */
import { Prose, ScriptTitle, SmallCaps, capsLinkClass } from "@/components/italy/Type";
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

/* The three motifs are drawn at different scales inside their own boxes:
   the rings are wide and shallow, the coupe is tall, and the sun is a sketch
   that only fills about three quarters of its viewBox. Sized by eye so the
   three read as the same weight rather than the same number. */
const MOTIF_SIZE: Record<string, number> = { coupe: 64, rings: 80, sun: 74 };

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
          <Prose align="center">{ITALY_HOME.welcome.body2}</Prose>
          <div className="mt-2">
            <RsvpReply label={ITALY_HOME.welcome.button} />
          </div>
        </div>
      </Band>

      {/* The three days. Cream: it follows the deep welcome band and leads
          the deep Details band below it. */}
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
              <SmallCaps>
                {d.day}
                {"start" in d && ` · ${d.start}`}
              </SmallCaps>
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

      {/* Details. Prose width holds the column at roughly what it measured
          as half of the old two-up grid, so the lines do not get longer now
          that the program is no longer beside it. */}
      <Band tone="band" width="prose">
        {/* The heading matches every other section on the page — script face,
            centred by the Band. The blocks below stay left: they are prose,
            and centred body copy is far harder to read. */}
        <ScriptTitle as="h3">{ITALY_DETAILS.title}</ScriptTitle>
        <div className="w-full text-left">
          <DetailBlocks className="mt-8" blocks={ITALY_DETAILS.blocks} />
        </div>
      </Band>

      {/* The countdown, then the reply, in one cream band: cream because the
          footer below it is the deep ground, and shared because a band of
          its own would break the alternation (see ITALY_HOME.countdown).
          Wide rather than prose so the four figures get room; everything
          in here is short and centred, so nothing else gets longer lines. */}
      <Band tone="cream" width="wide" className="gap-6">
        <ItalyCountdown />
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

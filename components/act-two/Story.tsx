"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Reveal } from "@/components/ui/Reveal";
import { STORY } from "@/lib/content";
import { EASE_OUT, MASK_REVEAL } from "@/lib/motion";

/*
 * S2 — Story / invitation (PRD §4.1). The section's signature: the Act I
 * envelope back at miniature scale, ribbon re-tied. Side captions arrive
 * from their sides; the invitation copy rises in line-group masks.
 */

/*
 * At md+ the two captions flank the frames and each hugs the middle column:
 * the left one is right-aligned, the right one left-aligned. Below md the grid
 * collapses to a single column and they'd both fall to the left edge, so the
 * pair reads as one stack. Aligning the trailing caption to the right keeps the
 * left/right conversation intact on a phone, and it sits under the oval
 * portrait, which is itself offset right.
 */
function Caption({ lines, from }: { lines: string[]; from: "left" | "right" }) {
  return (
    <Reveal
      x={from === "left" ? -24 : 24}
      className={from === "left" ? "md:text-right" : "text-right md:text-left"}
    >
      <p className="font-utility text-[11px] leading-[2] tracking-[0.26em] text-ink-soft">
        {lines.map((line) => (
          <span key={line} className="block whitespace-nowrap">
            {line}
          </span>
        ))}
      </p>
    </Reveal>
  );
}

export function Story() {
  const reduced = useReducedMotion();
  const groups = STORY.invitation;

  return (
    <section className="bg-ivory px-6 py-24 sm:py-32">
      {/* max-w-7xl, not 4xl: the gallery-wall frames are wide enough now that a
          narrower grid squeezed the side captions into mid-phrase wraps.
          The middle track is minmax(0,45rem) rather than auto: every child of
          the frame stack is absolutely positioned, so an auto track has no
          intrinsic width to size from — it either collapsed to 0 or blew past
          the viewport. minmax gives it a definite cap that can still shrink. */}
      <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-[1fr_minmax(0,45rem)_1fr] md:gap-14">
        <Caption lines={STORY.captionLeft} from="left" />

        {/* A little gallery wall — the framed couple photo with an oval
            portrait offset beside it, each hung at a slight tilt. */}
        {/* Sized fluidly rather than in fixed rem: the frames are large enough now
            that fixed widths blew past a phone viewport. The container caps at
            45rem and the frames are percentages of it, so the composition holds
            its proportions at every width and never overflows. */}
        <div className="relative mx-auto aspect-[25/28] w-full max-w-[45rem]">
          {/* Rectangular frame — the anchor piece */}
          <div className="absolute left-0 top-0 w-[64%]">
            <motion.div
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={
                reduced
                  ? { duration: 0.5 }
                  : { type: "spring", stiffness: 120, damping: 18 }
              }
              suppressHydrationWarning
            >
              <Image
                src="/framed_couple_final-remove-bg-io.png"
                alt="A framed photo of the couple"
                width={1087}
                height={1447}
                unoptimized /* static export has no optimizer; asset is local */
                className="block h-auto w-full [filter:drop-shadow(0_14px_16px_rgb(138_122_95/0.3))]"
              />
            </motion.div>
          </div>

          {/* Oval portrait — hung lower and to the right, layered on top */}
          <div className="absolute bottom-0 right-0 z-10 w-[60%]">
            <motion.div
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={
                reduced
                  ? { duration: 0.5, delay: 0.1 }
                  : { type: "spring", stiffness: 120, damping: 18, delay: 0.12 }
              }
              suppressHydrationWarning
            >
              <Image
                src="/oval_portrait.png"
                alt="An oval portrait of the couple"
                width={1536}
                height={2304}
                unoptimized /* static export has no optimizer; asset is local */
                className="block h-auto w-full [filter:drop-shadow(0_14px_16px_rgb(138_122_95/0.3))]"
              />
            </motion.div>
          </div>
        </div>

        <Caption lines={STORY.captionRight} from="right" />
      </div>

      {/* Invitation copy, rising by line groups. The viewport observer lives
          on the UNCLIPPED wrapper: a child translated inside overflow-hidden
          is 100% clipped, so IntersectionObserver would never fire on it. */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        className="mx-auto mt-4 max-w-2xl space-y-6 text-center sm:mt-6"
      >
        {groups.map((group, i) => (
          <div key={group} className="overflow-hidden">
            <motion.p
              variants={
                reduced
                  ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
                  : { hidden: { opacity: 0, y: "100%" }, show: { opacity: 1, y: "0%" } }
              }
              transition={{
                delay: i * MASK_REVEAL.lineStagger,
                duration: MASK_REVEAL.duration,
                ease: EASE_OUT,
              }}
              suppressHydrationWarning
              className="font-body text-[13px] leading-[2.15] tracking-[0.14em] text-ink uppercase"
            >
              {group}
            </motion.p>
          </div>
        ))}
      </motion.div>
    </section>
  );
}

"use client";

import { motion, useReducedMotion } from "motion/react";
import { Reveal } from "@/components/ui/Reveal";
import { TRAVEL, FAQ } from "@/lib/content";
import { EASE_OUT, SCROLL_REVEAL } from "@/lib/motion";
import { useCappedWidth } from "@/components/dev/WidthToggleContext";

/*
 * Travel & Stay + FAQ (added post-launch). Sits after Program on plain ivory —
 * Program carries the ivory-deep tint, so the two panels alternate. Reuses the
 * Program two-halves layout and the Reception label-first rise.
 */

function TravelColumn() {
  const reduced = useReducedMotion();
  return (
    <div>
      <Reveal>
        <h2 className="font-display text-5xl text-ink sm:text-6xl">
          {TRAVEL.header}
        </h2>
      </Reveal>
      <div className="mt-10 space-y-9">
        {TRAVEL.blocks.map((block, i) => (
          <div key={block.label}>
            <motion.h3
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{
                delay: i * SCROLL_REVEAL.stagger * 2,
                duration: SCROLL_REVEAL.duration,
                ease: EASE_OUT,
              }}
              suppressHydrationWarning
              className="font-body text-[15px] font-medium tracking-[0.02em] text-ink"
            >
              {block.label}
            </motion.h3>
            <motion.p
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{
                delay: i * SCROLL_REVEAL.stagger * 2 + 0.12,
                duration: SCROLL_REVEAL.duration,
                ease: EASE_OUT,
              }}
              suppressHydrationWarning
              className="mt-2 max-w-[42ch] font-body text-[17px] leading-[1.75] text-ink-soft"
            >
              {block.body}
            </motion.p>
          </div>
        ))}
      </div>
    </div>
  );
}

function FaqColumn() {
  const reduced = useReducedMotion();
  return (
    <div>
      <Reveal delay={0.1}>
        <h2 className="font-display text-5xl text-ink sm:text-6xl">
          {FAQ.header}
        </h2>
      </Reveal>
      <div className="mt-10 space-y-9">
        {FAQ.items.map((item, i) => (
          <div key={item.question}>
            <motion.h3
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{
                delay: i * SCROLL_REVEAL.stagger * 2,
                duration: SCROLL_REVEAL.duration,
                ease: EASE_OUT,
              }}
              suppressHydrationWarning
              className="font-body text-[15px] font-medium tracking-[0.02em] text-ink"
            >
              {item.question}
            </motion.h3>
            <motion.p
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{
                delay: i * SCROLL_REVEAL.stagger * 2 + 0.12,
                duration: SCROLL_REVEAL.duration,
                ease: EASE_OUT,
              }}
              suppressHydrationWarning
              className="mt-2 max-w-[42ch] font-body text-[17px] leading-[1.75] text-ink-soft"
            >
              {item.answer}
            </motion.p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TravelFaq() {
  // TEMP — capped is the dev A/B toggle; once John's picked a width, drop
  // this and always render the max-w-5xl wrapper below (see the plan).
  const [capped] = useCappedWidth();
  return (
    <section className="bg-ivory py-24 sm:py-32">
      {/* Capped at max-w-5xl so the halves shrink together on wide screens —
          otherwise short content sits centered in a much-too-wide half,
          leaving a large empty gap at the shared midline. Same two-halves
          split as Program within that: no column gap so the divide sits at
          50%; gap-y-20 gives breathing room when stacked below md. */}
      <div className={capped ? "mx-auto max-w-5xl" : undefined}>
        <div className="grid gap-y-20 md:grid-cols-2">
          <div className="flex justify-center px-6">
            <div className="w-fit max-w-full">
              <TravelColumn />
            </div>
          </div>
          <div className="flex justify-center px-6">
            <div className="w-fit max-w-full">
              <FaqColumn />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

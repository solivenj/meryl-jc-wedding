"use client";

import { motion, useReducedMotion } from "motion/react";
import { Reveal } from "@/components/ui/Reveal";
import { PROGRAM, RECEPTION } from "@/lib/content";
import { EASE_OUT, RULE_EXTEND, SCROLL_REVEAL } from "@/lib/motion";

/*
 * S4 — Program & Reception (PRD §4.1). Two columns; timeline rows cascade
 * with hairline rules extending from the left as each row lands; reception
 * blocks rise label-first on the opposite column.
 */

function ProgramColumn() {
  const reduced = useReducedMotion();

  return (
    <div>
      <Reveal>
        <h2 className="font-display text-5xl text-ink sm:text-6xl">{PROGRAM.header}</h2>
      </Reveal>
      <ol className="mt-10">
        {PROGRAM.rows.map((row, i) => (
          <li key={row.time} className="relative">
            <motion.div
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{
                delay: i * RULE_EXTEND.stagger,
                duration: SCROLL_REVEAL.duration,
                ease: EASE_OUT,
              }}
              suppressHydrationWarning
              className="flex items-baseline gap-6 py-4"
            >
              <span className="w-20 shrink-0 font-utility text-[11px] tracking-[0.18em] text-ink-soft tabular-nums">
                {row.time}
              </span>
              <span className="font-body text-[17px] text-ink">{row.item}</span>
            </motion.div>
            {i < PROGRAM.rows.length - 1 && (
              <motion.div
                aria-hidden
                initial={reduced ? { opacity: 0 } : { scaleX: 0 }}
                whileInView={reduced ? { opacity: 1 } : { scaleX: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{
                  delay: i * RULE_EXTEND.stagger + 0.15,
                  duration: RULE_EXTEND.duration,
                  ease: EASE_OUT,
                }}
                suppressHydrationWarning
                className="h-px origin-left bg-ink/15"
              />
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

function ReceptionColumn() {
  const reduced = useReducedMotion();

  return (
    <div>
      <Reveal delay={0.1}>
        <h2 className="font-display text-5xl text-ink sm:text-6xl">{RECEPTION.header}</h2>
      </Reveal>
      <div className="mt-10 space-y-9">
        {RECEPTION.blocks.map((block, i) => (
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
              className="mt-2 max-w-[42ch] font-body text-[15.5px] leading-[1.75] text-ink-soft"
            >
              {block.body}
            </motion.p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Program() {
  return (
    <section className="bg-ivory px-6 py-24 sm:py-32">
      {/* Split the page into two halves; center a bounded block in each half
          (Program in the left, Reception in the right). Content stays
          internally left-aligned so times and hairline rules keep lining up. */}
      <div className="mx-auto grid max-w-6xl gap-14 md:grid-cols-2 md:gap-10">
        <div className="flex justify-center">
          <div className="w-full max-w-sm">
            <ProgramColumn />
          </div>
        </div>
        <div className="flex justify-center">
          <div className="w-full max-w-sm">
            <ReceptionColumn />
          </div>
        </div>
      </div>
    </section>
  );
}

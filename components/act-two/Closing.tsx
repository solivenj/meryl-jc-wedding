"use client";

import { motion, useReducedMotion } from "motion/react";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { CLOSING, PLACEHOLDER_ALT } from "@/lib/content";
import { EASE_OUT, LINE_ART_DRAW, MASK_REVEAL } from "@/lib/motion";

/*
 * S5 — Closing (PRD §4.1). Full-bleed photo; the display line rises through
 * a clip mask, then a small hand-drawn heart draws itself in.
 */
export function Closing() {
  const reduced = useReducedMotion();

  return (
    <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden">
      {/* PLACEHOLDER — full-bleed photograph, ~3:2, bouquet close-up */}
      <PlaceholderImage
        label="CLOSING PHOTO · 3:2"
        alt={PLACEHOLDER_ALT.closing}
        tone="deep"
        fill
      />
      <div className="absolute inset-0 bg-scrim" aria-hidden />

      <div className="relative px-6 py-24 text-center text-ivory">
        {/* Observer on the unclipped wrapper (see Story.tsx note). */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
          className="overflow-hidden pb-2"
        >
          <motion.h2
            variants={
              reduced
                ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
                : { hidden: { opacity: 0, y: "70%" }, show: { opacity: 1, y: "0%" } }
            }
            transition={{ duration: MASK_REVEAL.duration + 0.2, ease: EASE_OUT }}
            suppressHydrationWarning
            className="font-display leading-[1.25]"
            style={{ fontSize: "clamp(2.5rem, 7vw, 5.25rem)" }}
          >
            {CLOSING.line}
          </motion.h2>
        </motion.div>

        {/* Hand-drawn heart flourish, drawn after the line lands */}
        <svg
          aria-hidden
          viewBox="0 0 48 44"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="mx-auto mt-7 h-10 w-auto opacity-90"
        >
          <motion.path
            d="M 24 14 C 22 4, 6 2, 5 13 C 4 22, 16 30, 24 37 C 32 30, 44 22, 43 13 C 42 2, 26 4, 24 15"
            initial={reduced ? { opacity: 1 } : { pathLength: 0, opacity: 0 }}
            whileInView={reduced ? { opacity: 1 } : { pathLength: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={
              reduced
                ? { duration: 0 }
                : {
                    pathLength: {
                      delay: MASK_REVEAL.duration,
                      duration: LINE_ART_DRAW.duration * 0.5,
                      ease: EASE_OUT,
                    },
                    opacity: { delay: MASK_REVEAL.duration, duration: 0.15 },
                  }
            }
            suppressHydrationWarning
          />
        </svg>
      </div>
    </section>
  );
}

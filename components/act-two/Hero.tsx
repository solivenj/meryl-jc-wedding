"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { COUPLE, EVENT, HERO, PLACEHOLDER_ALT } from "@/lib/content";
import { EASE_OUT, HERO_SETTLE } from "@/lib/motion";

/*
 * S1 — Hero (PRD §4.1). Full-bleed photo + scrim; bow-motif flourish replaces
 * the reference's dove ornament. Photo settles 1.06 → 1 as the Act I card
 * hand-off completes; names sharpen from a soft blur; corner meta slides in
 * from its corners. Parallax capped at 8%, photo only.
 */
export function Hero() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const parallax = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", `${HERO_SETTLE.parallaxPct}%`],
  );

  return (
    <section ref={ref} className="relative flex min-h-dvh items-center justify-center overflow-hidden">
      {/* PLACEHOLDER — full-bleed hero photograph, ~3:2, B&W candid of the couple */}
      <motion.div
        className="absolute inset-[-8%]"
        initial={reduced ? { opacity: 0 } : { opacity: 0, scale: HERO_SETTLE.fromScale }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: EASE_OUT }}
        style={reduced ? undefined : { y: parallax }}
        suppressHydrationWarning
      >
        <PlaceholderImage
          label="HERO PHOTO · 3:2"
          alt={PLACEHOLDER_ALT.hero}
          tone="deep"
          fill
        />
      </motion.div>
      <div className="absolute inset-0 bg-scrim" aria-hidden />

      {/* Chanel rule (PRD P5): the blur-to-sharp on this lockup was the one
          effect too many — cut in favor of the plain rise. */}
      <motion.div
        className="relative px-6 text-center text-ivory"
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 1.1, ease: EASE_OUT }}
        suppressHydrationWarning
      >
        {/* Bow-motif flourish: Act I's ribbon, re-drawn in a single line */}
        <svg
          aria-hidden
          viewBox="0 0 120 44"
          className="mx-auto mb-5 h-9 w-auto opacity-80"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        >
          <path d="M 60 24 C 46 10, 22 12, 25 25 C 27 36, 48 33, 59 24" />
          <path d="M 60 24 C 74 10, 98 12, 95 25 C 93 36, 72 33, 61 24" />
          <path d="M 56 27 C 50 34, 45 39, 41 42" />
          <path d="M 64 27 C 69 34, 74 38, 79 41" />
        </svg>

        <p className="font-utility text-[11px] tracking-[0.3em] text-ivory/85">
          {HERO.eyebrow}
        </p>
        <h1
          className="mt-5 font-display leading-[1.1]"
          style={{ fontSize: "clamp(3.25rem, 10vw, 8rem)" }}
        >
          {COUPLE.first}
          <span aria-hidden className="mx-2 inline-block align-middle text-[1.2em] leading-none -translate-y-1">
            &amp;
          </span>
          <span className="sr-only">and</span>
          {COUPLE.second}
        </h1>
      </motion.div>

      {/* Corner meta, arriving from their respective corners; stacks on
          narrow screens so the two lines never collide. */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 p-6 sm:flex-row sm:items-end sm:justify-between sm:p-8 lg:px-10">
        <motion.p
          className="font-utility text-[9px] tracking-[0.2em] text-ivory/80 sm:text-[11px] sm:tracking-[0.24em]"
          initial={reduced ? { opacity: 0 } : { opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.1, duration: 0.7, ease: EASE_OUT }}
          suppressHydrationWarning
        >
          {EVENT.dateLine}
        </motion.p>
        <motion.p
          className="font-utility text-[9px] tracking-[0.2em] text-ivory/80 sm:text-right sm:text-[11px] sm:tracking-[0.24em]"
          initial={reduced ? { opacity: 0 } : { opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2, duration: 0.7, ease: EASE_OUT }}
          suppressHydrationWarning
        >
          {EVENT.venueLine}
        </motion.p>
      </div>
    </section>
  );
}

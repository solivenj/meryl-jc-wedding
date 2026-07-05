"use client";

import { useSyncExternalStore } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Envelope } from "@/components/envelope/Envelope";
import { ACT_ONE, COUPLE } from "@/lib/content";
import { EASE_OUT, ENTRANCE, IDLE } from "@/lib/motion";

/*
 * Act I entrance choreography (PRD §3.2), five beats staggered one by one:
 * eyebrow → names → envelope (spring landing) → tagline → CTA.
 * Layout space is reserved up front — beats animate opacity/transform only,
 * so there is no layout shift during the sequence.
 */

const beat = (i: number) => i * ENTRANCE.stagger;

/* CTA label needs the pointer type; media-query state via external store
   (SSR snapshot: fine pointer → "CLICK TO OPEN"). */
const coarseQuery = "(pointer: coarse)";
const subscribeCoarse = (cb: () => void) => {
  const mq = window.matchMedia(coarseQuery);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const getCoarse = () => window.matchMedia(coarseQuery).matches;

export function ActOne({
  stage,
  onOpen,
}: {
  stage: "sealed" | "opening";
  onOpen: () => void;
}) {
  const reduced = useReducedMotion();
  const opening = stage === "opening";
  const touch = useSyncExternalStore(subscribeCoarse, getCoarse, () => false);

  /* suppressHydrationWarning: the server can't know the client's
     prefers-reduced-motion, so initial styles legitimately differ there. */
  const rise = (i: number) => ({
    initial: reduced ? { opacity: 0 } : { opacity: 0, y: ENTRANCE.travel },
    animate: { opacity: 1, y: 0 },
    transition: { delay: beat(i), duration: ENTRANCE.duration, ease: EASE_OUT },
    suppressHydrationWarning: true,
  });

  return (
    <section className="flex min-h-dvh flex-col items-center justify-center px-6 py-12">
      {/* Beat 1 — eyebrow */}
      <motion.p
        {...rise(0)}
        className="font-utility text-[11px] tracking-[0.28em] text-ink-soft sm:text-xs"
      >
        {ACT_ONE.eyebrow}
      </motion.p>

      {/* Beat 2 — names, the typographic hero; the ampersand is the featured glyph */}
      <motion.h1
        {...rise(1)}
        className="mt-4 text-center font-display leading-[1.15] text-ink"
        style={{ fontSize: "clamp(3.25rem, 9vw, 6.5rem)" }}
      >
        {COUPLE.first}
        <span aria-hidden className="relative mx-2 inline-block text-[1.25em] leading-none align-middle -translate-y-1">
          &amp;
        </span>
        <span className="sr-only">and</span>
        {COUPLE.second}
      </motion.h1>

      {/* Beat 3 — the envelope lands on its shadow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: beat(2), duration: 0.4 }}
        className="mt-6 w-[85vw] max-w-[560px]"
      >
        <Envelope
          onOpen={onOpen}
          entrance={reduced ? false : { delay: beat(2) }}
          idle
          open={opening}
        />
      </motion.div>

      {/* Beat 4 — script tagline (user-specified copy); bows out during the unravel */}
      <motion.p
        {...rise(3)}
        animate={opening ? { opacity: 0, y: 0 } : rise(3).animate}
        transition={opening ? { duration: 0.35 } : rise(3).transition}
        className="mt-2 text-center font-display text-ink-soft"
        style={{ fontSize: "clamp(1.5rem, 3vw, 2.1rem)" }}
      >
        {ACT_ONE.tagline}
      </motion.p>

      {/* Beat 5 — CTA with gentle infinite pulse; bows out during the unravel */}
      <motion.p
        {...rise(4)}
        animate={opening ? { opacity: 0, y: 0 } : rise(4).animate}
        transition={opening ? { duration: 0.35 } : rise(4).transition}
        className="mt-7"
      >
        <motion.span
          animate={
            reduced
              ? { opacity: 1 }
              : { opacity: [IDLE.ctaPulse.opacityMin, IDLE.ctaPulse.opacityMax, IDLE.ctaPulse.opacityMin] }
          }
          transition={
            reduced
              ? { duration: 0 }
              : {
                  delay: beat(4) + ENTRANCE.duration,
                  duration: IDLE.ctaPulse.period,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
          }
          className="font-utility text-[11px] tracking-[0.28em] text-ink-soft sm:text-xs"
        >
          {touch ? ACT_ONE.ctaTouch : ACT_ONE.ctaPointer}
        </motion.span>
      </motion.p>
    </section>
  );
}

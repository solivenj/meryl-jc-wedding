"use client";

import { useSyncExternalStore } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Envelope } from "@/components/envelope/Envelope";
import { ACT_ONE, COUPLE } from "@/lib/content";
import { ENTRANCE, IDLE } from "@/lib/motion";

/*
 * Act I entrance choreography (PRD §3.2), five beats staggered one by one:
 * eyebrow → names → envelope (spring landing) → tagline → CTA.
 *
 * The text beats are CSS animations (.act-rise) so they start at parse time,
 * before hydration — this is what lets the names lockup hold LCP. Elements
 * that must ALSO react to the open interaction (tagline, CTA) get an inner
 * motion element: CSS `forwards` fill would otherwise outrank Motion's
 * inline styles in the cascade.
 *
 * Layout space is reserved up front — beats animate opacity/transform only,
 * so there is no layout shift during the sequence.
 */

const beat = (i: number) => `${i * ENTRANCE.stagger}s`;

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

  const riseDelay = (i: number) =>
    ({ "--rise-delay": beat(i) }) as React.CSSProperties;

  return (
    <section className="flex min-h-dvh flex-col items-center justify-center px-6 py-12">
      {/* Beat 1 — eyebrow */}
      <p
        className="act-rise font-utility text-[11px] tracking-[0.28em] text-ink-soft sm:text-xs"
        style={riseDelay(0)}
      >
        {ACT_ONE.eyebrow}
      </p>

      {/* Beat 2 — names, the typographic hero; the ampersand is the featured glyph */}
      <h1
        className="act-rise mt-4 text-center font-display leading-[1.15] text-ink"
        style={{ fontSize: "clamp(3.25rem, 9vw, 6.5rem)", ...riseDelay(1) }}
      >
        {COUPLE.first}
        <span
          aria-hidden
          className="relative mx-2 inline-block text-[1.25em] leading-none align-middle -translate-y-1"
        >
          &amp;
        </span>
        <span className="sr-only">and</span>
        {COUPLE.second}
      </h1>

      {/* Beat 3 — the envelope lands on its shadow. No opacity fade on this
          wrapper: the SVG paints in the server HTML; the spring + shadow
          entrance still play. */}
      <div className="mt-6 w-[85vw] max-w-[560px]">
        <Envelope
          onOpen={onOpen}
          entrance={reduced ? false : { delay: ENTRANCE.stagger * 2 }}
          idle
          open={opening}
        />
      </div>

      {/* Beat 4 — script tagline (user-specified copy); bows out during the unravel */}
      <div className="act-rise mt-2" style={riseDelay(3)}>
        <motion.p
          initial={false}
          animate={{ opacity: opening ? 0 : 1 }}
          transition={{ duration: 0.35 }}
          className="text-center font-display text-ink-soft"
          style={{ fontSize: "clamp(1.5rem, 3vw, 2.1rem)" }}
        >
          {ACT_ONE.tagline}
        </motion.p>
      </div>

      {/* Beat 5 — CTA with gentle infinite pulse; bows out during the unravel */}
      <div className="act-rise mt-7" style={riseDelay(4)}>
        <motion.span
          initial={false}
          animate={
            opening
              ? { opacity: 0 }
              : reduced
                ? { opacity: 1 }
                : {
                    opacity: [
                      IDLE.ctaPulse.opacityMin,
                      IDLE.ctaPulse.opacityMax,
                      IDLE.ctaPulse.opacityMin,
                    ],
                  }
          }
          transition={
            opening
              ? { duration: 0.35 }
              : reduced
                ? { duration: 0 }
                : {
                    delay: ENTRANCE.stagger * 4 + ENTRANCE.duration,
                    duration: IDLE.ctaPulse.period,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
          }
          className="block font-utility text-[11px] tracking-[0.28em] text-ink sm:text-xs"
        >
          {touch ? ACT_ONE.ctaTouch : ACT_ONE.ctaPointer}
        </motion.span>
      </div>
    </section>
  );
}

"use client";

import { useSyncExternalStore } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ACT_ONE, COUPLE } from "@/lib/content";
import { ENTRANCE, IDLE } from "@/lib/motion";

/*
 * Act I entrance choreography (PRD §3.2), four beats staggered top to
 * bottom: names → tagline → envelope → CTA. All beats are CSS animations
 * (.act-rise) so they start at parse time, before hydration.
 *
 * The tagline now stands in for the old "SAVE OUR DATE" eyebrow (styled
 * identically — uppercase, tracked, utility face) and sits directly under
 * the names; the CTA moved below the envelope.
 *
 * The envelope is John's supplied photographic asset (PRD §3.1 alternative
 * path) — a static keepsake image inside a real button; clicking it fades
 * the whole scene into Act II (handled by the page machine).
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

export function ActOne({ onOpen }: { onOpen: () => void }) {
  const reduced = useReducedMotion();
  const touch = useSyncExternalStore(subscribeCoarse, getCoarse, () => false);

  const riseDelay = (i: number) =>
    ({ "--rise-delay": beat(i) }) as React.CSSProperties;

  return (
    <section className="flex min-h-dvh flex-col items-center justify-center px-6 py-8">
      {/* Beat 0 — names, the typographic hero; the ampersand is the featured glyph */}
      <h1
        className="act-rise text-center font-display leading-[1.15] text-ink"
        style={{ fontSize: "clamp(3.25rem, 9vw, 6.5rem)", ...riseDelay(0) }}
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

      {/* Beat 1 — tagline (user-specified copy), styled like the retired
          "SAVE OUR DATE" eyebrow: uppercase, tracked, utility face. */}
      <p
        className="act-rise mt-4 text-center font-utility text-[11px] uppercase tracking-[0.28em] text-ink-soft sm:text-xs"
        style={riseDelay(1)}
      >
        {ACT_ONE.tagline}
      </p>

      {/* Beat 2 — the envelope keepsake; whole image is the open button.
          Capped by viewport height (max-h) as well as width so it shrinks on
          short/wide windows instead of pushing the CTA off-screen. */}
      <div className="act-rise mt-8 flex w-full justify-center" style={riseDelay(2)}>
        <button
          type="button"
          aria-label={ACT_ONE.openLabel}
          onClick={onOpen}
          className="block cursor-pointer select-none"
        >
          <Image
            src="/envelope.webp"
            alt=""
            aria-hidden
            width={1200}
            height={857}
            priority
            unoptimized /* asset pre-compressed; static export has no optimizer */
            className="mx-auto block h-auto w-auto max-h-[46dvh] max-w-[min(85vw,540px)] [filter:drop-shadow(0_26px_26px_rgb(138_122_95/0.35))]"
          />
        </button>
      </div>

      {/* Beat 3 — CTA with gentle infinite pulse, now under the envelope */}
      <div className="act-rise mt-6" style={riseDelay(3)}>
        <motion.span
          initial={false}
          animate={
            reduced
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
            reduced
              ? { duration: 0 }
              : {
                  delay: ENTRANCE.stagger * 3 + ENTRANCE.duration,
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

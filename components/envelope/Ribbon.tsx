"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE_WHIP, IDLE, UNRAVEL } from "@/lib/motion";

/*
 * Satin ribbon: vertical band at the left third, horizontal band across the
 * lower body, bow on the crossing (168, 296) — deliberately offset from the
 * centered monogram so the two signatures form a diagonal, not a stack.
 *
 * Unravel (PRD §3.3, beats 1–2): bow loops pull through the knot (they are
 * filled paths, so the "slip" is a scale-toward-knot, not pathLength), the
 * knot wobbles and lets go, then each band whips off sequentially with a
 * curl in its tail. Cast shadows travel inside their band groups so they
 * exit together.
 */
export function Ribbon({
  p,
  idle = false,
  open = false,
}: {
  p: string;
  idle?: boolean;
  open?: boolean;
}) {
  const reduced = useReducedMotion();
  const breathe = idle && !open && !reduced;

  const bandHDelay = UNRAVEL.bandOverlap;
  const bandVDelay = UNRAVEL.bandOverlap + UNRAVEL.bandGap;

  return (
    <g>
      {/* Horizontal band whips off rightward around the envelope edge.
          The clip sits OUTSIDE the moving group: the band visibly shrinks as
          it slips past the paper's edge — pulled off, not flying away. */}
      <g clipPath={`url(#${p}-body-clip)`}>
        <motion.g
          data-band-h
          animate={
            open
              ? { x: 560, rotate: 2, scaleY: 0.85 }
              : { x: 0, rotate: 0, scaleY: 1 }
          }
          transition={
            open
              ? { delay: bandHDelay, duration: UNRAVEL.bandSlide, ease: EASE_WHIP }
              : { duration: 0 }
          }
          style={{ transformOrigin: "280px 296px" }}
        >
          <rect
            x="40"
            y="281"
            width="480"
            height="42"
            fill="#6b5b41"
            opacity="0.18"
            filter={`url(#${p}-soft-blur)`}
          />
          <rect x="40" y="278" width="480" height="36" fill={`url(#${p}-satin-h)`} />
          <rect x="40" y="278" width="8" height="36" fill="var(--color-ribbon-deep)" opacity="0.45" />
          <rect x="512" y="278" width="8" height="36" fill="var(--color-ribbon-deep)" opacity="0.45" />
        </motion.g>
      </g>

      {/* Vertical band follows, slipping down around the bottom fold */}
      <g clipPath={`url(#${p}-body-clip)`}>
        <motion.g
          data-band-v
          animate={
            open
              ? { y: 480, rotate: -1.5, scaleX: 0.88 }
              : { y: 0, rotate: 0, scaleX: 1 }
          }
          transition={
            open
              ? { delay: bandVDelay, duration: UNRAVEL.bandSlide, ease: EASE_WHIP }
              : { duration: 0 }
          }
          style={{ transformOrigin: "168px 220px" }}
        >
          <rect
            x="153"
            y="80"
            width="42"
            height="280"
            fill="#6b5b41"
            opacity="0.18"
            filter={`url(#${p}-soft-blur)`}
          />
          <rect x="150" y="80" width="36" height="280" fill={`url(#${p}-satin-v)`} />
          <rect x="150" y="80" width="36" height="8" fill="var(--color-ribbon-deep)" opacity="0.45" />
          <rect x="150" y="352" width="36" height="8" fill="var(--color-ribbon-deep)" opacity="0.45" />
        </motion.g>
      </g>

      {/* Bow at the crossing; after 4s idle it breathes once every ~6s (PRD §3.2). */}
      <motion.g
        data-bow
        style={{ transformOrigin: "168px 296px" }}
        animate={breathe ? { scale: [1, IDLE.breatheScale, 1] } : { scale: 1 }}
        transition={
          breathe
            ? {
                delay: IDLE.breatheDelay,
                duration: 1.4,
                repeat: Infinity,
                repeatDelay: IDLE.breathePeriod - 1.4,
                ease: "easeInOut",
              }
            : { duration: 0 }
        }
      >
        {/* Tails stretch as the knot slips, then vanish with it */}
        <motion.path
          data-bow-tail-l
          d="M 162 302
             C 152 318 142 334 134 352
             L 143 344 L 152 356
             C 160 338 166 320 172 308 Z"
          fill={`url(#${p}-knot)`}
          animate={open ? { scaleY: [1, 1.18, 1], opacity: [1, 1, 0] } : { scaleY: 1, opacity: 1 }}
          transition={
            open
              ? { duration: UNRAVEL.bowRelease, times: [0, 0.6, 1], ease: "easeIn" }
              : { duration: 0 }
          }
          style={{ transformOrigin: "168px 300px" }}
        />
        <motion.path
          data-bow-tail-r
          d="M 174 302
             C 182 322 190 340 197 358
             L 204 346 L 216 351
             C 207 331 194 313 186 302 Z"
          fill={`url(#${p}-knot)`}
          animate={open ? { scaleY: [1, 1.18, 1], opacity: [1, 1, 0] } : { scaleY: 1, opacity: 1 }}
          transition={
            open
              ? { duration: UNRAVEL.bowRelease, times: [0, 0.6, 1], ease: "easeIn" }
              : { duration: 0 }
          }
          style={{ transformOrigin: "168px 300px" }}
        />

        {/* Loops pull through the knot */}
        <motion.path
          data-bow-loop-l
          d="M 168 296 C 136 266 96 272 100 298 C 103 324 142 322 168 296 Z"
          fill={`url(#${p}-loop)`}
          stroke="var(--color-ribbon-deep)"
          strokeOpacity="0.35"
          strokeWidth="1"
          animate={
            open
              ? { scaleX: 0.06, scaleY: 0.45, rotate: 8, opacity: 0 }
              : { scaleX: 1, scaleY: 1, rotate: 0, opacity: 1 }
          }
          transition={
            open
              ? { duration: UNRAVEL.bowRelease * 0.85, ease: "easeIn" }
              : { duration: 0 }
          }
          style={{ transformOrigin: "168px 296px" }}
        />
        <motion.path
          data-bow-loop-r
          d="M 168 296 C 200 266 240 272 236 298 C 233 324 194 322 168 296 Z"
          fill={`url(#${p}-loop)`}
          stroke="var(--color-ribbon-deep)"
          strokeOpacity="0.35"
          strokeWidth="1"
          animate={
            open
              ? { scaleX: 0.06, scaleY: 0.45, rotate: -8, opacity: 0 }
              : { scaleX: 1, scaleY: 1, rotate: 0, opacity: 1 }
          }
          transition={
            open
              ? { duration: UNRAVEL.bowRelease * 0.85, delay: 0.06, ease: "easeIn" }
              : { duration: 0 }
          }
          style={{ transformOrigin: "168px 296px" }}
        />
        {/* Inner loop shading fades with the loops */}
        <motion.g
          animate={open ? { opacity: 0 } : { opacity: 1 }}
          transition={open ? { duration: UNRAVEL.bowRelease * 0.6 } : { duration: 0 }}
        >
          <path
            d="M 168 296 C 148 280 122 279 114 294"
            fill="none"
            stroke="var(--color-ribbon-deep)"
            strokeOpacity="0.4"
            strokeWidth="1.4"
          />
          <path
            d="M 168 296 C 188 280 214 279 222 294"
            fill="none"
            stroke="var(--color-ribbon-deep)"
            strokeOpacity="0.4"
            strokeWidth="1.4"
          />
        </motion.g>

        {/* Knot: a wobble sells the pull, then it slips away */}
        <motion.rect
          data-bow-knot
          x="157"
          y="287"
          width="22"
          height="18"
          rx="6"
          fill={`url(#${p}-knot)`}
          stroke="var(--color-ribbon-deep)"
          strokeOpacity="0.45"
          strokeWidth="1"
          animate={
            open
              ? { rotate: [-5, -9, 2, -5], scale: [1, 1, 0.6], opacity: [1, 1, 0] }
              : { rotate: -5, scale: 1, opacity: 1 }
          }
          transition={
            open
              ? { duration: UNRAVEL.bowRelease, times: [0, 0.4, 1], ease: "easeIn" }
              : { duration: 0 }
          }
          style={{ transformOrigin: "168px 296px" }}
        />
      </motion.g>
    </g>
  );
}

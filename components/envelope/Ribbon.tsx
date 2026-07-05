"use client";

import { motion, useReducedMotion } from "motion/react";
import { IDLE } from "@/lib/motion";

/*
 * Satin ribbon: vertical band at the left third, horizontal band across the
 * lower body, bow on the crossing (168, 296) — deliberately offset from the
 * centered monogram so the two signatures form a diagonal, not a stack.
 * Every animatable part carries a data attribute for P3:
 * data-band-h, data-band-v, data-bow-loop-l/r, data-bow-knot, data-bow-tail-l/r.
 */
export function Ribbon({ p, idle = false }: { p: string; idle?: boolean }) {
  const reduced = useReducedMotion();
  const breathe = idle && !reduced;

  return (
    <g>
      {/* Cast shadows onto the paper (clipped to the envelope body) */}
      <g clipPath={`url(#${p}-body-clip)`} data-band-shadows>
        <rect
          x="153"
          y="80"
          width="42"
          height="280"
          fill="#6b5b41"
          opacity="0.18"
          filter={`url(#${p}-soft-blur)`}
        />
        <rect
          x="40"
          y="281"
          width="480"
          height="42"
          fill="#6b5b41"
          opacity="0.18"
          filter={`url(#${p}-soft-blur)`}
        />
      </g>

      {/* Vertical band: edge to edge; darkened tips read as wrapping the fold */}
      <g data-band-v>
        <rect x="150" y="80" width="36" height="280" fill={`url(#${p}-satin-v)`} />
        <rect x="150" y="80" width="36" height="8" fill="var(--color-ribbon-deep)" opacity="0.45" />
        <rect x="150" y="352" width="36" height="8" fill="var(--color-ribbon-deep)" opacity="0.45" />
      </g>

      {/* Horizontal band across the lower body */}
      <g data-band-h>
        <rect x="40" y="278" width="480" height="36" fill={`url(#${p}-satin-h)`} />
        <rect x="40" y="278" width="8" height="36" fill="var(--color-ribbon-deep)" opacity="0.45" />
        <rect x="512" y="278" width="8" height="36" fill="var(--color-ribbon-deep)" opacity="0.45" />
      </g>

      {/* Bow at the crossing; after 4s idle it breathes once every ~6s (PRD §3.2). */}
      <motion.g
        data-bow
        style={{ transformOrigin: "168px 296px" }}
        animate={
          breathe
            ? { scale: [1, IDLE.breatheScale, 1] }
            : { scale: 1 }
        }
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
        {/* Tails behind the loops: drooping S-curves with notched ends */}
        <path
          data-bow-tail-l
          d="M 162 302
             C 152 318 142 334 134 352
             L 143 344 L 152 356
             C 160 338 166 320 172 308 Z"
          fill={`url(#${p}-knot)`}
          style={{ transformOrigin: "168px 300px" }}
        />
        <path
          data-bow-tail-r
          d="M 174 302
             C 182 322 190 340 197 358
             L 204 346 L 216 351
             C 207 331 194 313 186 302 Z"
          fill={`url(#${p}-knot)`}
          style={{ transformOrigin: "168px 300px" }}
        />

        {/* Loops: wide, slightly drooped */}
        <path
          data-bow-loop-l
          d="M 168 296 C 136 266 96 272 100 298 C 103 324 142 322 168 296 Z"
          fill={`url(#${p}-loop)`}
          stroke="var(--color-ribbon-deep)"
          strokeOpacity="0.35"
          strokeWidth="1"
          style={{ transformOrigin: "168px 296px" }}
        />
        <path
          data-bow-loop-r
          d="M 168 296 C 200 266 240 272 236 298 C 233 324 194 322 168 296 Z"
          fill={`url(#${p}-loop)`}
          stroke="var(--color-ribbon-deep)"
          strokeOpacity="0.35"
          strokeWidth="1"
          style={{ transformOrigin: "168px 296px" }}
        />
        {/* Inner loop shading so the loops read as folded tubes */}
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

        {/* Knot, tilted a touch so it reads hand-tied */}
        <rect
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
          transform="rotate(-5 168 296)"
          style={{ transformOrigin: "168px 296px" }}
        />
      </motion.g>
    </g>
  );
}

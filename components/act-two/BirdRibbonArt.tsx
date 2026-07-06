"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE_OUT, LINE_ART_DRAW } from "@/lib/motion";

/*
 * S3 line art (PRD §4.1): two birds carrying an unfurling ribbon that trails
 * into a loose bow. Hand-drawn feel — imperfect curves on purpose. Strokes
 * draw themselves in on viewport entry (pathLength); under reduced motion
 * the art is simply present.
 */

const strokes: { d: string; delay: number }[] = [
  /* left bird: the classic two-arc wing stroke reads as a bird even at
     small scale; a short body dip beneath the valley finishes it */
  { d: "M 178 88 C 198 66, 218 66, 232 82 C 246 64, 268 60, 286 74", delay: 0 },
  { d: "M 226 86 C 230 95, 237 98, 244 93", delay: 0.18 },
  /* right bird, slightly higher, mirrored weight */
  { d: "M 604 78 C 586 58, 566 58, 552 72 C 538 56, 516 54, 500 66", delay: 0.12 },
  { d: "M 546 76 C 550 85, 557 88, 564 83", delay: 0.3 },
  /* the ribbon they carry, hanging below them in a deep sag */
  { d: "M 240 100 C 320 176, 460 180, 542 92", delay: 0.45 },
  { d: "M 248 108 C 326 184, 452 188, 534 100", delay: 0.55 },
  /* trailing end unfurling into a loose bow, low center */
  { d: "M 386 174 C 378 196, 366 212, 352 224", delay: 0.9 },
  { d: "M 352 224 C 330 210, 308 222, 322 238 C 334 250, 354 240, 352 224", delay: 1.05 },
  { d: "M 354 226 C 374 214, 396 224, 384 240 C 374 252, 356 244, 354 226", delay: 1.2 },
  { d: "M 350 232 C 342 248, 336 260, 332 270", delay: 1.35 },
  { d: "M 358 234 C 364 248, 368 258, 374 268", delay: 1.4 },
];

export function BirdRibbonArt({ className }: { className?: string }) {
  const reduced = useReducedMotion();

  return (
    <svg
      viewBox="0 0 780 300"
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      className={className}
    >
      {strokes.map(({ d, delay }) => (
        <motion.path
          key={d}
          d={d}
          initial={reduced ? { opacity: 1 } : { pathLength: 0, opacity: 0 }}
          whileInView={
            reduced ? { opacity: 1 } : { pathLength: 1, opacity: 1 }
          }
          viewport={{ once: true, amount: 0.5 }}
          transition={
            reduced
              ? { duration: 0 }
              : {
                  pathLength: { delay, duration: LINE_ART_DRAW.duration * 0.5, ease: EASE_OUT },
                  opacity: { delay, duration: 0.15 },
                }
          }
          suppressHydrationWarning
        />
      ))}
    </svg>
  );
}

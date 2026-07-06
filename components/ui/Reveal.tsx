"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { EASE_OUT, SCROLL_REVEAL } from "@/lib/motion";

/*
 * Baseline scroll entrance (PRD §4.2): fade + 20px rise on viewport entry,
 * once only. Sections layer their own signatures on top of this.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  x = 0,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  /** Optional horizontal origin (e.g. -24 slides in from the left). */
  x?: number;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: x === 0 ? SCROLL_REVEAL.travel : 0, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, amount: SCROLL_REVEAL.viewportAmount }}
      transition={{ delay, duration: SCROLL_REVEAL.duration, ease: EASE_OUT }}
      suppressHydrationWarning
      className={className}
    >
      {children}
    </motion.div>
  );
}

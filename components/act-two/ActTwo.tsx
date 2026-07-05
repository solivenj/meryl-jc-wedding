"use client";

import { motion } from "motion/react";
import { COUPLE, HERO } from "@/lib/content";

/* P3 stub: hero-shaped landing surface so the hand-off can be verified.
   Root stays ivory and the dark hero fades up INSIDE it, so the Act I
   crossfade is ivory-to-ivory — no muddy blend, no flash (PRD §3.3 beat 4).
   The five real sections land in P4. */

export function ActTwo({ reduced }: { reduced: boolean }) {
  return (
    <section className="relative min-h-dvh bg-ivory">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduced ? 0.4 : 1.1, ease: "easeOut" }}
        className="grid min-h-dvh place-items-center bg-ink"
      >
        <motion.div
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-center text-ivory"
        >
          <p className="font-utility text-[11px] tracking-[0.28em]">{HERO.eyebrow}</p>
          <h1 className="mt-4 font-display" style={{ fontSize: "clamp(3rem, 8vw, 6rem)" }}>
            {COUPLE.names}
          </h1>
        </motion.div>
      </motion.div>
    </section>
  );
}

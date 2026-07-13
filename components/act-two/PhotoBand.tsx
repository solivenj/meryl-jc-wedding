"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { PLACEHOLDER_ALT } from "@/lib/content";

/*
 * S3 — Photo band (PRD §4.1): full-width photo (blurry.JPG), the scroll
 * centerpiece. Sized the same way as Hero and Closing — an explicit
 * min-height directly on the <section>, with nothing else in normal flow —
 * instead of a nested placeholder div, which resized oddly on window
 * resize. The photo drifts a subtle 4% (user-upgraded scroll layer; PRD
 * deviation noted).
 */
export function PhotoBand() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const drift = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);

  return (
    <section ref={ref} className="relative min-h-[50vh] overflow-hidden sm:min-h-[60vh]">
      <motion.div
        className="absolute inset-[-6%]"
        style={reduced ? undefined : { y: drift }}
        suppressHydrationWarning
      >
        <Image
          src="/blurry.JPG"
          alt={PLACEHOLDER_ALT.band}
          fill
          sizes="100vw"
          unoptimized /* static export has no optimizer; asset is local */
          className="object-cover"
        />
      </motion.div>
    </section>
  );
}

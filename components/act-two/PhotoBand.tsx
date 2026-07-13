"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { PLACEHOLDER_ALT } from "@/lib/content";

/*
 * S3 — Photo band (PRD §4.1): full-width photo (blurry.JPG), the scroll
 * centerpiece. Unlike Hero and Closing (which are sized in vh and lean into
 * an object-cover zoom), the band is sized by a fixed aspect ratio: height
 * tracks width, so object-cover shows the *same* crop at every viewport —
 * no zoom as the window widens, and consistent framing across devices. The
 * photo drifts a subtle 4% (user-upgraded scroll layer; PRD deviation noted).
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
    <section ref={ref} className="relative aspect-[21/9] overflow-hidden">
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
          className="object-cover object-[center_78%]"
        />
      </motion.div>
    </section>
  );
}

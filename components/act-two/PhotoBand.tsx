"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { BirdRibbonArt } from "./BirdRibbonArt";
import { PLACEHOLDER_ALT } from "@/lib/content";

/*
 * S3 — Photo band (PRD §4.1): full-width photo with the bird-and-ribbon
 * line art drawing itself over it — the scroll centerpiece. The photo
 * drifts a subtle 4% (user-upgraded scroll layer; PRD deviation noted).
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
    <section ref={ref} className="relative overflow-hidden">
      {/* PLACEHOLDER — full-width photograph, ~21:9, candid dancing shot */}
      <motion.div
        className="absolute inset-[-6%]"
        style={reduced ? undefined : { y: drift }}
        suppressHydrationWarning
      >
        <PlaceholderImage
          label="PHOTO · 21:9"
          alt={PLACEHOLDER_ALT.band}
          tone="deep"
          fill
        />
      </motion.div>

      <div className="relative mx-auto grid min-h-[420px] max-w-4xl place-items-center px-6 py-16 sm:min-h-[520px]">
        <BirdRibbonArt className="w-full max-w-3xl text-ivory" />
      </div>
    </section>
  );
}

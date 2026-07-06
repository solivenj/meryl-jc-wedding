"use client";

import { motion, useReducedMotion } from "motion/react";
import { Envelope } from "@/components/envelope/Envelope";
import { Reveal } from "@/components/ui/Reveal";
import { STORY } from "@/lib/content";
import { EASE_OUT, ENTRANCE, MASK_REVEAL } from "@/lib/motion";

/*
 * S2 — Story / invitation (PRD §4.1). The section's signature: the Act I
 * envelope back at miniature scale, ribbon re-tied. Side captions arrive
 * from their sides; the invitation copy rises in line-group masks.
 */

/* PLACEHOLDER copy is chunked so each group can mask-reveal separately. */
const chunk = (text: string, parts: number) => {
  const sentences = text.match(/[^.]+\.?/g) ?? [text];
  const out: string[] = [];
  const per = Math.ceil(sentences.length / parts);
  for (let i = 0; i < sentences.length; i += per) {
    out.push(sentences.slice(i, i + per).join(" ").trim());
  }
  return out;
};

function Caption({ lines, from }: { lines: string[]; from: "left" | "right" }) {
  return (
    <Reveal x={from === "left" ? -24 : 24} className={from === "left" ? "md:text-right" : ""}>
      <p className="font-utility text-[11px] leading-[2] tracking-[0.26em] text-ink-soft">
        {lines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </p>
    </Reveal>
  );
}

export function Story() {
  const reduced = useReducedMotion();
  const groups = chunk(STORY.invitation, 3);

  return (
    <section className="bg-ivory px-6 py-24 sm:py-32">
      <div className="mx-auto grid max-w-4xl items-center gap-10 md:grid-cols-[1fr_auto_1fr] md:gap-14">
        <Caption lines={STORY.captionLeft} from="left" />

        {/* The re-tied miniature — Act I's metaphor, kept. */}
        <motion.div
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={reduced ? { duration: 0.5 } : { ...ENTRANCE.envelopeSpring }}
          suppressHydrationWarning
          className="mx-auto w-56 sm:w-64"
        >
          <Envelope variant="miniature" />
        </motion.div>

        <Caption lines={STORY.captionRight} from="right" />
      </div>

      {/* Invitation copy, rising by line groups. The viewport observer lives
          on the UNCLIPPED wrapper: a child translated inside overflow-hidden
          is 100% clipped, so IntersectionObserver would never fire on it. */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        className="mx-auto mt-14 max-w-2xl text-center sm:mt-20"
      >
        {groups.map((group, i) => (
          <div key={group} className="overflow-hidden">
            <motion.p
              variants={
                reduced
                  ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
                  : { hidden: { opacity: 0, y: "100%" }, show: { opacity: 1, y: "0%" } }
              }
              transition={{
                delay: i * MASK_REVEAL.lineStagger,
                duration: MASK_REVEAL.duration,
                ease: EASE_OUT,
              }}
              suppressHydrationWarning
              className="font-body text-[13px] leading-[2.15] tracking-[0.14em] text-ink uppercase"
            >
              {group}
            </motion.p>
          </div>
        ))}
      </motion.div>
    </section>
  );
}

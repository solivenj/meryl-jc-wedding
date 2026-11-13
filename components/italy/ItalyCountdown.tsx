"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Rule, ScriptTitle, SmallCaps } from "@/components/italy/Type";
import { ITALY_HOME } from "@/lib/italy-content";
import { EASE_OUT } from "@/lib/motion";
import { timeUntil, type Tick } from "@/lib/countdown";

/*
 * The Italy countdown, to the ceremony on the Thursday. Same mechanics as
 * the church one (components/act-two/Countdown): the page is prerendered, so
 * nothing time-dependent renders until mount — a dash holds each figure's
 * place so nothing shifts when the numbers arrive.
 *
 * Italy's own dress: Cormorant figures rather than the script face (cursive
 * numerals don't read at a glance), Baskerville caps for the units, hairline
 * rules between them. Each figure rolls in from above when it changes; with
 * reduced motion it simply swaps.
 */

const { countdown } = ITALY_HOME;
const TARGET_MS = new Date(countdown.targetISO).getTime();

function Figure({ value }: { value: number | null }) {
  const reduced = useReducedMotion();
  const text = value === null ? "–" : String(value).padStart(2, "0");
  return (
    /* overflow-hidden clips the roll to the figure's own line box. The
       invisible copy sizes the box, so the absolutely-placed animated copy
       never changes the layout. */
    <span className="relative inline-block overflow-hidden font-body leading-none font-light text-ink tabular-nums lining-nums [font-size:calc(clamp(40px,7vw,68px)*var(--fs-scale))]">
      <span className="invisible">{text}</span>
      {/* Both copies are already absolute inside the clipped box, so the
          default mode is right: popLayout would re-parent the outgoing copy
          against the page and let it fall out below the figure. */}
      <AnimatePresence initial={false}>
        <motion.span
          key={text}
          className="absolute inset-0 text-center"
          initial={reduced ? { opacity: 0 } : { y: "-65%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduced ? { opacity: 0 } : { y: "65%", opacity: 0 }}
          transition={{ duration: reduced ? 0.15 : 0.45, ease: EASE_OUT }}
        >
          {text}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function Unit({ value, label }: { value: number | null; label: string }) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-3 px-1">
      <Figure value={value} />
      <span className="font-caps text-[calc(9.5px*var(--fs-scale))] uppercase tracking-[0.2em] text-ink-soft min-[480px]:tracking-[0.24em]">
        {label}
      </span>
    </div>
  );
}

export function ItalyCountdown() {
  const [tick, setTick] = useState<Tick | null>(null);

  useEffect(() => {
    const update = () => setTick(timeUntil(TARGET_MS, Date.now()));
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, []);

  if (tick?.passed) {
    return (
      <div className="flex flex-col items-center gap-4">
        <ScriptTitle size="lead">{countdown.passed}</ScriptTitle>
        <p className="max-w-[40ch] font-body text-[calc(17px*var(--fs-scale))] leading-[1.65] font-light text-ink-soft">
          {countdown.passedNote}
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center gap-5">
      <SmallCaps>{countdown.eyebrow}</SmallCaps>
      <ScriptTitle>{countdown.line}</ScriptTitle>
      {/* No visible date line: the card at the top of the page already says
          when. dateLine still names the date for screen readers below.
          aria-live off on purpose: a region that changes every second would
          have a screen reader announce the time forever. The label carries
          the meaning instead. */}
      <div
        aria-live="off"
        aria-label={`Counting down to ${countdown.dateLine}`}
        className="mt-4 grid w-full max-w-[34rem] grid-cols-4 divide-x divide-[var(--color-rule)]"
      >
        <Unit value={tick?.days ?? null} label={countdown.units.days} />
        <Unit value={tick?.hours ?? null} label={countdown.units.hours} />
        <Unit value={tick?.minutes ?? null} label={countdown.units.minutes} />
        <Unit value={tick?.seconds ?? null} label={countdown.units.seconds} />
      </div>
      <Rule className="mt-6" />
    </div>
  );
}

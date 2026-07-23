"use client";

import { useEffect, useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { COUNTDOWN, EVENT } from "@/lib/content";
import { timeUntil, type Tick } from "@/lib/countdown";

/*
 * Live countdown to the ceremony — a full-width beat above the venues.
 *
 * The page is prerendered, so a time-dependent value rendered on the server
 * would never match the client's first paint. We therefore render NOTHING
 * time-dependent until mounted: `tick` stays null through SSR and the first
 * client render (showing an em-dash placeholder of identical size, so there's
 * no layout shift), then the effect fills it in and starts ticking.
 */

const TARGET_MS = new Date(EVENT.ceremonyISO).getTime();

function Unit({ value, label }: { value: number | null; label: string }) {
  return (
    <div className="text-center">
      {/* Garamond, not the Pinyon display face: cursive numerals are gorgeous
          and unreadable, and a countdown exists to be read at a glance. */}
      <div className="font-body leading-none text-ink tabular-nums [font-size:clamp(2rem,4.5vw,3rem)]">
        {value === null ? "—" : String(value).padStart(2, "0")}
      </div>
      <div className="mt-3 font-utility text-[10px] uppercase tracking-[0.18em] text-ink-soft">
        {label}
      </div>
    </div>
  );
}

export function Countdown() {
  const [tick, setTick] = useState<Tick | null>(null);

  useEffect(() => {
    const update = () => setTick(timeUntil(TARGET_MS, Date.now()));
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="bg-ivory px-6 py-24 text-center sm:py-32">
      {tick?.passed ? (
        <Reveal>
          <p className="font-display text-5xl leading-[1.15] text-ink sm:text-6xl">
            {COUNTDOWN.passed}
          </p>
          <p className="mx-auto mt-4 max-w-[38ch] font-body text-[15.5px] leading-[1.75] text-ink-soft">
            {COUNTDOWN.passedNote}
          </p>
        </Reveal>
      ) : (
        <>
          <Reveal>
            <p className="font-utility text-[12.5px] uppercase tracking-[0.26em] text-ink-soft">
              {COUNTDOWN.eyebrow}
            </p>
            <p className="mt-3 font-display text-5xl leading-[1.15] text-ink sm:text-6xl">
              {COUNTDOWN.line}
            </p>
            {/* 50% larger than its old 11px — this date line sits right above
                the countdown grid and wanted more weight than the eyebrow. */}
            <p className="mt-4 font-utility text-[16.5px] uppercase tracking-[0.26em] text-ink-soft">
              {EVENT.dateLine}
            </p>
          </Reveal>

          {/*
            aria-live is off on purpose: a region that updates every second
            would make a screen reader announce the time endlessly. The label
            gives the block its meaning instead.
          */}
          <Reveal delay={0.1}>
            <div
              aria-live="off"
              aria-label={`Counting down to ${EVENT.date}`}
              className="mx-auto mt-12 grid max-w-2xl grid-cols-4 divide-x divide-ink/15"
            >
              <Unit value={tick?.days ?? null} label={COUNTDOWN.units.days} />
              <Unit value={tick?.hours ?? null} label={COUNTDOWN.units.hours} />
              <Unit value={tick?.minutes ?? null} label={COUNTDOWN.units.minutes} />
              <Unit value={tick?.seconds ?? null} label={COUNTDOWN.units.seconds} />
            </div>
          </Reveal>
        </>
      )}
    </section>
  );
}

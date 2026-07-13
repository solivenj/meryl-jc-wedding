"use client";

import { useRef, useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { RSVP } from "@/lib/content";
import { RsvpModal } from "./RsvpModal";

/*
 * A small beat above Program: a cursive invitation line and a pill CTA that
 * opens the RSVP modal. Lighter padding than the sections around it so it
 * reads as a quiet aside, not a full panel.
 */
export function Rsvp() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  function handleClose() {
    setOpen(false);
    // Return focus to the trigger for keyboard users.
    triggerRef.current?.focus();
  }

  return (
    <section className="bg-ivory px-6 py-16 text-center sm:py-20">
      <Reveal>
        <p className="font-display text-5xl leading-[1.1] text-ink sm:text-6xl">
          {RSVP.headline}
        </p>
      </Reveal>
      <Reveal delay={0.08}>
        <p className="mx-auto mt-4 max-w-[44ch] font-body text-[15.5px] leading-[1.75] text-ink-soft">
          {RSVP.subline}
        </p>
      </Reveal>
      <Reveal delay={0.16}>
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen(true)}
          className="mt-8 inline-block rounded-full border border-ink/25 px-9 py-3 font-utility text-[12px] uppercase tracking-[0.24em] text-ink transition-colors hover:border-ribbon-deep hover:bg-ribbon-deep hover:text-ivory"
        >
          {RSVP.buttonLabel}
        </button>
      </Reveal>

      <RsvpModal open={open} onClose={handleClose} />
    </section>
  );
}

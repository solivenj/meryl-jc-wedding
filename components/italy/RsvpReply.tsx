"use client";

import { useRef, useState } from "react";
import { RsvpModal } from "@/components/act-two/RsvpModal";
import { ITALY_RSVP } from "@/lib/italy-content";

const ITALY_ENDPOINTS = {
  lookup: "/api/italy/guests/lookup",
  submit: "/api/italy/submit",
};

/* Opens the shared RSVP modal against the Italy guest list. The modal picks
   up the Italy palette and type from the .theme-italy tokens around it. */
export function RsvpReply({ label }: { label: string }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
                /* text-forest / border-forest follow the band token re-point, so this
           button works on either ground. The hover fill has to invert to the
           SURFACE colour, not a fixed ivory — on a band that would be
           cream-on-cream. bg-current + the ground colour does it. */
        className="rounded-full border border-forest/40 px-9 py-3 font-caps text-[11.5px] uppercase tracking-[0.155em] text-forest transition-colors hover:bg-forest hover:text-[var(--color-hover-ink,var(--color-ivory))]"
      >
        {label}
      </button>
      <RsvpModal
        open={open}
        onClose={() => {
          setOpen(false);
          triggerRef.current?.focus();
        }}
        content={ITALY_RSVP}
        endpoints={ITALY_ENDPOINTS}
      />
    </>
  );
}

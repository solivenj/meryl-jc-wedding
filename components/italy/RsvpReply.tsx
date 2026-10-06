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
        className="rounded-full border border-forest/40 px-9 py-3 font-caps text-[11.5px] uppercase tracking-[0.155em] text-forest transition-colors hover:bg-forest hover:text-ivory"
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

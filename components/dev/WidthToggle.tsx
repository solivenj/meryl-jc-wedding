"use client";

import { useCappedWidth } from "./WidthToggleContext";

/* TEMP — remove this file and its usages once John's picked a width. Fixed
   positioning keeps it out of document flow entirely, so it never shifts any
   section's layout while comparing. */
export function WidthToggle() {
  const [capped, setCapped] = useCappedWidth();
  return (
    <button
      type="button"
      onClick={() => setCapped((c) => !c)}
      className="fixed bottom-4 right-4 z-50 rounded-full bg-ink px-4 py-2 font-utility text-[11px] uppercase tracking-[0.18em] text-ivory shadow-lg"
    >
      {capped ? "Width: New (capped)" : "Width: Old (full)"}
    </button>
  );
}

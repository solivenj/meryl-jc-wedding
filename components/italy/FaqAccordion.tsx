"use client";

import { useId, useState } from "react";

/* Single-open accordion: first item open, a second click closes it. */
export function FaqAccordion({ items }: { items: readonly { q: string; a: string }[] }) {
  const [open, setOpen] = useState(0);
  const base = useId();
  return (
    <div className="w-full max-w-[720px]">
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `${base}-p${i}`;
        return (
          <div key={item.q} className="-mt-px border-y border-rule">
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="flex w-full items-center justify-between gap-5 px-0.5 py-[22px] text-left font-caps text-[14px] leading-normal text-forest"
              >
                {item.q}
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className={`size-4 flex-none transition-transform duration-[350ms] ease-out motion-reduce:transition-none ${
                    isOpen ? "rotate-180" : ""
                  }`}
                >
                  <path
                    d="M5 9l7 7 7-7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </h3>
            <div
              id={panelId}
              className={`grid transition-[grid-template-rows,opacity] duration-[350ms] ease-out motion-reduce:transition-none ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden" inert={!isOpen}>
                <p className="max-w-[62ch] px-0.5 pb-6 font-body text-[17px] leading-[1.65] font-light text-ink-soft">
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

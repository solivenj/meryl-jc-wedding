"use client";

import { useEffect, useState } from "react";

/*
 * The day bar at the top of /italy/dress-code.
 *
 * Two codes live on one page and the second one starts eight bands down, so
 * until now the page said nothing about Thursday until you had scrolled the
 * whole of Wednesday. The bar names both before a guest scrolls anything.
 *
 * The links are real anchors, which is most of the value: /italy/dress-code
 * followed by #blacktie can go straight into a message to the half of the
 * party who only want to know about the wedding itself.
 *
 * Client only for the highlight. Server-rendered the links already work and
 * the bar already names both codes; what the effect adds is marking which one
 * is under the bar. So this degrades to a plain pair of links, not to nothing.
 */
export function DayJump({
  items,
}: {
  items: readonly { id: string; label: string }[];
}) {
  const [current, setCurrent] = useState(items[0]?.id);

  useEffect(() => {
    const sections = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    /* The band under the bar wins. The top margin pulls the line down past
       the bar's own height, and the bottom one pulls it well up the viewport,
       so a section only counts while it is crossing the upper band of the
       screen rather than whenever any part of it is visible. */
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setCurrent(e.target.id);
      },
      { rootMargin: "-80px 0px -62% 0px" },
    );
    for (const s of sections) io.observe(s);
    return () => io.disconnect();
  }, [items]);

  return (
    <nav
      aria-label="The dress codes"
      className="sticky top-0 z-20 flex w-full flex-wrap items-center justify-center gap-x-8 gap-y-1 border-b border-rule bg-ivory-deep px-4 py-3"
    >
      {items.map((i) => (
        <a
          key={i.id}
          href={`#${i.id}`}
          aria-current={current === i.id ? "true" : undefined}
          className={`border-b pb-1 font-caps text-[calc(10.5px*var(--fs-scale))] uppercase tracking-[0.18em] transition-colors motion-reduce:transition-none ${
            current === i.id
              ? "border-ink text-ink"
              : "border-transparent text-ink-soft hover:text-ink"
          }`}
        >
          {i.label}
        </a>
      ))}
    </nav>
  );
}

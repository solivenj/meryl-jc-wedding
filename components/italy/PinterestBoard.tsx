"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

/*
 * Pinterest's own widget (assets.pinterest.com/js/pinit.js) scans the DOM for
 * data-pin-do anchors and swaps each one for an iframe. It only scans once on
 * load, so if the script is already cached from a prior mount we re-trigger
 * the scan via window.PinUtils.build() on our own mount.
 */
declare global {
  interface Window {
    PinUtils?: { build: () => void };
  }
}

/*
 * Pinterest's board widget always bakes in a profile header and a "Follow on
 * Pinterest" bar — there's no official setting to drop them. We crop both out
 * by sizing the widget's own grid-height attribute to (our box height +
 * header height), then shifting the whole thing up by the header height so
 * only the grid lands inside our fixed-height, overflow-hidden box — the
 * footer ends up just below the visible window and never renders into it.
 * HEADER_HEIGHT is tuned against Pinterest's current widget layout, not a
 * documented API, so it may need re-tuning if Pinterest changes that layout.
 *
 * className should set the box's size (e.g. the same h-[clamp(...)] used by
 * the photo panel it's standing in for) so the embed matches that slot.
 */
const HEADER_HEIGHT = 62;
/* Pixel width of each pin thumbnail (Pinterest's default is 92, min 60) — bumped up so
   fewer, larger pins show per row instead of a cramped small grid. */
const PIN_WIDTH = 150;

export function PinterestBoard({ url, className = "" }: { url: string; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setSize({ width: Math.round(el.clientWidth), height: Math.round(el.clientHeight) });
  }, []);

  useEffect(() => {
    if (size) window.PinUtils?.build();
  }, [size, url]);

  return (
    <div ref={containerRef} className={`mx-auto w-full overflow-hidden ${className}`}>
      {size && (
        <div style={{ marginTop: -HEADER_HEIGHT }}>
          <a
            data-pin-do="embedBoard"
            data-pin-board-width={size.width}
            data-pin-scale-height={size.height + HEADER_HEIGHT}
            data-pin-scale-width={PIN_WIDTH}
            href={url}
          />
        </div>
      )}
      <Script
        src="https://assets.pinterest.com/js/pinit.js"
        strategy="lazyOnload"
        onReady={() => window.PinUtils?.build()}
      />
    </div>
  );
}

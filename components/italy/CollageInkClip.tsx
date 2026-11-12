"use client";

import { useEffect, useRef } from "react";

/*
 * Line art that sits in front of the collage card is cream, which vanishes on
 * the cream card. Each such piece also carries a dark-ink copy stacked exactly
 * over it ([data-ink-copy]); this clips that copy to the card's outline, so
 * the lines read as ink over the card and stay cream over the olive.
 *
 * The card and the art are both rotated, so the clip is worked out from their
 * real transforms: card corners go into stage pixels, then into each art
 * piece's own unrotated box, which is what clip-path is measured against.
 * Re-run on resize and once fonts load, since the card's height follows its
 * type. Without JS the ink copies stay fully clipped and the art is all cream.
 */

type Pt = { x: number; y: number };

/* Maps a point in an absolutely positioned element's own box to its offset
   parent's box, through its CSS transform (origin at the box centre). */
function boxToParent(el: HTMLElement) {
  const m = new DOMMatrix(getComputedStyle(el).transform === "none" ? undefined : getComputedStyle(el).transform);
  const cx = el.offsetWidth / 2;
  const cy = el.offsetHeight / 2;
  return {
    to(p: Pt): Pt {
      const q = m.transformPoint({ x: p.x - cx, y: p.y - cy });
      return { x: el.offsetLeft + cx + q.x, y: el.offsetTop + cy + q.y };
    },
    from(q: Pt): Pt {
      const p = m.inverse().transformPoint({ x: q.x - el.offsetLeft - cx, y: q.y - el.offsetTop - cy });
      return { x: p.x + cx, y: p.y + cy };
    },
  };
}

function clip(stage: HTMLElement) {
  const card = stage.querySelector<HTMLElement>("[data-collage-card]");
  if (!card) return;
  const w = card.offsetWidth;
  const h = card.offsetHeight;
  const cardMap = boxToParent(card);
  const corners = [
    { x: 0, y: 0 },
    { x: w, y: 0 },
    { x: w, y: h },
    { x: 0, y: h },
  ].map((p) => cardMap.to(p));

  stage.querySelectorAll<HTMLElement>("[data-ink-copy]").forEach((ink) => {
    const piece = ink.closest<HTMLElement>(".collage-piece");
    if (!piece) return;
    const local = corners.map((q) => boxToParent(piece).from(q));
    ink.style.clipPath = `polygon(${local.map((p) => `${p.x.toFixed(1)}px ${p.y.toFixed(1)}px`).join(",")})`;
  });
}

export function CollageInkClip() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const stage = ref.current?.closest<HTMLElement>(".collage-stage");
    if (!stage) return;
    const run = () => clip(stage);
    run();
    const ro = new ResizeObserver(run);
    ro.observe(stage);
    const card = stage.querySelector("[data-collage-card]");
    if (card) ro.observe(card);
    document.fonts?.ready.then(run);
    return () => ro.disconnect();
  }, []);

  return <span ref={ref} hidden />;
}

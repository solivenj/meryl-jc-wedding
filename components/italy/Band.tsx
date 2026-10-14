import type { ReactNode } from "react";

/*
 * A full-bleed horizontal band — the unit the Italy pages are built from.
 *
 * Pages alternate cream and the deep band colour down the page, each with the
 * woven linen on it. A Band replaces a page's old padded root div: <main> has
 * no padding of its own, so a Band rendered directly inside a page is already
 * full width. There is deliberately no w-screen / ml-[calc(50%-50vw)] escape
 * hatch — those miscount the scrollbar, and the layout's overflow-x-clip would
 * hide the resulting shift rather than fix it.
 *
 * Three nested elements, each earning its place:
 *   section  the background, the linen, and the text colour
 *   div      the ONLY direct child, so `.linen > *` (which forces
 *            position:relative + z-index:1) lands here and lifts the content
 *            clear of the ::after weave. Also the containing block for any
 *            absolutely-positioned descendant.
 *   div      the measure — centred, capped, stacked
 *
 * Two rules when composing:
 *   - Never make an absolutely-positioned element a DIRECT child of a Band.
 *     `.linen > *` would make it the containing block and its offsets would
 *     resolve against the wrong box. Always leave one plain wrapper between.
 *   - Every Band carries its own `.linen`. The layout root's weave paints
 *     under <main>, so an opaque band background covers it.
 *
 * data-tone="band" re-points the ink tokens (see globals.css) so every
 * existing primitive works on the dark ground without a `tone` prop.
 */

const WIDTH = {
  prose: "max-w-[29rem]",
  wide: "max-w-[1080px]",
  full: "max-w-none",
} as const;

const PAD = {
  normal: "py-[clamp(56px,8vw,96px)]",
  tight: "py-[clamp(34px,5vw,56px)]",
  none: "py-0",
} as const;

export function Band({
  tone = "cream",
  width = "wide",
  pad = "normal",
  align = "center",
  id,
  className = "",
  children,
}: {
  tone?: "cream" | "band";
  width?: keyof typeof WIDTH;
  pad?: keyof typeof PAD;
  align?: "center" | "left";
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  const deep = tone === "band";
  return (
    <section
      id={id}
      data-tone={deep ? "band" : undefined}
      className={`linen w-full ${
        deep
          ? "linen-dark bg-[var(--color-band)] text-[var(--color-band-ink)]"
          : "bg-ivory text-ink"
      }`}
    >
      <div className={`px-4 ${PAD[pad]}`}>
        <div
          className={`mx-auto flex w-full flex-col ${WIDTH[width]} ${
            align === "center" ? "items-center text-center" : "items-start"
          } ${className}`}
        >
          {children}
        </div>
      </div>
    </section>
  );
}

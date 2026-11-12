import Image from "next/image";
import { CollageInkClip } from "@/components/italy/CollageInkClip";
import { ITALY_COLLAGE, type CollagePiece } from "@/lib/italy-content";

/*
 * The scrapbook band under the home carousel: a cream card of facts in a
 * calla-lily frame with a cupid at its corner, two polaroids to its right,
 * and a map of Italy behind them.
 *
 * It exists because the first screen of /italy never said when or where the
 * wedding was.
 *
 * Everything is placed in percentages of the stage and sized in cqw, so the
 * whole arrangement scales as one group instead of reflowing. Two packs of
 * coordinates handle narrow screens; see ITALY_COLLAGE and the .collage-*
 * rules in app/globals.css for the reasoning behind both.
 *
 * Rendering notes, each one a trap this codebase has already hit:
 *   - The card needs `.on-paper`. A cream surface inside a deep Band has to
 *     opt out of the band ink re-point or it paints cream type on cream
 *     stock. PolaroidStack carries the same note.
 *   - Band nests its children two deep, so `.linen > *` lands on Band's own
 *     wrapper and never on the stage. Rendering this directly inside a Band
 *     is therefore fine; rendering it as a direct child of any .linen element
 *     is not.
 *   - Decorative throughout: the facts on the card are real text, and every
 *     photograph is aria-hidden, so a screen reader gets the details once
 *     rather than a list of unnamed images.
 */

/* A hairline with a diamond on it — the card's two dividers. Sized in cqw so
   it tracks the card rather than the stage. */
function Flourish() {
  return (
    <svg
      viewBox="0 0 120 10"
      aria-hidden="true"
      focusable="false"
      className="w-[34cqw] text-ink/45"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
    >
      <path d="M2 5h48M70 5h48" />
      <path d="M60 1.5 64.5 5 60 8.5 55.5 5z" fill="currentColor" stroke="none" />
    </svg>
  );
}

const SHADOW = "shadow-[0_1.6cqw_3.6cqw_rgba(20,18,8,0.34)]";

function pieceVars(p: CollagePiece): React.CSSProperties {
  /* Percentages and degrees are kept as numbers in content and stringified
     here, so the data file stays free of units. */
  const vars: Record<string, string | number> = {
    "--t": `${p.t}%`,
    "--z": p.z,
  };
  /* The card sets its own left and width in CSS (it is centred and has a
     floor width), so it passes its share rather than a flat percentage. */
  if (p.kind === "card") {
    vars["--card-left"] = `${p.l}%`;
    vars["--card-share"] = `${p.width}%`;
    if (p.pwidth !== undefined) vars["--card-share-tall"] = `${p.pwidth}%`;
  } else {
    vars["--l"] = `${p.l}%`;
    vars["--w"] = `${p.width}%`;
    if (p.pl !== undefined) vars["--pl"] = `${p.pl}%`;
    if (p.pwidth !== undefined) vars["--pw"] = `${p.pwidth}%`;
  }
  if (p.r !== undefined) vars["--r"] = `${p.r}deg`;
  if (p.pt !== undefined) vars["--pt"] = `${p.pt}%`;
  if (p.pr !== undefined) vars["--pr"] = `${p.pr}deg`;
  return vars as React.CSSProperties;
}

/* The stage is at most 1080px (Band width="wide"), so a piece never needs more
   than its share of that. Two breakpoints, matching the two packs. */
function sizesFor(p: CollagePiece) {
  const wide = Math.ceil((p.width / 100) * 1080);
  const tall = Math.ceil(((p.pwidth ?? p.width) / 100) * 640);
  return `(max-width: 640px) ${tall}px, ${wide}px`;
}

/*
 * Eager, not lazy: the collage is the first thing under the carousel, so none
 * of it is below the fold on a laptop and nothing here should wait on an
 * intersection observer to start downloading.
 */
const LOAD = { loading: "eager" } as const;

function Card() {
  const { card } = ITALY_COLLAGE;
  return (
    <div
      /* text-ink on the root as well as the children: without it the root
         inherits the Band's cream and any stray text node would print cream
         on cream. */
      className={`on-paper relative flex flex-col items-center gap-[2.4cqw] bg-ivory px-[7cqw] py-[9cqw] text-center text-ink ${SHADOW}`}
    >
      {/* The inner keyline, the way an engraved card has one. */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-[2.2cqw] border border-rule" />
      {/* Venue first, in script; the dates under the flourish. Amoresa once
          a licensed webfont is loaded as --font-amoresa; Pinyon until then. */}
      <span className="text-[10cqw] leading-[1.15] text-ink [font-family:var(--font-amoresa,var(--font-pinyon))]">
        {card.venue}
      </span>
      <span className="font-body text-[4.6cqw] leading-[1.5] font-light text-ink-soft">
        {card.place}
      </span>
      <Flourish />
      {/* The dates in Amoresa too, to match the venue. */}
      <span className="mt-[2.4cqw] text-[6.8cqw] leading-none whitespace-nowrap text-ink [font-family:var(--font-amoresa,var(--font-pinyon))]">
        {card.dates}, {card.year}
      </span>
    </div>
  );
}

function Polaroid({ piece }: { piece: CollagePiece }) {
  return (
    <figure className={`bg-[#fdfbf6] p-[4cqw] pb-[13cqw] ${SHADOW}`}>
      <div className={`relative w-full ${piece.landscape ? "aspect-[5/4]" : "aspect-[4/5]"}`}>
        {/* No src is a placeholder slot: plain black until a photo is set. */}
        {piece.src ? (
          <Image
            src={piece.src}
            alt=""
            aria-hidden="true"
            fill
            sizes={sizesFor(piece)}
            {...LOAD}
            className="object-cover"
          />
        ) : (
          <div aria-hidden="true" className="absolute inset-0 bg-[#141414]" />
        )}
      </div>
    </figure>
  );
}

/* Cream line art straight on the olive: no frame, no shadow. Art in front of
   the card also stacks its dark-ink copy over itself, clipped to the card's
   outline by CollageInkClip so the lines stay legible on the cream. */
function Art({ piece }: { piece: CollagePiece }) {
  const img = (src: string) => (
    <Image
      src={src}
      alt=""
      aria-hidden="true"
      width={piece.w}
      height={piece.h}
      sizes={sizesFor(piece)}
      {...LOAD}
      className="h-auto w-full"
    />
  );
  return (
    <div className="relative">
      {img(piece.src!)}
      {piece.ink && (
        <div data-ink-copy className="absolute inset-0 [clip-path:polygon(0_0,0_0,0_0)]">
          {img(piece.ink)}
        </div>
      )}
    </div>
  );
}

export function DetailCollage() {
  return (
    <div className="collage-stage">
      <div
        className="collage-inner"
        style={
          {
            "--collage-ratio": ITALY_COLLAGE.ratio,
            "--collage-ratio-tall": ITALY_COLLAGE.ratioTall,
          } as React.CSSProperties
        }
      >
        {ITALY_COLLAGE.pieces.map((p, i) => (
          <div
            key={p.src ?? `${p.kind}-${i}`}
            className={`collage-piece ${p.kind === "card" ? "collage-piece-card" : ""}`}
            style={pieceVars(p)}
            data-collage-card={p.kind === "card" ? "" : undefined}
          >
            {p.kind === "card" && <Card />}
            {p.kind === "photo" && <Polaroid piece={p} />}
            {p.kind === "art" && <Art piece={p} />}
          </div>
        ))}
        <CollageInkClip />
      </div>
    </div>
  );
}

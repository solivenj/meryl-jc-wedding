import Image from "next/image";

/*
 * Photographs scattered as if dropped on a table, with a note card among them.
 *
 * The inspiration does this as a single photograph of real objects on a
 * silver charger. This is the CSS equivalent: cheaper, responsive, and the
 * photos swap by editing data rather than reshooting. A real composite can
 * replace the whole thing later by passing `photo`.
 *
 * NOTE: this must never be a direct child of a Band — `.linen > *` forces
 * position:relative on direct children, which would make the wrapper the
 * containing block for these absolutely-ish placed tiles. Band already nests
 * its children two deep, so rendering it inside a Band is fine.
 *
 * Below 640px the rotation and overlap are dropped: three tilted, overlapping
 * tiles at phone width is a pile, not a composition.
 */
export type PolaroidItem = { src: string; alt: string; rotate: number };

export function PolaroidStack({
  items,
  note,
  className = "",
}: {
  items: readonly PolaroidItem[];
  note?: string;
  className?: string;
}) {
  return (
    <div
      className={`flex w-full flex-col items-center gap-5 sm:-space-y-10 sm:gap-0 ${className}`}
    >
      {items.map((it, i) => (
        <figure
          key={it.src}
          style={{ ["--r" as string]: `${it.rotate}deg` }}
          className={`on-paper w-[min(260px,78vw)] bg-[#fdfbf6] p-2.5 pb-10 shadow-[0_12px_30px_rgba(30,25,15,0.26)] sm:rotate-[var(--r)] ${
            i % 2 === 0 ? "sm:self-start" : "sm:self-end"
          }`}
        >
          <div className="relative aspect-[4/5] w-full overflow-hidden">
            <Image src={it.src} alt={it.alt} fill sizes="260px" className="object-cover" />
          </div>
        </figure>
      ))}

      {/* on-paper: a cream card inside a deep Band has to opt out of the band
          ink re-point, or it renders cream type on cream stock. */}
      {note && (
        <p className="on-paper w-[min(300px,82vw)] bg-paper px-7 py-6 text-center font-body text-[calc(15.5px*var(--fs-scale))] leading-[1.55] tracking-[0.02em] text-ink shadow-[0_10px_26px_rgba(30,25,15,0.22)] sm:-rotate-2 sm:self-center">
          {note}
        </p>
      )}
    </div>
  );
}

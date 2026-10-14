import type { Swatch } from "@/lib/italy-content";

/*
 * The palette capsules.
 *
 * Six wrap to two rows on a phone rather than scrolling: each capsule is
 * small and atomic, so wrapping keeps them all on screen where a rail would
 * hide half of them behind a swipe.
 *
 * A colour swatch carries information, so each one is named rather than
 * shipped as six unlabelled divs. The ring keeps the pale creams from
 * disappearing when they sit on the cream ground.
 */
export function PaletteRow({ swatches }: { swatches: readonly Swatch[] }) {
  return (
    <ul className="flex w-full flex-wrap justify-center gap-x-4 gap-y-6">
      {swatches.map((s) => (
        <li key={s.name} className="flex flex-col items-center gap-2.5">
          <span
            className="block h-[86px] w-[58px] rounded-full ring-1 ring-ink/15 sm:h-[104px] sm:w-[70px]"
            style={
              s.texture
                ? { backgroundImage: `url(${s.texture})`, backgroundSize: "cover" }
                : { background: s.hex }
            }
          />
          <span className="font-caps text-[calc(9.5px*var(--fs-scale))] uppercase tracking-[0.18em] text-ink-soft">
            {s.name}
          </span>
        </li>
      ))}
    </ul>
  );
}

import { Motif } from "@/components/italy/Art";
import type { MotifName } from "@/components/italy/sketches";

/*
 * Line art scattered in a page's margins, above 900px only: below that it
 * would land on the text. Each piece is absolutely positioned inside its
 * nearest relative ancestor, so it moves with the copy that owns it. Shared
 * by Travel and Dress Code.
 */
export type Placed = { name: MotifName; size: number; rot: number; style: React.CSSProperties };

export function Scatter({ items }: { items: Placed[] }) {
  return (
    <div aria-hidden="true" className="hidden min-[901px]:block">
      {items.map((m) => (
        <Motif
          key={m.name}
          name={m.name}
          size={m.size}
          className="absolute text-ink"
          style={{ ...m.style, transform: `rotate(${m.rot}deg)` }}
        />
      ))}
    </div>
  );
}

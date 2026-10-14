import { SmallCaps } from "@/components/italy/Type";

/*
 * Label-and-lines blocks: "Arrival", "By air", "What we're covering".
 *
 * Promoted out of app/italy/accommodations/page.tsx, where it lived as a
 * local Panel, because three places want it — accommodations (bordered),
 * travel's section blocks (unbordered), and the home Details column.
 *
 * Colours come from the tokens, so it works on either ground without a prop:
 * border-rule and text-ink-soft are both re-pointed inside a deep Band.
 */
export type DetailBlock = { label: string; lines: readonly string[] };

export function DetailBlocks({
  blocks,
  bordered = false,
  className = "",
}: {
  blocks: readonly DetailBlock[];
  bordered?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex w-full flex-col gap-[30px] ${className}`}>
      {blocks.map((b) => (
        <div
          key={b.label}
          className={`flex w-full flex-col items-start gap-2.5 text-left ${
            bordered ? "border border-rule p-6 sm:p-7" : ""
          }`}
        >
          <SmallCaps>{b.label}</SmallCaps>
          <ul className="flex flex-col gap-2 font-body text-[calc(17.5px*var(--fs-scale))] leading-[1.7] font-light text-ink-soft">
            {b.lines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

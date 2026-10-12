/*
 * The Thursday run of show: a time gutter against a list of items.
 *
 * Geometry is lifted from components/act-two/Program.tsx on the church side,
 * which solved the same problem — but not the component itself: that one is
 * "use client", pulls motion/react, Reveal and lib/motion's tokens, and reads
 * the church's own PROGRAM const. This is a server component with none of it.
 *
 * tabular-nums is what keeps the times in a straight column; without it the
 * glyph widths differ and the gutter looks ragged. Rules use bg-rule rather
 * than a fixed ink so they follow the band token re-point.
 */
export type ProgramRow = { time: string; item: string; tbd?: boolean };

export function ProgramTimeline({
  title,
  rows,
  note,
}: {
  title: string;
  rows: readonly ProgramRow[];
  note?: string;
}) {
  return (
    <div className="w-full text-left">
      <h3 className="font-caps text-[12px] uppercase tracking-[0.2em] text-ink">{title}</h3>
      <ol className="mt-6">
        {rows.map((row, i) => (
          <li
            key={row.time + row.item}
            className={`flex items-baseline gap-6 py-4 ${i > 0 ? "border-t border-rule" : ""}`}
          >
            <span className="w-20 shrink-0 font-utility text-[11px] tracking-[0.18em] tabular-nums text-ink-soft">
              {row.time}
            </span>
            <span
              className={`font-body text-[17.5px] leading-[1.6] font-light text-ink-soft ${
                row.tbd ? "italic" : ""
              }`}
            >
              {row.item}
            </span>
          </li>
        ))}
      </ol>
      {note && (
        <p className="mt-5 font-body text-[14.5px] leading-[1.6] font-light text-ink-soft/80 italic">
          {note}
        </p>
      )}
    </div>
  );
}

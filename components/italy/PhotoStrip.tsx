import { PhotoPanel } from "@/components/italy/PhotoPanel";

/*
 * A row of attire photographs.
 *
 * A scroll-snap rail, not a five-column grid: five images across a 390px
 * phone is about seventy pixels each, which is not a photograph so much as a
 * swatch. Above 900px the rail stops scrolling and the items share the row.
 *
 * Each tile is a PhotoPanel, so it renders its gradient until the real image
 * is registered in lib/italy-art.ts and needs no change when it is. The
 * gradients are varied deliberately — five identical ones read as a bug
 * rather than a placeholder.
 */
const PLACEHOLDER = [
  "linear-gradient(165deg,#E8C79A 0%,#C97B52 46%,#7C3F2E 100%)",
  "linear-gradient(200deg,#BFCBB4 0%,#6F8A6A 44%,#26382C 100%)",
  "linear-gradient(150deg,#D8C7D2 0%,#A98294 48%,#4E3340 100%)",
  "linear-gradient(190deg,#CFD6DF 0%,#7D90A6 50%,#2E3A4A 100%)",
  "linear-gradient(140deg,#EBD6A8 0%,#D9A25E 40%,#8C5A2B 100%)",
];

export function PhotoStrip({ slots }: { slots: readonly string[] }) {
  return (
    <div className="-mx-4 w-[calc(100%+2rem)] overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden min-[900px]:mx-0 min-[900px]:w-full min-[900px]:overflow-visible min-[900px]:px-0">
      <div className="flex snap-x snap-mandatory gap-3 min-[900px]:snap-none">
        {slots.map((slot, i) => (
          <PhotoPanel
            key={slot}
            slot={slot as never}
            gradient={PLACEHOLDER[i % PLACEHOLDER.length]}
            sizes="(min-width: 900px) 20vw, 46vw"
            className="aspect-[3/4] w-[46vw] max-w-[230px] shrink-0 snap-center min-[900px]:w-auto min-[900px]:max-w-none min-[900px]:flex-1"
          />
        ))}
      </div>
    </div>
  );
}

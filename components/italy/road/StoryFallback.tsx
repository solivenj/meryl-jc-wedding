import { Band } from "@/components/italy/Band";
import { Prose, ScriptTitle, SmallCaps } from "@/components/italy/Type";
import { ITALY_STORY } from "@/lib/italy-content";

/*
 * The story as plain bands: what readers get with reduced motion or no
 * JavaScript, and the one copy of the story that assistive tech reads while
 * the drive is showing (design doc §9). Deliberately plain — it exists so the
 * story is fully readable, not to imitate the drive.
 *
 * Bands alternate cream and deep. The header rail above and the footer below
 * are both deep, so the first and last bands must be cream; the closing band
 * absorbs the parity, the same way the old page's sign-off did.
 */
type Entry = { key: string; kicker: string; heading: string; body: string };

function entries(): Entry[] {
  const out: Entry[] = [];
  for (const s of ITALY_STORY.stops) {
    if (s.id === "spain") continue; // Bali and Spain share one band
    if (s.id === "bali") out.push({ key: "half", ...ITALY_STORY.halfStops });
    else out.push({ key: s.id, kicker: s.kicker, heading: s.heading, body: s.body });
  }
  return out;
}

function Closing() {
  const { closing } = ITALY_STORY;
  return (
    <div className="flex flex-col items-center gap-3">
      <SmallCaps>{closing.kicker}</SmallCaps>
      <p className="max-w-[30ch] text-center font-display text-[calc(clamp(22px,2.6vw,30px)*var(--fs-scale))] leading-[1.35] text-ink">
        {closing.line}
      </p>
      <SmallCaps>{closing.dates}</SmallCaps>
    </div>
  );
}

export function StoryFallback() {
  const list = entries();
  const closingRidesAlong = (list.length - 1) % 2 === 0;

  return (
    <>
      {list.map((e, i) => {
        const last = i === list.length - 1;
        return (
          <Band key={e.key} tone={i % 2 === 0 ? "cream" : "band"} width="prose" className="gap-5">
            <SmallCaps>{e.kicker}</SmallCaps>
            <ScriptTitle>{e.heading}</ScriptTitle>
            <Prose align="center">{e.body}</Prose>
            {last && closingRidesAlong && <div className="mt-10"><Closing /></div>}
          </Band>
        );
      })}
      {!closingRidesAlong && (
        <Band tone="cream" width="prose">
          <Closing />
        </Band>
      )}
    </>
  );
}

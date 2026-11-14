import type { Metadata } from "next";
import { Motif } from "@/components/italy/Art";
import { Band } from "@/components/italy/Band";
import { Scatter, type Placed } from "@/components/italy/Scatter";
import type { MotifName } from "@/components/italy/sketches";
import { DayJump } from "@/components/italy/DayJump";
import { PaletteRow } from "@/components/italy/PaletteRow";
import { PhotoPanel } from "@/components/italy/PhotoPanel";
import { PhotoStrip } from "@/components/italy/PhotoStrip";
import { PinterestBoard } from "@/components/italy/PinterestBoard";
import { Label, Prose, ScriptTitle, SmallCaps } from "@/components/italy/Type";
import { ITALY_DRESS, type DressSection } from "@/lib/italy-content";

export const metadata: Metadata = { title: "Dress Code" };

const HERO_GRADIENT: Record<string, string> = {
  cocktail: "linear-gradient(165deg,#E8C79A 0%,#C97B52 46%,#7C3F2E 100%)",
  blacktie: "linear-gradient(200deg,#BFCBB4 0%,#6F8A6A 44%,#26382C 100%)",
};

/* Margin line art, as on Travel: above 900px only, each set placed inside
   the band it belongs to. */
const TITLE_ART: Placed[] = [
  { name: "hat", size: 104, rot: -6, style: { left: "6%", top: 4 } },
  { name: "flowers", size: 96, rot: 7, style: { right: "8%", top: -12 } },
];
const CODE_ART: Record<string, Placed[]> = {
  cocktail: [
    { name: "coupe", size: 84, rot: -8, style: { left: "4%", top: -6 } },
    { name: "wineglass", size: 70, rot: 8, style: { right: "5%", top: 6 } },
  ],
  blacktie: [
    { name: "rings", size: 96, rot: -5, style: { left: "3%", top: -4 } },
    { name: "doves", size: 112, rot: 4, style: { right: "3%", top: -14 } },
  ],
};
const CLOSING_ART: Placed[] = [
  { name: "swallow", size: 78, rot: -8, style: { left: "10%", top: -6 } },
  { name: "espresso", size: 62, rot: 6, style: { right: "11%", top: 8 } },
];
const MOBILE_ROW: MotifName[] = ["hat", "coupe", "flowers", "rings"];

/* Ladies and gentlemen are the same block twice, so it is one component used
   twice rather than two near-identical lumps of JSX. */
function CodeSection({ section }: { section: DressSection }) {
  return (
    <>
      <Label>{section.heading}</Label>
      <div className="mt-6 flex w-full flex-col items-center gap-3">
        <ScriptTitle as="h3">palette</ScriptTitle>
        <p className="font-body text-[calc(16.5px*var(--fs-scale))] leading-[1.6] font-light text-ink-soft italic">
          {ITALY_DRESS.paletteNote}
        </p>
      </div>
      <div className="mt-8 w-full">
        <PaletteRow swatches={section.palette} />
      </div>
      <Prose className="mt-10">{section.body}</Prose>
      <div className="mt-10 w-full">
        <PhotoStrip slots={section.strip} />
      </div>
    </>
  );
}

/*
 * Tones down the page: the opening title is cream so it does not run into the
 * deep header, and every band after it simply alternates in render order,
 * boards included. With one board on Wednesday that is nine bands, so it lands
 * cream on the closing section, clear of the deep footer. If a board is added
 * or removed the parity flips; check the last band before the footer.
 */
function alternator() {
  let n = 0;
  return () => (n++ % 2 === 0 ? ("band" as const) : ("cream" as const));
}

export default function DressCodePage() {
  const next = alternator();
  return (
    <>
      {/* Above the title, so the page names both codes before anything is
          scrolled. Cream on cream with the title band below it, which is why
          it carries its own hairline. */}
      <DayJump items={ITALY_DRESS.codes.map((c) => ({ id: c.key, label: c.short }))} />

      {/* No eyebrow: the title opens the page, so the top padding is about
          half the usual and the bottom keeps the normal Band padding. */}
      {/* Wide, so the margin art has room either side; the copy keeps the
          prose measure in its own column. */}
      <Band tone="cream" width="wide" pad="none" className="pt-[clamp(28px,4vw,48px)] pb-[clamp(56px,8vw,96px)]">
        <div className="relative flex w-full flex-col items-center">
          <Scatter items={TITLE_ART} />
          <div className="flex w-full max-w-[29rem] flex-col items-center gap-5">
            <h1 className="sr-only">Dress code</h1>
            <ScriptTitle>{ITALY_DRESS.title}</ScriptTitle>
            <Prose>{ITALY_DRESS.intro}</Prose>
            <div aria-hidden="true" className="mt-2 flex justify-center gap-5 text-ink min-[901px]:hidden">
              {MOBILE_ROW.map((m) => (
                <Motif key={m} name={m} size={40} />
              ))}
            </div>
          </div>
        </div>
      </Band>

      {ITALY_DRESS.codes.map((code) => (
        <section key={code.key}>
          <Band id={code.key} tone={next()} width="wide" className="gap-5">
            {/* Art sits level with the day and title, which are centred and
                narrow; lower down the photo takes the full width. */}
            <div className="relative -mb-5 w-full">
              <Scatter items={CODE_ART[code.key] ?? []} />
            </div>
            <SmallCaps>{code.day}</SmallCaps>
            <ScriptTitle as="h2">{code.word}</ScriptTitle>
            <p className="font-caps text-[calc(11px*var(--fs-scale))] uppercase tracking-[0.24em] text-ink-soft">
              {code.subtitle}
            </p>
            <PhotoPanel
              slot={code.heroSlot as never}
              gradient={HERO_GRADIENT[code.key]}
              sizes="(min-width: 900px) 900px, 100vw"
              className="mt-6 h-[clamp(240px,34vw,420px)] w-full max-w-[900px]"
            />
            <Prose className="mt-6">{code.intro}</Prose>
          </Band>

          <Band tone={next()} width="wide">
            <CodeSection section={code.ladies} />
          </Band>

          <Band tone={next()} width="wide">
            <CodeSection section={code.gentlemen} />
          </Band>

          {/* Meryl's board, embedded live rather than rehosted — it is the one
              source of attire inspiration that stays current on its own. */}
          {code.pinterestUrl && (
            <Band tone={next()} width="prose" className="gap-6">
              <Label>More like this</Label>
              <PinterestBoard url={code.pinterestUrl} className="h-[clamp(300px,34vw,420px)]" />
            </Band>
          )}
        </section>
      ))}

      <Band tone="cream" width="wide">
        <div className="relative flex w-full flex-col items-center">
          <Scatter items={CLOSING_ART} />
          <div className="flex w-full max-w-[29rem] flex-col items-center gap-5">
            <Label>{ITALY_DRESS.notToWear.heading}</Label>
            <Prose>{ITALY_DRESS.notToWear.body}</Prose>
          </div>
        </div>
      </Band>
    </>
  );
}

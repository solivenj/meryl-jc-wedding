import type { Metadata } from "next";
import { PhotoPanel } from "@/components/italy/PhotoPanel";
import { Eyebrow, Prose, SmallCaps } from "@/components/italy/Type";
import { ITALY_DRESS } from "@/lib/italy-content";

export const metadata: Metadata = { title: "Dress Code" };

const PANEL = {
  terracotta: {
    slot: "cocktail",
    gradient: "linear-gradient(165deg,#E8C79A 0%,#C97B52 46%,#7C3F2E 100%)",
  },
  olive: {
    slot: "blacktie",
    gradient: "linear-gradient(200deg,#BFCBB4 0%,#6F8A6A 44%,#26382C 100%)",
  },
  ochre: {
    slot: "linen",
    gradient: "linear-gradient(120deg,#EBD6A8 0%,#D9A25E 40%,#8C5A2B 100%)",
  },
} as const;

export default function DressCodePage() {
  return (
    <div className="flex flex-col items-center px-4 pt-10">
      <h1 className="sr-only">Dress code</h1>
      <Eyebrow>{ITALY_DRESS.eyebrow}</Eyebrow>
      <Prose className="mt-[42px] mb-[34px]">{ITALY_DRESS.intro}</Prose>

      <div className="grid w-full max-w-[1080px] grid-cols-1 gap-[26px] min-[700px]:grid-cols-2">
        {ITALY_DRESS.panels.map((p) => {
          const wide = "wide" in p && p.wide;
          const look = PANEL[p.tone];
          return (
            <section key={p.word} className={`flex flex-col gap-3.5 ${wide ? "col-span-full" : ""}`}>
              <PhotoPanel
                slot={look.slot}
                gradient={look.gradient}
                sizes={wide ? "(min-width: 1080px) 1080px, 100vw" : "(min-width: 700px) 50vw, 100vw"}
                className={`flex items-center justify-center ${
                  wide ? "h-[clamp(280px,26vw,380px)]" : "h-[clamp(300px,34vw,420px)]"
                }`}
              >
                <h2 className="relative font-flourish text-[clamp(44px,5vw,74px)] text-ivory [text-shadow:0_2px_20px_rgba(40,25,10,.32)]">
                  {p.word}
                </h2>
              </PhotoPanel>
              <SmallCaps>{p.label}</SmallCaps>
              <Prose>{p.body}</Prose>
            </section>
          );
        })}
      </div>
    </div>
  );
}

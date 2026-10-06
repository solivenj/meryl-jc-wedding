import { Motif } from "@/components/italy/Art";
import { PhotoCarousel } from "@/components/italy/PhotoCarousel";
import { Label, Prose, Rule } from "@/components/italy/Type";
import { ITALY, ITALY_HOME } from "@/lib/italy-content";

export default function ItalyHome() {
  return (
    <>
      {/* Slow-drifting photo band with the hero script over it. */}
      <PhotoCarousel>
        <h1 className="text-center font-flourish text-[clamp(50px,11.6vw,176px)] leading-none text-ivory [text-shadow:0_2px_26px_rgba(30,20,10,.34)]">
          {ITALY_HOME.heroScript}
        </h1>
      </PhotoCarousel>

      <section className="flex flex-col items-center gap-[34px] px-4 pt-24 pb-10 text-center">
        <p className="font-display text-[clamp(26px,3.4vw,38px)] leading-[1.25] text-ink">
          {ITALY_HOME.kicker}
        </p>
        <Motif name="boat" size={118} className="text-ink" />
        <Label>{ITALY.dates}</Label>
        <p className="font-display text-[clamp(26px,3.4vw,38px)] leading-[1.25] text-ink">
          {ITALY.place}
        </p>
        <Prose>{ITALY_HOME.intro}</Prose>
        <Rule />
        <p className="font-caps text-[10px] uppercase tracking-[0.24em] text-ink-soft">
          {ITALY_HOME.replyBy}
        </p>
      </section>

      <div className="flex flex-wrap justify-center gap-[22px] px-4 pt-2.5 text-ink">
        {(["flowers", "lemon", "gelato", "coupe", "swallow", "vespa", "pizza", "wineglass", "olive"] as const).map((m) => (
          <Motif key={m} name={m} size={44} />
        ))}
      </div>
    </>
  );
}

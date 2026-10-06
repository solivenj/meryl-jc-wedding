import type { Metadata } from "next";
import { Scene } from "@/components/italy/Art";
import { Eyebrow, Label, ScriptTitle, SmallCaps } from "@/components/italy/Type";
import { ITALY_SCHEDULE } from "@/lib/italy-content";

export const metadata: Metadata = { title: "Schedule" };

export default function SchedulePage() {
  return (
    <div className="flex flex-col items-center px-4 pt-10">
      <h1 className="sr-only">Schedule</h1>
      <Eyebrow>{ITALY_SCHEDULE.eyebrow}</Eyebrow>

      <div className="mt-[42px] flex flex-col items-center gap-[78px]">
        {ITALY_SCHEDULE.days.map((d) => (
          <section key={d.day} className="flex flex-col items-center gap-5 text-center">
            <ScriptTitle>{d.day}</ScriptTitle>
            <Scene name={d.art} />
            <Label>{d.title}</Label>
            <p className="font-body text-[18px] font-light italic text-ink-soft">“{d.quote}”</p>
            <p className="font-body text-[17px] font-light text-ink-soft">{d.time}</p>
            {"place" in d && (
              <p className="font-body text-[17px] font-light text-ink-soft">{d.place}</p>
            )}
            <div className="flex flex-col items-center gap-2">
              <SmallCaps>Dress code · {d.dress}</SmallCaps>
              <span aria-hidden="true" className="h-px w-[120px] bg-rule" />
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

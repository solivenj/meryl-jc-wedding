import type { Metadata } from "next";
import { FaqAccordion } from "@/components/italy/FaqAccordion";
import { Eyebrow } from "@/components/italy/Type";
import { ITALY_FAQ } from "@/lib/italy-content";

export const metadata: Metadata = { title: "FAQ" };

export default function FaqPage() {
  return (
    <div className="flex flex-col items-center gap-5 px-4 pt-10">
      <h1 className="sr-only">Frequently asked questions</h1>
      <Eyebrow>{ITALY_FAQ.eyebrow}</Eyebrow>
      <FaqAccordion items={ITALY_FAQ.items} />
    </div>
  );
}

import type { Metadata } from "next";
import { Band } from "@/components/italy/Band";
import { FaqAccordion } from "@/components/italy/FaqAccordion";
import { Eyebrow } from "@/components/italy/Type";
import { ITALY_FAQ } from "@/lib/italy-content";

export const metadata: Metadata = { title: "FAQ" };

export default function FaqPage() {
  return (
    <Band tone="cream" width="wide" className="gap-5">
      <h1 className="sr-only">Frequently asked questions</h1>
      <Eyebrow>{ITALY_FAQ.eyebrow}</Eyebrow>
      <FaqAccordion items={ITALY_FAQ.items} />
    </Band>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import { Band } from "@/components/italy/Band";
import { Eyebrow, Prose, ScriptTitle } from "@/components/italy/Type";
import { ITALY_STORY } from "@/lib/italy-content";

export const metadata: Metadata = { title: "Our Story" };

/* TBD — the chapters are placeholders in lib/italy-content.ts. The photos are
   picked from the carousel set for now; swap them for chosen ones. */
const PHOTOS = [
  "/italy/photos/IMG_7036.JPG",
  "/italy/photos/IMG_7089.JPG",
  "/italy/photos/IMG_7200.JPG",
];

export default function OurStoryPage() {
  return (
    <>
      <Band tone="cream" pad="tight">
        <h1 className="sr-only">Our story</h1>
        <Eyebrow>{ITALY_STORY.eyebrow}</Eyebrow>
      </Band>

      {ITALY_STORY.chapters.map((c, i) => (
        <Band key={c.heading} tone={i % 2 === 0 ? "cream" : "band"} width="wide">
          {/* The photo leads on alternate chapters, so the eye zig-zags down
              the page rather than running straight. order- only applies from
              800px; stacked, the photo is always first. */}
          <div className="grid w-full items-center gap-10 min-[800px]:grid-cols-2 min-[800px]:gap-16">
            <div className={`relative aspect-[4/5] w-full overflow-hidden ${i % 2 === 1 ? "min-[800px]:order-2" : ""}`}>
              <Image
                src={PHOTOS[i % PHOTOS.length]}
                alt=""
                fill
                sizes="(min-width: 800px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col items-start gap-5 text-left">
              <ScriptTitle>{c.heading}</ScriptTitle>
              <Prose>{c.body}</Prose>
            </div>
          </div>
        </Band>
      ))}
    </>
  );
}

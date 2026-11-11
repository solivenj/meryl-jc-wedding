import type { Metadata } from "next";
import Image from "next/image";
import { Band } from "@/components/italy/Band";
import { Eyebrow, Prose, ScriptTitle, SmallCaps } from "@/components/italy/Type";
import { ITALY_STORY } from "@/lib/italy-content";

export const metadata: Metadata = { title: "Our Story" };

/*
 * Four chapters, each one scene beside one photograph, bands alternating
 * cream and deep the whole way down.
 *
 * The chapter count is content-led — ITALY_STORY.chapters drives the loop, so
 * adding or cutting one needs no change here. But the alternation has a deep
 * surface at BOTH ends of the page to clear: the header rail above and the
 * footer below. Two deep bands meeting read as one slab, so the first band
 * and the last band must both be cream — which an even number of chapters
 * cannot do on its own.
 *
 * The sign-off absorbs it. Chapters always start cream; the closing line then
 * either rides inside the last chapter's band (when that band is already
 * cream, i.e. an odd chapter count) or takes a cream band of its own (when it
 * is deep, i.e. even). Four chapters today: cream, deep, cream, deep, then a
 * cream band for the sign-off.
 *
 * TBD — the photographs are picked from the carousel set, so they also appear
 * on the home page. Swap them for chosen ones; four are needed, because
 * PHOTOS shorter than chapters wraps and repeats a frame down one page.
 */
const PHOTOS = [
  "/italy/photos/IMG_7036.JPG",
  "/italy/photos/IMG_7089.JPG",
  "/italy/photos/IMG_7200.JPG",
  "/italy/photos/0U1A5931.jpg",
];

function Closing() {
  return (
    <p className="max-w-[48ch] text-center font-display text-[calc(clamp(22px,2.6vw,30px)*var(--fs-scale))] leading-[1.35] font-normal text-ink">
      {ITALY_STORY.closing}
    </p>
  );
}

export default function OurStoryPage() {
  const { chapters } = ITALY_STORY;
  /* True when the final chapter's own band is cream, so the sign-off can sit
     in it rather than needing a band — see the note above. */
  const closingRidesAlong = (chapters.length - 1) % 2 === 0;

  return (
    <>
      {chapters.map((c, i) => {
        const first = i === 0;
        const last = i === chapters.length - 1;

        return (
          <Band
            key={c.heading}
            tone={i % 2 === 0 ? "cream" : "band"}
            width="wide"
            className={first || (last && closingRidesAlong) ? "gap-10" : ""}
          >
            {first && (
              <>
                <h1 className="sr-only">Our story</h1>
                <Eyebrow>{ITALY_STORY.eyebrow}</Eyebrow>
                {/* Parked rather than removed: intro is optional, so the line
                    in lib/italy-content.ts can be commented out and back. */}
                {ITALY_STORY.intro && <Prose align="center">{ITALY_STORY.intro}</Prose>}
              </>
            )}

            {/* The photo leads on alternate chapters, so the eye zig-zags down
                the page rather than running straight. order- only applies from
                800px; stacked, the photo is always first. */}
            <div className="grid w-full items-center gap-10 min-[800px]:grid-cols-2 min-[800px]:gap-16">
              <div
                className={`relative aspect-[4/5] w-full overflow-hidden ${
                  i % 2 === 1 ? "min-[800px]:order-2" : ""
                }`}
              >
                <Image
                  /* alt="" on purpose: the prose beside each photograph already
                     carries the meaning, and nobody has told me what is in
                     these frames. A guessed description would be worse than
                     none. Give them real alt text when the chosen photos land. */
                  src={PHOTOS[i % PHOTOS.length]}
                  alt=""
                  fill
                  /* The first chapter photo is the LCP element on this page, and
                     the dev server says so on every load. Eager only for that
                     one; the rest stay lazy, which is the default.

                     Not `preload`, and not `priority` - priority is deprecated
                     in Next 16, and the docs for its replacement say to reach
                     for loading="eager" first and keep preload for the case
                     where the image has to be found in <head>. */
                  loading={first ? "eager" : "lazy"}
                  sizes="(min-width: 800px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col items-start gap-5 text-left">
                <SmallCaps>{c.kicker}</SmallCaps>
                <ScriptTitle>{c.heading}</ScriptTitle>
                <Prose>{c.body}</Prose>
              </div>
            </div>

            {last && closingRidesAlong && <Closing />}
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

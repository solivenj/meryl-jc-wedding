import { readdirSync } from "node:fs";
import path from "node:path";
import Image from "next/image";

/*
 * Home hero band: a slow, endless horizontal drift of photos. Any image dropped
 * into public/italy/photos/ joins it (filename order) — read at build time, so
 * a redeploy picks up new photos. Pure CSS animation (.italy-marquee in
 * globals.css): the set is rendered twice and the track slides by exactly one
 * set, so the loop is seamless. Hover pauses; reduced motion gets a still,
 * swipeable row instead.
 */

const PHOTO_DIR = path.join(process.cwd(), "public/italy/photos");
const IMAGE_RE = /\.(jpe?g|png|webp|avif)$/i;
const MIN_PHOTOS = 3;
/* One loop must be wider than the widest screen (6 × 344px ≈ 2060px), so a
   short list is repeated until it reaches this many slides. */
const MIN_SLIDES_PER_LOOP = 6;
const SECONDS_PER_SLIDE = 9;

const PLACEHOLDERS = [
  "linear-gradient(150deg,#D8B270 0%,#A87C4A 48%,#2E2317 100%)",
  "linear-gradient(200deg,#C8A163 0%,#7A5E39 55%,#2E2317 100%)",
  "linear-gradient(160deg,#E0BE80 0%,#8A6A40 60%,#3A2C1C 100%)",
  "linear-gradient(190deg,#D8B270 0%,#6E5433 52%,#2E2317 100%)",
  "linear-gradient(170deg,#E4C99A 0%,#9C7448 50%,#33271A 100%)",
  "linear-gradient(140deg,#CFAE74 0%,#80603B 58%,#2E2317 100%)",
];

function listPhotos(): string[] {
  try {
    return readdirSync(PHOTO_DIR)
      .filter((f) => IMAGE_RE.test(f))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map((f) => `/italy/photos/${encodeURIComponent(f)}`);
  } catch {
    return [];
  }
}

const slideClass =
  "relative h-[clamp(240px,40vw,430px)] w-[calc(clamp(240px,40vw,430px)*0.8)] flex-none overflow-hidden";

export function PhotoCarousel({ children }: { children?: React.ReactNode }) {
  const found = listPhotos();
  const usePhotos = found.length >= MIN_PHOTOS;
  const photos = [...found];
  while (usePhotos && photos.length < MIN_SLIDES_PER_LOOP) photos.push(...found);
  const count = usePhotos ? photos.length : PLACEHOLDERS.length;

  const slides = (copy: number) =>
    usePhotos
      ? photos.map((src, i) => (
          <div key={`${copy}-${i}`} className={slideClass}>
            <Image
              src={src}
              alt=""
              aria-hidden="true"
              fill
              sizes="(min-width: 1075px) 344px, 32vw"
              priority={copy === 0 && i < 3}
              className="object-cover"
            />
          </div>
        ))
      : PLACEHOLDERS.map((bg, i) => (
          <div key={`${copy}-${i}`} className={slideClass} style={{ background: bg }} aria-hidden="true" />
        ));

  return (
    <section aria-label="Photographs" className="italy-marquee relative overflow-hidden bg-ivory">
      <div
        className="italy-marquee-track flex w-max gap-px"
        style={{ "--marquee-duration": `${count * SECONDS_PER_SLIDE}s` } as React.CSSProperties}
      >
        {slides(0)}
        {slides(1)}
      </div>
      {children && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[rgb(20_15_10/0.18)] px-4">
          {children}
        </div>
      )}
    </section>
  );
}

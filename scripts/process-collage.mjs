// Dev-only: build the props for the home-page detail collage
// (components/italy/DetailCollage.tsx) into public/italy/collage/.
//
// Usage: node scripts/process-collage.mjs
// Sources + licenses: public/italy/CREDITS.md
//
// Both source files already carry an alpha channel — roughly half of each
// image is fully transparent — so unlike scripts/process-illustrations.mjs
// there is no paper to knock out here. The work is recolouring and resizing.
//
// The envelope is John's own asset, already used on the church side. Its
// satin is dusty blue, which fights the olive ground on /italy, so the hue is
// rotated into a warm cream. Rotation rather than a flat tint on purpose:
// it keeps the satin's own highlights and shadows, which is the whole reason
// the photograph looks like fabric instead of a shape.
//
// The envelope body is near-white and barely saturated, so the same rotation
// leaves it alone. That is why this works as a global operation.
import sharp from "sharp";
import { mkdirSync, readFileSync } from "node:fs";
import path from "node:path";

const OUT = "public/italy/collage";

/* Blue satin sits near hue 211. The warm cream we want is near 36, hence
   +185. `saturation` below 1 pulls it back from "dyed" to "natural linen". */
const JOBS = [
  {
    name: "envelope-cream",
    src: "public/envelope.webp",
    width: 900,
    modulate: { hue: 185, saturation: 0.5, brightness: 1.04 },
  },
  {
    name: "envelope-blush",
    src: "public/envelope.webp",
    width: 900,
    modulate: { hue: 167, saturation: 0.62, brightness: 1.03 },
  },
  /*
   * public/oval_portrait.png is deliberately NOT built here. It is the two of
   * them in a gilt oval, and the collage sets its photograph in a paper
   * doily — a gold frame inside paper lace is two different objects in the
   * same place. The doily takes a plain circular crop instead. Add a job back
   * here if the gilt oval is ever wanted on its own.
   */
];

mkdirSync(OUT, { recursive: true });

for (const job of JOBS) {
  let img = sharp(readFileSync(job.src)).resize({
    width: job.width,
    withoutEnlargement: true,
  });
  if (job.modulate) img = img.modulate(job.modulate);

  const out = path.join(OUT, `${job.name}.webp`);
  const meta = await img
    .webp({ quality: 90, alphaQuality: 100 })
    .toFile(out);
  console.log(`${out}  ${meta.width}x${meta.height}`);
}

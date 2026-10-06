// Dev-only: cut approved doodle icons out of their source sheets, knock the
// white paper out to transparency, tint the line work to the Italy ink
// (#1E231E) and write WebP files to public/italy/art/. Grey shading in the
// source becomes semi-transparent ink, so it keeps its softness on any ground.
//
// Usage: node scripts/process-illustrations.mjs <sourceDir>
//   sourceDir holds the sheet images at the relative paths used below (the Vecteezy
//   previews, or the full-resolution downloads exported to JPG/PNG — if you
//   swap in a bigger export, scale the crop boxes by the same factor).
// Sources + licenses: public/italy/CREDITS.md
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import path from "node:path";

const INK = { r: 0x1e, g: 0x23, b: 0x1e };
const OUT = "public/italy/art";

/* Crop boxes are in source-sheet pixels. `erase` boxes are relative to the
   crop and blank out bits of neighbouring drawings that poke in. */
/* `threshold`: how dark a pixel must be to count as ink (raise it for sheets
   printed on a tinted ground). */
const ICONS = [
  { name: "vespa", sheet: "r2/packB.jpg", box: [1085, 448, 200, 180] },
  { name: "olive", sheet: "r2/packB.jpg", box: [280, 270, 96, 234] },
  { name: "pizza", sheet: "r2/packB.jpg", box: [798, 186, 128, 131], erase: [[92, 116, 36, 15]] },
  { name: "gelato", sheet: "r2/packB.jpg", box: [26, 6, 94, 278] },
  { name: "rings", sheet: "r2/rings.jpg", box: [398, 88, 112, 70] },
  { name: "swallow", sheet: "r2/swallow.jpg", box: [1048, 490, 222, 200] },
  { name: "wineglass", sheet: "r2/packB.jpg", box: [978, 603, 100, 100], erase: [[78, 80, 22, 20]] },
  {
    name: "coupe",
    sheet: "r3/vintage.jpg",
    box: [300, 20, 220, 215],
    threshold: 40,
    erase: [
      [0, 105, 45, 110],
      [148, 118, 72, 97],
    ],
  },
  { name: "espresso", sheet: "r2/packB.jpg", box: [263, 530, 105, 105] },
  { name: "hat", sheet: "r3/summerGrey.jpg", box: [100, 560, 228, 105] },
  { name: "flowers", sheet: "r3/vintage.jpg", box: [580, 180, 120, 280], threshold: 40 },
  {
    name: "boat",
    sheet: "r3/summerBlack.jpg",
    box: [318, 322, 170, 180],
    erase: [
      [0, 0, 8, 180],
      [162, 0, 8, 180],
      [0, 0, 30, 45],
      [135, 0, 35, 45],
    ],
  },
];

const srcDir = process.argv[2];
if (!srcDir) {
  console.error("usage: node scripts/process-illustrations.mjs <sourceDir>");
  process.exit(1);
}
mkdirSync(OUT, { recursive: true });

for (const icon of ICONS) {
  const [left, top, width, height] = icon.box;
  const { data, info } = await sharp(path.join(srcDir, icon.sheet))
    .extract({ left, top, width, height })
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Darkness → alpha. Near-white (paper, JPEG noise) goes fully clear.
  const px = info.width * info.height;
  const rgba = Buffer.alloc(px * 4);
  for (let i = 0; i < px; i++) {
    const x = i % info.width;
    const y = Math.floor(i / info.width);
    const erased = (icon.erase ?? []).some(
      ([ex, ey, ew, eh]) => x >= ex && x < ex + ew && y >= ey && y < ey + eh,
    );
    const dark = erased ? 0 : 255 - data[i * info.channels];
    const t = icon.threshold ?? 18;
    const a = dark < t ? 0 : Math.min(255, Math.round((dark - t) * 1.35));
    rgba[i * 4] = INK.r;
    rgba[i * 4 + 1] = INK.g;
    rgba[i * 4 + 2] = INK.b;
    rgba[i * 4 + 3] = a;
  }

  const out = path.join(OUT, `${icon.name}.webp`);
  const img = sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } }).trim({
    threshold: 1,
  });
  const meta = await img.webp({ quality: 92, alphaQuality: 100 }).toFile(out);
  console.log(`${out}  ${meta.width}x${meta.height}`);
}

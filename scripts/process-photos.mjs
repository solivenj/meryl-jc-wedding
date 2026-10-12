// Dev-only: optimise photographs into public/italy/<subdir> as WebP.
//
// Separate from process-illustrations.mjs on purpose — that one is a crop,
// greyscale, darkness-to-alpha and tint-to-ink pipeline for line art on white
// paper. Run a photograph through it and you get an ink silhouette.
//
// Usage: node scripts/process-photos.mjs <srcDir> <subdir>
//   srcDir  a flat directory of source images (any format sharp reads)
//   subdir  destination under public/italy/ (e.g. "attire")
//
// .rotate() with no argument applies the EXIF orientation and then drops the
// metadata, which also strips GPS — these can be phone originals.
// One size only: next/image generates the responsive set at request time.
import sharp from "sharp";
import { mkdirSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const [srcDir, subdir] = process.argv.slice(2);
if (!srcDir || !subdir) {
  console.error("usage: node scripts/process-photos.mjs <srcDir> <subdir>");
  process.exit(1);
}

const OUT = path.join("public/italy", subdir);
const MAX_EDGE = 1600;
const QUALITY = 80;

mkdirSync(OUT, { recursive: true });

const files = readdirSync(srcDir)
  .filter((f) => statSync(path.join(srcDir, f)).isFile())
  .sort();

const registry = [];
for (const f of files) {
  const name = path.parse(f).name;
  const dest = path.join(OUT, `${name}.webp`);
  try {
    const info = await sharp(path.join(srcDir, f))
      .rotate()
      .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(dest);
    registry.push(`  ${name}: { src: "/italy/${subdir}/${name}.webp", width: ${info.width}, height: ${info.height}, alt: "" },`);
    console.log(`${f} -> ${dest} (${info.width}x${info.height}, ${Math.round(info.size / 1024)}KB)`);
  } catch (err) {
    console.error(`skip ${f}: ${err.message}`);
  }
}

console.log("\n--- paste into lib/italy-art.ts, then fill in each alt ---");
console.log(registry.join("\n"));

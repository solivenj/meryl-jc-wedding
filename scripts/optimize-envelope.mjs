// One-off: compress the supplied envelope PNG (1.9MB) into a webp with
// alpha preserved, sized for its largest render (~560px CSS ≈ 1120px @2x).
import sharp from "sharp";

const meta = await sharp("public/envelope.png").metadata();
console.log("source:", meta.width, "x", meta.height);
const out = await sharp("public/envelope.png")
  .resize({ width: 1200 })
  .webp({ quality: 85, alphaQuality: 90 })
  .toFile("public/envelope.webp");
console.log("wrote public/envelope.webp:", out.width, "x", out.height, out.size, "bytes");

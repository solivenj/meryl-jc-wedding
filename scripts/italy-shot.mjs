// Dev-only: full-page screenshots of every /italy-wedding tab at phone,
// tablet and desktop widths, plus a horizontal-overflow check.
// Usage: node scripts/italy-shot.mjs [baseUrl] [outDir]
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const [base = "http://localhost:3000", outDir = "shots/italy"] = process.argv.slice(2);
const PAGES = ["", "/schedule", "/dress-code", "/stay", "/faq", "/rsvp"];
const WIDTHS = [390, 768, 1440];

mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
for (const width of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  for (const p of PAGES) {
    await page.goto(`${base}/italy-wedding${p}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    const name = `${p.slice(1) || "home"}-${width}.png`;
    await page.screenshot({ path: `${outDir}/${name}`, fullPage: true });
    console.log(name, overflow > 0 ? `OVERFLOW ${overflow}px` : "ok");
  }
  await ctx.close();
}
await browser.close();

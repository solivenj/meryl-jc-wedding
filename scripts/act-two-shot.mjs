// Dev-only: open the envelope, scroll through Act II (triggering reveals),
// then capture a full-page screenshot.
// Usage: node scripts/act-two-shot.mjs <out.png> [width] [height]
import { chromium } from "playwright";

const [out, w = "1440", h = "900"] = process.argv.slice(2);
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: Number(w), height: Number(h) } });
const page = await ctx.newPage();
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(3400);
await page.locator("button[aria-label*='open the save the date']").click();
await page.waitForTimeout(1400); // fade-out + Act II fade-in complete

// Scroll through so every whileInView (once: true) fires and settles.
const total = await page.evaluate(() => document.body.scrollHeight);
for (let y = 0; y <= total; y += Math.round(Number(h) * 0.7)) {
  await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
  await page.waitForTimeout(650);
}
await page.waitForTimeout(1200);
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(400);
await page.screenshot({ path: out, fullPage: true });
await browser.close();
console.log("saved", out);

// Dev-only screenshot helper for visual verification (PRD §7).
// Usage: node scripts/shot.mjs <url> <out.png> <width> <height> [delayMs] [reduced] [full]
import { chromium } from "playwright";

const [url, out, w, h, delay = "1200", reduced = "", fullpage = ""] = process.argv.slice(2);
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: Number(w), height: Number(h) },
  deviceScaleFactor: 1,
  reducedMotion: reduced === "reduced" ? "reduce" : "no-preference",
});
const page = await ctx.newPage();
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(Number(delay));
await page.screenshot({ path: out, fullPage: fullpage === "full" });
await browser.close();
console.log("saved", out);

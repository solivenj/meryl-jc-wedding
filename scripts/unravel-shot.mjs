// Dev-only: drive the open interaction and capture unravel frames (PRD §7).
// Usage: node scripts/unravel-shot.mjs <outdir> [reduced|keyboard]
import { chromium } from "playwright";

const [outdir, mode = ""] = process.argv.slice(2);
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: mode === "reduced" ? "reduce" : "no-preference",
});
const page = await ctx.newPage();
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(3400); // let the entrance finish

if (mode === "keyboard") {
  await page.keyboard.press("Tab"); // focus the envelope button
  await page.screenshot({ path: `${outdir}/unravel-focus.png` });
  await page.keyboard.press("Enter");
} else {
  await page.locator("button[aria-label*='open the save the date']").click();
}

const frames = mode === "reduced" ? [200, 600] : [300, 700, 1000, 1350, 1750, 2100, 2900];
let elapsed = 0;
for (const t of frames) {
  await page.waitForTimeout(t - elapsed);
  elapsed = t;
  await page.screenshot({ path: `${outdir}/unravel-${mode || "pointer"}-${t}.png` });
}
await browser.close();
console.log("done");

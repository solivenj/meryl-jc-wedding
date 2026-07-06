// Dev-only: click open, wait exactly <ms>, screenshot once (no drift).
// Usage: node scripts/open-frame.mjs <out.png> <msAfterClick> [reduced|keyboard]
import { chromium } from "playwright";

const [out, ms, mode = ""] = process.argv.slice(2);
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: mode === "reduced" ? "reduce" : "no-preference",
});
const page = await ctx.newPage();
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(3400);

if (mode === "keyboard") {
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
} else {
  await page.locator("button[aria-label*='open the save the date']").click();
}
await page.waitForTimeout(Number(ms));
await page.screenshot({ path: out });
await browser.close();
console.log("saved", out);

// Dev-only: measure the inline envelope SVG payload (PRD budget: < ~40KB).
import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await (await browser.newContext()).newPage();
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
const bytes = await page.evaluate(() => {
  const svg = document.querySelector("button[aria-label*='open the save the date'] svg");
  return svg ? new Blob([svg.outerHTML]).size : -1;
});
console.log("envelope svg bytes:", bytes);
await browser.close();

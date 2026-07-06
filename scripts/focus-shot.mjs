// Dev-only: Tab to the envelope button and capture the focus ring.
import { chromium } from "playwright";

const [out] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(3400);
await page.keyboard.press("Tab");
await page.waitForTimeout(300);
await page.screenshot({ path: out });
await browser.close();
console.log("saved", out);

// Dev-only: checks the entrance after the Italy password is accepted.
// Types the real word into the gate, submits, and confirms the gate hands
// off through a view transition with the couple's names named on both sides.
//
// What it cannot check: the Italy page's side of the transition. Headless
// Chromium on this machine never paints the incoming page of ANY
// cross-document view transition (a bare two-page example stalls the same
// way), so watching the glide itself needs a real Chrome window.
//
// Usage: node scripts/entrance-check.mjs [baseUrl]
// Reads GATE_PASSWORD_ITALY from the environment, or from .env.local.
import { chromium } from "playwright";
import { readFileSync, existsSync } from "node:fs";

const base = process.argv[2] || "http://localhost:3000";
let word = process.env.GATE_PASSWORD_ITALY;
if (!word && existsSync(".env.local")) {
  word = readFileSync(".env.local", "utf8").match(/^GATE_PASSWORD_ITALY=(.*)$/m)?.[1]?.trim().replace(/^["']|["']$/g, "");
}
if (!word) throw new Error("set GATE_PASSWORD_ITALY");

const results = [];
const check = (name, why) => results.push(why ? `FAIL ${name}: ${why}` : `PASS ${name}`);

const browser = await chromium.launch();
for (const reducedMotion of ["no-preference", "reduce"]) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion });
  // Record, on every page, whether it was revealed through a view transition.
  await ctx.addInitScript(() => {
    addEventListener("pageswap", (e) => {
      try {
        sessionStorage.setItem("__swap", JSON.stringify({ from: location.pathname, viewTransition: !!e.viewTransition }));
      } catch {}
    });
    window.__optedIn = () =>
      [...document.styleSheets].some((s) => {
        try {
          return [...s.cssRules].some((r) => r.cssText.startsWith("@view-transition"));
        } catch {
          return false;
        }
      });
  });
  const page = await ctx.newPage();
  await page.goto(`${base}/`, { waitUntil: "networkidle" });
  const gate = await page.evaluate(() => ({
    name: getComputedStyle(document.querySelector("h1")).viewTransitionName,
    optedIn: window.__optedIn(),
  }));
  await page.fill("input", word);
  await Promise.all([page.waitForURL(/\/italy/), page.click("button[type=submit]")]);
  await page.waitForTimeout(800);
  const arrived = await page.evaluate(() => ({
    swap: JSON.parse(sessionStorage.getItem("__swap") || "null"),
    optedIn: window.__optedIn(),
    headerName: getComputedStyle(document.querySelector("header a")).viewTransitionName,
  }));
  if (reducedMotion === "no-preference") {
    check("gate opts into page transitions", gate.optedIn ? "" : "no @view-transition rule on the gate");
    check("italy opts into page transitions", arrived.optedIn ? "" : "no @view-transition rule on /italy");
    check("gate names are named for the transition", gate.name === "couple-names" ? "" : `gate h1 is ${gate.name}`);
    check("italy header names are named for the transition", arrived.headerName === "couple-names" ? "" : `header is ${arrived.headerName}`);
    check("the gate hands off through a view transition", arrived.swap?.from === "/" && arrived.swap.viewTransition ? "" : `pageswap: ${JSON.stringify(arrived.swap)}`);
  } else {
    check("reduced motion: names are not carried over", arrived.headerName === "none" ? "" : `header is ${arrived.headerName}`);
  }
  await ctx.close();
}
await browser.close();
console.log(results.join("\n"));
if (results.some((r) => r.startsWith("FAIL"))) process.exitCode = 1;

# Our Story Road Trip Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace `/italy/our-story` with the scroll-driven road trip from the approved prototype, looking as close to it as possible.

**Architecture:** The route geometry and scroll mapping are pure TypeScript (`route.ts`, unit-tested with `node --test`). The drawings are the prototype's SVG markup strings, moved into small art modules and injected once. A framework-free engine (`engine.ts`) measures paths and writes transforms and attributes to the DOM each frame. A thin `"use client"` component owns the sticky stage, the scroll read and the rAF loop. A server page renders the real story text, the drive, and a plain fallback that CSS swaps in for reduced motion and no-JS.

**Tech Stack:** Next 16.2.10 App Router, React 19.2, Tailwind 4, `next/font/google`, `node:test` on Node 24 (native type stripping), Playwright (already a devDependency) for parity screenshots.

**Spec:** `docs/superpowers/specs/2026-11-11-our-story-road-trip-design.md`. Visual spec: `docs/superpowers/specs/2026-11-11-our-story-road-trip/prototype.html` (called **the prototype** below). Executors read both.

## Global Constraints

- The prototype is the visual spec. Copy constants, path data, drawing markup, timings and CSS values from it **verbatim**. A number changes only to fix a bug, with a comment saying why.
- When a visible change seems necessary, stop and ask Meryl and John. Do not decide it.
- Never mention the church wedding, "getting married twice", another ceremony, or whether Meryl and John live together or apart, anywhere: copy, alt text, aria labels, shipped comments.
- No new runtime dependencies. `motion` 12.42.2 is already installed. Fonts come from `next/font/google`.
- Native scrolling only. Never intercept wheel or touch events or set the scroll position, except when a stop button is clicked.
- No React state updates per frame. One rAF loop writes to refs.
- New colour tokens live under a `.road-trip` scope, never in `@theme` or `.theme-italy`.
- Before writing client boundaries, fonts or images, read the matching guide in `node_modules/next/dist/docs/` (AGENTS.md: "This is NOT the Next.js you know").
- Engine constants come from the prototype: `SCALE_W = 0.72`, smoothing `0.11`, narrow breakpoint stage width `< 900`, camera anchors `.58` (wide) and `.36` (narrow), scale `min(SW/1200, 1.25)` wide and `clamp(SW/700, .5, .8)` narrow.
- The prototype's olive header rail and its "gameplan" `<main class="plan">` section do not ship.
- `/italy` sits behind the password gate. Screenshot scripts unlock it with `GATE_PASSWORD_ITALY`, the way `scripts/italy-shot.mjs` does.

## Review Focus

1. **Resizing or rotating a phone mid-drive.** The camera re-centres on the car and the narrow layout switches cleanly. Pinned by `resize mid-drive` in Task 7.
2. **Landing mid-page**, through reload scroll restoration, a stop button or a fast fling. The first frame already shows that stop's full state: stamps, tally, chip, odometer unit. Pinned by `restored scroll` in Task 7.
3. **Scrolling backwards through set pieces.** Stamps, ring, keys, tally and the KM/MI unit all reverse. Pinned by `locate is monotonic and reversible` in Task 1 and `scroll back` in Task 7.
4. **Final copy longer than the placeholders.** No chapter text overflows its slot onto drawings. Pinned by `copy fit` in Task 7.
5. **Short phone viewports** (390×600, address bar shown). The docked card never covers the car. Pinned by `card clears car` in Task 7.

---

## File Structure

| File | Responsibility |
|---|---|
| `components/italy/road/route.ts` | Pure: geometry constants, leg/hairpin/arc helpers, the ordered `PIECES` table, cumulative weights, `locate(p)`, `chapterStart(ch)`, `odometerReading(...)`. No imports. |
| `components/italy/road/art/kit.ts` | Pure: the prototype's drawing helpers (`greenSign`, `itArrow`, `cypress`, `olive`, `palm`, `waves`, `stamp`, `up`, `dn`, `TERRA`), returning SVG markup strings. Imports `route.ts`. |
| `components/italy/road/art/*.ts` | Pure: one file per scene returning markup strings: `backdrop`, `prologue`, `boston`, `distance`, `italy22`, `chicago`, `halfStops`, `thanksgiving`, `crossing`, `umbria`, `todi`, `fx` (heart, ring, keys), `defs` (car bodies, wheels, mask). |
| `components/italy/road/art/index.ts` | `sceneryMarkup()`, `backdropMarkup()`, `fxMarkup()`, `defsMarkup()`: the concatenations in prototype order. |
| `components/italy/road/engine.ts` | DOM-only, framework-free: `createDrive(els, opts)` returns `{ render(p), layout(), destroy() }`. A port of the prototype's measure, roads, vehicles, set pieces, HUD writes, camera and tint. |
| `components/italy/road/RoadTrip.tsx` | `"use client"`: renders the sticky stage, world `<svg>` (art injected), text `foreignObject`s, HUD markup. Wires the engine, scroll read, smoothing and rAF loop. Adds `road-ready` once running. |
| `components/italy/road/StoryFallback.tsx` | Server: alternating `Band`s with the story text (spec §9). |
| `components/italy/road/fonts.ts` | `next/font/google` Overpass (700, 800) and Titillium Web (600, 700) as CSS variables. |
| `components/italy/road/road.css` | The prototype's stage, world-text, HUD, card and chip CSS, scoped under `.road-trip`. Imported by `RoadTrip.tsx`. |
| `lib/italy-content.ts` | `ITALY_STORY` reshaped (spec §8). |
| `app/italy/our-story/page.tsx` | Composes the sr-only `h1`, `RoadTrip`, and `StoryFallback` (the single accessible copy, visually hidden unless reduced motion or no JS). |
| `tests/road/*.test.ts` | `node --test` unit tests. |
| `scripts/road-shot.mjs` | Prototype vs page paired screenshots plus the behaviour checks in Task 7. |
| `package.json`, `tsconfig.json` | `"test"` script, `allowImportingTsExtensions`. |

---

### Task 1: Route table and test harness

**Files:**
- Create: `components/italy/road/route.ts`, `tests/road/route.test.ts`
- Modify: `package.json` (add `"test": "node --test tests/"`), `tsconfig.json` (add `"allowImportingTsExtensions": true`; it is valid because `noEmit` is set)

**Interfaces:**
- Produces:
  - Constants: `W=1200, H=4880, XL=160, XR=1040, RISE=220, HP=240, STEP=460, Y0=4400, SCALE_W=0.72, PZ={x:560,y:580}`
  - `type Pt = { x: number; y: number }`
  - `legStart(i: number): Pt`, `legEnd(i): Pt`, `legPt(i, f): Pt`, `legY(i, x): number`
  - `hairpinSeg(i): string`, `arcSeg(a: Pt, b: Pt, lift: number): string`, `lineSeg(p: Pt): string`, all exactly as in the prototype's `hairpin`, `arcSeg` and `L`
  - `type PieceKind = "spur" | "road" | "flight" | "pause"`
  - `type Piece = { kind: PieceKind; w: number; ch: number; from?: Pt; seg?: string; ease?: "in" | "out" | "io"; tag?: string; car?: "us" | "it" }`, where `w` is already multiplied by `SCALE_W`
  - `PIECES: readonly Piece[]`: the prototype's `add(...)` list, in order (28 pieces)
  - `SPURS: { a: string; b: string }`: the two spur path `d` strings
  - `CUM: number[]` (length 29), `TOTAL_W: number`
  - `locate(p: number): { i: number; t: number }`, clamped to `[0, 1]`
  - `chapterStart(ch: number): number`, the progress where chapter `ch` first appears
  - `ease(kind: Piece["ease"], t: number): number`, the prototype's `easeOut`, `easeIn` and `easeIO`
  - `odometerReading(o: { i: number; t: number; roadUnits: number }): { value: number; unit: "MI" | "KM" }`. The prototype's rule: `miles = roadUnits*.36 + (long ? t*2100 : past long ? 2100 : 0)`. KM when on `italy22` or at/after `landed`, then `value = miles*1.609`.
  - `pieceIndex(tag: string): number`

- [ ] **Step 1: Write the failing tests** in `tests/road/route.test.ts`, importing `../../components/italy/road/route.ts`:
  - `PIECES has 28 pieces and ends with park`: `PIECES.length === 28`, `PIECES.at(-1).tag === "park"`, `PIECES[0].kind === "spur"`
  - `weights are the prototype's`: `Math.abs(TOTAL_W - 28.8 * 0.72) < 1e-9`, and `PIECES[pieceIndex("long")].w === 3.0 * 0.72`
  - `hairpins join legs`: for `i` in 1..7, the last two numbers of `hairpinSeg(i)` equal `legStart(i+1).x, legStart(i+1).y`
  - `pieces are continuous`: for every consecutive pair of non-pause, non-spur pieces, `next.from` equals the end point parsed from `prev.seg` (last two numbers) to 0.1
  - `locate bounds`: `locate(0)` gives `{ i: 0, t: 0 }`; `locate(1)` gives `{ i: 27, t: 1 }`; `locate(-1)` equals `locate(0)`; `locate(2)` equals `locate(1)`
  - `locate is monotonic and reversible`: sampling p from 0 to 1 in steps of 0.001, `i` never decreases, and `t` never decreases within the same `i`
  - `chapter starts`: `chapterStart(0) === CUM[1] / TOTAL_W`, and for ch 0–9 each start is strictly greater than the previous one
  - `odometer`: `odometerReading({ i: pieceIndex("long"), t: .5, roadUnits: 0 })` gives `{ value: 1050, unit: "MI" }`; on `italy22` gives `unit: "KM"`; on `flyhome` gives `"MI"`; on `landed` gives `"KM"`; at `park`, `value` equals `(roadUnits*.36 + 2100) * 1.609`
- [ ] **Step 2: Run** `npm test`. Expected: FAIL, cannot find module `route.ts`.
- [ ] **Step 3: Implement `route.ts`** by porting the prototype's `route geometry` block and its `pcs` list. `fA3`, `fB3`, `fA7` and `fB7` are `legPt(3,.13)`, `legPt(3,.33)`, `legPt(7,.22)` and `legPt(7,.78)`. `fly3`'s segment is the literal C-curve from the prototype, not `arcSeg`. The final climb segment is `C 50 932 300 600 560 580`. Pauses carry `car` from the previous moving piece.
- [ ] **Step 4: Run** `npm test`. Expected: all pass. Run `npx tsc --noEmit`. Expected: no errors.
- [ ] **Step 5: Commit**: `git add components/italy/road/route.ts tests/road package.json tsconfig.json` with the message "Add the road-trip route table and its tests".

### Task 2: Story content and the fallback page

**Files:**
- Modify: `lib/italy-content.ts` (replace the `ITALY_STORY` type and value), `app/italy/our-story/page.tsx`
- Create: `components/italy/road/StoryFallback.tsx`

**Interfaces:**
- Produces in `lib/italy-content.ts`:
  ```ts
  export type StopChipStyle = "" | "olive" | "eu" | "it" | "brown" | "stamp";
  export type StoryStop = {
    id: "boston" | "distance" | "italy-2022" | "chicago" | "bali" | "spain" | "thanksgiving" | "crossing" | "umbria";
    kicker: string; heading: string; body: string;
    chip: { text: string; style: StopChipStyle };
    half?: boolean;
  };
  export const ITALY_STORY: {
    title: { kicker: string; tagline: string; cue: string };
    stops: StoryStop[];                         // 9, in drive order; index = route chapter 0–8
    halfStops: { kicker: string; heading: string; body: string };
    closing: { kicker: string; line: string; dates: string; chip: { text: string; style: StopChipStyle } };
  };
  ```
  The chapter number used by `route.ts` equals the stop's index, and the closing is chapter 9.
- Produces: `StoryFallback(): JSX.Element` (server, no props; reads `ITALY_STORY`)

- [ ] **Step 1: Replace `ITALY_STORY`.** Copy every string from the prototype's `CH` array, title block, half-stop block and closing into the new shape. Chip texts and styles also come from `CH`. Keep the existing "Never mention the New Jersey church wedding…" guard comment above the stops. Delete the old `eyebrow`, `intro` and `chapters` fields and their comments.
- [ ] **Step 2: Write `StoryFallback`** to spec §9: `Band`s alternating cream and band, first and last cream, one per stop (Bali and Spain share one using `halfStops`). Each band holds `SmallCaps` kicker, `ScriptTitle` heading and `Prose` body, centred. The closing line and `closing.dates` end the page.
- [ ] **Step 3: Point `page.tsx` at it.** For now the page renders `<h1 className="sr-only">Our story</h1>` plus `<StoryFallback />`. Keep `metadata = { title: "Our Story" }`. Delete the `PHOTOS` array and `Closing`.
- [ ] **Step 4: Verify** with `npx tsc --noEmit` and `npm run lint` (both clean). Start `npm run dev`, open `/italy/our-story` (unlock the gate) and confirm the 9 stops plus the closing render in alternating bands. Then search the page text for `church` and `twice`: no matches.
- [ ] **Step 5: Commit** with the message "Reshape the Our Story content for the road trip, with a plain fallback page".

### Task 3: Drawing modules

**Files:**
- Create: `components/italy/road/art/{kit,defs,backdrop,prologue,boston,distance,italy22,chicago,halfStops,thanksgiving,crossing,umbria,todi,fx,index}.ts`, `tests/road/art.test.ts`

**Interfaces:**
- Consumes: `route.ts` exports (import with the `.ts` extension).
- Produces from `art/index.ts`: `defsMarkup(): string`, `backdropMarkup(): string`, `sceneryMarkup(): string`, `fxMarkup(): string`, `longArcD(): string` (the long-distance flight arc `d`).

- [ ] **Step 1: Write the failing tests** in `tests/road/art.test.ts`:
  - `scenery has every stop's landmarks`: `sceneryMarkup()` contains `BOSTON, MA`, `NEU`, `CHARLES RIVER`, `PACIFIC`, `>80<`, `POSITANO`, `ATLANTIC`, `ITALIA`, `TODI  3`, `S. MARGHERITA`, `id="tally"`, `id="family"`, `id="town"`, `CA</text>` and `NJ</text>`
  - `fx has every animated element`: `fxMarkup()` contains `id="heart"`, `id="ring"`, `id="sparks"`, `id="keys"`, `id="keysTxt"`, `id="stIt22"`, `id="stBali"`, `id="stSpain"` and `id="stIt27"`
  - `defs has the vehicles`: `defsMarkup()` contains `id="carBody"`, `id="itBody"`, `id="wheel"`, `id="wheelS"`, `id="reveal"` and `id="revealPath"`
  - `no arrivals board or med school sign`: `sceneryMarkup()` contains neither `ARRIVALS` nor `MED SCHOOL`
  - `content rules`: the combined markup, lowercased, contains none of `church`, `twice` or `moved in`
- [ ] **Step 2: Run** `npm test`. Expected: FAIL, the modules are missing.
- [ ] **Step 3: Port the markup.** Move each `/* ---------- N. … ---------- */` block of the prototype script into its module, as a function returning the concatenated strings it currently passes to `html(...)`. Split the strings by where they go: `sc` → scenery, `bd` → backdrop, `fx` → fx. The `<defs>` children of the prototype's `<svg>` go into `defsMarkup()`. Copy the template strings character for character. Where the prototype calls `el(...)` to build the long arc, return its `d` from `longArcD()` instead.
- [ ] **Step 4: Run** `npm test`. Expected: pass.
- [ ] **Step 5: Commit** with the message "Port the road-trip drawings into art modules".

### Task 4: Stage, fonts, styles and the static world

**Files:**
- Create: `components/italy/road/fonts.ts`, `components/italy/road/road.css`, `components/italy/road/RoadTrip.tsx`
- Modify: `app/italy/our-story/page.tsx`

**Interfaces:**
- Consumes: `art/index.ts` (Task 3), `ITALY_STORY` (Task 2), `route.ts` constants, and the `ITALY.names` field.
- Produces: `RoadTrip(): JSX.Element`, a `"use client"` component. In this task it renders the static world only. The DOM hooks Task 5 relies on are: section `#drive`; `.stage`; `svg#world` with `viewBox="0 0 1200 4880"`; groups `#backdrop`, `#road` (containing `#roadFaint` and `#roadInk[mask=url(#reveal)]`), `#scenery`, `#texts`, `#fx`, `#vehicles` and `#measure[visibility=hidden]`; HUD `#chip`, `#chipSub`, `#stops`, `#digits`, `#unit` and `#card` (`.k`, `h3`, `.b`); and the `.skip` link. Same ids as the prototype.

- [ ] **Step 1: Read the docs.** Read `node_modules/next/dist/docs/` on font loading and on client components. Write `fonts.ts`, exporting `overpass` and `titillium` with `variable: "--font-overpass"` and `variable: "--font-titillium"`, weights 700/800 and 600/700, `display: "swap"`.
- [ ] **Step 2: Write `road.css`** by copying the prototype's `<style>` rules for `.drive`, `.stage`, `#world`, `.post`, `.hwy`, `.itx`, `.ln`, `.ln-thin`, `.paper`, `.pf`, `.leaf`, `.lf`, `.cap`, `.wt*`, `.hud-sign`, `.chip*`, `.odo*`, `.stops*`, `.skip`, `.card*` and `.narrow *`, plus the reduced-motion block. Prefix every selector with `.road-trip`. Put the prototype's `:root` tokens on `.road-trip`, mapping them to site tokens per spec §7. Map the fonts like this: `--f-script` to `var(--font-pinyon)`, `--f-caps` to `var(--font-baskerville)`, `--f-body` to `var(--font-cormorant)`, `--f-hwy` to `var(--font-overpass)` and `--f-it` to `var(--font-titillium)`, each with the prototype's fallbacks. Do not copy `.rail`, `.btn`, `.plan` or anything below them.
- [ ] **Step 3: Write `RoadTrip.tsx`.** The root is `<div className={\`road-trip ${overpass.variable} ${titillium.variable}\`}>` containing the prototype's `<section class="drive">` markup. Inject `defsMarkup()`, `backdropMarkup()`, `sceneryMarkup()` and `fxMarkup()` into their groups with `dangerouslySetInnerHTML`; this is static markup we author. Render the text slots from spec §6.8 as `<foreignObject>` elements using `ITALY_STORY` copy, with `data-ch` values `0`, `1`, `2`, `3`, `4,5`, `6`, `7`, `8` and `9`. The title uses `ITALY.names`. Mark the stage `aria-hidden="true"`, except the skip link and stop buttons, which stay focusable: put `aria-hidden` on the svg and HUD readouts, not on the whole stage.
- [ ] **Step 4: Mount it** in `page.tsx` above `<StoryFallback />` for now.
- [ ] **Step 5: Verify.** `npx tsc --noEmit` and `npm run lint` are clean. On the dev server at 1440×900, the page shows the world's first frame without JS motion: roads drawn faint, all scenery, the title under the merge, the HUD. Screenshot it next to the prototype at p=0 by opening both and comparing by eye: same drawings, same places.
- [ ] **Step 6: Commit** with the message "Render the road-trip stage and static world".

### Task 5: The drive engine

**Files:**
- Create: `components/italy/road/engine.ts`
- Modify: `components/italy/road/RoadTrip.tsx`

**Interfaces:**
- Consumes: `route.ts` (`PIECES`, `CUM`, `TOTAL_W`, `locate`, `ease`, `odometerReading`, `chapterStart`, `pieceIndex`, `SPURS`, constants), `longArcD()`, the DOM ids from Task 4, and `ITALY_STORY` (for card copy and chips).
- Produces: `createDrive(root: HTMLElement, story: typeof ITALY_STORY, opts: { reduceMotion: boolean }): { render(p: number): void; layout(): void; destroy(): void }`

- [ ] **Step 1: Port into `createDrive`**, in prototype order: measuring pieces into hidden paths; building `fullD`/`roadD` and the road layers; spur ink; the reveal mask dasharray; the four car instances and the planes (`makeCar`, `placeCar`, `placePlane`); odometer digit strips and `setOdo`; stop buttons (labels from `heading`, `half` class, smooth-scroll click to `chapterStart(i) + .002`, `behavior: "auto"` when `reduceMotion`); `setChapter`; `layout`; and `render(p)`, with all set pieces, the camera, the park lift and the background tint. Replace the prototype's `CH` reads with `story` reads. Chapter 9's chip comes from `story.closing.chip`, and the card shows `story.closing.line`. `destroy()` removes the resize listener and the stop-button listeners.
- [ ] **Step 2: Wire it in `RoadTrip.tsx`.** A `useEffect` creates the drive, reads progress from `#drive`'s rect exactly like the prototype's `target()`, smooths it by `0.11` per frame (snap below `1e-5`), skips the render when unchanged, and runs one rAF loop. Cleanup cancels the rAF and calls `destroy()`. After the first render, add `road-ready` to the root.
- [ ] **Step 3: Write `scripts/road-shot.mjs`.** Usage: `node scripts/road-shot.mjs [baseUrl] [outDir]`. It opens the prototype by its file URL and `${baseUrl}/italy/our-story` (unlocking the gate as `italy-shot.mjs` does). For viewports 1440×900 and 390×844, and progress values `0, .06, .2, .33, .42, .507, .57, .677, .785, .87, 1`, it scrolls each page so `#drive` is at that progress, waits 1600 ms, and saves `proto-{w}-{p}.png` and `page-{w}-{p}.png`.
- [ ] **Step 4: Verify.** Run it against the dev server, then open each pair. Expected: every pair matches in composition, positions, sizes and colours. Only the site header and footer show at p=0 and p=1, and copy changes are allowed. Fix any drift by comparing against the prototype source, never by eye-tuning.
- [ ] **Step 5: Verify behaviour by hand.** Drive slowly through every stop. The ink follows the car, the cars turn at hairpins, the plane swaps in on all three flights, the tally reaches 5, all four stamps pop, the ring rises and the heads bob, the keys swing, KM/MI flips at the right places, and scrolling back reverses all of it.
- [ ] **Step 6: Commit** with the message "Drive the road trip from scroll".

### Task 6: Accessibility, fallbacks and the final page

**Files:**
- Modify: `app/italy/our-story/page.tsx`, `components/italy/road/road.css`

**Interfaces:**
- Consumes: `RoadTrip`, `StoryFallback`, `ITALY_STORY`.

- [ ] **Step 1: Compose `page.tsx`** as: `<h1 className="sr-only">Our story</h1>`, then `<RoadTrip />`, then `<div className="road-fallback"><StoryFallback /></div>`. The fallback is the **one** accessible copy of the story. The drive's svg and readouts stay `aria-hidden` (Task 4).
- [ ] **Step 2: Add the switching CSS** to `road.css`. By default, `.road-fallback` gets the `sr-only` treatment (visually hidden, still read by assistive tech) and the drive shows. That way JS users never see the fallback flash on load. Under `@media (prefers-reduced-motion: reduce)`, `.road-trip { display: none }` and `.road-fallback` becomes visible (undo the sr-only styles). For no JavaScript, put a `<noscript><style>` in `page.tsx` with the same two rules. `RoadTrip` skips creating the engine when `matchMedia('(prefers-reduced-motion: reduce)').matches`. Drop the `road-ready` class from Task 5 if nothing else needs it.
- [ ] **Step 3: Point "Skip the drive"** at the footer (`href="#site-footer"`) and add `id="site-footer"` to the footer in `app/italy/layout.tsx`.
- [ ] **Step 4: Verify.** In Chrome DevTools: (a) with JavaScript disabled, the fallback shows the whole story; (b) emulating `prefers-reduced-motion: reduce`, the fallback shows and no rAF loop runs (Performance panel); (c) in the Accessibility pane, the story is exposed exactly once, in order, both with the drive showing and under reduced motion; (d) tabbing reaches "Skip the drive" and the stop buttons, and activating a stop lands on it. `npm run build` passes.
- [ ] **Step 5: Commit** with the message "Add the road trip's accessible copy and fallbacks".

### Task 7: Behaviour checks and sign-off

**Files:**
- Modify: `scripts/road-shot.mjs` (add a `--checks` mode)

- [ ] **Step 1: Add checks** to `road-shot.mjs --checks`, each printing `PASS` or `FAIL <reason>`. "The car" means the `#vehicles > g` child whose `opacity` attribute is `1`.
  - `resize mid-drive`: at 1440×900, go to p=.42, resize to 390×844, wait 1600 ms. The `#vehicles` car's bounding rect is fully inside the viewport and `.stage` has class `narrow`.
  - `restored scroll`: go to p=.84 (the hairpin after landing in 2027), reload, wait 1600 ms. `#chip` text equals `ITALY_STORY.stops[7].chip.text`, the opacity of `#stIt22`, `#stBali`, `#stSpain` and `#stIt27` is `1`, and `#unit` reads `KM`.
  - `scroll back`: go to p=1, then to p=.3. The opacity of `#stIt27` and `#stBali` is `0`, `#unit` is `KM` (inside Italy 2022), and the tally's 5th stroke opacity is `1`. Then go to p=.15: tally strokes with opacity 1 number fewer than 5.
  - `copy fit`: at 1440×900, every `#texts foreignObject > div` has `scrollHeight <= foreignObject.height.baseVal.value`.
  - `card clears car`: at 390×600, for p in `.06, .33, .42, .677, .87`, the car's rect does not intersect `#card`'s rect.
  - `content`: the page's `document.body.innerText`, lowercased, contains none of `church`, `twice`, `moved in`, `live together`, `living together`.
  - `no overflow`: `document.documentElement.scrollWidth <= innerWidth` at 390, 768 and 1440.
- [ ] **Step 2: Run** `node scripts/road-shot.mjs http://localhost:3000 shots/road --checks`. Expected: every line PASS. Fix failures in the owning task's files.
- [ ] **Step 3: Check speed.** In the Chrome Performance panel, with 4× CPU slowdown at 390×844, record a scroll through the whole drive. Expected: no long tasks over 50 ms during scrolling and no layout events per frame.
- [ ] **Step 4: Run the full checks.** `npm test`, `npm run lint` and `npm run build` all pass. Also run `node scripts/italy-shot.mjs` with its overflow check clean.
- [ ] **Step 5: Hand over** the paired screenshots (`shots/road/proto-*` and `page-*`) to Meryl and John for review before merge.
- [ ] **Step 6: Commit** with the message "Add road-trip behaviour checks".

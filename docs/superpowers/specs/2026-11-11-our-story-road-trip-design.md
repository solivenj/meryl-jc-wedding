# Our Story as a road trip: design

**Status:** approved design, ready for an implementation plan
**Date:** 2026-11-11
**Page:** `/italy/our-story` on branch `feat/italy-collage`
**Visual spec:** [`2026-11-11-our-story-road-trip/prototype.html`](2026-11-11-our-story-road-trip/prototype.html), which is version 3 of the approved prototype, also published at https://claude.ai/artifact/H4XiCVr87jW4emXNfbd5i2.

---

## 1. What this is, and why

The Our Story page on the Italy site is being rebuilt as a scroll-driven road trip. A small hand-drawn car climbs a switchback road up a hill, one stretch of road per part of Meryl and John's life, and parks in the piazza of Todi at the top. Scrolling down drives the car forward and the world slides down past it, so the reader feels the climb.

The inspiration was helenandjoshsittinginatree.com: one long hand-drawn scene the reader climbs through, with big lettering and small props at each stop. This page swaps the tree for a road. That fits the wedding: Todi is a hill town, the roads up to Umbrian hill towns really do switch back and forth, and the existing Todi copy already ends on guests putting the car keys away.

Meryl and John want it to be extremely high quality and unlike any other wedding site. They have approved the prototype and want the built page to look **as close to it as possible**. That is the governing requirement of this whole document.

## 2. Goals, non-goals, anti-goals

**Goals**

- The built page looks and behaves like the prototype at every stop, on a laptop and on a phone.
- The story reads in order: NJ and CA merge, Boston, the long-distance years, Italy 2022, Chicago, the Bali and Spain half stops, Thanksgiving 2025, the crossing, Umbria, then arrival in Todi.
- Scrolling stays smooth on a mid-range phone.
- Every word of the story is real text in the HTML: readable by screen readers, findable, copyable.
- The copy lives in `lib/italy-content.ts` so Meryl and John can edit it without touching drawing code.

**Non-goals**

- No sound. The couple decided this.
- No CMS or admin. Copy changes are edits to `lib/italy-content.ts`.
- No redraw of the drawings in the Vecteezy doodle style used on other Italy pages. The couple compared both and chose the prototype's own style. The build must not "upgrade" the art.
- The prototype's olive header rail ("The road to Todi") and its "gameplan" section below the drive are prototype-only. They do not ship.

**Anti-goals: things that would make this a failure even if it technically works**

- The page drifts visibly from the prototype: re-laid-out stops, re-proportioned drawings, different fonts or colours, different pacing.
- Anything on the page mentions the New Jersey church wedding, "getting married twice", or another ceremony. Some Italy guests were not invited to it and must not find out from this site.
- Anything says or implies whether Meryl and John live together or apart.
- Scroll-jacking. The page must use native scrolling. It must never intercept wheel or touch events or hijack the scroll position.
- Jank: visible stutter while scrolling, or React re-rendering on every frame.

## 3. The prototype is the spec

`docs/superpowers/specs/2026-11-11-our-story-road-trip/prototype.html` is a single self-contained file. Open it in a browser and scroll to drive it. It contains, as working code:

- every coordinate: the road geometry, every drawing, every text block position
- every scroll weight, easing curve and timing
- the camera rules for desktop and phone
- every drawing, as inline SVG
- the HUD: road-sign label, odometer, stop dots
- the colours and type

**Rules for the build:**

1. Port, don't redesign. Constants, path data and drawing markup are copied from the prototype as-is. A number changes only to fix a bug, and the doc notes the fix.
2. Where this document and the prototype disagree about anything you can **see**, the prototype wins. Where they disagree about **behaviour or constraints** (content rules, accessibility, fallbacks, performance), this document wins.
3. The only planned visible differences are in §14: real copy, real photos, and the site's own header and footer around the page.
4. If a change is needed during the build that would visibly alter the design, stop and ask Meryl and John. Don't decide it.

The prototype's script is plain JavaScript in one IIFE. Section 6 below explains each system so the builder can find things quickly. The prototype holds the exact numbers.

## 4. Content rules

These come from the couple and apply to every string on the page, including alt text, aria labels and code comments that might ship.

- **Never mention the church wedding.** No "New Jersey wedding", "the church", "getting married twice", "the other ceremony", "one of the two". The reason given for Italy is their 2022 trip. A comment in `lib/italy-content.ts` already guards this, and the live Todi chapter was fixed on 2026-11-10 (uncommitted at the time of writing).
- **Never mention living arrangements.** The Chicago stop says Meryl moved there in 2022 for medical school and John followed in 2023. It must not say or hint whether they live together or apart. No moving boxes, shared keys, a shared apartment, or "moved in".
- **Copy is placeholder.** All chapter text in the prototype is a draft. Meryl and John will rewrite it. The build reads copy from `lib/italy-content.ts` so their edits never touch drawing code.

**Facts the drawings rely on**, which the couple supplied:

| Fact | Used where |
|---|---|
| John is from New Jersey, Meryl from California | NJ sign on the short merging road, CA sign on the long one |
| They met at Northeastern University in Boston, and dating began in 2019 | Boston stop, NEU polaroid, husky |
| John was on the East Coast, Meryl on the West Coast | Long-distance pins |
| First trip to Italy together, 2022 | Italy 2022 stop |
| Meryl moved to Chicago in 2022 for med school; John followed in 2023 | Chicago stop |
| Trips to Bali (2024) and Spain (2025) | Half stops |
| Proposal at Thanksgiving 2025, in California (Meryl's home), in front of both families | Thanksgiving stop |
| Wedding 21–23 April 2027, Monastero Santa Margherita, Todi | Ending |

**Placeholder claims to confirm or cut:** "By 2019 it was official: dinner, a movie" (Boston) and "on a hill above the Tiber valley" (Umbria; Todi does overlook the Tiber). Bali and Spain each say "One line about … goes here."

## 5. The drive, stop by stop

The world is one SVG, 1200 units wide and 4880 tall. Y grows downward, so the drive starts near the bottom (y≈4400) and ends at the top (y≈580). There are eight straight stretches ("legs"), numbered from the bottom. Odd legs run left to right, even legs right to left. A hairpin bend joins each leg to the next.

"Text slot" says where the stop's chapter text sits in the world. Each stop's text sits **one slot before** its own road, so the reader meets the text just before the car arrives. The couple asked for this ordering.

| # | Stop | Road | What happens | HUD chip | Text slot |
|---|---|---|---|---|---|
| – | **Two roads** (prologue) | Two spur roads | John's car comes in on the short road from the left edge past a green **NJ** sign; Meryl's comes in on the long road from the right edge past a green **CA** sign (California is the longer drive to Boston; the couple asked for this on 2026-11-11). Each car has one person in it. They merge at the start of leg 1. A small red heart rises at the merge, and from there it is one car with two people. The spur roads ink in as the cars arrive. | `NJ · CA` (green) | Title block, under the merge point, bottom left |
| 1 | **Boston, 2019** | Leg 1 (→) | Olive **BOSTON, MA** sign. "Polaroid pickets": a fence of six overlapping polaroids on stakes along two rails, each tilted a little. The first is larger, with a husky face and **NEU** in red; the second is captioned 2019. Beyond them, the Boston skyline drawn in the prototype's line over a "CHARLES RIVER" waterline: State House with a gold dome, the Zakim Bridge, the Custom House clock tower, towers, the Old State House. | `Boston, MA` (olive) | Below leg 1, right (where the title used to be) |
| 2 | **The long-distance years** | Leg 2 (←), the long one | Takes about 3× a normal leg's scrolling, on purpose. The car drives westbound past four green time-zone signs (Leaving Eastern, Entering Central, Mountain, Pacific), an I-80 shield, a red **JOHN · EAST COAST** pin at the east end and **MERYL · WEST COAST** at the west end. Overhead a small plane flies back and forth five times along a faint dotted arc, and a yellow sticky note headed "flights" gains one tally stroke per pass, ending in a full five-bar gate. | `I-80 · Westbound` (green) | Above leg 1, left |
| 3 | **Italy, 2022** | Leg 3 (→) | The road runs out at a coast. The car becomes a plane and flies a dotted arc over "ATLANTIC" waves, then lands as the **Italian car**. An **ITALIA 2022** passport stamp pops in, and the odometer switches to KM. Tuscany: three cypresses, vineyard rows below the road, a **Tuscan villa** (low terracotta hipped roofs, square tower, arched loggia, cypresses) on a gentle mound. Then **Positano**: house blocks stepping up a cliff, the church with a tiled majolica dome low on the left, beach umbrellas and waves below the road, a small "POSITANO" label. The hairpin after leg 3 **is the flight home**: the plane flies the bend, and the odometer goes back to MI. | `Italia · 2022` (EU blue) | Above leg 2, right |
| 4 | **Chicago** | Leg 4 (←) | A **white coat with a stethoscope** on a coat stand. The skyline (Willis-style stepped tower with antennas, Hancock-style tapered tower with X-bracing, others) with the **elevated "L" track** and a train in front, its posts reaching down to the road. No arrivals board, no "med school" sign, no Bean and no city flag: the couple asked for all four to be removed. | `Chicago` (green) | Above leg 3, left |
| 5a | **Bali, 2024** (half stop) | Leg 5 (→), first quarter | Palms and a split temple gate (candi bentar). The car pauses, and a **BALI 2024** stamp pops in. Bali sits a full bend above Chicago, at the couple's request. | `Bali · 2024` (stamp style) | Shared slot "Bali & Spain", above leg 4, right |
| 5b | **Spain, 2025** (half stop) | Leg 5, last quarter | White house with a tiled roof and an orange tree. The car pauses, and an **ESPAÑA 2025** stamp pops in. | `España · 2025` (stamp style) | Shared slot |
| 6 | **Thanksgiving, 2025** | Leg 6 (←) | Green California route shield "CA 1", two palms, then a house with a terracotta roof and a long Thanksgiving table: eight people (both families, two tones) around a scalloped tablecloth with a turkey, a pie and two candles. String lights run from the house's right eave, sag over the table and end at a pole past its far end, so house and table read as one scene (the couple asked for this on 2026-11-11). The car stops in front of the table, a ring rises above it with sparkles, and the heads bob as if everyone jumped up. | `California` (green) | Above leg 5, left |
| 7 | **Across the water** | Leg 7 (→) | The road reaches a coast and the car becomes a plane over "ATLANTIC" waves. It lands at a blue EU **ITALIA** border sign as the Italian car, now with a suitcase on the roof. An **ITALIA 2027** stamp pops in. The odometer is in KM from here on. | `Italia · 2027` (EU blue) | Above leg 6, right |
| 8 | **Umbria** | Leg 8 (←) | A white Italian arrow sign **TODI 3**, a brown **MONASTERO S. MARGHERITA** sign, cypresses, olive trees, the big hill behind. | `Todi` (Italian white arrow) | Above leg 7, left |
| – | **Arrived** | Final climb to the piazza | Exactly the version 1 ending: the road curves up the hill into Todi's skyline (walls, crenellated tower, campanile, the Duomo with its rose window, rooftops, cypresses). The car parks in the piazza. The keys arc from the car onto a key board on the wall and swing to rest, and "keys away" appears. The camera lifts to show the closing line, "Benvenuti a Todi", and the dates **21 · 22 · 23 April 2027**. | `Monastero S. Margherita` (brown) | Top of the world, centred |

## 6. Systems

Each heading names the matching part of the prototype's script.

### 6.1 World and route geometry (`route geometry`)

- Constants: `W=1200`, `H=4880`, `XL=160`, `XR=1040`, `RISE=220` (each leg climbs 220 across its width), `HP=240` (each hairpin climbs 240), `STEP=460`, `Y0=4400` (leg 1 start).
- `legStart(i)`, `legEnd(i)` and `legPt(i, f)` give points on leg `i` at fraction `f`. Legs are straight lines.
- `hairpin(i)` is one cubic Bézier whose control points continue the leg's direction (offsets 184 and 46), so the joins are smooth.
- Flights are cubic arcs: `fly1` is on leg 3 from f .13 to .33, the flight home is hairpin 3 itself, and `fly3` is on leg 7 from f .22 to .78.
- The final climb is `C 50 932 300 600 560 580`, from the end of leg 8 to the piazza `PZ = (560, 580)`.
- The spur roads run from `(-60, Y0+90)` (short: John, NJ) and `(1240, Y0+260)` (long: Meryl, CA) and both end tangent to leg 1 at `(160, Y0)`.

### 6.2 Scroll mapping (`Pieces of the drive`)

- The drive is an ordered list of **pieces**, each with a kind (`spur`, `road`, `flight`, `pause`), a chapter, a scroll weight `w`, an optional easing (`out` into a stop, `in` out of a stop, `io` for both), an optional tag, and the car type.
- All weights are multiplied by `SCALE_W = 0.72`. The drive section is `(sum of weights + 1) × 100vh` tall, and the stage is sticky inside it.
- Progress `p` (0–1) comes from the section's bounding rect against the viewport. Rendering uses a **smoothed** progress that eases toward the real one by 0.11 per frame, which gives the gliding feel. Under reduced motion it would be 1, but see §9: reduced-motion readers get the static fallback instead.
- Pauses have length 0 on the road. The car stands still while the reader scrolls through a set piece (Bali, Spain, the ring, parking).
- Scrolling backwards plays everything in reverse. Nothing is one-shot.

### 6.3 Camera (`camera + layout`)

- **Wide screens (stage ≥ 900px):** world scale `S = min(stageWidth / 1200, 1.25)`, centred horizontally. The car is held 58% of the way down the stage.
- **Narrow screens (< 900px):** `S = clamp(stageWidth / 700, .5, .8)`. The camera also follows the car sideways. The car is held 36% of the way down, because the text card covers the bottom.
- The camera is always clamped to the world's edges.
- During the prologue the horizontal camera eases from x=290 (so the title shows on phones) toward the merge point.
- While parked, the camera eases up to the very top so the closing line and dates are in view.

### 6.4 Road rendering (`road layers`)

- Each road is three strokes on the same path: a 34-wide ink edge, a 29-wide ivory fill, and a 1.6-wide dashed centre line (`10 12`).
- **Pencil ahead, ink behind.** A faint copy (32% opacity) shows the whole route. An inked copy sits on top, revealed by an SVG mask: an 80-wide stroke along the full path whose dash offset tracks the distance driven. Scroll back up and the ink retreats.
- Flights have no road. They are dotted lines (`2 9`), faint plus inked, under the same mask.
- The spur roads ink in as the two cars arrive.

### 6.5 Vehicles (`vehicles`)

- **US car** (`#carBody`, wheels r=10): paper body, olive stripe, sage windows, two heads after the merge. In the prologue there are two copies with one head each.
- **Italian car** (`#itBody`, wheels r=8.5): rounder and shorter. Used from landing in Italy 2022 until the flight home, and again from landing in 2027 to the end. The suitcase on the roof shows only after the 2027 landing.
- **Plane:** used on every flight. A smaller copy is the plane in the long-distance set piece.
- The car always faces its direction of travel. At hairpins it squashes through a near-zero horizontal scale (minimum 0.14), as if turning toward the viewer. It tilts with the road up to ±24°. While moving it bobs slightly, the wheels turn with the distance driven, and three small exhaust puffs trail behind. Puffs stop when it stops.

### 6.6 Set pieces

| Set piece | Trigger | Behaviour |
|---|---|---|
| Merge heart | End of the spur piece into the start of leg 1 | Fades in and out while rising and growing above the merge point |
| Long-distance flights | Leg 2 | 5 passes, alternating direction, eased. The tally shows `floor(t×5)` strokes and stays at 5 once past |
| Passport stamps | 2022 at the end of `fly1`, Bali and Spain during their pauses, 2027 on landing | Pop from 1.8× scale to 1× while fading in, at a slight rotation. They stay once shown |
| Ring | The `ring` pause | Rises and scales up over the first 40%, sparkles flicker, heads bob from 45%. Fades as the car pulls away |
| Keys | The `park` pause | Arc from the car to the key board between 12% and 52% while spinning, then a damped swing. "keys away" fades in from 50% |

### 6.7 HUD

- **Road-sign chip** (top right) shows the current stop's sign in its real-world style: green US guide sign, olive, EU blue with a gold rule, white Italian arrow (pointing left), brown tourist sign, or a red passport-stamp style for half stops. No subtitle sits under the sign: the couple asked for it removed (2026-11-11).
- **Odometer** (bottom left): five rolling digits, the last one paper-coloured. It counts **road distance only**, so it freezes during flights. It reads KM while in Italy (2022 and from 2027 on) and MI otherwise, flipping its unit label when it switches. The long-distance leg adds up to 2,100 miles on top of the road distance. **The numbers are decorative placeholders, not facts.**
- **Stop dots** (right edge, bottom to top): one per chapter, half stops smaller, labels on hover, focus or when active. Clicking one smooth-scrolls to that stop (instant under reduced motion).
- **"Skip the drive"** link at top left jumps past the drive. In the site, it targets the end of the page or the footer.

### 6.8 Text

- Chapter text sits in the world as HTML inside SVG `foreignObject`: small-caps kicker, Pinyon heading (54 world units), Cormorant body (19.5 units).
- Text slots, in world units (x, y, width): Boston (690, Y0−100, 470); long distance (180, Y0−550, 380); Italy (690, Y0−1010, 345); Chicago (180, Y0−1470, 380); Bali & Spain (690, Y0−1940, 345); Thanksgiving (180, Y0−2400, 380); crossing (690, Y0−2855, 345); Umbria (176, Y0−3306, 392); title (30, Y0+196, 520); closing (160, 70, 880).
- The current stop's text is at full opacity and the others at 72%.
- **Narrow screens:** body text and kickers are hidden in the world, and a paper card docked above the odometer shows the current stop's kicker, heading and body, fading between stops.
- **Copy fit:** the slots were sized for the placeholder copy. If the final copy is much longer, the text could hit a drawing. The builder must check fit with the real copy (§12). Fixing a fit problem means asking the couple to trim, or nudging a slot by a few units. It never means re-laying out a stop.

### 6.9 Atmosphere

- The stage background lerps from ivory `#f6f1e8` to warm `#f1dfbf` by `p^2.2`, so it is late afternoon by the time you reach Todi.
- A faint linen weave covers the stage: two repeating 1px gradients.
- A hill backdrop sits under Todi. Its lower edge follows the faint hill line, so there is no hard horizontal edge.
- There is a sun at the top right.

## 7. Visual system

**Colour.** Use the prototype's tokens. Where a token matches an existing site token, use the site token so the two stay in step.

| Prototype token | Value | Maps to |
|---|---|---|
| `--ivory` | `#f6f1e8` | `--color-ivory` |
| `--ink` | `#1e231e` | `.theme-italy --color-ink` |
| `--ink-soft` | `#55564c` | `.theme-italy --color-ink-soft` |
| `--olive` | `#4b4b30` | `--color-band` |
| `--olive-ink` | `#f4efe2` | `--color-band-ink` |
| `--paper` | `#fffcf5` | new, road-scoped |
| `--warm` | `#f1dfbf` | new, road-scoped |
| `--hwy` | `#0d6a48` | new: road-sign green |
| `--brown` | `#6f4527` | new: tourist-sign brown |
| `--eu` | `#233f97` | new: EU blue |
| `--gold` | `#f2c230` | new |
| `--red` | `#b3262d` | new |
| `--stamp` | `#a8323a` | new |

New tokens are scoped to the road component (for example a `.road-trip` class), not added globally.

**Type.** Pinyon Script, Libre Baskerville and Cormorant Garamond are already on the Italy site. **Overpass** (700 and 800, for US road signs, the odometer and stamps) and **Titillium Web** (600 and 700, for Italian and EU signs) are new. Load them with the same font loader the Italy layout already uses, scoped to this page.

**Drawing style.** Thin, even ink lines: 2.4 for posts and the car body, 1.8–2 for main outlines, 1.3–1.6 for detail. Paper fill. A light olive tint (`rgb(75 75 48 / .22)`) on foliage and hills. Colour only on signs, flags, stamps, terracotta roofs, the State House dome, the Positano dome, lemons and oranges. No wobble filter and no heavy black fills: the couple chose this style over the site's Vecteezy style.

## 8. How it fits into the repo

**Where things go.** Suggested layout; the builder can adjust names.

```
app/italy/our-story/page.tsx          server component: real story text + <RoadTrip> + fallback
components/italy/road/RoadTrip.tsx    "use client": sticky stage, scroll → progress, one animation loop
components/italy/road/route.ts        the prototype's geometry, pieces, weights (pure, no DOM)
components/italy/road/art/*.tsx       drawings, one file per stop, markup copied from the prototype
components/italy/road/Hud.tsx         chip, odometer, stop dots
lib/italy-content.ts                  ITALY_STORY reshaped for stops (below)
lib/motion.ts                         ROAD tokens: smoothing, camera anchors, SCALE_W
scripts/road-shot.mjs                 prototype vs page screenshots at every stop
```

**Rendering approach** (decided):

- **No React state per frame.** One `requestAnimationFrame` loop reads the scroll position and writes attributes and transforms straight to SVG nodes held in refs, the same way the prototype does. React renders the static SVG once.
- `motion` 12 is already installed and its `useScroll` may supply progress. A plain scroll read like the prototype's is also fine. Either way, the smoothing must feel the same.
- Path lengths are measured once on mount, from hidden paths, as in the prototype. Per-frame `getPointAtLength` is fine. A precomputed lookup table is allowed if profiling asks for it.
- The drawings are static JSX ported from the prototype's template strings. The ones the prototype generates in loops (polaroid pickets, vineyard dots, Positano rows, time-zone signs, family heads) can stay as loops.

**Metadata.** Keep `export const metadata = { title: "Our Story" }` and the nav link label as they are.

**Next.js version.** The repo runs Next 16.2.10, and `AGENTS.md` warns that its APIs differ from older versions. Read the relevant guide in `node_modules/next/dist/docs/` before writing the client boundary, font loading or any image handling.

**Page structure inside the site.** The Italy layout's own header (names and nav) sits above the drive, and its footer below. The prototype's olive "The road to Todi" rail and its plan section are not ported. The stage is `position: sticky` inside the drive section:

- The layout root uses `overflow-x: clip`, which does not create a scroll container, so sticky works.
- `app/italy/template.tsx` wraps pages in `.italy-rise`, a transform animation that ends at `transform: none`. That is fine for sticky, but the HUD must stay absolutely positioned inside the stage, never `position: fixed`.

**Content model.** Reshape `ITALY_STORY` to drive this page. Proposed shape:

```ts
ITALY_STORY = {
  title: { kicker: "Our story, by road", tagline: "From New Jersey and California to a hill in Umbria.", cue: "Scroll to start the car" },
  stops: [
    { id: "boston", kicker, heading, body, chip: { text: "Boston, MA", style: "olive" } },
    { id: "distance", ... }, { id: "italy-2022", ... }, { id: "chicago", ... },
    { id: "bali", half: true, ... }, { id: "spain", half: true, ... },
    { id: "thanksgiving", ... }, { id: "crossing", ... }, { id: "umbria", ... },
  ],
  halfStops: { kicker: "Two half stops", heading: "Bali & Spain", body },
  closing: { kicker: "Benvenuti a Todi", line, dates: "21 · 22 · 23 April 2027" },
};
```

Geometry, drawings and sign art stay in code, keyed by `id`, never in content. The names "Meryl & John" come from `ITALY.names`. The old `eyebrow`, `intro` and `chapters` fields and the four-photo `PHOTOS` array on the page go away.

**Photos.** The prototype has drawn placeholders: six polaroid pickets in Boston, including the NEU and husky one. Real photos are a later content pass (§14). When they land, they go inside the existing polaroid frames at the same size and tilt, processed with `scripts/process-photos.mjs`, with real alt text. The NEU and husky polaroid stays drawn unless the couple says otherwise.

## 9. Accessibility and fallbacks

- **One accessible copy of the story.** The drive's drawing and readouts are decorative (`aria-hidden`). The fallback below is the single copy that assistive tech reads. It is visually hidden while the drive shows and visible when it doesn't. The text in the world duplicates it for sighted readers.
- **Reduced motion** (decided by Claude; flagged in §13): under `prefers-reduced-motion: reduce`, CSS hides the drive and shows a static fallback with the same copy. Both are in the server HTML and CSS chooses between them, so there is no hydration mismatch. The drive pans the whole world, which is exactly the motion that setting exists to avoid.
- **What the fallback looks like:** the existing `Band` and `Type` primitives, alternating cream and olive like today's page, with the first and last bands cream (the current page's comment explains why). One band per stop, holding the kicker as `SmallCaps`, the heading as `ScriptTitle` and the body as `Prose`, centred, with no photos. Bali and Spain share one band. The closing line and dates end the page. This is deliberately plain. It exists so the story is fully readable, not to imitate the drive.
- **No JavaScript:** the same fallback shows. One way: render it by default and let the client add a class that swaps to the drive once it is ready. The builder picks the mechanism, but the page must never be blank or broken without JS.
- **Keyboard:** the stop dots are real buttons with labels, focus is visible, and "Skip the drive" is the first focusable thing in the stage.
- **Contrast:** the world text uses the site ink on ivory, which already passes. The 72% opacity on inactive text is decorative, and the active stop is always at 100%.

## 10. Performance

- Transforms and attributes only per frame. No layout reads beyond one `getBoundingClientRect` of the drive section.
- The render is skipped when the smoothed progress hasn't changed, as in the prototype.
- No images in the world until photos land, then at most six small polaroid images, lazy and sized.
- The page's LCP stays in the layout header (the names), not the SVG.
- **Target:** no dropped-frame stutter while scrolling on a mid-range Android phone (Chrome performance panel, 4× CPU slowdown as a proxy), and on a 2020-era laptop.

## 11. Responsive behaviour

- The breakpoint is the 900px stage width (§6.3). Below it: camera follows sideways, world text bodies hide, the card docks at the bottom, the chip shrinks and truncates, stop labels hide.
- Widths to verify: 390 (phone), 768 (tablet: narrow mode), 1024, 1440. Heights: 700 and 900 on desktop, 844 on phone.
- No horizontal page scroll at any width. The existing `scripts/italy-shot.mjs` overflow check covers this.

## 12. Verification: how we know it matches

1. **`scripts/road-shot.mjs`** (new) opens the prototype file and the real page side by side, drives both to the same progress values, and saves paired screenshots at 1440×900 and 390×844. Progress values: 0, 0.06 (Boston), 0.2 (long distance), 0.33 (Tuscany and Positano), 0.42 (Chicago), 0.507 (Bali pause), 0.57 (Spain pause), 0.677 (ring), 0.785 (crossing), 0.87 (Umbria), 1.0 (arrived). Like `italy-shot.mjs`, it unlocks the password gate with `GATE_PASSWORD_ITALY`.
2. **Acceptance:** at every pair, the same things are on screen, in the same places, at the same size, in the same colours. The only differences allowed are copy and photos (§14). Meryl and John review the pairs before merge.
3. Reduced-motion and no-JS fallbacks render the full story.
4. Keyboard: tab to the stop dots, activate one, and it lands on the right stop.
5. `npm run build` and `npm run lint` pass.
6. A content check: search the built page's text for "church", "twice", "New Jersey wedding" and living-arrangement words, and expect none.

## 13. Decisions

**Decided by Meryl and John**

- The road climbs, with Todi at the top.
- The prototype's little car in the US, an Italian-style car in Europe.
- The prototype's drawing style, not the Vecteezy style.
- No sound.
- The built page matches the prototype as closely as possible.
- The stop list and order in §5, including NJ/CA, Boston details, Italy 2022 (villa and Positano), Chicago (white coat and stethoscope; no arrivals board, med school sign, Bean or flag), the Bali and Spain half stops, Thanksgiving with both families, and the version 1 ending.
- The title sits under the merge point, and each stop's text sits one slot before its road.
- Never mention the church wedding or living arrangements.

**Claude's calls, for the couple to check**

- The reduced-motion and no-JS readers get the static band layout instead of the drive (§9).
- Overpass and Titillium Web as the road-sign faces.
- The odometer numbers, the I-80 shield and the westbound time-zone order are decorative.
- The NEU and husky polaroid stays a drawing even after real photos arrive.
- New colour tokens are scoped to the road component rather than added to the site theme.

## 14. Left to do, and by whom

| Item | Who | Notes |
|---|---|---|
| Final copy for every stop, the title, the half stops and the closing | Meryl & John | Edit `lib/italy-content.ts`. Keep each stop near the placeholder's length, or check fit (§6.8) |
| One line each for Bali and Spain | Meryl & John | |
| Photos for the five plain polaroid pickets | Meryl & John | Optional. Drawn placeholders ship if none arrive |
| Confirm or cut "officially dating in 2019 / dinner and a movie" and "above the Tiber valley" | Meryl & John | |
| Everything in §§6–12 | Builder | |

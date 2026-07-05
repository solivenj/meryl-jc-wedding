# PRD — Meryl & John Save-the-Date Site

**Project codename:** `wrapped-with-love`
**Owner:** John
**Executor:** Claude Code (full architectural autonomy within the constraints below)
**Status:** Ready for build

---

## 1. Overview

A single-page, premium, animated save-the-date website for the wedding of **Meryl & John** — **April 10, 2027, St. Aloysius R.C. Church, Jersey City, NJ**.

The experience has two acts:

1. **Act I — The Envelope.** A sealed, textured envelope wrapped in a ribbon, presented like a physical keepsake. The user clicks the ribbon/envelope; the ribbon unravels, the flap opens, and the envelope gives way to the site.
2. **Act II — The Site.** A long-form editorial page (modeled on Reference Image 2: the "Rafael & Kirsten" layout) with hero, story, program/reception columns, and a closing sign-off. All copy and photos are placeholders.

Tonal anchor: **"wrapped with love."** The ribbon/bow metaphor carries from Act I into Act II's illustrations and copy.

Quality bar: this should look like a $3–5k custom studio build, not a template. Every animation should feel intentional and physical. If a detail reads as "AI-generated wedding template," it fails review.

---

## 2. Tech stack (fixed — do not substitute)

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 14+ App Router | Static export acceptable; no server logic needed |
| Language | TypeScript, strict | |
| Styling | Tailwind CSS | Design tokens in `tailwind.config` — no arbitrary one-off hex values scattered in JSX |
| Animation | **Framer Motion** (primary) | Orchestration, layout transitions, entrance choreography |
| SVG path animation | Framer Motion `pathLength`/`pathOffset`, or **anime.js** if FM is insufficient for the ribbon unravel | Claude Code decides; justify in an ADR comment if anime.js is added |
| 3D | **Not used** | Three.js is explicitly out of scope — the envelope is 2.5D (SVG + CSS transforms), not WebGL. Do not add it. |
| Fonts | `next/font` self-hosted | See §6 typography |
| Hosting | Vercel | |

**Anti-goals:** no CMS, no RSVP form, no backend, no analytics beyond Vercel defaults, no i18n.

---

## 3. Act I — Envelope reveal

### 3.1 Envelope asset strategy — DECISION POINT

**Chosen approach (default): high-fidelity procedural SVG.**

The envelope must NOT look like flat geometric shapes. Build it as layered inline SVG:

- **Geometry:** back panel, side flaps, bottom flap, top flap (separate `<g>` so the flap can hinge open in Act I's exit), and a wax-seal-style monogram medallion ("M·J" in the display face) centered on the flap point.
- **Paper texture:** `feTurbulence` (fractalNoise, low baseFrequency) + `feDiffuseLighting` or a blend-mode overlay to produce visible paper grain. Add a second subtle `feTurbulence` layer at higher frequency for fiber detail.
- **Depth:** soft drop shadow under the envelope (large blur, low opacity, warm-tinted — never pure black), inner shadows along flap creases via gradient strokes, and a faint top-light gradient across the whole envelope. The flap edges should have a barely-visible deckled/soft edge, not a razor line.
- **Ribbon:** a separate SVG layer crossing the envelope (vertical + horizontal bands meeting in a bow at center, or a single diagonal wrap with a bow — Claude Code's call, pick whichever animates more convincingly). Ribbon gets its own gradient (satin sheen: light band along its length) and a subtle shadow onto the envelope beneath it.

**Alternative (only if John supplies one):** a photographic envelope raster (PNG/WebP). In that case the ribbon remains SVG overlaid on the raster, and the unravel uses masked layers rather than restructuring envelope paths. Do not source stock imagery yourself; do not generate raster textures with placeholder services.

### 3.2 Entrance choreography (page load)

Background: warm off-white/ivory field (see palette). Elements fade + translate up from below (~24–32px travel, ease-out, ~0.7s each), staggered **one by one** in this order:

1. **Eyebrow:** "SAVE OUR DATE" — small caps, tracked-out, utility face.
2. **Names:** "Meryl & John" — large display script/serif. This is the typographic hero; it must be more refined than the reference (see §6). The ampersand is a featured glyph — consider a contrasting size/style for it, as in the reference.
3. **Envelope + ribbon** — rises with a slightly longer duration and a soft settle (spring, low bounce). The shadow scales/fades in with it so it reads as landing on a surface.
4. **CTA:** "CLICK TO OPEN" (desktop) / "TAP TO OPEN" (touch — detect pointer type) — small caps, tracked-out, gentle infinite pulse (opacity 0.55 ↔ 1.0, ~2.5s cycle). Never a bouncing arrow.

Total sequence ≤ 3s. After ~4s idle, the ribbon bow does a single subtle "breathe" (scale 1.0 → 1.02 → 1.0) every ~6s to invite interaction.

### 3.3 The unravel interaction

Trigger: click/tap anywhere on the envelope or ribbon (generous hit area, entire envelope group). Keyboard: envelope is a `button` with visible focus ring; Enter/Space triggers. `aria-label="Open the save the date"`.

Sequence (target 1.8–2.6s total, interruptible only by `prefers-reduced-motion`):

1. **Bow release (~0.5s):** bow loops shrink/pull through — animate loop paths' `pathLength`/scale so the knot visually slips. A tiny rotation wobble on the knot sells the pull.
2. **Ribbon unravel (~0.8s, overlapping):** ribbon bands slide off the envelope — animate `pathOffset`/translate along the band direction with easing that accelerates (ribbon "whips" off), each band ending in a fade + slight curl (rotate + scaleY on the tail). Bands exit in sequence, not simultaneously.
3. **Flap open (~0.6s):** top flap hinges upward — `rotateX` on the flap group with `transform-origin` at the fold line and a perspective wrapper. The monogram medallion rides the flap. Shadow under the flap animates as it lifts.
4. **Reveal transition (~0.7s):** a card/liner rises out of the envelope opening (a simple ivory rectangle with the names, emerging via `clip-path` or overflow mask), then the whole Act I scene scales up slightly (1 → 1.06) and cross-fades as the card expands into Act II's hero. The hand-off must feel continuous — the card *becomes* the page. No hard cut, no white flash.

State: once opened, Act I never replays in-session (store in React state; do **not** persist to localStorage — artifacts constraint aside, a returning visitor re-experiencing the open is desirable).

**`prefers-reduced-motion`:** entrance elements fade in with no translation; clicking the envelope cross-fades directly to Act II in ~0.4s with no ribbon/flap animation.

---

## 4. Act II — The site

Recreate the structure and editorial feel of Reference Image 2, adapted to Meryl & John. Single page, five sections. All photography is placeholder (see §5). Keep the ivory/editorial palette — Act II is predominantly light like the reference's content panels; the reference's dark outer backdrop is a mockup frame, not part of the page.

### 4.1 Section map (top → bottom)

**S1 — Hero.**
Full-bleed placeholder photo with a soft dark gradient scrim. Overlaid, centered:
- Eyebrow: "WELCOMING YOU TO THE WEDDING OF" (utility face, small caps, tracked)
- "Meryl & John" in the display face, large, two lines acceptable, with a small ornamental flourish above (SVG — a bow motif echoing Act I's ribbon, replacing the reference's swan/dove ornament).
- Bottom corners of the hero (as in reference): left — "APRIL 10, 2027 · 12 PM" *(placeholder time)*; right — "ST. ALOYSIUS R.C. CHURCH, JERSEY CITY".
Hero content fades/translates in as the Act I transition completes.

**S2 — Story / invitation.**
Ivory panel. Three-column arrangement at desktop: left caption "OUR LOVE / A FAIRYTALE" *(placeholder)*, center — a small envelope illustration **reusing the Act I SVG envelope at reduced scale with the ribbon re-tied** (the metaphor's callback; this is the section's signature), right caption "A MEMORY / A STORY" *(placeholder)*. Below, a centered justified-feel block of placeholder invitation copy (~60 words, small caps or small serif, generous leading). Provide tasteful placeholder copy in the "wrapped with love" register — e.g. closing line "…every moment until then, wrapped with love." *(placeholder, John will rewrite)*.

**S3 — Photo band.**
Full-width placeholder photo with a line-art SVG overlay: two birds holding an unfurling ribbon (white stroke, ~1.5px, hand-drawn feel — imperfect curves welcome). Ribbon ends trail into a loose bow.

**S4 — Program & Reception.**
Two columns on desktop, stacked on mobile.
- Left: "Program" (script/display header). Timeline rows, hairline rules between: 5:00 PM Welcome Photos & Cocktails · 6:00 PM Dinner Program · 7:00 PM Toasts & Speeches · 8:00 PM Official Picture Taking · 9:00 PM Open Bar & Dancing *(all placeholder)*.
- Right: "Reception" (matching header). Stacked blocks with bold labels + 2–3 line placeholder body each: **Reception Venue**, **Dress Code**, **Parking & Directions**.

**S5 — Closing.**
Full-bleed placeholder photo, overlaid large display text: "We Look Forward to Seeing You." with a small hand-drawn heart flourish SVG. Scroll-triggered fade/translate entrance.

### 4.2 Scroll behavior

Standard scrolling — **no scroll-jacking.** Each section's content group animates in on viewport entry (Framer Motion `whileInView`, once: true, ~20px translate + fade, staggered children). Restraint: no parallax on more than the hero (a subtle hero parallax ≤ 8% is permitted), no rotating/scaling scroll effects elsewhere.

---

## 5. Placeholders

- **Images:** local placeholder component — a soft two-tone gradient (warm gray → ivory) with faint grain (reuse the paper-noise filter) and a small centered label like `HERO PHOTO · 3:2`. No external placeholder services (no picsum/placehold). Each placeholder documents its intended aspect ratio and content in a comment.
- **Copy:** all body copy marked with `{/* PLACEHOLDER */}` comments and collected in a single `content.ts` so John can rewrite in one file. Real values only for: names, date (April 10, 2027), venue (St. Aloysius R.C. Church, Jersey City, NJ).

---

## 6. Design system

### Typography (three roles — final faces are Claude Code's choice within these constraints, self-hosted via `next/font`):
- **Display:** a high-contrast calligraphic script or Didone-with-swash italic for names and section headers ("Program", "Reception"). Must have a beautiful ampersand. Candidates to evaluate: a refined script in the vein of the reference (avoid the overused Great Vibes / Dancing Script tier — pick something less default), or a serif italic with swash alternates.
- **Body:** a quiet transitional/old-style serif (e.g. EB Garamond–class) for invitation copy and reception blocks.
- **Utility:** a geometric or grotesque sans, small caps / all caps with +0.15–0.25em tracking, for eyebrows, timestamps, CTA, timeline hours.

Do not use the same family for all three roles. Set a real type scale; the names lockup at desktop should be dramatically large (viewport-relative, clamped).

### Palette (tokens, ~5 values — exact hexes are Claude Code's choice within this direction):
- `ivory` — warm off-white page field (Act I bg, Act II panels)
- `paper` — slightly deeper warm neutral for the envelope body
- `ink` — near-black warm charcoal for text (never #000)
- `ribbon` — the single accent: a muted satin tone (champagne/sage/dusty blue — pick one and commit; it should feel like a real ribbon color, not a UI accent)
- `scrim` — translucent dark for photo overlays

No gradients as decoration outside the envelope/satin sheen. Restraint is the aesthetic.

### Signature element
The envelope-and-ribbon system **is** the signature: Act I's interaction, the re-tied miniature in S2, the bird-and-ribbon line art in S3. Nothing else on the page should compete with it.

---

## 7. Architecture & quality requirements

- **Structure:** `app/page.tsx` orchestrates two top-level states (`sealed` / `opened`) via a single state machine (simple union type is fine). Envelope in `components/envelope/` (geometry, ribbon, animation hooks separated). Act II sections as individual components. Animation timing constants centralized in `lib/motion.ts` — no magic durations inline.
- **Performance:** LCP < 2.0s on 4G (Act I is nearly all inline SVG — this should be easy). No layout shift during the entrance choreography (reserve space before animating). Lighthouse ≥ 95 performance/accessibility. Envelope SVG kept under ~40KB.
- **Responsive:** mobile-first. Envelope scales to ~85vw on mobile (max ~560px desktop). Act II columns stack. Test at 375px, 768px, 1440px.
- **Accessibility:** envelope is a focusable button; full keyboard path to open; `prefers-reduced-motion` honored everywhere (see §3.3); text over photos meets contrast via scrim; all placeholder images have alt text describing intended content.
- **Verification before done:** run the dev server, exercise the open interaction (pointer + keyboard + reduced-motion), and screenshot Act I initial, mid-unravel, Act II hero, and mobile layout. The unravel must be judged against "does this look like a real ribbon coming off a real envelope" — iterate until yes.

---

## 8. Build phases

1. **P1 — Envelope static.** SVG envelope with texture, shadow, ribbon, monogram. Ship a Storybook-less test page; screenshot review. *This is the risk item — do it first.*
2. **P2 — Act I choreography.** Entrance stagger, idle breathe, CTA pulse.
3. **P3 — Unravel + reveal transition.** The four-beat open sequence, reduced-motion branch.
4. **P4 — Act II sections.** All five sections, scroll entrances, placeholder system, `content.ts`.
5. **P5 — Polish pass.** Responsive QA, a11y audit, Lighthouse, timing tuning (Chanel rule: remove one effect).

Commit at the end of every phase. Conventional commits, feature branch per phase.

---

## 9. Open questions for John (do not block P1 on these)

1. Ribbon accent color — champagne, sage, or dusty blue? (P1 proceeds with one; trivially swappable via token.)
2. Ceremony time — 12 PM is a placeholder in S1's corner text.
3. Bow style — center bow with vertical+horizontal bands vs. single diagonal wrap? Claude Code prototypes whichever animates better and flags the choice.

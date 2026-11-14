/*
 * The road trip's engine: everything that moves. Framework-free; RoadTrip.tsx
 * creates it once, calls render(p) with smoothed scroll progress, and calls
 * destroy() on unmount.
 *
 * A port of the approved prototype's script (render, set pieces, HUD, camera,
 * tint). Every number is the prototype's; change one only to fix a bug.
 */
import {
  H,
  PIECES,
  SCALE_W,
  SPURS,
  TOTAL_W,
  W,
  FORK,
  ITALY_ENTRY,
  ITALY_TIP,
  XL,
  chapterStart,
  ease,
  locate,
  odometerReading,
  pieceIndex,
  roadPaths,
  textChapter,
} from "./route.ts";
import { MINI_STOPS, miniStopX } from "./art/miniStops.ts";
import type { ITALY_STORY } from "@/lib/italy-content";

type Story = typeof ITALY_STORY;
type Car = {
  g: SVGGElement;
  puffs: SVGCircleElement[];
  w1: SVGGElement;
  w2: SVGGElement;
  lug: SVGGElement;
  wx: [number, number];
  wy: number;
  r: number;
};

const NS = "http://www.w3.org/2000/svg";
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOut = (t: number) => ease("out", t);
const easeIO = (t: number) => ease("io", t);
const f1 = (n: number) => Math.round(n * 10) / 10;

function el<K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string | number>, parent?: Element): SVGElementTagNameMap[K] {
  const n = document.createElementNS(NS, tag);
  for (const k in attrs) n.setAttribute(k, String(attrs[k]));
  if (parent) parent.appendChild(n);
  return n;
}

export function createDrive(root: HTMLElement, story: Story, opts: { reduceMotion: boolean }) {
  const $ = <T extends Element>(id: string) => root.querySelector(`#${id}`) as T;
  const stage = $<HTMLElement>("stage");
  const world = $<SVGSVGElement>("world");
  const measure = $<SVGGElement>("measure");
  const V = $<SVGGElement>("vehicles");

  /* ---------- measure every moving piece ---------- */
  type Measured = { el: SVGPathElement; len: number; d0: number; end: { x: number; y: number }; endDir: { x: number; y: number } };
  const M: (Measured | null)[] = [];
  let dist = 0;
  for (const p of PIECES) {
    if (p.kind === "spur" || p.kind === "pause") {
      M.push(null);
      continue;
    }
    const path = el("path", { d: `M ${f1(p.from!.x)} ${f1(p.from!.y)} ${p.seg}` }, measure);
    const len = path.getTotalLength();
    const e = path.getPointAtLength(len);
    const e2 = path.getPointAtLength(len - 2);
    M.push({ el: path, len, d0: dist, end: { x: e.x, y: e.y }, endDir: { x: e.x - e2.x, y: e.y - e2.y } });
    dist += len;
  }
  const TOTAL = dist;
  const spurA = el("path", { d: SPURS.a }, measure);
  const spurB = el("path", { d: SPURS.b }, measure);
  const spurLen = [spurA.getTotalLength(), spurB.getTotalLength()];

  const revealPath = $<SVGPathElement>("revealPath");
  revealPath.setAttribute("d", roadPaths().full);
  revealPath.setAttribute("stroke-dasharray", `${TOTAL} ${TOTAL + 10}`);
  const spurInk = $<SVGGElement>("spurInk");

  /* ---------- vehicles ---------- */
  const makeCar = (heads: number[], kind: "us" | "it" = "us"): Car => {
    const g = el("g", {}, V);
    const puffs = [0, 1, 2].map(() => el("circle", { r: 4, fill: "none", stroke: "var(--ink)", "stroke-width": 1.2, opacity: 0 }, g));
    const body = el("g", {}, g);
    const lug = el("g", { opacity: 0 }, body);
    if (kind === "it")
      lug.insertAdjacentHTML(
        "beforeend",
        `<rect x="-20" y="-58" width="30" height="11" rx="2" class="paper" stroke="var(--ink)" stroke-width="1.4"/><path class="ln-thin" d="M -24 -47 L 18 -47 M -10 -58 L -10 -47 M 0 -58 L 0 -47"/>`,
      );
    el("use", { href: kind === "it" ? "#itBody" : "#carBody" }, body);
    const hy = kind === "it" ? -33 : -36;
    const hr = kind === "it" ? 4.2 : 4.6;
    heads.forEach((hx) => el("circle", { cx: hx, cy: hy, r: hr, fill: "var(--ink)" }, body));
    const w1 = el("g", {}, body);
    const w2 = el("g", {}, body);
    el("use", { href: kind === "it" ? "#wheelS" : "#wheel" }, w1);
    el("use", { href: kind === "it" ? "#wheelS" : "#wheel" }, w2);
    return { g, puffs, w1, w2, lug, wx: kind === "it" ? [-24, 24] : [-24, 26], wy: kind === "it" ? -9 : -10, r: kind === "it" ? 8.5 : 10 };
  };
  const carA = makeCar([15]);
  const carB = makeCar([15]);
  const car = makeCar([-7, 15]);
  const itc = makeCar([-10, 13], "it");
  const PLANE = `<path class="paper" stroke="var(--ink)" stroke-width="2.2" stroke-linejoin="round" d="M -36 0 C -36 -6 -22 -9 10 -9 C 28 -9 37 -4 39 0 C 37 4 28 7 10 7 L -28 7 C -34 7 -36 3 -36 0 Z"/>
    <path class="paper" stroke="var(--ink)" stroke-width="2" stroke-linejoin="round" d="M -28 -3 L -38 -22 L -27 -22 L -16 -7 Z"/>
    <path class="paper" stroke="var(--ink)" stroke-width="2" stroke-linejoin="round" d="M -6 2 L -18 20 L -8 20 L 12 3 Z"/>
    <path d="M -18 -2 L 22 -2" stroke="var(--ink)" stroke-width="2.4" stroke-dasharray="0.1 6" stroke-linecap="round"/>
    <path d="M -34 2 L 34 2" stroke="var(--olive)" stroke-width="1.6"/>`;
  const plane = el("g", { opacity: 0 }, V);
  plane.insertAdjacentHTML("beforeend", PLANE);
  /* The Vespa, Italy 2022 only: side-on along leg 3, riding away up the
     drawing. Two puffs mark it turning back into the plane at the tip. */
  const vespaSide = el("g", { opacity: 0 }, V);
  el("use", { href: "#vespaSide" }, vespaSide);
  const vespaRear = el("g", { opacity: 0 }, V);
  el("use", { href: "#vespaRear" }, vespaRear);
  const tipPuffs = [0, 1].map((k) => el("circle", { r: 0, fill: "none", stroke: "var(--ink)", "stroke-width": k ? 1.4 : 2, opacity: 0 }, V));
  const longPlane = el("g", { opacity: 0 }, V);
  longPlane.insertAdjacentHTML("beforeend", `<g transform="scale(.62)">${PLANE}</g>`);
  const longArc = $<SVGPathElement>("longArc");
  const longArcLen = longArc.getTotalLength();

  const placeCar = (c: Car, x: number, y: number, dx: number, dy: number, d: number, mv: boolean, s = 1) => {
    const len = Math.hypot(dx, dy) || 1;
    let sx = clamp((dx / len) * 3, -1, 1);
    if (Math.abs(sx) < 0.14) sx = (sx < 0 ? -1 : 1) * 0.14;
    const tilt = clamp((Math.atan2(dy, Math.abs(dx)) * 180) / Math.PI, -24, 24);
    const bob = mv ? Math.sin(d * 0.32) * 0.7 : 0;
    c.g.setAttribute("transform", `translate(${f1(x)} ${f1(y + bob)}) scale(${(sx * s).toFixed(3)} ${s}) rotate(${tilt.toFixed(2)})`);
    const rot = ((d * 180) / (Math.PI * c.r)) % 360;
    c.w1.setAttribute("transform", `translate(${c.wx[0]} ${c.wy}) rotate(${rot.toFixed(1)})`);
    c.w2.setAttribute("transform", `translate(${c.wx[1]} ${c.wy}) rotate(${rot.toFixed(1)})`);
    c.puffs.forEach((p, k) => {
      const ph = ((d * 0.9 + k * 22) % 66) / 66;
      p.setAttribute("cx", String(f1(-48 - ph * 40)));
      p.setAttribute("cy", String(f1(-12 - ph * 10)));
      p.setAttribute("r", String(f1(3 + ph * 5)));
      p.setAttribute("opacity", String(mv ? f1((1 - ph) * 0.55) : 0));
    });
  };
  const placePlane = (g: SVGGElement, x: number, y: number, dx: number, dy: number, s = 1) => {
    const sx = dx < 0 ? -1 : 1;
    const tilt = clamp((Math.atan2(dy, Math.abs(dx)) * 180) / Math.PI, -30, 30);
    g.setAttribute("transform", `translate(${f1(x)} ${f1(y - 14 * s)}) scale(${(sx * s).toFixed(3)} ${s.toFixed(3)}) rotate(${tilt.toFixed(2)})`);
  };
  /* The Vespa is a little smaller than the cars. Up the drawing it shrinks
     with the drawn road, which narrows with height: full size where leg 3
     joins it, under a third of that at the tip. */
  const VESPA = 0.7;
  const vespaScale = (y: number) => VESPA * (0.3 + 0.7 * Math.pow(clamp((y - ITALY_TIP.y) / (ITALY_ENTRY.y - ITALY_TIP.y), 0, 1), 1.1));
  const placeVespaSide = (x: number, y: number, dx: number, dy: number, s: number) => {
    const sx = dx < 0 ? -1 : 1;
    const tilt = clamp((Math.atan2(dy, Math.abs(dx)) * 180) / Math.PI, -24, 24);
    vespaSide.setAttribute("transform", `translate(${f1(x)} ${f1(y)}) scale(${(sx * s).toFixed(3)} ${s.toFixed(3)}) rotate(${tilt.toFixed(2)})`);
  };
  /* Seen from behind, it leans a little into the bends rather than turning. */
  const placeVespaRear = (x: number, y: number, dx: number, dy: number, s: number) => {
    const lean = clamp(((Math.atan2(dx, -dy) * 180) / Math.PI) * 0.3, -16, 16);
    vespaRear.setAttribute("transform", `translate(${f1(x)} ${f1(y + 6 * s)}) scale(${s.toFixed(3)}) rotate(${lean.toFixed(2)})`);
  };

  /* ---------- HUD ---------- */
  const digits = $<HTMLElement>("digits");
  const NDIG = 5;
  const strips: HTMLElement[] = [];
  for (let k = 0; k < NDIG; k++) {
    const d = document.createElement("div");
    d.className = "d" + (k === NDIG - 1 ? " last" : "");
    const s = document.createElement("div");
    s.className = "strip";
    s.innerHTML = Array.from({ length: 11 }, (_, n) => `<div>${n % 10}</div>`).join("");
    d.appendChild(s);
    digits.appendChild(d);
    strips.unshift(s);
  }
  const setOdo = (v: number) => {
    for (let k = 0; k < NDIG; k++) {
      const p10 = Math.pow(10, k);
      let pos = Math.floor(v / p10) % 10;
      if (k === 0) pos = v % 10;
      else pos += Math.max(0, (v % p10) - (p10 - 1));
      strips[k].style.transform = `translateY(${(-pos * 22).toFixed(1)}px)`;
    }
  };

  /* Chapter metadata: stops 0–8, then the arrival (9). */
  const CH = [
    ...story.stops.map((s) => ({ k: s.kicker, h: s.heading, b: s.body, chip: s.chip, half: !!s.half })),
    { k: story.closing.stop.kicker, h: story.closing.stop.heading, b: story.closing.line, chip: story.closing.chip, half: false },
  ];
  const unit = $<HTMLElement>("unit");
  const chip = $<HTMLElement>("chip");
  const card = $<HTMLElement>("card");
  const stopsUl = $<HTMLElement>("stops");
  const drive = $<HTMLElement>("drive");
  const cleanups: (() => void)[] = [];
  const stopBtns = CH.map((c, i) => {
    const li = document.createElement("li");
    const b = document.createElement("button");
    b.type = "button";
    if (c.half) b.classList.add("half");
    b.innerHTML = `<span class="lab">${c.h}</span><span class="dot"></span>`;
    b.setAttribute("aria-label", `Drive to: ${c.h}`);
    const onClick = () => {
      const top = drive.getBoundingClientRect().top + scrollY;
      const span = drive.offsetHeight - innerHeight;
      scrollTo({ top: top + (chapterStart(i) + 0.002) * span, behavior: opts.reduceMotion ? "auto" : "smooth" });
    };
    b.addEventListener("click", onClick);
    cleanups.push(() => b.removeEventListener("click", onClick));
    li.appendChild(b);
    stopsUl.appendChild(li);
    return b;
  });
  const wts = [...root.querySelectorAll<HTMLElement>("#texts .wt[data-ch]")].filter((w) => w.dataset.ch !== "");

  /* Stop text runs on its own clock: it comes in TEXT_LEAD ahead of the
     stop (route.ts), but only once its whole block is on screen, so a reader
     never gets words that are already cut off. Once in, a stop's words stay
     as the car drives on; they only go if the reader scrolls back above
     that stop, so they can come in again on the way down. */
  const slots = wts.map((w) => ({ w, chs: (w.dataset.ch || "").split(",").map(Number), y: Number(w.parentElement!.getAttribute("y")) }));
  let curText = -2;
  let shownText = -1;
  const setText = (c: number) => {
    if (c === curText) return;
    curText = c;
    slots.forEach((s) => s.w.classList.toggle("on", Math.min(...s.chs) <= c));
  };
  let curCh = -2;
  let curUnit = "MI";
  let swapTimer = 0;
  let flashTimer = 0;
  let curMini = -1;
  const setChapter = (c: number) => {
    if (c === curCh) return;
    curMini = -1;
    curCh = c;
    const meta: { chip: { text: string; style: string } } = c < 0 ? { chip: { text: "NJ · CA", style: "" } } : CH[c];
    chip.textContent = meta.chip.text;
    chip.className = "chip " + (meta.chip.style || "");
    /* A stop that is not a place (the long-distance years) has no sign. */
    chip.hidden = !meta.chip.text;
    stopBtns.forEach((b, i) => {
      b.classList.toggle("on", i === c);
      b.classList.toggle("done", i < c);
      b.classList.toggle("flash", i === c);
    });
    /* The new stop's name shows for a moment, then tucks away; hovering or
       focusing a dot brings any name back. */
    window.clearTimeout(flashTimer);
    flashTimer = window.setTimeout(() => stopBtns.forEach((b) => b.classList.remove("flash")), 1200);
    if (c >= 0) {
      card.classList.add("swap");
      window.clearTimeout(swapTimer);
      swapTimer = window.setTimeout(() => {
        card.querySelector(".k")!.textContent = CH[c].k;
        card.querySelector("h3")!.textContent = CH[c].h;
        card.querySelector(".b")!.textContent = CH[c].b;
        card.classList.remove("swap");
      }, opts.reduceMotion ? 0 : 180);
      card.hidden = false;
    } else {
      card.hidden = true;
    }
  };

  /* ---------- camera + layout ---------- */
  let S = 1;
  let narrow = false;
  let SW = 0;
  let SH = 0;
  const layout = () => {
    SW = stage.clientWidth;
    SH = stage.clientHeight;
    narrow = SW < 900;
    S = narrow ? clamp(SW / 700, 0.5, 0.8) : Math.min(SW / W, 1.25);
    world.style.width = `${W * S}px`;
    world.style.height = `${H * S}px`;
    stage.classList.toggle("narrow", narrow);
  };

  const warm = [241, 223, 191];
  const iv = [246, 241, 232];
  const I = {
    long: pieceIndex("long"),
    fly1: pieceIndex("fly1"),
    leg5a: pieceIndex("leg5a"),
    leg5b: pieceIndex("leg5b"),
    ring: pieceIndex("ring"),
    landed: pieceIndex("landed"),
    ride: pieceIndex("vespaRide"),
    flyhome: pieceIndex("flyhome"),
    park: pieceIndex("park"),
  };
  const flights = PIECES.map((p, i) => (p.kind === "flight" ? i : -1)).filter((i) => i >= 0);
  /* Road length with the flights taken out: the odometer's full scale. */
  const ROAD_TOTAL = TOTAL - flights.reduce((sum, fi) => sum + M[fi]!.len, 0);
  const famHeads = [...root.querySelectorAll<SVGGElement>("#family .fam")];
  const fx = (id: string) => $<SVGElement>(id);
  const heart = fx("heart");
  const ring = fx("ring");
  const sparks = fx("sparks");
  const keys = fx("keys");
  const keysTxt = fx("keysTxt");

  const popStamp = (id: string, k: number) => {
    const n = fx(id) as SVGElement & { dataset: DOMStringMap };
    const e = clamp(k, 0, 1);
    const s = 1 + (1 - easeOut(e)) * 0.8;
    n.setAttribute("opacity", String(f1(e)));
    n.setAttribute("transform", `translate(${n.dataset.x} ${n.dataset.y}) rotate(${n.dataset.r}) scale(${s.toFixed(3)})`);
  };

  const render = (p: number) => {
    const { i, t } = locate(p);
    const s = p * TOTAL_W;
    const pc = PIECES[i];

    let x: number;
    let y: number;
    let dx = 1;
    let dy = 0;
    let d = 0;
    let mv = true;
    let vehicle: "us" | "it" | "vespa" | "plane" | "none" = pc.car === "it" ? "it" : pc.car === "vespa" ? "vespa" : "us";
    if (pc.kind === "spur") {
      const te = easeIO(t);
      const a = spurA.getPointAtLength(te * spurLen[0]);
      const a2 = spurA.getPointAtLength(Math.min(te * spurLen[0] + 2, spurLen[0]));
      const b = spurB.getPointAtLength(te * spurLen[1]);
      const b2 = spurB.getPointAtLength(Math.min(te * spurLen[1] + 2, spurLen[1]));
      placeCar(carA, a.x, a.y, a2.x - a.x || 1, a2.y - a.y, te * spurLen[0], t > 0 && t < 1, 0.9);
      placeCar(carB, b.x, b.y, b2.x - b.x || -1, b2.y - b.y, te * spurLen[1], t > 0 && t < 1, 0.9);
      carA.g.setAttribute("opacity", "1");
      carB.g.setAttribute("opacity", "1");
      x = lerp(290 + FORK.x - XL, FORK.x, easeIO(t));
      y = (a.y + b.y) / 2;
      vehicle = "none";
    } else {
      carA.g.setAttribute("opacity", "0");
      carB.g.setAttribute("opacity", "0");
      if (pc.kind === "pause") {
        let j = i - 1;
        while (!M[j]) j--;
        const prev = M[j]!;
        x = prev.end.x;
        y = prev.end.y;
        dx = prev.endDir.x;
        dy = prev.endDir.y;
        d = prev.d0 + prev.len;
        mv = false;
      } else {
        const m = M[i]!;
        const l = ease(pc.ease, t) * m.len;
        const a = m.el.getPointAtLength(l);
        const b = l + 2 <= m.len ? m.el.getPointAtLength(l + 2) : null;
        x = a.x;
        y = a.y;
        if (b) {
          dx = b.x - a.x;
          dy = b.y - a.y;
        } else {
          const a0 = m.el.getPointAtLength(l - 2);
          dx = a.x - a0.x;
          dy = a.y - a0.y;
        }
        d = m.d0 + l;
        if (pc.kind === "flight") vehicle = "plane";
      }
    }
    car.g.setAttribute("opacity", vehicle === "us" ? "1" : "0");
    itc.g.setAttribute("opacity", vehicle === "it" ? "1" : "0");
    plane.setAttribute("opacity", vehicle === "plane" ? "1" : "0");
    if (vehicle === "us") placeCar(car, x, y, dx, dy, d, mv);
    if (vehicle === "it") placeCar(itc, x, y, dx, dy, d, mv);
    if (vehicle === "plane") {
      /* Out of the drawing's tip the plane starts small, the size the
         Vespa was, and grows to full size as it climbs away. */
      const fromTip = i === I.flyhome;
      const ps = fromTip ? 0.35 + 0.65 * clamp(t / 0.6, 0, 1) : 1;
      if (fromTip) plane.setAttribute("opacity", String(f1(clamp(t / 0.06, 0, 1))));
      placePlane(plane, x, y, dx, dy, ps);
    }
    {
      /* The Vespa: side-on along leg 3, turning to ride away over the first
         stretch of the drawing, then fading at the tip as the plane takes
         over. */
      let side = 0;
      let rear = 0;
      if (vehicle === "vespa") {
        const turn = i === I.ride ? clamp(t / 0.08, 0, 1) : 0;
        const out = i === I.ride ? 1 - clamp((t - 0.96) / 0.04, 0, 1) : 1;
        side = (1 - turn) * out;
        rear = turn * out;
        const vs = i === I.ride ? vespaScale(y) : VESPA;
        if (side > 0) placeVespaSide(x, y, dx, dy, vs);
        if (rear > 0) placeVespaRear(x, y, dx, dy, vs);
      }
      vespaSide.setAttribute("opacity", String(f1(side)));
      vespaRear.setAttribute("opacity", String(f1(rear)));
      /* the puff at the tip, as the Vespa becomes the plane */
      const pu = i === I.ride ? clamp((t - 0.94) / 0.06, 0, 1) * 0.4 : i === I.flyhome ? 0.4 + clamp(t / 0.2, 0, 1) * 0.6 : 0;
      tipPuffs.forEach((c, k) => {
        const u = clamp(pu - k * 0.15, 0, 1);
        c.setAttribute("cx", String(ITALY_TIP.x));
        c.setAttribute("cy", String(f1(ITALY_TIP.y - 6)));
        c.setAttribute("r", String(f1((k ? 14 : 24) * u)));
        c.setAttribute("opacity", u > 0 && u < 1 ? String(f1(1 - u)) : "0");
      });
    }
    itc.lug.setAttribute("opacity", i >= I.landed ? "1" : "0");

    revealPath.setAttribute("stroke-dashoffset", String(f1(TOTAL - d)));
    spurInk.setAttribute("opacity", String(pc.kind === "spur" ? f1(clamp((t - 0.6) / 0.4, 0, 1) * 0.6) : 1));

    /* merge heart */
    {
      /* Timed against the whole of leg 1's road weight (1.8), not PIECES[1],
         which now ends early at the Boston pause. */
      const hs = (s - PIECES[0].w * 0.82) / (PIECES[0].w * 0.18 + 1.8 * SCALE_W * 0.4);
      if (hs > 0 && hs < 1) {
        heart.setAttribute("opacity", String(f1(Math.sin(hs * Math.PI))));
        heart.setAttribute("transform", `translate(${f1(FORK.x)} ${f1(FORK.y - 56 - hs * 40)}) scale(${f1(1 + hs * 0.6)})`);
      } else heart.setAttribute("opacity", "0");
    }

    /* long-distance flights (the post-it tally that counted them is gone) */
    {
      if (i === I.long) {
        const u = t * 5;
        const pass = Math.min(4, Math.floor(u));
        const fr = u - pass;
        const fwd = pass % 2 === 0;
        const q = easeIO(fwd ? fr : 1 - fr);
        const a = longArc.getPointAtLength(q * longArcLen);
        const b = longArc.getPointAtLength(Math.min(q * longArcLen + 2, longArcLen));
        longPlane.setAttribute("opacity", fr > 0.02 && fr < 0.98 ? "1" : "0");
        placePlane(longPlane, a.x, a.y + 14, (b.x - a.x) * (fwd ? 1 : -1) || (fwd ? -1 : 1), (b.y - a.y) * (fwd ? 1 : -1));
      } else {
        longPlane.setAttribute("opacity", "0");
      }
    }

    /* passport stamps */
    popStamp("stIt22", i === I.fly1 ? (t - 0.85) / 0.15 : i > I.fly1 ? 1 : 0);
    /* The five mini stops on leg 5: each stamp lands, and its polaroid and
       name fade in, as the car reaches the stop, over the last 40 units of
       road before it. */
    MINI_STOPS.forEach((_, k) => {
      const on5 = i === I.leg5a || i === I.leg5b;
      const sx = miniStopX(k);
      const kk = i > I.leg5b ? 1 : on5 ? (x - (sx - 40)) / 40 : 0;
      popStamp(`stMini${k}`, kk);
      fx(`pMini${k}`).setAttribute("opacity", String(f1(clamp(kk, 0, 1))));
    });
    popStamp("stIt27", i === I.landed ? t / 0.3 : i > I.landed ? 1 : 0);

    /* Thanksgiving: the ring rises, both families jump up */
    if (i === I.ring || i === I.ring + 1) {
      const rt = i === I.ring ? t : 1;
      const fade = i === I.ring + 1 ? 1 - clamp(t * 2.5, 0, 1) : 1;
      const rise = easeOut(clamp(rt / 0.4, 0, 1));
      const pp = M[I.ring - 1]!.end;
      ring.setAttribute("opacity", String(f1(rise * fade)));
      ring.setAttribute("transform", `translate(${f1(pp.x)} ${f1(pp.y - 90 - rise * 40)}) scale(${f1(0.6 + rise * 0.7)})`);
      sparks.setAttribute("opacity", String(f1(clamp((rt - 0.3) / 0.2, 0, 1) * (0.6 + 0.4 * Math.sin(s * 40)))));
      const cheer = clamp((rt - 0.45) / 0.15, 0, 1) * fade;
      famHeads.forEach((h, k) => h.setAttribute("transform", `translate(0 ${f1(-Math.abs(Math.sin(s * 30 + k * 1.3)) * 7 * cheer)})`));
    } else {
      ring.setAttribute("opacity", "0");
      famHeads.forEach((h) => h.removeAttribute("transform"));
    }

    /* park: keys onto the hook */
    if (i === I.park) {
      const k = easeIO(clamp((t - 0.12) / 0.4, 0, 1));
      const from = { x: 590, y: 548 };
      const to = { x: 702, y: 562 };
      const kx = lerp(from.x, to.x, k);
      const ky = lerp(from.y, to.y, k) - Math.sin(k * Math.PI) * 60;
      const swing = k >= 1 ? Math.sin((t - 0.52) * 30) * 12 * Math.max(0, 1 - (t - 0.52) * 3) : k * 360;
      keys.setAttribute("opacity", "1");
      keys.setAttribute("transform", `translate(${f1(kx)} ${f1(ky)}) rotate(${f1(swing)})`);
      keysTxt.setAttribute("opacity", String(f1(clamp((t - 0.5) / 0.2, 0, 1))));
    } else {
      keys.setAttribute("opacity", "0");
      keysTxt.setAttribute("opacity", "0");
    }

    /* odometer: road only, frozen in the air, kilometres while in Italy */
    {
      let flown = 0;
      flights.forEach((fi) => {
        if (i > fi) flown += M[fi]!.len;
        else if (i === fi) flown += d - M[fi]!.d0;
      });
      const reading = odometerReading({ roadFraction: Math.max(0, d - flown) / ROAD_TOTAL });
      setOdo(reading.value);
      if (reading.unit !== curUnit) {
        curUnit = reading.unit;
        unit.textContent = reading.unit;
        unit.classList.remove("flip");
        void unit.offsetWidth;
        unit.classList.add("flip");
      }
    }

    setChapter(pc.ch);

    /* On leg 5 the corner badge names the mini stop the car has reached
       (the first one until it gets there), rather than the half-leg. */
    if (i === I.leg5a || i === I.leg5b) {
      let k = 0;
      MINI_STOPS.forEach((_, j) => {
        if (x >= miniStopX(j) - 40) k = j;
      });
      if (k !== curMini) {
        curMini = k;
        chip.textContent = `${MINI_STOPS[k].name} · ${MINI_STOPS[k].year}`;
        chip.className = "chip stamp";
        chip.hidden = false;
      }
    } else curMini = -1;

    /* camera */
    const ay = SH * (narrow ? 0.36 : 0.58);
    /* On phones the docked card covers the bottom of the stage, and near the
       bottom of the world the camera can't follow the car up. So as the two
       cars merge, let it lift the world past its bottom edge by up to 40% of
       the stage; the opening frame is untouched (the couple chose this,
       2026-11-12). */
    const lift = narrow ? SH * 0.4 * clamp((s - PIECES[0].w * 0.7) / (PIECES[0].w * 0.3), 0, 1) : 0;
    let oy = clamp(ay - y * S, SH - H * S - lift, 0);
    if (pc.tag === "park") oy = lerp(oy, 0, easeIO(clamp((t - 0.35) / 0.45, 0, 1)));
    const ox = W * S <= SW ? (SW - W * S) / 2 : clamp(SW / 2 - x * S, SW - W * S, 0);
    world.style.transform = `translate3d(${ox.toFixed(1)}px, ${oy.toFixed(1)}px, 0)`;

    {
      const raw = textChapter(p);
      /* Scrolled back above a stop: let its words go. */
      if (raw < shownText) shownText = raw;
      let tc = raw;
      const slot = slots.find((s) => s.chs.includes(tc));
      if (slot && tc > shownText) {
        const top = oy + slot.y * S;
        const bottom = top + slot.w.offsetHeight * S;
        /* A new stop's words wait until their whole block is on screen. Only
           a stop not yet shown is held back; one already in stays even as it
           scrolls off the top. */
        if (top < 0 || bottom > SH) tc = Math.min(...slot.chs) - 1;
      }
      shownText = Math.max(shownText, tc);
      setText(shownText);
    }

    /* light: late afternoon as you near Todi */
    const k = Math.pow(p, 2.2);
    stage.style.backgroundColor = `rgb(${iv.map((c, n) => Math.round(lerp(c, warm[n], k))).join(" ")})`;
  };

  layout();
  return {
    render,
    layout,
    /* Undo everything createDrive added, so a later createDrive on the same
       DOM (motion turned back on, Fast Refresh, a preserved route) starts
       clean instead of stacking a second set of cars and digits. */
    destroy() {
      window.clearTimeout(swapTimer);
      window.clearTimeout(flashTimer);
      cleanups.forEach((f) => f());
      for (const g of [measure, V, digits, stopsUl]) g.replaceChildren();
    },
  };
}

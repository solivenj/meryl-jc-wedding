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
  SPURS,
  TOTAL_W,
  W,
  XL,
  Y0,
  chapterStart,
  ease,
  locate,
  odometerReading,
  pieceIndex,
  roadPaths,
} from "./route.ts";
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
  const placePlane = (g: SVGGElement, x: number, y: number, dx: number, dy: number) => {
    const sx = dx < 0 ? -1 : 1;
    const tilt = clamp((Math.atan2(dy, Math.abs(dx)) * 180) / Math.PI, -30, 30);
    g.setAttribute("transform", `translate(${f1(x)} ${f1(y - 14)}) scale(${sx} 1) rotate(${tilt.toFixed(2)})`);
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
  const chipSub = $<HTMLElement>("chipSub");
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

  let curCh = -2;
  let curUnit = "MI";
  let swapTimer = 0;
  const setChapter = (c: number) => {
    if (c === curCh) return;
    curCh = c;
    const meta = c < 0 ? { chip: { text: "NJ · CA", style: "" }, k: "Two roads" } : CH[c];
    chip.textContent = meta.chip.text;
    chip.className = "chip " + (meta.chip.style || "");
    chipSub.textContent = meta.k;
    wts.forEach((w) => w.classList.toggle("on", (w.dataset.ch || "").split(",").includes(String(c))));
    stopBtns.forEach((b, i) => {
      b.classList.toggle("on", i === c);
      b.classList.toggle("done", i < c);
    });
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
      wts.forEach((w) => w.classList.remove("on"));
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
    bali: pieceIndex("bali"),
    spain: pieceIndex("spain"),
    ring: pieceIndex("ring"),
    landed: pieceIndex("landed"),
    park: pieceIndex("park"),
  };
  const flights = PIECES.map((p, i) => (p.kind === "flight" ? i : -1)).filter((i) => i >= 0);
  const famHeads = [...root.querySelectorAll<SVGGElement>("#family .fam")];
  const tally = [...$<SVGGElement>("tally").children] as SVGElement[];
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
    let vehicle: "us" | "it" | "plane" | "none" = pc.car === "it" ? "it" : "us";
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
      x = lerp(290, XL, easeIO(t));
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
    if (vehicle === "plane") placePlane(plane, x, y, dx, dy);
    itc.lug.setAttribute("opacity", i >= I.landed ? "1" : "0");

    revealPath.setAttribute("stroke-dashoffset", String(f1(TOTAL - d)));
    spurInk.setAttribute("opacity", String(pc.kind === "spur" ? f1(clamp((t - 0.6) / 0.4, 0, 1) * 0.6) : 1));

    /* merge heart */
    {
      const hs = (s - PIECES[0].w * 0.82) / (PIECES[0].w * 0.18 + PIECES[1].w * 0.4);
      if (hs > 0 && hs < 1) {
        heart.setAttribute("opacity", String(f1(Math.sin(hs * Math.PI))));
        heart.setAttribute("transform", `translate(${XL} ${f1(Y0 - 56 - hs * 40)}) scale(${f1(1 + hs * 0.6)})`);
      } else heart.setAttribute("opacity", "0");
    }

    /* long-distance flights + tally */
    {
      let passes = 0;
      if (i === I.long) {
        const u = t * 5;
        const pass = Math.min(4, Math.floor(u));
        const fr = u - pass;
        passes = Math.floor(u + 1e-6);
        const fwd = pass % 2 === 0;
        const q = easeIO(fwd ? fr : 1 - fr);
        const a = longArc.getPointAtLength(q * longArcLen);
        const b = longArc.getPointAtLength(Math.min(q * longArcLen + 2, longArcLen));
        longPlane.setAttribute("opacity", fr > 0.02 && fr < 0.98 ? "1" : "0");
        placePlane(longPlane, a.x, a.y + 14, (b.x - a.x) * (fwd ? 1 : -1) || (fwd ? -1 : 1), (b.y - a.y) * (fwd ? 1 : -1));
      } else {
        longPlane.setAttribute("opacity", "0");
        passes = i > I.long ? 5 : 0;
      }
      for (let k = 0; k < 5; k++) tally[k].setAttribute("opacity", k < passes ? "1" : "0");
    }

    /* passport stamps */
    popStamp("stIt22", i === I.fly1 ? (t - 0.85) / 0.15 : i > I.fly1 ? 1 : 0);
    popStamp("stBali", i === I.bali ? (t - 0.2) / 0.2 : i > I.bali ? 1 : 0);
    popStamp("stSpain", i === I.spain ? (t - 0.2) / 0.2 : i > I.spain ? 1 : 0);
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
      const reading = odometerReading({ i, t, roadUnits: Math.max(0, d - flown) });
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

    /* camera */
    const ay = SH * (narrow ? 0.36 : 0.58);
    let oy = clamp(ay - y * S, SH - H * S, 0);
    if (pc.tag === "park") oy = lerp(oy, 0, easeIO(clamp((t - 0.35) / 0.45, 0, 1)));
    const ox = W * S <= SW ? (SW - W * S) / 2 : clamp(SW / 2 - x * S, SW - W * S, 0);
    world.style.transform = `translate3d(${ox.toFixed(1)}px, ${oy.toFixed(1)}px, 0)`;

    /* light: late afternoon as you near Todi */
    const k = Math.pow(p, 2.2);
    stage.style.backgroundColor = `rgb(${iv.map((c, n) => Math.round(lerp(c, warm[n], k))).join(" ")})`;
  };

  layout();
  return {
    render,
    layout,
    destroy() {
      window.clearTimeout(swapTimer);
      cleanups.forEach((f) => f());
    },
  };
}

"use client";

/*
 * The road trip: a sticky stage holding one SVG world that the reader drives
 * through by scrolling. Ported from the approved prototype
 * (docs/superpowers/specs/2026-11-11-our-story-road-trip/prototype.html);
 * the element ids below match it, because engine.ts addresses them by id.
 *
 * Everything here renders once. Motion is written straight to the DOM by the
 * engine, never through React state.
 */
import "./road.css";
import { useEffect, useRef } from "react";
import { overpass, titillium } from "./fonts";
import { H, TOTAL_W, W, Y0, roadPaths } from "./route.ts";
import { createDrive } from "./engine.ts";
import { backdropMarkup, defsMarkup, fxMarkup, sceneryMarkup } from "./art/index.ts";
import { ITALY, ITALY_STORY } from "@/lib/italy-content";

const PATHS = roadPaths();

function RoadLayer({ d, inked }: { d: string; inked: boolean }) {
  return (
    <>
      <path d={d} fill="none" stroke="var(--ink)" strokeWidth={34} strokeLinejoin="round" />
      <path d={d} fill="none" stroke="var(--ivory)" strokeWidth={29} strokeLinejoin="round" />
      <path d={d} fill="none" stroke="var(--ink)" strokeWidth={1.6} strokeDasharray="10 12" opacity={inked ? 0.8 : 1} />
    </>
  );
}

function Flights({ width }: { width: number }) {
  return PATHS.flights.map((d) => (
    <path key={d} d={d} fill="none" stroke="var(--ink)" strokeWidth={width} strokeDasharray="2 9" strokeLinecap="round" />
  ));
}

/* Chapter text in the world: x, y, width, height in world units (design doc
   §6.8). Each stop's text sits one slot before its own road. */
function Slot({ x, y, w, h, ch, className = "", children }: { x: number; y: number; w: number; h: number; ch: string; className?: string; children: React.ReactNode }) {
  return (
    <foreignObject x={x} y={y} width={w} height={h}>
      <div className={`wt ${className}`} data-ch={ch}>
        {children}
      </div>
    </foreignObject>
  );
}

function Block({ i }: { i: number }) {
  const s = ITALY_STORY.stops[i];
  return (
    <>
      <p className="k">{s.kicker}</p>
      <h2>{s.heading}</h2>
      <p className="b">{s.body}</p>
    </>
  );
}

/* How far along the drive the reader is, 0–1: how much of the section has
   scrolled past the top of the viewport, as in the prototype. */
function progressOf(section: HTMLElement): number {
  const r = section.getBoundingClientRect();
  return Math.max(0, Math.min(1, -r.top / (r.height - innerHeight)));
}

const SMOOTHING = 0.11; // per frame, from the prototype

export function RoadTrip() {
  const { title, halfStops, closing } = ITALY_STORY;
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    /* Reduced motion: road.css hides the drive and shows the fallback, so
       there is nothing to animate. */
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const section = root.querySelector<HTMLElement>("#drive")!;
    const engine = createDrive(root, ITALY_STORY, { reduceMotion: false });

    let shown = progressOf(section);
    let last = -1;
    let raf = 0;
    const onResize = () => {
      engine.layout();
      last = -1;
    };
    const loop = () => {
      const target = progressOf(section);
      shown += (target - shown) * SMOOTHING;
      if (Math.abs(target - shown) < 1e-5) shown = target;
      if (shown !== last) {
        engine.render(shown);
        last = shown;
      }
      raf = requestAnimationFrame(loop);
    };
    engine.render(shown);
    last = shown;
    addEventListener("resize", onResize);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("resize", onResize);
      engine.destroy();
    };
  }, []);

  return (
    <div ref={rootRef} className={`road-trip ${overpass.variable} ${titillium.variable}`}>
      <section
        className="drive"
        id="drive"
        aria-label="Our story, as a drive to Todi"
        style={{ height: `calc(${(TOTAL_W + 1).toFixed(2)} * 100vh)` }}
      >
        <div className="stage" id="stage">
          <svg id="world" viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <defs dangerouslySetInnerHTML={{ __html: defsMarkup() }} />
            <g id="backdrop" dangerouslySetInnerHTML={{ __html: backdropMarkup() }} />
            <g id="road">
              <g id="roadFaint" opacity={0.32}>
                <RoadLayer d={PATHS.road} inked={false} />
                <RoadLayer d={PATHS.spurs} inked={false} />
                <Flights width={2} />
              </g>
              <g id="roadInk" mask="url(#reveal)">
                <RoadLayer d={PATHS.road} inked />
                <Flights width={2.2} />
              </g>
              <g id="spurInk" opacity={0}>
                <RoadLayer d={PATHS.spurs} inked />
              </g>
            </g>
            <g id="scenery" dangerouslySetInnerHTML={{ __html: sceneryMarkup() }} />
            <g id="texts">
              <Slot x={690} y={Y0 - 100} w={470} h={280} ch="0"><Block i={0} /></Slot>
              <Slot x={180} y={Y0 - 550} w={380} h={370} ch="1"><Block i={1} /></Slot>
              <Slot x={690} y={Y0 - 1010} w={345} h={370} ch="2"><Block i={2} /></Slot>
              <Slot x={180} y={Y0 - 1470} w={380} h={340} ch="3"><Block i={3} /></Slot>
              <Slot x={690} y={Y0 - 1940} w={345} h={190} ch="4,5">
                <p className="k">{halfStops.kicker}</p>
                <h2>{halfStops.heading}</h2>
                <p className="b">{halfStops.body}</p>
              </Slot>
              <Slot x={180} y={Y0 - 2400} w={380} h={350} ch="6"><Block i={6} /></Slot>
              <Slot x={690} y={Y0 - 2855} w={345} h={330} ch="7"><Block i={7} /></Slot>
              <Slot x={176} y={Y0 - 3306} w={392} h={330} ch="8"><Block i={8} /></Slot>
              <Slot x={30} y={Y0 + 196} w={520} h={270} ch="" className="title on">
                <p className="k">{title.kicker}</p>
                <h2>{ITALY.names}</h2>
                <p className="b" style={{ fontSize: 20 }}>{title.tagline}</p>
                <p className="cue">{title.cue} &darr;</p>
              </Slot>
              <Slot x={160} y={70} w={880} h={260} ch="9" className="closing">
                <p className="k" style={{ marginBottom: 10 }}>{closing.kicker}</p>
                <p className="b">{closing.line}</p>
                <p className="date">{closing.dates}</p>
              </Slot>
            </g>
            <g id="fx" dangerouslySetInnerHTML={{ __html: fxMarkup() }} />
            <g id="vehicles" />
            <g id="measure" visibility="hidden" />
          </svg>

          <a className="skip" href="#site-footer">Skip the drive</a>
          <div className="hud-sign" aria-hidden="true">
            <span className="chip" id="chip">NJ · CA</span>
            <span className="chip-sub" id="chipSub">Two roads</span>
          </div>
          <ul className="stops" id="stops" aria-label="Jump to a stop" />
          <div className="odo" aria-hidden="true">
            <div className="lbl">The road<br />so far</div>
            <div className="digits" id="digits" />
            <div className="unit" id="unit">MI</div>
          </div>
          <div className="card" id="card" hidden aria-hidden="true">
            <p className="k" />
            <h3 />
            <p className="b" />
          </div>
        </div>
      </section>
    </div>
  );
}

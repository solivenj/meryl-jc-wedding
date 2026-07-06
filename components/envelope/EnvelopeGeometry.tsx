"use client";

import { motion } from "motion/react";
import { UNRAVEL } from "@/lib/motion";

/*
 * Envelope paper geometry, back-to-front:
 * back panel → interior liner → side flaps → bottom flap → flap cast-shadow →
 * top flap (hinged group) → monogram. Ground shadow lives in Envelope.tsx.
 *
 * Flap open (PRD §3.3 beat 3) is a 2.5D mirror-flip: scaleY 1 → 0 → -0.92
 * about the fold line (y=84), swapping the sealed outer face for a plain
 * underside at the zero crossing. This avoids SVG 3D-transform quirks while
 * reading as a hinge. ADR: rotateX on SVG groups is unreliable cross-browser.
 */

const FLAP_DELAY = UNRAVEL.bandOverlap + UNRAVEL.bandSlide;

export function EnvelopeGeometry({ p, open = false }: { p: string; open?: boolean }) {
  return (
    <g>
      {/* Back panel + crisp silhouette edge */}
      <rect
        x="40"
        y="80"
        width="480"
        height="280"
        rx="6"
        fill="var(--color-paper)"
        filter={`url(#${p}-paper)`}
      />
      <rect
        x="40"
        y="80"
        width="480"
        height="280"
        rx="6"
        fill="none"
        stroke="#b7a98c"
        strokeOpacity="0.55"
        strokeWidth="1"
      />

      {/* Interior liner — revealed as the flap hinges open. */}
      <rect x="46" y="84" width="468" height="150" fill="#c9bb9f" />

      {/* Side flaps folding toward center */}
      <path d="M 40 86 L 40 354 L 254 236 Z" fill={`url(#${p}-panel-side-l)`} filter={`url(#${p}-paper)`} />
      <path d="M 520 86 L 520 354 L 306 236 Z" fill={`url(#${p}-panel-side-r)`} filter={`url(#${p}-paper)`} />

      {/* Bottom flap over the side flaps */}
      <path
        d="M 40 356 L 520 356 C 470 322 330 234 292 214 C 284 210 276 210 268 214 C 230 234 90 322 40 356 Z"
        fill={`url(#${p}-panel-bottom)`}
        filter={`url(#${p}-paper)`}
      />
      {/* Bottom flap crease shadows */}
      <path
        d="M 40 356 C 90 322 230 234 268 214"
        fill="none"
        stroke="#8a7a5f"
        strokeOpacity="0.2"
        strokeWidth="1.4"
      />
      <path
        d="M 520 356 C 470 322 330 234 292 214"
        fill="none"
        stroke="#8a7a5f"
        strokeOpacity="0.2"
        strokeWidth="1.4"
      />

      {/* Top-light across the whole body */}
      <rect
        x="40"
        y="80"
        width="480"
        height="280"
        rx="6"
        fill={`url(#${p}-toplight)`}
        pointerEvents="none"
      />

      {/* Cast shadow of the flap edge — fades as the flap lifts. */}
      <g clipPath={`url(#${p}-body-clip)`}>
        <motion.path
          initial={false}
          data-flap-shadow
          d="M 40 92 L 520 92 C 468 136 332 232 294 256 C 285 261.5 275 261.5 266 256 C 228 232 92 136 40 92 Z"
          fill="#6b5b41"
          filter={`url(#${p}-flap-blur)`}
          animate={open ? { opacity: 0 } : { opacity: 0.18 }}
          transition={open ? { delay: FLAP_DELAY, duration: 0.3 } : { duration: 0 }}
        />
      </g>

      {/* Top flap — mirror-flips open about the fold line.
          NOTE: Motion computes its own transform-origin for SVG from
          originX/originY (CSS transform-origin gets overridden), so the hinge
          MUST be set via style.originX/originY: originY 0 = the fold line. */}
      <motion.g
        initial={false}
        data-flap
        style={{ originX: 0.5, originY: 0 }}
        animate={open ? { scaleY: -0.92 } : { scaleY: 1 }}
        transition={
          open
            ? { delay: FLAP_DELAY, duration: UNRAVEL.flapOpen, ease: "easeInOut" }
            : { duration: 0 }
        }
      >
        {/* Underside: plain deeper paper, appears as the flip crosses the fold. */}
        <motion.path
          initial={false}
          d="M 40 84 L 520 84 C 468 128 332 226 294 250 C 285 255.5 275 255.5 266 250 C 228 226 92 128 40 84 Z"
          fill="#d8cbb2"
          animate={open ? { opacity: 1 } : { opacity: 0 }}
          transition={
            open
              ? { delay: FLAP_DELAY + UNRAVEL.flapOpen * 0.48, duration: 0.06 }
              : { duration: 0 }
          }
        />

        {/* Sealed outer face (texture, creases, medallion) — hidden at the crossing. */}
        <motion.g
          initial={false}
          animate={open ? { opacity: 0 } : { opacity: 1 }}
          transition={
            open
              ? { delay: FLAP_DELAY + UNRAVEL.flapOpen * 0.48, duration: 0.06 }
              : { duration: 0 }
          }
        >
          <g filter={`url(#${p}-deckle)`}>
            <path
              d="M 40 84 L 520 84 C 468 128 332 226 294 250 C 285 255.5 275 255.5 266 250 C 228 226 92 128 40 84 Z"
              fill={`url(#${p}-flap)`}
              filter={`url(#${p}-paper)`}
            />
          </g>
          <path d="M 40 84 L 520 84" stroke="#8a7a5f" strokeOpacity="0.25" strokeWidth="2" />
          <path
            d="M 40 84 C 92 128 228 226 266 250"
            fill="none"
            stroke="#8a7a5f"
            strokeOpacity="0.16"
            strokeWidth="1.2"
          />
          <path
            d="M 520 84 C 468 128 332 226 294 250"
            fill="none"
            stroke="#8a7a5f"
            strokeOpacity="0.16"
            strokeWidth="1.2"
          />

          {/* Wax-seal-style monogram medallion on the flap point */}
          <g data-medallion>
            <ellipse
              cx="280"
              cy="230"
              rx="32"
              ry="39"
              fill="#f4edde"
              stroke="var(--color-ribbon-deep)"
              strokeWidth="1.8"
            />
            <ellipse
              cx="280"
              cy="230"
              rx="26"
              ry="33"
              fill="none"
              stroke="var(--color-ribbon-deep)"
              strokeWidth="0.8"
              strokeOpacity="0.75"
            />
            <text
              x="268"
              y="242"
              textAnchor="middle"
              fontSize="46"
              fill="var(--color-ribbon-deep)"
              stroke="var(--color-ribbon-deep)"
              strokeWidth="0.5"
              style={{ fontFamily: "var(--font-display)" }}
            >
              M
            </text>
            <text
              x="296"
              y="250"
              textAnchor="middle"
              fontSize="46"
              fill="var(--color-ribbon-deep)"
              stroke="var(--color-ribbon-deep)"
              strokeWidth="0.5"
              style={{ fontFamily: "var(--font-display)" }}
            >
              J
            </text>
          </g>
        </motion.g>
      </motion.g>
    </g>
  );
}

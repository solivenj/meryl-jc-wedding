"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "motion/react";
import { PaperFilters } from "./PaperFilters";
import { EnvelopeGeometry } from "./EnvelopeGeometry";
import { Ribbon } from "./Ribbon";
import { ACT_ONE, COUPLE, EVENT } from "@/lib/content";
import { EASE_OUT, ENTRANCE, UNRAVEL } from "@/lib/motion";

type EnvelopeProps = {
  /** "full" = Act I interactive button; "miniature" = S2 decorative callback. */
  variant?: "full" | "miniature";
  onOpen?: () => void;
  /** Play the Act I landing entrance (body springs down, shadow scales in). */
  entrance?: { delay: number } | false;
  /** Enable the idle bow breathe (Act I only). */
  idle?: boolean;
  /** Run the four-beat unravel (bow → bands → flap → card). */
  open?: boolean;
  className?: string;
};

/** Reveal beat starts once the flap is most of the way open. */
const REVEAL_DELAY = UNRAVEL.bandOverlap + UNRAVEL.bandSlide + UNRAVEL.flapOpen * 0.65;

/**
 * The envelope scene. In "full" mode it is a real <button> (keyboard path,
 * generous hit area = the whole envelope group, PRD §3.3).
 */
export function Envelope({
  variant = "full",
  onOpen,
  entrance = false,
  idle = false,
  open = false,
  className,
}: EnvelopeProps) {
  const raw = useId();
  const p = `env${raw.replace(/[^a-zA-Z0-9]/g, "")}`;
  const reduced = useReducedMotion();
  const animateEntrance = entrance !== false && !reduced;
  const entranceDelay = entrance === false ? 0 : entrance.delay;

  const svg = (
    <svg
      viewBox="0 0 560 400"
      role={variant === "miniature" ? "img" : undefined}
      aria-hidden={variant === "full" ? true : undefined}
      aria-label={
        variant === "miniature"
          ? "A small paper envelope tied again with its dusty blue ribbon"
          : undefined
      }
      className="block h-auto w-full overflow-visible"
    >
      <PaperFilters p={p} />

      {/* Ground shadow: warm-tinted; scales/fades in so the envelope reads as landing. */}
      <motion.ellipse
        cx="280"
        cy="376"
        rx="230"
        ry="18"
        fill="#8a7a5f"
        filter={`url(#${p}-ground-blur)`}
        initial={animateEntrance ? { opacity: 0, scaleX: 0.82 } : { opacity: 0.32 }}
        animate={{ opacity: 0.32, scaleX: 1 }}
        suppressHydrationWarning
        transition={
          animateEntrance
            ? { delay: entranceDelay + 0.15, duration: 0.8 }
            : { duration: 0 }
        }
        style={{ transformOrigin: "280px 376px" }}
      />

      {/* Envelope body: springs down onto its shadow. */}
      <motion.g
        initial={animateEntrance ? { y: -26 } : { y: 0 }}
        animate={{ y: 0 }}
        suppressHydrationWarning
        transition={
          animateEntrance
            ? { delay: entranceDelay, ...ENTRANCE.envelopeSpring }
            : { duration: 0 }
        }
      >
        <EnvelopeGeometry p={p} open={open} />
        <Ribbon p={p} idle={idle} open={open} />

        {/* The save-the-date card, rising through the slot at the fold line. */}
        {variant === "full" && (
          <g clipPath={`url(#${p}-slot-clip)`}>
            <motion.g
              data-card
              animate={open ? { y: -180 } : { y: 0 }}
              transition={
                open
                  ? { delay: REVEAL_DELAY, duration: UNRAVEL.reveal, ease: EASE_OUT }
                  : { duration: 0 }
              }
            >
              <g transform="translate(140 120)">
                <rect
                  width="280"
                  height="190"
                  rx="3"
                  fill={`url(#${p}-card)`}
                  stroke="#d8cdb8"
                  strokeWidth="1"
                />
                <text
                  x="140"
                  y="86"
                  textAnchor="middle"
                  fontSize="40"
                  fill="var(--color-ink)"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {COUPLE.names}
                </text>
                <line x1="90" y1="116" x2="190" y2="116" stroke="#b7a98c" strokeWidth="0.8" />
                <text
                  x="140"
                  y="146"
                  textAnchor="middle"
                  fontSize="11"
                  letterSpacing="3"
                  fill="var(--color-ink-soft)"
                  style={{ fontFamily: "var(--font-utility)" }}
                >
                  {EVENT.date.toUpperCase()}
                </text>
              </g>
            </motion.g>
          </g>
        )}
      </motion.g>
    </svg>
  );

  if (variant === "miniature") {
    return <div className={className}>{svg}</div>;
  }

  return (
    <button
      type="button"
      aria-label={ACT_ONE.openLabel}
      onClick={onOpen}
      disabled={open}
      className={`block w-full cursor-pointer select-none disabled:cursor-default ${className ?? ""}`}
    >
      {svg}
    </button>
  );
}

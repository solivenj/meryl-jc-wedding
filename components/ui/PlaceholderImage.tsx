"use client";

import { useId } from "react";

/*
 * Local placeholder photo (PRD §5): two-tone gradient + faint grain, centered
 * label documenting the slot. No external services. `tone="deep"` is a warm
 * charcoal field (B&W-film register, real contrast under ivory text);
 * `tone="soft"` is warm gray → ivory for inline images.
 */
type PlaceholderImageProps = {
  /** e.g. "HERO PHOTO · 3:2" — documents intended content + ratio. */
  label: string;
  /** Alt text describing the intended final photograph. */
  alt: string;
  tone?: "deep" | "soft";
  /** CSS aspect-ratio (e.g. "3 / 2"). Omit + `fill` for full-bleed slots. */
  aspect?: string;
  /** Absolutely fill the nearest positioned ancestor. */
  fill?: boolean;
  className?: string;
};

export function PlaceholderImage({
  label,
  alt,
  tone = "soft",
  aspect,
  fill = false,
  className,
}: PlaceholderImageProps) {
  const raw = useId();
  const id = `ph${raw.replace(/[^a-zA-Z0-9]/g, "")}`;

  const gradient =
    tone === "deep"
      ? "linear-gradient(150deg, #453e34 0%, #2e2a25 55%, #57493a 100%)"
      : "linear-gradient(150deg, #e6ddcb 0%, #f6f1e8 60%, #efe8db 100%)";

  return (
    <div
      role="img"
      aria-label={alt}
      className={`overflow-hidden ${fill ? "absolute inset-0 h-full w-full" : "relative"} ${className ?? ""}`}
      style={{ background: gradient, ...(aspect ? { aspectRatio: aspect } : {}) }}
    >
      {/* Film grain: reuses the paper-noise idea at photo scale. */}
      <svg aria-hidden className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
        <filter id={id}>
          <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="1" seed="5" />
          <feColorMatrix
            type="matrix"
            values={
              tone === "deep"
                ? "0 0 0 0 1  0 0 0 0 1  0 0 0 0 0.95  0.09 0.09 0.09 0 -0.08"
                : "0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.09 0.09 0.09 0 -0.08"
            }
          />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${id})`} />
      </svg>

      <span
        className={`absolute inset-0 grid place-items-center font-utility text-[10px] tracking-[0.3em] ${
          tone === "deep" ? "text-ivory/40" : "text-ink-soft/50"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

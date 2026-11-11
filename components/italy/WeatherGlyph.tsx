/*
 * Line-drawn weather icons in the same hand as the margin sketches: thin
 * round-capped strokes in currentColor, so they follow the ink on either
 * band. One viewBox for all of them, so a row of mixed icons lines up.
 */

export type GlyphKind =
  | "sun"
  | "moon"
  | "partly-day"
  | "partly-night"
  | "cloud"
  | "fog"
  | "rain"
  | "snow"
  | "storm";

/* WMO weather interpretation codes, as Open-Meteo returns them. */
export function glyphFor(code: number, isDay: boolean): GlyphKind {
  if (code === 0) return isDay ? "sun" : "moon";
  if (code <= 2) return isDay ? "partly-day" : "partly-night";
  if (code === 3) return "cloud";
  if (code <= 48) return "fog";
  if (code <= 67 || (code >= 80 && code <= 82)) return "rain";
  if (code <= 77 || code === 85 || code === 86) return "snow";
  return "storm";
}

const CLOUD = "M14 33h21a7 7 0 0 0 0-14 10 10 0 0 0-19-2 8 8 0 0 0-2 16z";
const SMALL_CLOUD = "M18 36h18a6 6 0 0 0 0-12 8.5 8.5 0 0 0-16-1.5A6.8 6.8 0 0 0 18 36z";
const SUN_RAYS = [0, 45, 90, 135, 180, 225, 270, 315];

function Sun({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <>
      <circle cx={cx} cy={cy} r={r} />
      {SUN_RAYS.map((a) => {
        const rad = (a * Math.PI) / 180;
        const x1 = cx + Math.cos(rad) * (r + 3);
        const y1 = cy + Math.sin(rad) * (r + 3);
        const x2 = cx + Math.cos(rad) * (r + 6.5);
        const y2 = cy + Math.sin(rad) * (r + 6.5);
        return <path key={a} d={`M${x1.toFixed(2)} ${y1.toFixed(2)}L${x2.toFixed(2)} ${y2.toFixed(2)}`} />;
      })}
    </>
  );
}

const MOON = (cx: number, cy: number, r: number) =>
  `M${cx + r * 0.35} ${cy - r}a${r} ${r} 0 1 0 ${r * 0.65} ${r * 1.55}A${r * 0.8} ${r * 0.8} 0 0 1 ${cx + r * 0.35} ${cy - r}z`;

export function WeatherGlyph({
  kind,
  size = 32,
  className = "",
}: {
  kind: GlyphKind;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 48 48"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {kind === "sun" && <Sun cx={24} cy={24} r={8} />}
      {kind === "moon" && <path d={MOON(22, 24, 11)} />}
      {kind === "partly-day" && (
        <>
          <Sun cx={18} cy={17} r={6} />
          <path d={SMALL_CLOUD} />
        </>
      )}
      {kind === "partly-night" && (
        <>
          <path d={MOON(17, 16, 7.5)} />
          <path d={SMALL_CLOUD} />
        </>
      )}
      {kind === "cloud" && <path d={CLOUD} />}
      {kind === "fog" && (
        <>
          <path d={CLOUD} />
          <path d="M11 39h22M17 43h20" />
        </>
      )}
      {kind === "rain" && (
        <>
          <path d={CLOUD} />
          <path d="M18 38l-2 5M25 38l-2 5M32 38l-2 5" />
        </>
      )}
      {kind === "snow" && (
        <>
          <path d={CLOUD} />
          <path d="M17 40h.01M24 42h.01M31 40h.01M20.5 45h.01M27.5 45h.01" strokeWidth={2.4} />
        </>
      )}
      {kind === "storm" && (
        <>
          <path d={CLOUD} />
          <path d="M25 35l-4 6h5l-3 6" />
        </>
      )}
    </svg>
  );
}

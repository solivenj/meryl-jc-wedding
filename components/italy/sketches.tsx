/*
 * TEMPORARY fallback line drawings, ported from the Claude Design file. Each is
 * replaced by a real, licensed hand-drawn illustration once approved — see
 * lib/italy-art.ts. Delete an entry here once its image lands.
 */

export type MotifName =
  | "vespa"
  | "coupe"
  | "espresso"
  | "lemon"
  | "olive"
  | "hat"
  | "swallow"
  | "moon"
  | "bottle"
  | "boat"
  | "arch"
  | "rings"
  | "pizza"
  | "gelato"
  | "wineglass"
  | "flowers";

export type SceneName = "villa" | "chapel" | "loggia";

/* Motifs added with real art (pizza, gelato, wineglass, flowers) have no sketch fallback. */
export const MOTIF_PATHS: Partial<Record<MotifName, string[]>> = {
  vespa: [
    "M13 74a11 11 0 1 0 22 0a11 11 0 1 0-22 0",
    "M69 74a11 11 0 1 0 22 0a11 11 0 1 0-22 0",
    "M36 76h30c-1-8 2-13 7-15l10-4",
    "M66 61c9-1 14 3 17 10",
    "M83 71c4-8 2-16-3-20",
    "M36 76c-5-1-8-5-8-11 0-12 5-22 11-27l6-5",
    "M45 33h16c3 0 4 2 3 4l-5 9c-1 2-3 3-5 3H43",
    "M45 33l-3-6",
    "M42 27h-9",
    "M13 70c3-6 7-9 11-9",
  ],
  coupe: [
    "M30 26h40l-6 18c-3 8-8 12-14 12s-11-4-14-12z",
    "M50 56v20",
    "M36 78h28",
    "M46 34a4 4 0 1 0 8 0a4 4 0 1 0-8 0",
  ],
  espresso: [
    "M26 42h40v14c0 9-7 16-16 16h-8c-9 0-16-7-16-16z",
    "M66 46h6c6 0 10 4 10 9s-4 9-10 9h-6",
    "M18 80h58",
    "M40 32c4-4 0-8 2-12",
    "M52 32c4-4 0-8 2-12",
  ],
  lemon: [
    "M27 65.5c-2.8-7.8 3.4-17.4 13.9-21.2s20.9-.5 23.7 7.3-3.4 17.4-13.9 21.2-20.9.5-23.7-7.3z",
    "M54 50c8-10 16-15 26-15",
    "M63 42c-3-9 2-15 11-17 2 9-3 15-11 17z",
  ],
  olive: [
    "M18 80c20-10 40-30 62-56",
    "M31.8 63.7c-1.6-2.3 1.4-6.8 6.6-10.1s10.9-4.4 12.5-2.1-1.4 6.8-6.6 10.1-10.9 4.4-12.5 2.1z",
    "M51.8 45.7c-1.6-2.3 1.4-6.8 6.6-10.1s10.9-4.4 12.5-2.1-1.4 6.8-6.6 10.1-10.9 4.4-12.5 2.1z",
    "M45 68a5 5 0 1 0 10 0a5 5 0 1 0-10 0",
    "M63 50a5 5 0 1 0 10 0a5 5 0 1 0-10 0",
  ],
  hat: [
    "M34 56c0-17 4-28 16-28s16 11 16 28",
    "M14 58c0-6 16-10 36-10s36 4 36 10-16 10-36 10-36-4-36-10z",
  ],
  swallow: [
    "M38 52c-8-10-18-16-28-18 8 9 12 17 13 24 6-3 11-4 15-6z",
    "M62 48c8-12 18-20 28-23-7 10-10 19-11 27-6-3-12-4-17-4z",
    "M38 52c4-6 10-9 16-9 5 0 8 2 8 5 0 6-6 12-14 17l-18 12 8-16z",
    "M48 65l4 12 10-8",
    "M60 46l6-2",
  ],
  moon: [
    "M64 22a30 30 0 1 0 0 56 34 34 0 0 1 0-56z",
    "M26 26v9M21.5 30.5h9",
    "M80 60v7M76.5 63.5h7",
  ],
  bottle: [
    "M38 86h26V50c0-7-5-9-5-15V26H43v9c0 6-5 8-5 15z",
    "M43 20h14v6H43z",
    "M72 20l9-7",
    "M82 9a4 4 0 1 0 8 0a4 4 0 1 0-8 0",
    "M64 14l6-4M70 28l9-2",
  ],
  boat: [
    "M12 64h74l-11 15H24z",
    "M34 64V50h28v14",
    "M39 50v-9h17v9",
    "M8 88c8 5 15-4 23 0s15-4 23 0 15-4 23 0",
  ],
  arch: ["M32 84V48a18 18 0 0 1 36 0v36z", "M50 30v54", "M32 58h36", "M26 88h48"],
  rings: [
    "M23 58a17 17 0 1 0 34 0a17 17 0 1 0-34 0",
    "M45 58a17 17 0 1 0 34 0a17 17 0 1 0-34 0",
    "M62 30l4-6 4 6",
  ],
};

export const SCENE_PATHS: Record<SceneName, string[]> = {
  villa: [
    "M60 142h180", "M66 142V62h168v80", "M58 62h184", "M62 54h176l-4 8H66z",
    "M84 142v-24a12 12 0 0 1 24 0v24z", "M126 142v-24a12 12 0 0 1 24 0v24z",
    "M168 142v-24a12 12 0 0 1 24 0v24z", "M210 142v-24a12 12 0 0 1 12-12",
    "M84 96h28v-22H84zM136 96h28V74h-28zM188 96h28V74h-28z", "M98 74v22M150 74v22M202 74v22",
    "M150 54V36", "M30 142c0-8 2-14 2-14", "M32 128c9-11 10-26 7-36-2-7-11-9-15 0-3 10-2 25 8 36z",
    "M268 142c0-8-2-14-2-14", "M266 128c10-11 11-26 8-36-3-7-12-9-15 0-3 10-2 25 7 36z",
  ],
  chapel: [
    "M50 142h200", "M92 142V70h116v72", "M86 70l64-34 64 34",
    "M126 142V104a24 24 0 0 1 48 0v38", "M150 104v38M126 120h48", "M150 52v-16M142 44h16",
    "M218 142V56h30v86", "M214 56l19-14 19 14", "M226 100h14v-18h-14z", "M233 82v18",
    "M112 96a10 10 0 0 1 20 0", "M168 96a10 10 0 0 1 20 0",
  ],
  loggia: [
    "M20 142h260", "M56 130V74M104 130V74M152 130V74M200 130V74M248 130V74",
    "M50 74h12M98 74h12M146 74h12M194 74h12M242 74h12", "M50 130h212", "M44 66h220l-6 8H50z",
    "M44 66V44h220v22", "M70 62V48h22v14zM118 62V48h22v14zM166 62V48h22v14zM214 62V48h22v14z",
    "M56 130v12M104 130v12M152 130v12M200 130v12M248 130v12", "M20 142c14-6 26-6 36 0",
    "M280 142c-14-6-26-6-36 0",
  ],
};

export function Sketch({
  paths,
  viewBox,
  className,
  style,
}: {
  paths: string[];
  viewBox: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg viewBox={viewBox} className={className} style={style} aria-hidden="true">
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {paths.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
    </svg>
  );
}

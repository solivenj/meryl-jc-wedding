import Image from "next/image";
import { MOTIF_ART, SCENE_ART } from "@/lib/italy-art";
import { MOTIF_PATHS, SCENE_PATHS, Sketch, type MotifName, type SceneName } from "./sketches";

/*
 * Illustrations for /italy-wedding. Renders the approved hand-drawn image when
 * one is registered in lib/italy-art.ts, otherwise the design's line sketch.
 * Motifs are decorative (alt=""); scenes describe the place.
 */

export function Motif({
  name,
  size,
  className,
  style,
}: {
  name: MotifName;
  size: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const art = MOTIF_ART[name];
  if (art) {
    return (
      <Image
        src={art.src}
        width={art.width}
        height={art.height}
        alt=""
        aria-hidden="true"
        className={className}
        style={{ width: size, height: size, objectFit: "contain", ...style }}
      />
    );
  }
  const paths = MOTIF_PATHS[name];
  if (!paths) return null;
  return (
    <Sketch
      paths={paths}
      viewBox="0 0 100 100"
      className={className}
      style={{ width: size, height: size, ...style }}
    />
  );
}

const SCENE_ALT: Record<SceneName, string> = {
  villa: "Drawing of an Italian villa with arched doors between two cypress trees",
  chapel: "Drawing of a hill-town chapel with a bell tower",
  loggia: "Drawing of a colonnaded loggia",
};

export function Scene({ name }: { name: SceneName }) {
  const art = SCENE_ART[name];
  const className = "h-auto w-[min(300px,86vw)] text-ink";
  if (art) {
    return (
      <Image
        src={art.src}
        width={art.width}
        height={art.height}
        alt={SCENE_ALT[name]}
        className={className}
      />
    );
  }
  return (
    <div role="img" aria-label={SCENE_ALT[name]}>
      <Sketch paths={SCENE_PATHS[name]} viewBox="0 0 300 150" className={className} />
    </div>
  );
}

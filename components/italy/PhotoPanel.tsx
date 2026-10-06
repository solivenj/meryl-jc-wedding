import Image from "next/image";
import { PHOTO_ART, type PhotoSlot } from "@/lib/italy-art";

/*
 * A photo / painting slot. Until a real image is registered in lib/italy-art.ts
 * it shows the design's warm gradient, so the layout reads correctly now.
 */
export function PhotoPanel({
  slot,
  gradient,
  className = "",
  sizes = "100vw",
  priority = false,
  children,
}: {
  slot: PhotoSlot;
  gradient: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  children?: React.ReactNode;
}) {
  const art = PHOTO_ART[slot];
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={art ? undefined : { background: gradient }}
    >
      {art && (
        <Image
          src={art.src}
          alt={art.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      )}
      {children}
    </div>
  );
}

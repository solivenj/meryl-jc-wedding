import type { MotifName, SceneName } from "@/components/italy/sketches";

/*
 * Approved, licensed hand-drawn illustrations for /italy-wedding. Files live
 * in public/italy/art/ (processed by scripts/process-illustrations.mjs: paper
 * knocked out, tinted to ink #1E231E, WebP). Sources + licenses are recorded in
 * public/italy/CREDITS.md.
 *
 * A name with no entry falls back to the design's temporary line sketch.
 */
export type ArtImage = { src: string; width: number; height: number };

/* Round 2 (approved): Vecteezy free assets — attribution in the footer. Cut
   from preview sheets for now; re-run the script on the full downloads. */
export const MOTIF_ART: Partial<Record<MotifName, ArtImage>> = {
  vespa: { src: "/italy/art/vespa.webp", width: 187, height: 171 },
  olive: { src: "/italy/art/olive.webp", width: 86, height: 229 },
  pizza: { src: "/italy/art/pizza.webp", width: 120, height: 125 },
  gelato: { src: "/italy/art/gelato.webp", width: 82, height: 243 },
  rings: { src: "/italy/art/rings.webp", width: 101, height: 60 },
  swallow: { src: "/italy/art/swallow.webp", width: 219, height: 187 },
  /* Round 3 */
  wineglass: { src: "/italy/art/wineglass.webp", width: 92, height: 92 },
  coupe: { src: "/italy/art/coupe.webp", width: 212, height: 212 },
  flowers: { src: "/italy/art/flowers.webp", width: 115, height: 275 },
  boat: { src: "/italy/art/boat.webp", width: 152, height: 178 },
  /* Round 4 */
  espresso: { src: "/italy/art/espresso.webp", width: 95, height: 101 },
  hat: { src: "/italy/art/hat.webp", width: 219, height: 96 },
};

export const SCENE_ART: Partial<Record<SceneName, ArtImage>> = {};

/* Photo / painting slots: home band (4), dress-code panels (3), RSVP hero (1). */
export type PhotoSlot =
  | "home1"
  | "home2"
  | "home3"
  | "home4"
  | "cocktail"
  | "blacktie"
  | "linen"
  | "rsvp";

export const PHOTO_ART: Partial<Record<PhotoSlot, ArtImage & { alt: string }>> = {};

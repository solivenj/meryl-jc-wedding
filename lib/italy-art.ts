import type { MotifName, SceneName } from "@/components/italy/sketches";

/*
 * Approved, licensed hand-drawn illustrations for /italy. Files live
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

/*
 * Photo slots.
 *
 * Page heroes keep their own named slots; the dress-code strips are keyed
 * by code + section + index. A missing entry is not an error — PhotoPanel
 * falls back to the gradient it is given, which is what lets the layout work
 * before the photography exists.
 */
export type PhotoSlot =
  | "home1"
  | "home2"
  | "home3"
  | "home4"
  | "cocktail"
  | "blacktie"
  | "linen"
  | "rsvp"
  | "cocktailLadies1"
  | "cocktailLadies2"
  | "cocktailLadies3"
  | "cocktailLadies4"
  | "cocktailLadies5"
  | "cocktailGents1"
  | "cocktailGents2"
  | "cocktailGents3"
  | "cocktailGents4"
  | "cocktailGents5"
  | "blacktieLadies1"
  | "blacktieLadies2"
  | "blacktieLadies3"
  | "blacktieLadies4"
  | "blacktieLadies5"
  | "blacktieGents1"
  | "blacktieGents2"
  | "blacktieGents3"
  | "blacktieGents4"
  | "blacktieGents5";

/*
 * Attire references. Sources and licensing: public/italy/CREDITS.md.
 *
 * The black-tie strips are deliberately absent — the reference set is a
 * garden wedding in pastels and has nothing formal in it, so those five slots
 * stay on gradients until the right images are chosen. Better an obvious
 * placeholder than a cocktail photograph captioned black tie.
 */
export const PHOTO_ART: Partial<Record<PhotoSlot, ArtImage & { alt: string }>> = {
  cocktailLadies1: { src: "/italy/attire/ladies-cocktail-1.webp", width: 647, height: 799, alt: "Guests in pastel dresses on a clifftop" },
  cocktailLadies2: { src: "/italy/attire/ladies-cocktail-2.webp", width: 533, height: 800, alt: "Two guests in long summer dresses under trees" },
  cocktailLadies3: { src: "/italy/attire/ladies-cocktail-3.webp", width: 647, height: 799, alt: "Guests in pastel and floral dresses walking through a garden" },
  cocktailLadies4: { src: "/italy/attire/ladies-cocktail-4.webp", width: 527, height: 800, alt: "Guests with parasols in soft-coloured dresses" },
  cocktailLadies5: { src: "/italy/attire/ladies-cocktail-5.webp", width: 533, height: 799, alt: "A rail of floral and pastel summer dresses" },
  cocktailGents1: { src: "/italy/attire/gents-cocktail-1.webp", width: 649, height: 799, alt: "Guests in light tan suits beside the sea" },
  cocktailGents2: { src: "/italy/attire/gents-cocktail-2.webp", width: 640, height: 800, alt: "A group in cream and pastel summer suits" },
  cocktailGents3: { src: "/italy/attire/gents-cocktail-3.webp", width: 646, height: 800, alt: "Two guests in light tailored summer suits" },
  cocktailGents4: { src: "/italy/attire/gents-formal-2.webp", width: 410, height: 798, alt: "A double-breasted suit in warm brown" },
  cocktailGents5: { src: "/italy/attire/ladies-shoes.webp", width: 1066, height: 1599, alt: "A pair of ivory heeled sandals" },
};

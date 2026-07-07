/*
 * All site copy in one place (PRD §5) so John can rewrite in a single file.
 * Real values: names, date, venue. Everything marked PLACEHOLDER is John's to replace.
 */

export const COUPLE = {
  names: "Meryl & John",
  first: "Meryl",
  second: "John",
  monogram: { left: "M", right: "J" },
};

export const EVENT = {
  date: "April 10, 2027",
  /* PLACEHOLDER — ceremony time TBC (PRD §9.2) */
  dateLine: "APRIL 10, 2027 · 12 PM",
  venueLine: "ST. ALOYSIUS R.C. CHURCH, JERSEY CITY",
  venueFull: "St. Aloysius R.C. Church, Jersey City, NJ",
};

export const ACT_ONE = {
  eyebrow: "SAVE OUR DATE",
  /* User-specified real copy — not a placeholder. */
  tagline: "Wrapped tight, sent with love",
  ctaPointer: "CLICK TO OPEN",
  ctaTouch: "TAP TO OPEN",
  /* Accessible name contains the card's visible text (axe: label-content-name-mismatch). */
  openLabel: "Meryl & John, April 10, 2027: open the save the date",
};

export const HERO = {
  eyebrow: "WELCOMING YOU TO THE MATRIMONY OF",
};

export const STORY = {
  /* PLACEHOLDER — side captions (PRD §4.1 S2) */
  captionLeft: ["OUR LOVE", "A FAIRYTALE"],
  captionRight: ["A MEMORY", "A STORY"],
  /* PLACEHOLDER — invitation copy (~60 words); John will rewrite. */
  invitation:
    "Love found us in the quiet ways: in shared laughter, in long walks home, " +
    "in a bond that grew stronger with every passing season. With grateful " +
    "hearts and endless joy, we have chosen forever. We would be honored to " +
    "have you beside us on our wedding day, to witness the beginning of our " +
    "next chapter and every moment until then, wrapped with love.",
};

export const PROGRAM = {
  header: "Program",
  /* PLACEHOLDER — all times and items (PRD §4.1 S4) */
  rows: [
    { time: "5:00 PM", item: "Welcome Photos & Cocktails" },
    { time: "6:00 PM", item: "Dinner Program" },
    { time: "7:00 PM", item: "Toasts & Speeches" },
    { time: "8:00 PM", item: "Official Picture Taking" },
    { time: "9:00 PM", item: "Open Bar & Dancing" },
  ],
};

export const RECEPTION = {
  header: "Reception",
  /* PLACEHOLDER — all blocks (PRD §4.1 S4) */
  blocks: [
    {
      label: "Reception Venue",
      body:
        "Our reception will follow the ceremony at a venue nearby. The " +
        "celebration continues into the evening with dinner, dancing, and " +
        "a few surprises we are keeping wrapped for now.",
    },
    {
      label: "Dress Code",
      body:
        "Garden formal: breathable fabrics and comfortable shoes. Heels " +
        "are optional, dancing is not. Please save ivory for the bride.",
    },
    {
      label: "Parking & Directions",
      body:
        "Free parking is available on site, with designated areas for " +
        "rideshare pick up and drop off close to the entrance. Details " +
        "will follow with the formal invitation.",
    },
  ],
};

export const CLOSING = {
  line: "We Look Forward to Seeing You.",
};

/* Alt text: hero is the real rings photo; the rest are placeholders (PRD §7). */
export const PLACEHOLDER_ALT = {
  hero: "John placing the engagement ring on Meryl's hand",
  band: "Candid photograph of Meryl and John dancing, soft motion blur",
  closing: "Bridal bouquet of white calla lilies held in gloved hands",
};

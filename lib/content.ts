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

export const RSVP = {
  /* Small section above Program. PLACEHOLDER copy — John's to rewrite. */
  headline: "Will you celebrate with us?",
  subline:
    "Kindly send your reply by March 1, 2027 so we can save you a seat at the table.",
  buttonLabel: "RSVP",
  /* Modal form copy */
  modalTitle: "RSVP",
  modalIntro: "We can't wait to celebrate with you. Just a few details:",
  fields: {
    name: { label: "Full name", placeholder: "First and last name" },
    email: { label: "Email", placeholder: "you@example.com" },
    attending: {
      label: "Will you attend?",
      yes: "Joyfully accepts",
      no: "Regretfully declines",
    },
    /* Built but hidden behind RSVP_SHOW_GUEST_COUNT (lib/config.ts). */
    guests: { label: "Number of guests", placeholder: "1" },
    dietary: {
      label: "Dietary needs",
      placeholder: "Allergies or restrictions (optional)",
    },
    message: {
      label: "A note for the couple",
      placeholder: "Anything you'd like us to know (optional)",
    },
  },
  submitLabel: "Send RSVP",
  submittingLabel: "Sending…",
  /* Post-submit states */
  successTitle: "Thank you!",
  successBody: "Your RSVP is in. We're so grateful you'll be part of our day.",
  errorTitle: "Something went wrong",
  errorBody: "We couldn't save your RSVP just now. Please try again, or email us:",
  retryLabel: "Try again",
  /* mailto fallback shown on error — PLACEHOLDER address */
  mailtoFallback: "meryl.and.john@example.com",
};

export const TRAVEL = {
  header: "Travel & Stay",
  /* PLACEHOLDER — John's to replace with real hotels/directions. */
  blocks: [
    {
      label: "Getting There",
      body:
        "Both the ceremony and reception are a short drive from Newark " +
        "Liberty (EWR). Rideshare is plentiful; we'll share exact routes " +
        "and timing with the formal invitation.",
    },
    {
      label: "Where to Stay",
      body:
        "We've reserved a block of rooms at a hotel near the venue at a " +
        "special rate. Booking details and the group code will follow by " +
        "email in the coming months.",
    },
    {
      label: "Parking",
      body:
        "Complimentary parking is available on site, with rideshare drop " +
        "off close to the entrance for anyone who'd rather not drive.",
    },
  ],
};

export const FAQ = {
  header: "FAQ",
  /* PLACEHOLDER — common guest questions; John's to rewrite. */
  items: [
    {
      question: "Can I bring a plus one?",
      answer:
        "Your invitation will name everyone we've reserved a seat for. If " +
        "you have a question, just reach out and we'll do our best.",
    },
    {
      question: "Are kids welcome?",
      answer:
        "We love your little ones, but this celebration is planned as an " +
        "adults-only evening so everyone can relax and dance.",
    },
    {
      question: "What should I wear?",
      answer:
        "Garden formal. Think breathable fabrics and shoes you can dance " +
        "in. Please save ivory for the bride.",
    },
  ],
};

export const CLOSING = {
  line: "See you at the altar",
};

/* Alt text for the real photos placed throughout the site (PRD §7). */
export const PLACEHOLDER_ALT = {
  hero: "John placing the engagement ring on Meryl's hand",
  band: "Meryl and John walking hand in hand through a museum gallery, motion blurred",
  closing: "Meryl and John laughing together on a balcony",
};

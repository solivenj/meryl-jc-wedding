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
  dateLine: "APRIL 10, 2027 · 3 PM",
  venueLine: "ST. ALOYSIUS CATHOLIC CHURCH, JERSEY CITY",
  venueFull: "St. Aloysius Catholic Church, Jersey City, NJ",
  /*
   * Countdown target. The offset is written explicitly (-04:00 = US Eastern
   * is on EDT in April) rather than built from a local-time string, so every
   * guest counts down to the same instant no matter their timezone.
   */
  ceremonyISO: "2027-04-10T15:00:00-04:00",
};

/* The two real venues, pinned on the Venue section's maps. */
export const VENUES = [
  {
    label: "Ceremony",
    name: "St. Aloysius Catholic Church",
    address: "691 West Side Ave, Jersey City, NJ 07304",
    time: "3:00 PM",
  },
  {
    label: "Reception",
    name: "Adega Grill",
    address: "130 Ferry St, Newark, NJ 07105",
    time: "6:00 PM",
  },
];

export const COUNTDOWN = {
  eyebrow: "COUNTING DOWN",
  line: "Until we say I do",
  units: {
    days: "Days",
    hours: "Hours",
    minutes: "Minutes",
    seconds: "Seconds",
  },
  /* Shown once the ceremony is behind us — no dead zeros. */
  passed: "We're married!",
  passedNote: "Thank you for celebrating with us.",
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
        "Our reception follows the ceremony at Adega Grill in Newark, where " +
        "the celebration continues into the evening with dinner, dancing, and " +
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

  /* Modal — step 1: find yourself */
  modalTitle: "RSVP",
  search: {
    intro: "Find your invitation by typing your name.",
    label: "Your name",
    placeholder: "Start typing your first or last name…",
    help: "Look yourself up and your whole party will appear.",
    searching: "Searching…",
    notFound:
      "We couldn't find that name. Check the spelling, try a last name, or reach us at",
    backLabel: "Search a different name",
  },

  /* Modal — step 2: your party */
  party: {
    intro: "Let us know who's coming. You can respond for your whole party.",
    attendingLabel: "Attending?",
    yes: "Joyfully accepts",
    no: "Regretfully declines",
    dietaryLabel: "Dietary needs",
    dietaryPlaceholder: "Allergies or restrictions (optional)",
    kidTag: "Child",
    addPlusOne: "Add a guest",
    plusOneNote: "You may bring one guest.",
    plusOneNamePlaceholder: "Your guest's name",
    removePlusOne: "Remove",
    emailLabel: "Email",
    emailPlaceholder: "you@example.com",
    messageLabel: "A note for the couple",
    messagePlaceholder: "Anything you'd like us to know (optional)",
  },

  submitLabel: "Send RSVP",
  submittingLabel: "Sending…",

  /* Post-submit + edit + closed states */
  successTitle: "Thank you!",
  successBody: "Your RSVP is in. We're so grateful you'll be part of our day.",
  editingNote: "You've responded before — your answers are filled in below. Update anything and resend.",
  editConfirmTitle: "Update your RSVP?",
  editConfirmBody: "You already have an RSVP on file for this party. Do you want to review and update it?",
  editConfirmYes: "Yes, update it",
  editConfirmNo: "Cancel",
  closedTitle: "RSVPs are closed",
  closedBody: "The deadline to respond has passed. If you need to reach us, email",
  errorTitle: "Something went wrong",
  errorBody: "We couldn't save your RSVP just now. Please try again, or email us:",
  retryLabel: "Try again",
  /* mailto fallback shown on error / closed — PLACEHOLDER address */
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

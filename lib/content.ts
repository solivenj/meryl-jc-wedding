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
  captionRight: ["A PAINTING", "A CENTERPIECE"],
  /* Invitation copy — one string per paragraph. Story.tsx mask-reveals each
     paragraph as its own group, so paragraph breaks live here. */
  invitation: [
    "Our love started in college, falling more in love with each study session, " +
      "meals shared, and time spent together. After a first date with dinner and a scary movie, " +
      "we knew that our connection was real and special.",
    "Through periods of long distance on opposite coasts of the country, " +
      "there was nothing that could affect our love for each other. " +
      "We became each other's #1 person, navigating life hand in hand.",
    "We would be honored to have you beside us on our wedding day to witness the beginning of our " +
      "next chapter and every moment until then",
  ],
};

export const PROGRAM = {
  header: "Program",
  /* PLACEHOLDER — all times and items (PRD §4.1 S4) */
  rows: [
    { time: "3:00 PM", item: "Marriage Ceremony Begins" },
    { time: "6:00 PM", item: "Welcome Photos & Cocktails" },
    { time: "7:00 PM", item: "Dinner Program" },
    { time: "8:00 PM", item: "Toasts & Speeches" },
    { time: "9:00 PM", item: "Dancing!" },
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
        "lots of fun.",
    },
    /* Dress code lives in the FAQ ("What should I wear?") — it was duplicated
       here almost word for word. TODO(John): confirm "family style" and the
       open bar against what's actually booked at Adega before this ships. */
    {
      label: "Dinner & Drinks",
      body:
        "Dinner is served family style, with plenty of it, and the bar stays " +
        "open through the night. If you let us know about allergies or " +
        "restrictions in your RSVP, the kitchen will take care of the rest.",
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
    intro: "Find your invitation by typing your full name.",
    label: "Your name",
    placeholder: "First and last name…",
    searching: "Searching…",
    notFound:
      "We couldn't find that name. Check the spelling, make sure you've entered both your first and last name, or reach us at",
    ambiguous:
      "We have more than one guest by that name, so we'd rather not guess. Send us a note at",
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

  /* Recap shown when a returning guest picks their party — read-only view of
     the latest RSVP on file, with an Edit button that opens the form. Only ever
     shown to the browser that submitted it (see lib/rsvp-cookie.ts). */
  recap: {
    submittedPrefix: "Submitted",
    editButton: "Edit RSVP",
    back: "Search a different name",
    noResponse: "No response recorded",
    guestPrefix: "Guest",
    emailLabel: "Email",
    noteLabel: "Note",
  },

  /* Shown instead of the recap when we can't tell that this device sent the
     original reply — e.g. a guest on a new phone. Confirms a reply exists and
     when, and nothing else about it. */
  responded: {
    title: "You've already replied",
    body: "We have a response on file for your party from",
    replaceNote:
      "If this was you and you'd like to change it, fill the form in again — your new answers replace the old ones.",
    continueButton: "Respond again",
  },
  closedTitle: "RSVPs are closed",
  closedBody: "The deadline to respond has passed. If you need to reach us, email",
  errorTitle: "Something went wrong",
  errorBody: "We couldn't save your RSVP just now. Please try again, or email us:",
  retryLabel: "Try again",
  /* mailto fallback shown on error / closed — PLACEHOLDER address */
  mailtoFallback: "meryl.and.john@example.com",
};

export const TRAVEL = {
  header: "Travel",
  /* PLACEHOLDER — John's to replace with real hotels/directions. */
  blocks: [
    {
      label: "Getting There",
      body:
        "Both the ceremony and reception are a short drive from Newark " +
        "Liberty (EWR) and rideshare is plentiful.",
    },
    /* No hotel block — guests are local, so nobody needs lodging. Replaced with
       the one piece of travel this wedding actually creates: the ceremony and
       reception are in two different cities.
       TODO(John): confirm the drive time between the two venues. */
    {
      label: "Between the Venues",
      body:
        "The ceremony and the reception are about twenty minutes apart — St. " +
        "Aloysius in Jersey City, then Adega Grill in Newark. Rideshare runs " +
        "easily between the two if you'd rather leave the car where it is.",
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
        "Cocktail attire and Filipino traditional barongs! Please save ivory for the bride.",
    },
    /* The ceremony is at three and dinner isn't until six — the likeliest
       question any guest will have, and the only place the site answers it. */
    {
      question: "What happens between the ceremony and the reception?",
      answer:
        "There's a bit of a gap while we steal away for photos — the reception " +
        "starts at six. Cocktails begin the moment you arrive, and there's " +
        "plenty nearby in the Ironbound if you'd like a coffee or a drink first.",
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

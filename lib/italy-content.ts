/*
 * All copy for /italy-wedding in one place — same pattern as lib/content.ts.
 *
 * Facts marked VERIFIED came from venue / transport sources (Sept 2026).
 * Anything marked TBD is a placeholder in the right voice that Meryl & John
 * still need to confirm or rewrite (times, locations, dress codes, etc.).
 */
import { RSVP as SAVE_THE_DATE_RSVP } from "./content";

export const ITALY = {
  names: "Meryl & John",
  monogram: "M&J",
  dates: "April 21 – 23 · 2027",
  place: "Todi, Umbria",
  footerLine: "Todi, Umbria · MMXXVII",
  /* VERIFIED — Monastero Santa Margherita is the wedding venue of Hotel Bramante. */
  venue: {
    name: "Monastero Santa Margherita",
    address: "Via Circonvallazione Orvietana est 48, 06059 Todi (PG)",
    website: "https://monasterosantamargherita.com/",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Monastero+Santa+Margherita+Hotel+Bramante+Todi",
  },
};

export const ITALY_NAV = [
  { href: "/italy-wedding", label: "Home" },
  { href: "/italy-wedding/schedule", label: "Schedule" },
  { href: "/italy-wedding/dress-code", label: "Dress Code" },
  { href: "/italy-wedding/stay", label: "Stay" },
  { href: "/italy-wedding/faq", label: "FAQ" },
  { href: "/italy-wedding/rsvp", label: "RSVP" },
] as const;

export const ITALY_HOME = {
  heroScript: "Il nostro giorno",
  kicker: "Save the date",
  /* TBD — rewrite freely. Venue facts are verified; the plans are placeholders. */
  intro:
    "Three days in a hill town above the Tiber valley — a welcome aperitivo on the piazza, a ceremony at the Monastero Santa Margherita, and a long dinner beneath its frescoed ceilings. Bring good shoes for the stone lanes and something warm for the evening; April in Umbria is green, bright at noon, and cool after dark. Formal invitations will follow; this page will hold everything you need until then.",
  replyBy: "Kindly reply by the first of February",
};

/* TBD — the whole order of days is a placeholder built on real Todi places. */
export const ITALY_SCHEDULE = {
  eyebrow: "The order of the days",
  days: [
    {
      day: "Wednesday, April 21st",
      art: "villa",
      title: "Pizza Party",
      quote: "Come as you are, stay until the lamps go on",
      time: "Seven in the evening",
      // place: "Piazza del Popolo · Todi",
      dress: "Summer Cocktail",
    },
    {
      day: "Thursday, April 22nd",
      art: "chapel",
      title: "The Ceremony & Reception",
      quote: "Four o’clock, and the bells across the valley",
      time: "Four in the afternoon, dinner at eight",
      place: "Monastero Santa Margherita · Todi",
      dress: "Black Tie",
    },
    {
      day: "Friday, April 23rd",
      art: "loggia",
      title: "Farewell",
      quote: "Long tables, slow afternoon",
      time: "Midday until late afternoon",
      place: "Details to follow",
      dress: "Linen & Sun Hats",
    },
  ],
} as const;

/* TBD — dress codes mirror the schedule above. */
export const ITALY_DRESS = {
  eyebrow: "What to wear",
  intro:
    "Three occasions, three registers. Nothing here is a rule so much as a temperature — April in Umbria is bright at noon and genuinely cold after nine, and most floors you will stand on are stone.",
  panels: [
    {
      word: "Cocktail",
      label: "Wednesday · Welcome",
      body: "Printed silk, a light suit, no tie. Colour is welcome — the piazza is pale travertine and everything reads well against it.",
      tone: "terracotta",
    },
    {
      word: "Black Tie",
      label: "Thursday · Ceremony",
      body: "Long dress, dinner jacket. A block heel will thank you on the old stone floors; bring a wrap for the terrace once the sun goes down.",
      tone: "olive",
    },
    {
      word: "Linen",
      label: "Friday · Lunch in the grove",
      body: "Anything you would wear on a warm gravel track and still be happy in at five o’clock. Sun hats encouraged, flat soles strongly advised.",
      tone: "ochre",
      wide: true,
    },
  ],
} as const;

/* VERIFIED places (Sept 2026 research); availability for 2027 not checked. */
export const ITALY_STAY = {
  eyebrow: "Fly to Rome or Perugia · Book early",
  groups: [
    {
      title: "The Venue",
      lines: ["Hotel Bramante — the Monastero’s own rooms, Todi"],
    },
    {
      title: "Luxury Hotels",
      lines: [
        "Roccafiore Wine Resort & Spa, Chioano",
        "Relais Todini, Collevalenza",
        "Borgo Petroro, Petroro",
        "Tenuta di Canonica, Canonica",
      ],
    },
    {
      title: "Inside the Walls",
      lines: [
        "Residenza d’Epoca San Lorenzo Tre",
        "Hotel Fonte Cesia",
        "Monastero SS. Annunziata",
      ],
    },
    {
      title: "Small & Simple",
      lines: [
        "Il Ghiottone Umbro",
        "Villa Luisa",
        "Hotel Tuder",
        "Agriturismo Casale Ulivi, Loreto",
      ],
    },
    {
      title: "Houses for Families",
      lines: [
        "Farmhouses and villas across the Tiber valley",
        "Many sleep ten to twelve, most with pools",
        "Book early — April fills quickly",
      ],
    },
    {
      title: "Getting Around",
      lines: [
        "Perugia airport is forty minutes by car",
        "Rome Fiumicino is about two hours",
        "The old town is a limited-traffic zone",
        "Park at Porta Orvietana and take the lift up",
      ],
    },
  ],
};

/* Mix of VERIFIED logistics and TBD policies (kids, shuttle, room blocks). */
export const ITALY_FAQ = {
  eyebrow: "Questions, answered",
  items: [
    {
      q: "Which airport should we fly into?",
      a: "Rome Fiumicino has the most international flights and is about two hours by car. Perugia San Francesco is only forty minutes away but has fewer connections. Florence is about two and a quarter hours north.",
    },
    {
      q: "How do we get to the monastery?",
      a: "The Monastero Santa Margherita sits just outside the town walls, a short walk from the church of Santa Maria della Consolazione and about fifteen minutes uphill on foot to Piazza del Popolo. There is free parking on site.",
    },
    {
      q: "Can we drive into Todi?",
      a: "The historic centre is a limited-traffic zone watched by cameras, so leave the car outside the walls. The car park at Porta Orvietana connects to the upper town by a new glass lift.",
    },
    {
      q: "What will the weather be?",
      a: "Mild and bright by day, around seventeen or eighteen degrees, and properly cool once the sun sets at about eight. A coat for the evening is the only thing anyone regrets forgetting.",
    },
    /* TBD — confirm the policy. */
    {
      q: "Can we bring children?",
      a: "Details to follow with the formal invitation. If you have questions before then, write to us.",
    },
    {
      q: "Are you doing a gift list?",
      a: "Your presence in Todi is the whole of it. There is a note on the RSVP page if you would like to mark the day, and no expectation whatsoever if you would not.",
    },
  ],
};

export const ITALY_RSVP_PAGE = {
  hero: "RSVP",
  heroSub: "Kindly reply by the first of February, 2027",
  replyTitle: "Reply",
  replyBody:
    "Find your invitation by name and answer for everyone in your party — and tell us anything the kitchen should know. If you are still deciding, tell us that too; we would rather hold a chair than lose one.",
  replyButton: "Reply online",
  emailLink: "Or write to us",
  registryTitle: "Registry",
  /* TBD — rewrite freely. */
  registryBody:
    "Your presence in Todi is the whole of it. If you would like to mark the day with something, we will share a small fund here closer to the date.",
  /* Links render only once a real URL is set. */
  registryLinks: [] as { label: string; href: string }[],
};

/* Modal copy for the Italy RSVP — the save-the-date copy with Italy tweaks. */
export const ITALY_RSVP = {
  ...SAVE_THE_DATE_RSVP,
  subline: {
    before: "Kindly send your reply by ",
    date: "February 1, 2027",
    after: " so we can save you a seat in Todi.",
  },
  successBody: "Your RSVP is in. We can’t wait to see you in Todi.",
};

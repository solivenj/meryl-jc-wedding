/*
 * All copy for /italy in one place — same pattern as lib/content.ts.
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

/*
 * The essentials (the days, the run of show, the details, the reply) live on
 * the home page now, so the tabs carry only what a guest does not need in
 * order to turn up. Schedule is gone - it is a home section. RSVP has no tab
 * either: the home section is the front door, and /italy/rsvp survives for
 * the registry and for links sent straight to it.
 *
 * Home stays a tab because the names lockup in the header is the only other
 * route back and it does not read as a link.
 */
export const ITALY_NAV = [
  { href: "/italy", label: "Home" },
  { href: "/italy/our-story", label: "Our Story" },
  { href: "/italy/dress-code", label: "Dress Code" },
  { href: "/italy/travel", label: "Travel" },
  { href: "/italy/faq", label: "FAQ" },
] as const;

/* A subject in the About band. Declared rather than inferred so the optional
   link survives the list being trimmed to one entry. */
export type AboutColumn = {
  motif: string;
  title: string;
  body: string;
  href?: string;
};

/*
 * The home page is the whole invitation now: a welcome, the three days, the
 * Thursday run of show with the practical details beside it, and the reply.
 * Each key below is one Band.
 */
export const ITALY_HOME = {
  hero: { script: "Il nostro giorno", tagline: "Three days in Umbria" },
  welcome: {
    script: "We’re getting married!",
    /* TBD — rewrite freely. */
    body: "And we couldn’t imagine doing it without you. However long you have been part of our lives, we are so grateful to share this special moment with you.",
    body2: "Join us for three days at Monastero Santa Margherita in the beautiful region of Umbria, Italy.",
    button: "RSVP here",
  },
  about: {
    title: "About our wedding",
    /* One subject for now. The page renders however many are here: one
       centred, several in a row. The Destination and Dress Code entries that
       used to sit either side of this are in the history if they are wanted
       back — the Dress Code one carried the only link to that page from the
       home page, which the nav still provides. */
    columns: [
      {
        motif: "coupe",
        title: "The Reception",
        body: "Aperitivo on the terrace while the sun goes down, then a long dinner beneath the frescoes, and dancing after.",
      },
    ] as AboutColumn[],
  },
  days: { title: "The three days" },
  rsvp: {
    script: "Will you join us?",
    replyBy: "Kindly reply by the first of February, 2027",
    button: "RSVP here",
    registryLink: "See the registry, or write to us",
  },
};

/*
 * Thursday's run of show.
 *
 * TBD — only the four o'clock ceremony and the eight o'clock dinner are
 * settled. Rather than stamping TBD on every row, rows carry a flag and the
 * page prints one note beneath the list.
 */
export const ITALY_PROGRAM = {
  title: "Program",
  note: "Times other than the ceremony and dinner are still being settled.",
  rows: [
    { time: "3:30", item: "Guests arrive", tbd: true },
    { time: "4:00", item: "The ceremony" },
    { time: "4:45", item: "Aperitivo and photographs", tbd: true },
    { time: "6:30", item: "Drinks on the terrace", tbd: true },
    { time: "8:00", item: "Dinner" },
    { time: "10:00", item: "Dancing", tbd: true },
    { time: "1:00", item: "Carriages", tbd: true },
  ],
};

/* The column beside the program — practical things that do not belong in a
   timeline. TBD where noted. */
export const ITALY_DETAILS = {
  title: "Details",
  blocks: [
    {
      label: "Arriving",
      lines: ["Come by half past three, so there is time to find a seat and say hello before the ceremony starts."],
    },
    {
      label: "Getting there",
      lines: ["The Monastero sits just outside the town walls, with free parking on site. The historic centre above it is a limited-traffic zone — leave the car below."],
    },
    /* TBD — confirm before this goes out. */
    { label: "Children", lines: ["Details to follow with the formal invitation."] },
    {
      label: "Gifts",
      lines: ["Your presence in Todi is the whole of it. There is a note on the RSVP page if you would like to mark the day."],
    },
  ],
};

/*
 * TBD — PLACEHOLDER. Meryl & John to replace entirely. Structure only: three
 * chapters, each a passage beside a photograph.
 */
export const ITALY_STORY = {
  eyebrow: "How we got here",
  chapters: [
    { heading: "How we met", body: "A placeholder for the beginning — where you were, who introduced you, and the detail you both still disagree about." },
    { heading: "The proposal", body: "A placeholder for the question — where it happened, whether it was a surprise, and what was said immediately afterwards." },
    { heading: "And now, Todi", body: "A placeholder for why Umbria — the trip that started it, the hill town you kept going back to, and why you wanted everyone there for it." },
  ],
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
    /* No farewell lunch — Friday is an open day, with people leaving at their
       own pace. Nothing is scheduled, so there is no `place` or fixed time. */
    {
      day: "Friday, April 23rd",
      art: "loggia",
      title: "A farewell day",
      quote: "No schedule, no hurry",
      time: "Leave when you like",
      dress: "Whatever you travel in",
    },
  ],
} as const;

/*
 * Dress code.
 *
 * Two codes, each split for ladies and gentlemen, each with a palette and a
 * strip of attire photographs. Declared types rather than `as const`: the
 * shape is heterogeneous (optional swatch textures, optional strips) and
 * `as const` would turn every optional field into a narrowing chore at the
 * call site — which is exactly why the old version had to write
 * `"pinterestUrl" in p`.
 *
 * Swatches are hex by default. A `texture` is only for the two or three
 * fabric-pattern capsules; a flat colour needs no file, no licence and no
 * credit row.
 */
export type Swatch = { name: string; hex?: string; texture?: string };

export type DressSection = {
  heading: string;
  body: string;
  palette: Swatch[];
  /* PhotoSlot keys — see lib/italy-art.ts. Render as gradients until the
     real images are registered. */
  strip: string[];
};

export type DressCode = {
  key: string;
  day: string;
  word: string;
  subtitle: string;
  heroSlot: string;
  intro: string;
  /* Meryl's board, embedded live rather than rehosted. */
  pinterestUrl?: string;
  ladies: DressSection;
  gentlemen: DressSection;
};

export const ITALY_DRESS: {
  eyebrow: string;
  title: string;
  intro: string;
  explainer: { heading: string; body: string };
  paletteNote: string;
  codes: DressCode[];
  notToWear: { heading: string; body: string };
} = {
  eyebrow: "What to wear",
  title: "The Dress Code",
  intro:
    "Two evenings, two registers. Nothing here is a rule so much as a temperature — April in Umbria is bright at noon and genuinely cold after nine, and most floors you will stand on are stone.",
  explainer: {
    heading: "So what does that mean?",
    body: "It means dress for a garden in spring and a frescoed room after dark. Think elegant silhouettes and fabrics that move — and shoes that will forgive fifteen minutes on cobbles.",
  },
  paletteNote: "Use these as inspiration — no need to match exactly.",
  codes: [
    {
      key: "cocktail",
      day: "Wednesday · Welcome",
      word: "Summer Cocktail",
      subtitle: "Pizza, piazza, lamps coming on",
      heroSlot: "cocktail",
      intro:
        "The first night is the loose one. Colour is welcome — the piazza is pale travertine and everything reads well against it.",
      pinterestUrl: "https://www.pinterest.com/merylfranco/wedding-attire/",
      ladies: {
        heading: "For the ladies",
        body: "A printed silk, a midi, or a long cotton dress. Soft draping, florals and delicate details are all right at home. Block heels or dressy sandals — the lanes are cobbled.",
        palette: [
          { name: "Butter", hex: "#f2e3b8" },
          { name: "Floral", texture: "/italy/attire/swatch-floral.webp" },
          { name: "Lily", texture: "/italy/attire/swatch-lily.webp" },
          { name: "Sky", hex: "#aec6d8" },
          { name: "Apricot", hex: "#e8b893" },
          { name: "Lilac", hex: "#cdc0dd" },
        ],
        strip: ["cocktailLadies1", "cocktailLadies2", "cocktailLadies3", "cocktailLadies4", "cocktailLadies5"],
      },
      gentlemen: {
        heading: "For the gentlemen",
        body: "A light suit, no tie, sleeves rolled by ten. Linen and cotton over anything heavy. Loafers rather than trainers.",
        palette: [
          { name: "Linen", texture: "/italy/attire/swatch-linen.webp" },
          { name: "Sand", hex: "#d6c3a2" },
          { name: "Olive", hex: "#8a8b63" },
          { name: "Sage", hex: "#b9c4ad" },
          { name: "Sky", hex: "#9db7cc" },
          { name: "Stone", hex: "#b4aa9c" },
        ],
        strip: ["cocktailGents1", "cocktailGents2", "cocktailGents3", "cocktailGents4", "cocktailGents5"],
      },
    },
    {
      key: "blacktie",
      day: "Thursday · The wedding",
      word: "Black Tie",
      subtitle: "Ceremony at four, dinner at eight",
      heroSlot: "blacktie",
      intro:
        "The evening everything is for. Long, dark and properly dressed — and bring something for your shoulders, because the terrace turns cold the moment the sun goes.",
      ladies: {
        heading: "For the ladies",
        body: "A floor-length gown, or an elegant midi in a formal fabric — silk, satin, chiffon, velvet. A block heel will thank you on the old stone floors; a wrap will thank you on the terrace.",
        palette: [
          { name: "Midnight", hex: "#1c2233" },
          { name: "Forest", hex: "#1e312c" },
          { name: "Burgundy", hex: "#5a1f2a" },
          { name: "Bronze", hex: "#8a6a3f" },
          { name: "Champagne", hex: "#e3d3b4" },
          { name: "Black", hex: "#14140f" },
        ],
        strip: ["blacktieLadies1", "blacktieLadies2", "blacktieLadies3", "blacktieLadies4", "blacktieLadies5"],
      },
      gentlemen: {
        heading: "For the gentlemen",
        body: "A dinner jacket, black or midnight. Bow tie preferred, and a dark shoe you can dance in. If you do not own one, a very dark suit and a black tie will not look out of place.",
        palette: [
          { name: "Black", hex: "#14140f" },
          { name: "Midnight", hex: "#1c2233" },
          { name: "Flannel", texture: "/italy/attire/swatch-flannel.webp" },
          { name: "Ivory", hex: "#efe7d6" },
          { name: "Forest", hex: "#1e312c" },
          { name: "Oxblood", hex: "#4a1f23" },
        ],
        strip: ["blacktieGents1", "blacktieGents2", "blacktieGents3", "blacktieGents4", "blacktieGents5"],
      },
    },
  ],
  notToWear: {
    heading: "What not to wear",
    body: "Please leave white, ivory and anything that reads as white to the bride. Beyond that: no denim, no trainers, no flip-flops, and nothing with a logo doing the talking.",
  },
};

/*
 * Travel (was Stay). No hotel is named on this page — not even Hotel Bramante.
 * The room block is covered for guests who reply yes, and advertising that
 * publicly invites RSVPs for the lodging and an overbooked block, so the
 * accommodation section is a teaser that points at the RSVP and the real
 * detail lives on /italy/accommodations behind that reply.
 *
 * Travel times marked VERIFIED came from Sept 2026 research; everything TBD
 * still needs confirming closer to the date.
 */
export const ITALY_TRAVEL = {
  eyebrow: "Getting to Todi",
  sections: [
    {
      id: "arriving",
      title: "Arriving",
      body: "Todi sits on a hill above the Tiber valley, an hour or two from three airports and — despite having a railway station — nowhere near a reliable train. Here is what actually works.",
      blocks: [
        {
          label: "By air",
          /* VERIFIED Sept 2026 — drive times, not flight times. */
          lines: [
            "Rome Fiumicino (FCO) — about two hours by car, and far the most international flights",
            "Perugia San Francesco (PEG) — about forty minutes, small, a handful of European routes",
            "Florence (FLR) — about two and a quarter hours north",
          ],
        },
        {
          label: "By train from Rome",
          lines: [
            /* TBD — re-confirm FCU service status before this goes to guests. */
            "Todi has its own station on the Ferrovia Centrale Umbra, but service has been unreliable and partly suspended — we would not plan around it",
            /* VERIFIED Sept 2026 */
            "The route that works: Roma Termini to Orvieto, an hour to an hour and a quarter, then about forty minutes by taxi or hire car",
            "Or Roma Termini to Perugia, then about forty-five minutes by road",
          ],
        },
        {
          label: "By car",
          lines: [
            "Hiring a car is the easiest way to see Umbria — collect it at the airport and keep it for the three days",
            /* TBD — confirm the road numbers. */
            "From Rome: the A1 north, then the E45 up the Tiber valley, about two hours",
            "There is free parking at the Monastero",
          ],
        },
        {
          label: "Once you arrive",
          /* VERIFIED — the ZTL and the Porta Orvietana lift are both real. */
          lines: [
            "The historic centre is a ZTL, a limited-traffic zone watched by cameras. Do not drive into it",
            "Leave the car at Porta Orvietana and take the glass lift up into the old town",
            "The Monastero sits just outside the walls, fifteen minutes on foot below Piazza del Popolo",
          ],
        },
      ],
    },
    {
      id: "accommodation",
      title: "Where to stay",
      /* Deliberately names nothing. See app/italy/accommodations. */
      body: "We are arranging rooms for our guests, and what we can offer depends on who is coming — so please send your reply first. Once your RSVP is in, this is where you will find the details.",
      cta: { label: "Go to the RSVP", href: "/italy/rsvp" },
    },
    {
      /* =====================================================================
       * TBD — GENERATED PLACEHOLDER. Meryl & John to rewrite entirely.
       * Nothing below has been checked for 2027 opening hours or existence.
       * ===================================================================== */
      id: "nearby",
      title: "Things we love nearby",
      body: "If you are making a week of it — and you should — these are the places we keep going back to.",
      blocks: [
        {
          label: "In Todi",
          lines: [
            "Piazza del Popolo at the top of the town — three palazzi, one cathedral, and the best coffee of the morning on the south side",
            "Santa Maria della Consolazione, the domed church below the walls, ten minutes on foot from the Monastero",
            "The Roman cisterns, if you like your history underneath you",
          ],
        },
        {
          label: "Half an hour away",
          lines: [
            "Orvieto, for the striped facade of the duomo and a glass of Classico in the shade of it",
            "Deruta, for hand-painted majolica you will regret not buying",
            "Montefalco and the Sagrantino hills, for the big red wine of Umbria",
          ],
        },
        {
          label: "A longer day",
          lines: [
            "Assisi, Spoleto and Perugia — each an hour or less",
            "Lake Trasimeno, for a slow lunch by the water",
          ],
        },
        {
          label: "Eat & drink",
          lines: [
            "Black truffle is in season into spring — ask for tagliatelle al tartufo and do not share",
            "Torta al testo, the flatbread that comes with everything",
            "Olive oil from the Tiber valley, the thing to carry home",
          ],
        },
      ],
    },
  ],
};

/*
 * /italy/accommodations — not in ITALY_NAV, and reachable only by a
 * browser that has RSVP'd yes (see lib/accommodations-access.ts).
 *
 * The "two nights only" limit is the single most important line on the page.
 * It is rendered as its own panel rather than a sentence inside a paragraph
 * because guests scan, and a guest who misses it arrives expecting a room on
 * a night nobody has booked for them.
 */
export const ITALY_ACCOMMODATION = {
  eyebrow: "For our guests",
  title: "Where you’ll stay",
  intro:
    "Thank you for deciding to celebrate our wedding with us. We are handling accommodation on behalf of our guests — here is exactly what that means.",
  covered: {
    label: "What we’re covering",
    lines: [
      "A room at Hotel Bramante, the Monastero’s own hotel, in the block we have reserved for our guests.",
      "The two nights of the wedding: Wednesday the 21st and Thursday the 22nd of April, checking out on the Friday.",
    ],
  },
  notCovered: {
    label: "What we’re not",
    lines: [
      "Any night before the 21st or after the 22nd. Stay as long as you like — those nights are booked and paid directly with the hotel.",
      "Extras: minibar, spa, laundry, and meals outside the wedding events, settled by you at checkout.",
    ],
  },
  /* TBD — the hotel will give us a booking code or a form. */
  howTo: {
    label: "How to book",
    lines: ["Details to follow — we will write to you with how to claim your room."],
  },
  deny: {
    title: "Please reply first",
    body: "This page holds the accommodation we have arranged for our guests. Send us your reply and it will open here.",
    cta: { label: "Go to the RSVP", href: "/italy/rsvp" },
  },
  unavailable: {
    title: "One moment",
    body: "We couldn’t check your reply just now. Please refresh the page in a minute, or write to us at",
  },
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
  /* Only rendered when the reply included at least one yes. */
  successLink: {
    href: "/italy/accommodations",
    label: "See where you’ll stay",
    note: "We’ll be handling accommodation on behalf of our guests — here is what we have arranged.",
  },
};

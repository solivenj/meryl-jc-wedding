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
  { href: "/italy/explore", label: "Italy" },
  { href: "/italy/faq", label: "FAQ" },
] as const;

/*
 * The home page is the whole invitation now: a welcome, the three days, the
 * Thursday run of show with the practical details beside it, and the reply.
 * Each key below is one Band.
 */
export const ITALY_HOME = {
  hero: { script: "Il nostro giorno", tagline: "Three days in Umbria" },
  welcome: {
    script: "We’re Getting Married!",
    /* TBD — rewrite freely. */
    body: "From sharing life's daily rhythms in Chicago to supporting each other's biggest dreams, every step has led to this excited new chapter. We have built a foundation on shared laughter, endless curiosity and a deep love that keeps growing every day.",
    body2: "We are overjoyed to bring together our favorite people across the United States and the globe to celebrate the official beginning of our forever. Thank you for being a part of our journey and shaping the people we are today.",
    button: "RSVP here",
  },
  days: { title: "The Wedding Week" },
  collageAlt: "Photographs, an envelope and a card laid out on a table",
  rsvp: {
    script: "Will you join us?",
    replyBy: "Kindly reply by the first of February, 2027",
    button: "RSVP here",
  },
  /* Has the olive band before the reply to itself, in the slot the parked
     Details band held. Counts to the start of the wedding days, Wednesday
     the 21st, at midnight Todi time (+02:00 is Italian summer time). */
  countdown: {
    eyebrow: "Counting down",
    line: "Until we say I do",
    dateLine: "Wednesday, the 21st of April, 2027",
    targetISO: "2027-04-21T00:00:00+02:00",
    units: { days: "Days", hours: "Hours", minutes: "Minutes", seconds: "Seconds" },
    passed: "Sposati!",
    passedNote: "We’re married. Thank you for celebrating with us in Todi.",
  },
};

/*
 * The collage under the carousel.
 *
 * It exists because the first screen of /italy never said when or where the
 * wedding was. The card carries those facts; the polaroids beside it carry
 * the feeling. Modelled on a scrapbook reference John supplied.
 *
 * Coordinates live here, not in the component, so the arrangement is tuned by
 * editing numbers. Every piece has two packs, both in percentages of the
 * stage: the wide one (l/t/w/r) and a tall one (pl/pt/pw/pr) used below 640px.
 * See .collage-* in app/globals.css for why there are two.
 *
 * Laid out from John's mockup: the card wrapped by a calla-lily frame, a
 * cupid at its corner, the rings polaroid with a second polaroid tilted over
 * it, and a map of Italy behind them. The three drawings are line art tinted
 * to the band ink (#f4efe2) with the paper knocked out; the files live in
 * public/italy/collage/, made from the .jpeg originals in public/italy/art/.
 */
export type CollagePiece = {
  /* "art" is a cream line drawing laid straight on the olive; a "photo"
     with no src is a black placeholder in a polaroid frame. */
  kind: "card" | "photo" | "art";
  src?: string;
  alt?: string;
  /* Intrinsic pixels of an "art" file, so next/image can reserve the box. */
  w?: number;
  h?: number;
  /* A dark-ink copy of an "art" file. Set it for art that sits in front of
     the card: that copy shows wherever the art crosses the card, so the
     lines read as ink there and stay cream on the olive. */
  ink?: string;
  landscape?: boolean;
  /* Wide pack. */
  l: number;
  t: number;
  width: number;
  r?: number;
  z: number;
  /* Tall pack, under 640px. Omitted keys fall back to the wide value. */
  pl?: number;
  pt?: number;
  pwidth?: number;
  pr?: number;
};

export const ITALY_COLLAGE: {
  card: {
    dates: string;
    year: string;
    venue: string;
    place: string;
  };
  /* Stage proportions for the wide and tall packs (CSS aspect-ratio). */
  ratio: string;
  ratioTall: string;
  pieces: readonly CollagePiece[];
} = {
  ratio: "1230 / 633",
  ratioTall: "10 / 15.8",
  card: {
    dates: "April 21 – 23",
    year: "2027",
    venue: ITALY.venue.name,
    /* The place, not the postal address. The full street address is still on
       the Travel tab, which is where someone actually navigating from it will
       be; on the card it was four lines of detail nobody reads at a glance. */
    place: "Todi, Umbria, Italy",
  },
  /* Wide-pack numbers were measured off the mockup (a 1230 × 633 stage). */
  pieces: [
    {
      /* Wraps the card's top-left corner, in front of it. */
      kind: "art",
      src: "/italy/collage/cala_frame.webp",
      ink: "/italy/collage/cala_frame-ink.webp",
      w: 700,
      h: 1015,
      l: 8,
      t: 13,
      width: 20,
      r: -8,
      z: 8,
      pl: -4,
      pt: 0,
      pwidth: 36,
      pr: -8,
    },
    {
      kind: "photo",
      src: "/italy/collage/rings.webp",
      alt: "",
      landscape: true,
      l: 48,
      t: 12,
      width: 21,
      r: 1,
      z: 3,
      pl: 2,
      pt: 54,
      pwidth: 52,
      pr: 2,
    },
    {
      /* Placeholder until a photograph is chosen: black, in a polaroid
         frame, tipped counterclockwise over the rings. */
      kind: "photo",
      landscape: true,
      l: 47,
      t: 42,
      width: 26,
      r: -4,
      z: 4,
      pl: 40,
      pt: 64.5,
      pwidth: 56,
      pr: -4,
    },
    {
      /* Over the polaroids' right edges, as in the mockup, tipped
         clockwise. */
      kind: "art",
      src: "/italy/collage/italy.webp",
      w: 700,
      h: 835,
      l: 65,
      t: 11,
      width: 23,
      r: 8,
      z: 6,
      pl: 56,
      pt: 47,
      pwidth: 42,
      pr: 8,
    },
    {
      /* For the card, `l` is where its CENTRE goes in the wide pack; the
         tall pack always centres it. The CSS caps it at 92% of the stage,
         so pwidth 96 is effectively 92 on a phone. */
      kind: "card",
      l: 31,
      t: 23,
      width: 35,
      r: -9,
      z: 5,
      pt: 8.2,
      pwidth: 96,
      pr: -6,
    },
    {
      /* Over the card's bottom-right corner, in front of it; on a phone it
         takes the bottom-left corner instead, clear of the map. */
      kind: "art",
      src: "/italy/collage/cupid.webp",
      ink: "/italy/collage/cupid-ink.webp",
      w: 700,
      h: 779,
      l: 35,
      t: 59,
      width: 14,
      z: 7,
      pl: -2,
      pt: 39,
      pwidth: 24,
    },
  ],
};

/*
 * Thursday's run of show.
 *
 * TBD — only the four o'clock ceremony and the eight o'clock dinner are
 * settled. Rather than stamping TBD on every row, rows carry a flag and the
 * page prints one note beneath the list.
 */
/*
 * PARKED. The run of show is off the home page until the replies are in and
 * the Thursday times are settled; it goes back as one of the three-day
 * layouts rather than the single Thursday column it was. Kept here so the
 * real hours are not lost: four o'clock and eight are settled, the rest are
 * flagged.
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
 * Our Story — the road trip (docs/superpowers/specs/2026-11-11-our-story-road-trip-design.md).
 *
 * The page is a drive up a switchback road to Todi. Each stop below is one
 * stretch of road, in drive order; its index is the route's chapter number
 * (components/italy/road/route.ts), so do not reorder or add stops here
 * without changing the route and drawings too. Copy is safe to rewrite.
 *
 * ALL COPY IS PLACEHOLDER, written from the facts Meryl and John gave and
 * meant to be rewritten by them. Keep each stop near its current length:
 * the text sits in a fixed spot beside the drawings (the copy-fit check in
 * scripts/road-shot.mjs catches overflow).
 *
 * Two rules for every string here:
 *   - Never mention the New Jersey church wedding, "getting married twice",
 *     or another ceremony anywhere on /italy. Some Italy guests were not
 *     invited to it, and the site must not be how they find out. The reason
 *     for Italy is the 2022 trip.
 *   - Never say or hint whether Meryl and John live together or apart.
 *
 * To confirm or cut: "By 2019 it was official: dinner, a movie" (Boston) and
 * "on a hill above the Tiber valley" (Umbria).
 */
export type StopChipStyle = "" | "olive" | "eu" | "it" | "brown" | "stamp";
export type StoryStop = {
  id: "boston" | "distance" | "italy-2022" | "chicago" | "bali" | "spain" | "thanksgiving" | "crossing" | "umbria";
  kicker: string;
  heading: string;
  body: string;
  /* The road sign in the corner while this stop is on screen. */
  chip: { text: string; style: StopChipStyle };
  half?: boolean;
};

export const ITALY_STORY: {
  title: { kicker: string; tagline: string; cue: string };
  stops: StoryStop[];
  halfStops: { kicker: string; heading: string; body: string };
  closing: {
    kicker: string;
    line: string;
    dates: string;
    chip: { text: string; style: StopChipStyle };
    /* How the last stop is named in the stop list and the phone card. */
    stop: { kicker: string; heading: string };
  };
} = {
  title: {
    kicker: "Our story, by road",
    tagline: "From New Jersey and California to a hill in Umbria.",
    cue: "Scroll to start the car",
  },
  stops: [
    {
      id: "boston",
      kicker: "Boston · 2019",
      heading: "Where it started",
      body:
        "We met at Northeastern, in study sessions that kept running long. They turned into " +
        "meals, then into most of our free time. By 2019 it was official: dinner, a movie, and " +
        "both of us already sure.",
      chip: { text: "Boston, MA", style: "olive" },
    },
    {
      id: "distance",
      kicker: "The long-distance years",
      heading: "Opposite coasts",
      body:
        "Then came the years with the whole country in the middle and a running list of flights " +
        "we could just about afford. We would not choose it again. We would not give it back " +
        "either. It made us each other’s first call, about anything.",
      chip: { text: "I-80 · Westbound", style: "" },
    },
    {
      id: "italy-2022",
      kicker: "Italy · 2022",
      heading: "Where we fell for it",
      body:
        "In 2022 we went to Italy together for the first time. A villa in Tuscany, the long " +
        "drive south, Positano. We flew home already talking about coming back.",
      chip: { text: "Italia · 2022", style: "eu" },
    },
    {
      id: "chicago",
      kicker: "Chicago",
      heading: "Same city, finally",
      body:
        "Meryl moved to Chicago in 2022 to start medical school. John followed in 2023. Same " +
        "city, same time zone, finally.",
      chip: { text: "Chicago", style: "" },
    },
    {
      id: "bali",
      kicker: "Half stop",
      heading: "Bali, 2024",
      body: "One line about Bali goes here.",
      chip: { text: "Bali · 2024", style: "stamp" },
      half: true,
    },
    {
      id: "spain",
      kicker: "Half stop",
      heading: "Spain, 2025",
      body: "One line about Spain goes here.",
      chip: { text: "España · 2025", style: "stamp" },
      half: true,
    },
    {
      id: "thanksgiving",
      kicker: "Thanksgiving · 2025",
      heading: "The question",
      body:
        "Thanksgiving 2025, in California, with both of our families at the table. Everyone we " +
        "would have called afterwards was already in the room.",
      chip: { text: "California", style: "" },
    },
    {
      id: "crossing",
      kicker: "Across the water",
      heading: "Coming back",
      body: "We knew in 2022 that we would come back. This time we are bringing all of you.",
      chip: { text: "Italia · 2027", style: "eu" },
    },
    {
      id: "umbria",
      kicker: "Why Umbria",
      heading: "And now, Todi",
      body:
        "Todi is small and walkable, on a hill above the Tiber valley, and once you arrive you " +
        "can put the car keys away until you leave.",
      chip: { text: "Todi", style: "it" },
    },
  ],
  /* One shared text block for the two half stops. */
  halfStops: {
    kicker: "Two half stops",
    heading: "Bali & Spain",
    body: "Bali in 2024, Spain in 2025. One line about each goes here.",
  },
  closing: {
    kicker: "Benvenuti a Todi",
    line: "We would rather tell you the rest of it in April, over a drink.",
    dates: "21 · 22 · 23 April 2027",
    chip: { text: "Monastero S. Margherita", style: "brown" },
    stop: { kicker: "Arrived", heading: "Keys away" },
  },
};
/* TBD — the whole order of days is a placeholder built on real Todi places. */
export const ITALY_SCHEDULE = {
  eyebrow: "The order of the days",
  days: [
    {
      day: "Wednesday, April 21st",
      art: "villa",
      motif: "cheers",
      title: "Welcome Dinner",
      quote: "Come as you are, stay until the lamps go on",
      /* `start` rides on the date line. It is the only clock time a day
         carries — Friday has none, and nothing sits below the title. */
      start: "7PM",
      // place: "Piazza del Popolo · Todi",
      /* Each day closes on one link to the tab that answers it. The first two
         deep-link to their own code on the dress page (ids are the `key`
         below); Friday has no code, so it points at the tab a guest leaving
         that morning actually wants. */
      link: { label: "Dress code", href: "/italy/dress-code#cocktail" },
    },
    {
      day: "Thursday, April 22nd",
      art: "chapel",
      motif: "rings",
      /* No leading "The": it is the longest of the three day titles and has
         to hold one line in the home grid. */
      title: "Ceremony & Reception",
      quote: "Four o’clock, and the bells across the valley",
      start: "4PM",
      place: "Monastero Santa Margherita · Todi",
      link: { label: "Dress code", href: "/italy/dress-code#blacktie" },
    },
    /* No farewell lunch — Friday is an open day, with people leaving at their
       own pace. Nothing is scheduled, so there is no `place` or fixed time. */
    {
      day: "Friday, April 23rd",
      art: "loggia",
      motif: "luggage",
      title: "Morning Farewell",
      quote: "No schedule, no hurry",
      /* No start: nothing is scheduled, so the date line carries no clock. */
      link: { label: "Travelling home", href: "/italy/travel" },
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
  /* What the day bar calls it. Both halves on purpose. */
  short: string;
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
  title: string;
  intro: string;
  paletteNote: string;
  codes: DressCode[];
  notToWear: { heading: string; body: string };
} = {
  title: "What To Wear",
  intro:
    "Two days means to ",
  paletteNote: "Use these as inspiration — no need to match exactly.",
  codes: [
    {
      key: "cocktail",
      day: "Wednesday · Welcome",
      short: "Wednesday · Summer Cocktail",
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
      short: "Thursday · Black Tie",
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
  /* Laid out "at a glance" (design A on the Travel Tab Redesigns canvas):
     four cards up top with the answers most guests want, then three
     numbered sections. Copy is deliberately short; each card or block
     should stay a sentence or two. */
  eyebrow: "Getting to Todi",
  title: "Travel",
  intro:
    "Todi sits on a hill above the Tiber valley, an hour or two from three airports. Here is everything you need, in the order you will need it.",
  glance: [
    /* VERIFIED Sept 2026 — drive times, not flight times. */
    {
      kicker: "Fly into",
      title: "Rome",
      body: "Fiumicino (FCO) has the most international flights. About two hours to Todi by car.",
    },
    {
      kicker: "Or the closest",
      title: "Perugia",
      body: "San Francesco (PEG) is about forty minutes away, with a handful of European routes.",
    },
    {
      kicker: "Getting around",
      title: "Hire a car",
      body: "Collect it at the airport and keep it for the three days. Parking at the Monastero is free.",
    },
    /* VERIFIED Oct 2026 — the Schengen rule is issued within ten years
       and valid three months past departure. */
    {
      kicker: "Check now",
      title: "Passports",
      body: "Issued within the last ten years, and valid three months after you leave Europe.",
    },
  ],
  /* Border rules — the only thing on this site with an expiry date on it.
     EES is live and settled. ETIAS is neither, and its start has moved
     more than once, so that block is written as a warning rather than an
     instruction and the section carries the date it was last checked.
     Re-check travel-europe.europa.eu before the formal invitations go out;
     if ETIAS is running by then, rewrite that block. */
  border: {
    id: "entering",
    kicker: "01 · Before you book",
    title: "The border",
    intro: "Nothing here is hard, but the passport has a lead time, so read this part now.",
    note: "Checked 10 November 2026. The rules are still changing, so travel-europe.europa.eu is the page to trust over this one.",
    blocks: [
      /* VERIFIED Nov 2026 — EES became fully operational 10 April 2026. */
      {
        label: "At the border",
        body: "Since April 2026 the EU records arrivals electronically. There is nothing to apply for or pay. The first time, you will have a photo and fingerprints taken when you land. It takes a few minutes and lasts three years.",
      },
      /* VERIFIED Oct 2026 — you are enrolled at the first Schengen entry.
         Ireland is outside EES and the UK is outside the EU. */
      {
        label: "If you are connecting",
        body: "You are processed at the first European airport you land in, so leave extra time for the layover. Dublin and London are outside the zone, so through either you are processed in Italy instead.",
      },
      /* TBD — ETIAS. 2027 is the current expectation, which is our year.
         Do not write this as settled until it is. */
      {
        label: "ETIAS, later",
        body: "A separate online authorisation the EU plans to introduce: twenty euros, free under eighteen and over seventy, valid three years. It might start in 2027. There is nothing to do yet, and we will add details once there is a firm date.",
      },
    ],
    /* The EU's own pages. The poster is the official campaign artwork,
       hosted by Austria's interior ministry because the EU's materials
       repository is not public. */
    links: {
      label: "From the EU",
      items: [
        { label: "The EU’s guide to the EES", href: "https://travel-europe.europa.eu/en/ees" },
        { label: "Official questions and answers", href: "https://travel-europe.europa.eu/ees/faq" },
        { label: "The poster you will see at the border", href: "https://www.bmi.gv.at/202/Fremdenpolizei_und_Grenzkontrolle/Entry_Exit_System/files/EN/EES_poster_A4_EN_print.pdf" },
        { label: "Travel to Europe app", href: "https://travel-europe.europa.eu/ees/Travel-to-Europe-mobile-app" },
      ],
    },
  },
  arriving: {
    id: "arriving",
    kicker: "02 · Arriving",
    title: "Three ways in",
    ways: [
      {
        label: "By air",
        body: "Rome Fiumicino, about two hours by car. Perugia, about forty minutes. Florence, about two and a quarter hours.",
        aside: "A non-stop into Rome is worth paying for: connect in Europe and you clear the border at your first stop.",
      },
      /* TBD — re-confirm FCU service status, and the Orvieto frequency,
         before this goes to guests. Termini to Orvieto VERIFIED Sept 2026. */
      {
        label: "By train",
        body: "Roma Termini to Orvieto (an hour or so), then about forty minutes by car. Book that car before you travel.",
        aside: "Or Termini to Perugia, then forty-five minutes by road. Todi’s own station is too unreliable to plan around.",
      },
      /* TBD — confirm the road numbers. */
      {
        label: "By car",
        body: "From Rome, the A1 north and then the E45 up the Tiber valley, about two hours.",
        aside: "The easiest way to see Umbria. Free parking at the Monastero.",
      },
    ],
    drive: {
      title: "Before you drive",
      items: [
        /* VERIFIED — Italy requires an IDP alongside a foreign licence,
           issued in your own country. */
        "Bring an International Driving Permit. AAA issues them for about $20, before you leave.",
        /* Deliberately "check", not "you are covered": Italy is commonly on
           the excluded list for credit-card rental cover. */
        "Look for Italy by name in your card’s rental cover. It is often left out.",
        /* VERIFIED — the ZTL and the Porta Orvietana lift are both real. */
        "The old centre is a camera-watched ZTL. Do not drive into it.",
        "Park at Porta Orvietana and ride the glass lift into town. The Monastero is fifteen minutes on foot below Piazza del Popolo.",
      ],
    },
  },
  /* Deliberately names nothing. See app/italy/accommodations. */
  stay: {
    id: "accommodation",
    kicker: "03 · Where to stay",
    title: "Rooms, after your reply",
    body: "We are arranging rooms for our guests, and what we can offer depends on who is coming. Send your RSVP first and the details will appear here.",
    cta: { label: "Go to the RSVP", href: "/italy/rsvp" },
    closing: { prompt: "Anything we have missed?", cta: "Write to us" },
  },
};

/*
 * /italy/explore — the "Italy" tab. Everything about being there that is
 * not logistics: the weather, and the places worth the trip. It split off
 * from Travel so that page can stay the one a guest reads before booking.
 */
export const ITALY_EXPLORE = {
  closing: {
    body: "For flights, trains, the car and the border, see the Travel page.",
    cta: { label: "Getting to Todi", href: "/italy/travel" },
  },
  /* The live tracker at the top of the weather section
     (components/italy/TodiWeather). Todi's coordinates; Open-Meteo answers
     in Todi local time because the request asks for Europe/Rome. */
  live: {
    label: "Todi right now",
    latitude: 42.78,
    longitude: 12.41,
    timeZone: "Europe/Rome",
    hourlyLabel: "Forecast",
    unavailable: "The live weather isn’t loading just now. Late April’s usual range is beside it.",
  },
  /* The first band: the live tracker on the left, this beside it.
     VERIFIED Nov 2026 — Open-Meteo historical archive for Todi
     (42.78N 12.41E, 343m), every 17–27 April from 2001 to 2025: mean high
     17.8°C, mean low 7.2°C, highs 14–21°C on four days in five. */
  weather: {
    title: "The weather in Todi",
    april: {
      label: "In late April",
      body: "Days run from about 57 to 70°F (14 to 21°C), and nights drop to around 45°F (7°C).",
    },
    pack: {
      label: "What to pack",
      lines: [
        "Layers for the day, and a proper coat or wrap for the evenings",
        "A small umbrella, just in case",
        "Shoes that can manage cobbles and hills. The old town is steep",
      ],
    },
  },
  sections: [
    {
      /* =====================================================================
       * TBD — GENERATED PLACEHOLDER. Meryl & John to rewrite entirely.
       * Nothing below has been checked for 2027 opening hours or existence.
       * ===================================================================== */
      id: "nearby",
      title: "Things we love nearby",
      body: "If you are making a week of it, and you should, these are the places we keep going back to.",
      blocks: [
        {
          label: "In Todi",
          lines: [
            "Piazza del Popolo at the top of the town, with three palazzi, one cathedral, and the best coffee of the morning on the south side",
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
            "Assisi, Spoleto and Perugia, each an hour or less",
            "Lake Trasimeno, for a slow lunch by the water",
          ],
        },
        {
          label: "Eat & drink",
          lines: [
            "Black truffle is in season into spring. Ask for tagliatelle al tartufo and do not share",
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
      q: "Do we need anything special to enter Italy?",
      a: "A passport issued within the last ten years and still valid for three months after you leave. The EU stopped stamping passports in 2026 and takes a photograph and fingerprints at the border instead, which adds a few minutes on arrival. A separate online authorisation may also be in place by 2027. The Travel page covers all of it, including why a European connection needs a long layover.",
    },
    {
      q: "Do we need an international driving licence?",
      a: "If you are hiring a car, yes. Italy requires an International Driving Permit alongside your own licence, and you have to get it before you leave home. AAA issues them for about twenty dollars. The Travel page has the rest, including the limited-traffic zone in the old town.",
    },
    /* TBD — the real answer belongs with the accommodation details, once the
       room block and the day timings are settled. */
    {
      q: "Are you arranging transport on the wedding day?",
      a: "We are still working this out, and we will confirm alongside the accommodation details. If you are planning around it, please write to us.",
    },
    {
      q: "What will the weather be?",
      a: "Mild and bright by day, around seventeen or eighteen degrees, and properly cool once the sun sets at about eight. A coat for the evening is the only thing anyone regrets forgetting. The Italy page has the April averages and the live weather in Todi.",
    },
    /* TBD — confirm the policy. */
    {
      q: "Can we bring children?",
      a: "Details to follow with the formal invitation. If you have questions before then, write to us.",
    },
    {
      q: "Are you doing a gift list?",
      a: "Your presence in Todi is the whole of it. We will share more closer to the date if you would like to mark the day, and there is no expectation whatsoever if you would not.",
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
  /* PARKED, not rendered: the registry gets its own page closer to the date
     (docs/closer-to-the-date.md). Kept here as a starting point for it. */
  registryTitle: "Registry",
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

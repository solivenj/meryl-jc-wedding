# Closer to the date

Things we decided to leave off the Italy site for now and bring back as the
wedding (21–23 April 2027) gets closer.

## What we said we'd do

- **Registry page.** Set up a separate registry page. The registry link under
  the RSVP button on the home page and the registry section on the RSVP page
  were removed on 12 November 2026. The old copy is parked in
  `ITALY_RSVP_PAGE` (`registryTitle`, `registryBody`, `registryLinks`) in
  `lib/italy-content.ts`. When the page exists, link to it from the home RSVP
  band and update the FAQ answer to "Are you doing a gift list?", which now
  says "We will share more closer to the date".
- **Details section on the home page.** Taken off the home page on 11 November
  2026. The copy is still in `ITALY_DETAILS` in `lib/italy-content.ts`, and the
  comment above the countdown band in `app/italy/page.tsx` says how to put it
  back (a `width="prose"` olive band with the title over `DetailBlocks`).

## Also parked in the code

Not things we talked about as "later", but they are switched off in the same
way and are easy to bring back:

- **Start times on the three day cards** (7PM, 4PM). Removed from the cards on
  11 November 2026; each day still has `start` in `ITALY_SCHEDULE`.
- **"Dress code" / "Travelling home" links under each day card.** Commented
  out in `app/italy/page.tsx`; the hrefs are still on each day as `link`.
- **Thursday's run of show** (`ITALY_PROGRAM`). Parked until the Thursday
  times are settled.
- **Black-tie attire photos** on the dress code page. Those slots still show
  gradients until the right images are chosen.
- **Countdown end message.** The countdown runs to midnight on Wednesday 21
  April, and when it ends it says "Sposati! We're married." That is a day
  before the ceremony, so change the wording or the end time before then.

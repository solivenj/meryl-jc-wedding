/*
 * Client-safe UI flags (no secrets — these ship in the browser bundle).
 * Server secrets (Google service-account creds) live only in env vars,
 * read exclusively by app/api/submit/route.ts.
 */

/**
 * Guest-count / plus-ones on the RSVP form. Off for now (the couple asked to
 * leave it out) but the field is fully built in RsvpModal — flip to `true`
 * to bring it back, and add a "guests" column to the sheet / append range.
 */
export const RSVP_SHOW_GUEST_COUNT = false;

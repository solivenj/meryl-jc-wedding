/*
 * Client-safe UI flags (no secrets — these ship in the browser bundle).
 * Server secrets (Google service-account creds) live only in env vars,
 * read exclusively by the API routes under app/api/.
 */

/**
 * Hard deadline for RSVPs. When set to an ISO 8601 string and that moment has
 * passed, the lookup endpoint returns `{ closed: true }` and the submit route
 * rejects — so guests can view but no longer change their response. `null`
 * keeps RSVPs open indefinitely.
 *
 * Example: "2027-03-01T23:59:59-05:00"
 */
export const RSVP_DEADLINE: string | null = null;

/**
 * @deprecated Superseded by the guest-list party model (each guest's
 * `plus_one_allowed` flag in the Guests sheet). Left only to avoid breaking
 * any stale import; no longer read by the RSVP flow.
 */
export const RSVP_SHOW_GUEST_COUNT = false;

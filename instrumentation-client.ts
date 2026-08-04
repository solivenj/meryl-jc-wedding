import { initBotId } from "botid/client/core";

/*
 * Vercel BotID — an invisible challenge on the two RSVP endpoints. The guest
 * lookup is the sensitive one: it answers questions about real people's names
 * and attendance, so it's the endpoint worth scripting against.
 *
 * A path missing from this list makes the matching checkBotId() call fail on the
 * server, so both routes have to be declared here. Next is >= 15.3, so this
 * instrumentation hook is the recommended entry point over <BotIdClient/>.
 *
 * Basic checks are free on every plan; Deep Analysis is a paid per-call add-on
 * enabled in the Vercel dashboard, deliberately left off — see the RSVP notes.
 */
initBotId({
  protect: [
    { path: "/api/guests/lookup", method: "POST" },
    { path: "/api/submit", method: "POST" },
  ],
});

import type { NextConfig } from "next";
import { withBotId } from "botid/next/config";

const nextConfig: NextConfig = {
  // Standard Vercel deploy (serverless): the RSVP form posts to app/api/submit,
  // which needs a Node runtime, so we no longer static-export (was output:"export").
  // Pages still prerender; only /api/submit runs at request time.
};

/* withBotId adds the first-party proxy rewrites BotID serves its challenge
 * through, so ad-blockers and third-party script blockers can't defeat it.
 * Protected paths are declared in instrumentation-client.ts. */
export default withBotId(nextConfig);

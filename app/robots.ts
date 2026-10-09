import type { MetadataRoute } from "next";

/*
 * The whole site is private — both weddings sit behind the password gate
 * (proxy.ts), and the accommodation details behind an RSVP on top of that.
 * A blanket disallow is more reliable than per-page robots metadata: it also
 * covers anything served from /public, which no page-level export can.
 *
 * This is a request, not an enforcement — it keeps the site out of search
 * results, it does not keep anyone out of the site. The gate does that.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", disallow: "/" }],
  };
}

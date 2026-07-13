import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standard Vercel deploy (serverless): the RSVP form posts to app/api/submit,
  // which needs a Node runtime, so we no longer static-export (was output:"export").
  // Pages still prerender; only /api/submit runs at request time.
};

export default nextConfig;

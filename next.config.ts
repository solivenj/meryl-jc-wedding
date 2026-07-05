import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export per PRD §2 — no server logic; deployable to Vercel as static output.
  output: "export",
};

export default nextConfig;

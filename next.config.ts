import type { NextConfig } from "next";

/**
 * ubiqautomation.com — standalone Next.js app for the uBIQ brand site.
 *
 * Forked out of the parent unntangle.com project, where this content used
 * to live under /ubiq/*. Here the same pages sit at the root of their own
 * domain (/ instead of /ubiq, /about instead of /ubiq/about, and so on).
 *
 * The parent's OfficeMate cache-header rule is intentionally dropped —
 * that subtree doesn't exist in this project.
 */
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  turbopack: {
    root: __dirname,
  },
  experimental: {
    viewTransition: true,
  },
  async redirects() {
    // Common misspellings of the share link.
    return ["/birtdays-effects", "/birthdays-effects", "/birtday-effects"].map(
      (source) => ({ source, destination: "/birthday-effects", permanent: false }),
    );
  },
  async rewrites() {
    // Each birthday effect is a standalone page in public/birthday-effects/<n>/index.html.
    return [
      {
        source: "/birthday-effects/:n(\\d{1,2})",
        destination: "/birthday-effects/:n/index.html",
      },
    ];
  },
};

export default nextConfig;

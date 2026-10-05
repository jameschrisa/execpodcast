import type { NextConfig } from "next";
import { shortLinks } from "./src/content/short-links";

// PostHog region. "us" or "eu". Must match the project you created in PostHog.
const region = process.env.NEXT_PUBLIC_POSTHOG_REGION === "eu" ? "eu" : "us";

const nextConfig: NextConfig = {
  // PostHog's own endpoints use trailing slashes (/e/, /decide/). Keep Next from
  // redirecting them away before the /ingest rewrite proxies the request.
  skipTrailingSlashRedirect: true,

  images: {
    qualities: [75, 90],
  },

  async rewrites() {
    // Reverse proxy so ad blockers don't drop analytics. The browser talks to
    // /ingest on our own domain and Next forwards to PostHog.
    return [
      {
        source: "/ingest/static/:path*",
        destination: `https://${region}-assets.i.posthog.com/static/:path*`,
      },
      {
        source: "/ingest/array/:path*",
        destination: `https://${region}-assets.i.posthog.com/array/:path*`,
      },
      {
        source: "/ingest/:path*",
        destination: `https://${region}.i.posthog.com/:path*`,
      },
    ];
  },

  async redirects() {
    // Link-in-bio short paths. Each one stamps UTMs so PostHog can attribute
    // the visit even when the social app's in-app browser strips the referrer.
    return shortLinks.map((link) => ({
      source: link.path,
      destination: link.destination,
      permanent: false,
    }));
  },
};

export default nextConfig;

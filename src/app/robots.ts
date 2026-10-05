import type { MetadataRoute } from "next";
import { show } from "@/content/show";

export default function robots(): MetadataRoute.Robots {
  // Keep preview deployments out of search results. Local builds have no
  // VERCEL_ENV, so they fall through to the production rules.
  const env = process.env.VERCEL_ENV;
  if (env && env !== "production") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/ingest/"] },
    sitemap: `${show.siteUrl}/sitemap.xml`,
  };
}

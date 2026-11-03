import type { MetadataRoute } from "next";
import { show } from "@/content/show";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: show.siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${show.siteUrl}/sessions`, changeFrequency: "daily", priority: 0.7 },
    { url: `${show.siteUrl}/contact`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${show.siteUrl}/privacy`, changeFrequency: "yearly", priority: 0.2 },
  ];
}

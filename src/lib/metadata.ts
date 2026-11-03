import type { Metadata, ResolvingMetadata } from "next";

// Per-page metadata that keeps the site's default share image. Next replaces
// openGraph and twitter wholesale per page, so we start from the parent's
// resolved values (which include the file-based opengraph and twitter images)
// and override only the page-specific fields. og:url always equals the canonical.
export async function pageMetadata(
  parent: ResolvingMetadata,
  page: { path: string; title: string; description: string },
): Promise<Metadata> {
  const { openGraph, twitter } = await parent;
  const shareTitle = `${page.title} | Executive Upskill`;
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: page.path },
    openGraph: { ...openGraph, type: "website", title: shareTitle, description: page.description, url: page.path },
    twitter: { ...twitter, title: shareTitle, description: page.description },
  } as Metadata;
}

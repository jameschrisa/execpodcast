import { PageInstrumentation } from "@/components/analytics/PageInstrumentation";
import { Hero } from "@/components/hero/Hero";
import { Join } from "@/components/join/Join";
import { Faq, faqItems } from "@/components/sections/Faq";
import { Hosts } from "@/components/sections/Hosts";
import { LensTest } from "@/components/sections/LensTest";
import { Lenses } from "@/components/sections/Lenses";
import { CallBand } from "@/components/sections/CallBand";
import { Ticker } from "@/components/sections/Ticker";
import { Watch } from "@/components/sections/Watch";
import { Sessions } from "@/components/sessions/Sessions";
import { CompactNav } from "@/components/site/CompactNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { hosts } from "@/content/hosts";
import { questionCutoff, show } from "@/content/show";
import { longDate, shortDate, timeOf } from "@/lib/time";

// Session schedule refreshes from the source every six hours.
export const revalidate = 21600;

export default function Home() {
  const premiereLabel = shortDate(show.premiereAt);
  const premiereLong = `${longDate(show.premiereAt)} at ${timeOf(show.premiereAt)}`;
  const cutoff = questionCutoff();
  const cutoffLabel = `${shortDate(cutoff)}, ${timeOf(cutoff)}`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "PodcastSeries",
      name: show.name,
      url: show.siteUrl,
      description:
        "A live video podcast where a brand operator, a finance executive and a venture investor argue AI, money, brand and pop culture.",
      webFeed: show.channels.youtube.url,
      sameAs: [show.channels.youtube.url, show.channels.instagram.url, show.channels.tiktok.url, show.channels.linkedin.url],
      author: hosts.map((h) => ({ "@type": "Person", name: h.name, jobTitle: h.role, sameAs: h.linkedin })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BroadcastEvent",
      name: `${show.name} premiere: ${show.premiereEpisode}`,
      isLiveBroadcast: true,
      startDate: show.premiereAt,
      eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
      location: { "@type": "VirtualLocation", url: show.liveEventUrl || show.channels.youtube.url },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems(premiereLong, cutoffLabel).map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <div className="relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <CompactNav />
      <SiteHeader />
      <main>
        <Hero />
        <Ticker />
        <CallBand dateLabel={premiereLabel} />
        <Watch />
        <Lenses />
        <LensTest premiereLabel={premiereLabel} />
        <Hosts />
        <Sessions />
        <Join cutoffLabel={cutoffLabel} />
        <Faq premiere={premiereLong} cutoff={cutoffLabel} />
      </main>
      <SiteFooter />
      <PageInstrumentation />
    </div>
  );
}

import type { Metadata, ResolvingMetadata } from "next";
import { CalendarPlusIcon } from "@phosphor-icons/react/ssr";
import { PageInstrumentation } from "@/components/analytics/PageInstrumentation";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { SessionsExplorer } from "@/components/sessions/SessionsExplorer";
import { CompactNav } from "@/components/site/CompactNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { show } from "@/content/show";
import { getEvents } from "@/lib/events";
import { pageMetadata } from "@/lib/metadata";
import { button, container, cx } from "@/lib/ui";

// Same cadence as the homepage: the schedule refreshes every six hours.
export const revalidate = 21600;

const description =
  "Every free live working session from F3 Insights in one calendar. Browse by month or list, filter by topic, and subscribe from your own calendar app.";

export function generateMetadata(_props: unknown, parent: ResolvingMetadata): Promise<Metadata> {
  return pageMetadata(parent, { path: "/sessions", title: "Live sessions calendar", description });
}

export default async function SessionsPage() {
  const { sessions, source, fetchedAt } = await getEvents();
  const feedUrl = `${show.siteUrl}/sessions/calendar.ics`;
  const webcal = feedUrl.replace(/^https?:/, "webcal:");
  const google = `https://calendar.google.com/calendar/render?${new URLSearchParams({ cid: webcal })}`;

  return (
    <div className="relative">
      <CompactNav />
      <SiteHeader />
      <main className={cx(container, "pt-12 md:pt-16")}>
        <h1 className="font-display text-[clamp(56px,9vw,120px)]">Live sessions</h1>
        <p className="mt-4 text-[18px] leading-relaxed text-ink-soft">
          Free online working sessions from F3 Insights, an AI and finance advisory affiliated with the show. Bring a laptop
          and a real problem. Every time on this page is Pacific.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4 rounded-2xl border border-line bg-raised p-5 md:p-6">
          <div className="mr-auto min-w-0 basis-full sm:basis-auto">
            <h2 className="text-[17px] font-bold">Get every session in your calendar</h2>
            <p className="mt-1 text-[14px] text-muted">
              Subscribe once. New sessions appear as F3 Insights announces them, and calendar apps check for changes every few
              hours.
            </p>
          </div>
          <TrackedLink href={webcal} event="sessions_subscribe_clicked" props={{ method: "webcal" }} className={button.primary}>
            <CalendarPlusIcon size={18} weight="bold" aria-hidden />
            Subscribe
          </TrackedLink>
          <TrackedLink
            href={google}
            external
            event="sessions_subscribe_clicked"
            props={{ method: "google" }}
            className={button.text}
          >
            Add to Google Calendar
          </TrackedLink>
        </div>

        {source === "snapshot" && (
          <p role="status" className="mt-6 rounded-2xl border border-line bg-raised px-5 py-4 text-[14px] leading-relaxed text-ink-soft">
            Showing the saved schedule. The live list on F3 Insights could not be reached, so a session may be missing or have
            changed. Check the{" "}
            <a
              href={show.eventsSource}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline decoration-line underline-offset-4 hover:decoration-current"
            >
              F3 Insights events page
            </a>{" "}
            before you register.
          </p>
        )}

        <SessionsExplorer sessions={sessions} renderedAt={fetchedAt} />
      </main>
      <SiteFooter />
      <PageInstrumentation />
    </div>
  );
}

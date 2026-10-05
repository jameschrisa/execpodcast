import { ArrowUpRightIcon } from "@phosphor-icons/react/ssr";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { AlertsButton } from "@/components/site/AlertsButton";
import { show } from "@/content/show";
import { getEvents } from "@/lib/events";
import { shortDate } from "@/lib/time";
import { button, container, cx } from "@/lib/ui";
import { SessionsCalendar } from "./SessionsCalendar";

export async function Sessions() {
  const { sessions, fetchedAt } = await getEvents();
  const allUrl = `${show.eventsSource}?${new URLSearchParams({ ...show.eventsUtm, utm_content: "all-sessions" })}`;

  return (
    <section id="sessions" data-section="sessions" className={cx(container, "pt-24 md:pt-32")}>
      <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-accent-ink">Free live sessions from F3 Insights</p>
      <h2 className="font-display mt-4 max-w-[14ch] text-[clamp(48px,6.4vw,96px)]">Try it on your own files</h2>
      <p className="mt-5 max-w-[60ch] text-[18px] leading-relaxed text-ink-soft">
        F3 Insights, an AI and finance advisory affiliated with the show, runs free online working sessions for executives.
        Bring a laptop and a real problem.
      </p>
      <div className="mt-5 flex flex-wrap gap-2 text-[13px] font-semibold">
        <span className="rounded-full border border-line px-3.5 py-1.5">Hands-on: bring your own files and tools</span>
        <span className="rounded-full border border-line px-3.5 py-1.5">Free, online, 30 to 90 minutes</span>
      </div>

      <SessionsCalendar sessions={sessions} renderedAt={fetchedAt} />

      <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-2xl border border-line p-6 md:p-7">
        <p className="mr-auto text-[17px] font-semibold">The show premieres {shortDate(show.premiereAt)}.</p>
        <AlertsButton placement="sessions_footer" />
        <TrackedLink
          href={allUrl}
          external
          event="session_register_clicked"
          props={{ session: "all_sessions", session_date: "", category: "all", placement: "sessions_footer" }}
          className={cx(button.text, "text-[14px]")}
        >
          All sessions
          <ArrowUpRightIcon size={14} weight="bold" aria-hidden />
        </TrackedLink>
      </div>
    </section>
  );
}

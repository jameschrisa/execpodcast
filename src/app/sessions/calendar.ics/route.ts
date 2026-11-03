import { getEvents, registrationUrl } from "@/lib/events";
import { buildFeed } from "@/lib/ics";
import { sessionCalendarEvent } from "@/lib/sessions";

// Same cadence as the page: the feed refreshes from the source every six hours.
export const revalidate = 21600;

export async function GET() {
  const { sessions } = await getEvents();
  const now = Date.now();
  const upcoming = sessions.filter((s) => Date.parse(s.end) > now);

  const body = buildFeed(
    upcoming.map((s) => {
      const url = new URL(registrationUrl(s.url));
      url.searchParams.set("utm_content", `calendar_feed_${s.id}`);
      return sessionCalendarEvent(s, { url: url.toString() });
    }),
    { name: "Free live sessions (F3 Insights)", description: "Free online working sessions for executives, listed on Executive Upskill." },
  );

  return new Response(body, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="executive-upskill-sessions.ics"',
      "Cache-Control": "public, max-age=900, s-maxage=21600, stale-while-revalidate=86400",
    },
  });
}

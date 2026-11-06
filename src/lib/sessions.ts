// Helpers shared by the homepage sessions section, the /sessions page and the
// calendar feed. Pure functions only, so server and client code can import it.
import { sessionNotes } from "@/content/site";
import { show } from "@/content/show";
import type { EventCategory, LiveSession } from "@/lib/events";
import type { CalendarEvent } from "@/lib/ics";

export type Filter = "all" | EventCategory;

export const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "webinar", label: "Webinars" },
  { id: "finance", label: "Finance" },
  { id: "productivity", label: "Productivity" },
  { id: "leadership", label: "Leadership" },
  { id: "creative", label: "Creative" },
  { id: "community", label: "Weekly meetup" },
];

export const categoryName: Record<EventCategory, string> = {
  webinar: "Webinars",
  finance: "Finance",
  productivity: "Productivity",
  leadership: "Leadership",
  creative: "Creative",
  community: "Weekly meetup",
};

export function withUtm(url: string, content: string) {
  const u = new URL(url);
  for (const [k, v] of Object.entries(show.eventsUtm)) u.searchParams.set(k, v);
  u.searchParams.set("utm_content", content);
  return u.toString();
}

export function sessionNote(s: LiveSession) {
  return sessionNotes[s.name.toLowerCase()] ?? {};
}

export function sessionBlurb(s: LiveSession) {
  return sessionNote(s).line ?? s.summary;
}

export function sessionCalendarEvent(s: LiveSession, opts: { url?: string; sequence?: number } = {}): CalendarEvent {
  return {
    uid: s.id,
    title: s.name,
    description: sessionBlurb(s),
    start: s.start,
    end: s.end,
    url: opts.url ?? s.url,
    location: "Online",
    sequence: opts.sequence,
  };
}

export function monthKeyOf(dk: string) {
  return dk.slice(0, 7);
}

export function shiftMonth(mk: string, delta: number) {
  const [y, m] = mk.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + delta, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

// Day keys (YYYY-MM-DD) for a month, padded with nulls to whole weeks that
// start on Sunday.
export function monthGrid(mk: string) {
  const [y, m] = mk.split("-").map(Number);
  const first = new Date(Date.UTC(y, m - 1, 1)).getUTCDay();
  const days = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const cells: (string | null)[] = Array(first).fill(null);
  for (let d = 1; d <= days; d++) cells.push(`${mk}-${String(d).padStart(2, "0")}`);
  while (cells.length % 7) cells.push(null);
  return cells;
}

// "Full" and "Limited seats" labels. Open sessions have no label.
export function statusLabel(s: LiveSession) {
  return s.status === "full" ? "Full" : s.status === "limited" ? "Limited seats" : null;
}

// Hides category filters that would show nothing. "All" always stays.
export function visibleFilters(sessions: LiveSession[]) {
  const present = new Set(sessions.map((s) => s.category));
  return filters.filter((f) => f.id === "all" || present.has(f.id));
}

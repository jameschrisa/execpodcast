import snapshot from "@/content/events-snapshot.json";
import { show } from "@/content/show";

export type EventCategory = "finance" | "productivity" | "leadership" | "community";

export type LiveSession = {
  id: string;
  name: string;
  description: string;
  start: string;
  end: string;
  url: string;
  category: EventCategory;
  recurring: boolean;
};

export type EventsPayload = {
  sessions: LiveSession[];
  source: "live" | "snapshot";
  fetchedAt: number;
};

type RawEvent = {
  name?: string | null;
  description?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  url?: string | null;
};

export const categoryLabels: Record<EventCategory, string> = {
  finance: "Finance",
  productivity: "Productivity",
  leadership: "Leadership",
  community: "Weekly meetup",
};

const rules: [EventCategory, RegExp][] = [
  ["community", /coffee and ai coding/i],
  ["finance", /forecast|variance|month-end|financ|f&a|numerical|excel/i],
  ["leadership", /policy|governance|security|organization|executive reporting|smb|data ready|connecting ai|sales|workflow/i],
  ["productivity", /.*/],
];

function categorize(name: string): EventCategory {
  return rules.find(([, re]) => re.test(name))?.[0] ?? "productivity";
}

function normalize(raw: RawEvent[]): LiveSession[] {
  return raw
    .filter((e): e is Required<RawEvent> & { name: string; startDate: string; url: string } =>
      Boolean(e.name && e.startDate && e.url),
    )
    .map((e) => {
      const category = categorize(e.name);
      return {
        id: e.url.split("/").filter(Boolean).pop() ?? e.url,
        name: e.name,
        description: e.description ?? "",
        start: e.startDate,
        end: e.endDate ?? e.startDate,
        url: e.url,
        category,
        recurring: category === "community",
      };
    })
    .sort((a, b) => Date.parse(a.start) - Date.parse(b.start));
}

function parseJsonLd(html: string): RawEvent[] {
  const out: RawEvent[] = [];
  const re = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  for (const match of html.matchAll(re)) {
    try {
      const data = JSON.parse(match[1]);
      const items: unknown[] = Array.isArray(data) ? data : data["@graph"] ?? [data];
      for (const item of items) {
        const type = (item as { "@type"?: string })["@type"];
        if (typeof type === "string" && type.endsWith("Event")) out.push(item as RawEvent);
      }
    } catch {
      // Skip malformed blocks; the rest of the page may still parse.
    }
  }
  return out;
}

// Reads the public events page (its schema.org Event markup) and refreshes
// every six hours. Falls back to the bundled snapshot if the fetch fails.
export async function getEvents(): Promise<EventsPayload> {
  try {
    const res = await fetch(show.eventsSource, {
      next: { revalidate: 60 * 60 * 6 },
      signal: AbortSignal.timeout(6000),
    });
    if (res.ok) {
      const sessions = normalize(parseJsonLd(await res.text()));
      if (sessions.length > 0) return { sessions, source: "live", fetchedAt: Date.now() };
    }
  } catch {
    // Network or timeout. Use the snapshot below.
  }
  return { sessions: normalize(snapshot as RawEvent[]), source: "snapshot", fetchedAt: Date.now() };
}

export function registrationUrl(url: string) {
  const u = new URL(url);
  for (const [k, v] of Object.entries(show.eventsUtm)) u.searchParams.set(k, v);
  return u.toString();
}

import snapshot from "@/content/events-snapshot.json";
import { show } from "@/content/show";

export type EventCategory = "finance" | "productivity" | "leadership" | "creative" | "community";
export type SessionStatus = "open" | "limited" | "full";

export type LiveSession = {
  // The full slug, exactly as the source returns it. Repeating sessions differ
  // only by their suffix, so never trim it. Also the ICS UID.
  id: string;
  name: string;
  // Short blurb for cards and calendar entries.
  summary: string;
  // Full plain-text description. Paragraphs are separated by blank lines.
  description: string;
  agenda: string[];
  takeaways: string[];
  prerequisites: string;
  format: string;
  // Short label such as "PT". Empty when the source gives none.
  timezone: string;
  start: string;
  end: string;
  url: string;
  status: SessionStatus;
  category: EventCategory;
  recurring: boolean;
};

export type EventsPayload = {
  sessions: LiveSession[];
  source: "live" | "snapshot";
  fetchedAt: number;
};

// The public JSON API shape. Only the fields the site uses are read. Join
// links and platform internals are never read, stored or passed on.
type ApiEvent = {
  slug?: unknown;
  title?: unknown;
  start?: unknown;
  end?: unknown;
  timezone?: unknown;
  summary?: unknown;
  description?: unknown;
  agenda?: unknown;
  takeaways?: unknown;
  prerequisites?: unknown;
  format?: unknown;
  practice?: unknown;
  topics?: unknown;
  status?: unknown;
};

type JsonLdEvent = {
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
  creative: "Creative",
  community: "Weekly meetup",
};

const REVALIDATE = 60 * 60 * 6;
const REGISTRATION_BASE = "https://f3insights.com/events/";

// One primary category per event, first match wins:
//   1. format "Office Hours" (the recurring Coffee and AI Coding)  -> community
//   2. practice "revenue", or topic revenue-marketing without
//      finance-accounting or deep-dives                              -> creative
//   3. topic finance-accounting                                     -> finance
//   4. topic personal-productivity                                  -> productivity
//   5. topic deep-dives, or format Seminar or Briefing              -> leadership
//   6. anything else (intro-basics only, unknown)                   -> productivity
// F3 tags revenue-marketing on many general sessions, so that topic alone does
// not make a session Creative; it must stand apart from finance and deep dives.
export function categorize(format: string, topics: string[], practice = ""): EventCategory {
  if (format === "Office Hours") return "community";
  if (
    practice === "revenue" ||
    (topics.includes("revenue-marketing") && !topics.includes("finance-accounting") && !topics.includes("deep-dives"))
  )
    return "creative";
  if (topics.includes("finance-accounting")) return "finance";
  if (topics.includes("personal-productivity")) return "productivity";
  if (topics.includes("deep-dives") || format === "Seminar" || format === "Briefing") return "leadership";
  return "productivity";
}

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

// Plain text only. Drops any line that mentions a Zoom address, as a guard
// against a join link ever being pasted into a description.
function clean(v: unknown) {
  return str(v)
    .split(/\r?\n/)
    .filter((line) => !/zoom\.us|zoom\.com/i.test(line))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// Agenda and takeaway items arrive numbered ("1. Open floor"). The page
// renders real lists, so strip the leading number.
function list(v: unknown) {
  if (!Array.isArray(v)) return [];
  return v
    .map((i) => clean(i).replace(/^\s*\d+[.)]\s+/, ""))
    .filter(Boolean);
}

function strings(v: unknown) {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
}

function isDate(v: string) {
  return v !== "" && !Number.isNaN(Date.parse(v));
}

function normalizeApi(raw: unknown): LiveSession[] {
  if (!Array.isArray(raw)) return [];
  const out: LiveSession[] = [];
  for (const item of raw as ApiEvent[]) {
    if (!item || typeof item !== "object") continue;
    const slug = str(item.slug);
    const name = str(item.title);
    const start = str(item.start);
    if (!slug || !name || !isDate(start)) continue;
    const status = str(item.status).toLowerCase();
    if (status === "cancelled" || status === "canceled") continue;
    const end = isDate(str(item.end)) ? str(item.end) : start;
    const format = str(item.format);
    const category = categorize(format, strings(item.topics), str(item.practice));
    const description = clean(item.description);
    out.push({
      id: slug,
      name,
      summary: clean(item.summary) || description.split(/\n\n/)[0] || "",
      description,
      agenda: list(item.agenda),
      takeaways: list(item.takeaways),
      prerequisites: clean(item.prerequisites),
      format,
      timezone: str(item.timezone),
      start,
      end,
      url: `${REGISTRATION_BASE}${encodeURIComponent(slug)}`,
      status: status === "full" ? "full" : status === "limited" ? "limited" : "open",
      category,
      recurring: category === "community",
    });
  }
  return sort(out);
}

const sort = (s: LiveSession[]) => s.sort((a, b) => Date.parse(a.start) - Date.parse(b.start));

// Last-resort scrape of the events page. Maps schema.org markup into the API
// shape so the rest of the site sees one kind of record.
function fromJsonLd(raw: JsonLdEvent[]): LiveSession[] {
  return normalizeApi(
    raw.map((e) => {
      const slug = (e.url ?? "").split("?")[0].split("/").filter(Boolean).pop();
      const title = e.name ?? "";
      return {
        slug,
        title,
        start: e.startDate,
        end: e.endDate,
        summary: e.description,
        description: e.description,
        format: /coffee and ai coding/i.test(title) ? "Office Hours" : "Workshop",
      };
    }),
  );
}

function parseJsonLd(html: string): JsonLdEvent[] {
  const out: JsonLdEvent[] = [];
  const re = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  for (const match of html.matchAll(re)) {
    try {
      const data = JSON.parse(match[1]);
      const items: unknown[] = Array.isArray(data) ? data : data["@graph"] ?? [data];
      for (const item of items) {
        const type = (item as { "@type"?: string })["@type"];
        if (typeof type === "string" && type.endsWith("Event")) out.push(item as JsonLdEvent);
      }
    } catch {
      // Skip malformed blocks; the rest of the page may still parse.
    }
  }
  return out;
}

async function fetchApi(): Promise<LiveSession[]> {
  const res = await fetch(process.env.EVENTS_API_URL || show.eventsApi, {
    next: { revalidate: REVALIDATE },
    signal: AbortSignal.timeout(6000),
  });
  if (!res.ok) return [];
  const data = (await res.json()) as { events?: unknown };
  return normalizeApi(data.events);
}

async function fetchJsonLd(): Promise<LiveSession[]> {
  const res = await fetch(process.env.EVENTS_PAGE_URL || show.eventsSource, {
    next: { revalidate: REVALIDATE },
    signal: AbortSignal.timeout(6000),
  });
  if (!res.ok) return [];
  return fromJsonLd(parseJsonLd(await res.text()));
}

// Reads the public events API and refreshes every six hours. If the API is
// down or empty, scrapes the events page's schema.org markup, then falls back
// to the bundled snapshot (kept in the API's shape).
export async function getEvents(): Promise<EventsPayload> {
  for (const load of [fetchApi, fetchJsonLd]) {
    try {
      const sessions = await load();
      if (sessions.length > 0) return { sessions, source: "live", fetchedAt: Date.now() };
    } catch {
      // Network, timeout or bad JSON. Try the next source.
    }
  }
  return { sessions: normalizeApi(snapshot), source: "snapshot", fetchedAt: Date.now() };
}

export function registrationUrl(url: string) {
  const u = new URL(url);
  for (const [k, v] of Object.entries(show.eventsUtm)) u.searchParams.set(k, v);
  return u.toString();
}

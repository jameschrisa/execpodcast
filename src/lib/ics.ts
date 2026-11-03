// Builds .ics text for a single event (browser download) or a whole feed
// (the subscribable calendar route). Works with Apple Calendar, Google
// Calendar and Outlook.

export type CalendarEvent = {
  uid: string;
  title: string;
  description: string;
  start: string;
  end: string;
  url: string;
  location?: string;
  // Bump when an event's details change so calendars that saved an earlier
  // copy replace it. Defaults to 0.
  sequence?: number;
};

function stamp(iso: string) {
  return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function escape(text: string) {
  return text.replace(/\\/g, "\\\\").replace(/\r?\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

// RFC 5545 asks for lines of 75 octets or fewer.
// Counts UTF-8 octets and never splits a multibyte character. Continuation
// lines start with one space, which counts toward their 75.
const encoder = new TextEncoder();
function fold(line: string) {
  const out: string[] = [];
  let cur = "";
  let bytes = 0;
  for (const ch of line) {
    const n = encoder.encode(ch).length;
    if (bytes + n > 75) {
      out.push(cur);
      cur = " ";
      bytes = 1;
    }
    cur += ch;
    bytes += n;
  }
  out.push(cur);
  return out.join("\r\n");
}

function eventLines(e: CalendarEvent, dtstamp: string, alarm: boolean) {
  return [
    "BEGIN:VEVENT",
    `UID:${e.uid}@executiveupskill`,
    `DTSTAMP:${dtstamp}`,
    `SEQUENCE:${e.sequence ?? 0}`,
    `DTSTART:${stamp(e.start)}`,
    `DTEND:${stamp(e.end)}`,
    `SUMMARY:${escape(e.title)}`,
    `DESCRIPTION:${escape(`${e.description}\n\n${e.url}`)}`,
    `URL:${e.url}`,
    `LOCATION:${escape(e.location ?? e.url)}`,
    ...(alarm ? ["BEGIN:VALARM", "TRIGGER:-PT15M", "ACTION:DISPLAY", `DESCRIPTION:${escape(e.title)}`, "END:VALARM"] : []),
    "END:VEVENT",
  ];
}

function calendar(body: string[], extra: string[] = []) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Executive Upskill//Site//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    ...extra,
    ...body,
    "END:VCALENDAR",
  ];
  return `${lines.map(fold).join("\r\n")}\r\n`;
}

export function buildIcs(e: CalendarEvent) {
  return calendar(eventLines(e, stamp(new Date().toISOString()), true));
}

// A subscribable feed: many events, no alarms (the subscriber's calendar
// decides how to remind), and a refresh hint so clients poll every few hours.
export function buildFeed(events: CalendarEvent[], opts: { name: string; description?: string }) {
  const dtstamp = stamp(new Date().toISOString());
  return calendar(
    events.flatMap((e) => eventLines(e, dtstamp, false)),
    [
      `X-WR-CALNAME:${escape(opts.name)}`,
      ...(opts.description ? [`X-WR-CALDESC:${escape(opts.description)}`] : []),
      "X-WR-TIMEZONE:America/Los_Angeles",
      "REFRESH-INTERVAL;VALUE=DURATION:PT6H",
      "X-PUBLISHED-TTL:PT6H",
    ],
  );
}

export function downloadIcs(e: CalendarEvent, filename: string) {
  const blob = new Blob([buildIcs(e)], { type: "text/calendar;charset=utf-8" });
  const href = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = href;
  a.download = filename.endsWith(".ics") ? filename : `${filename}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(href), 1000);
}

export function googleCalendarUrl(e: CalendarEvent) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: e.title,
    dates: `${stamp(e.start)}/${stamp(e.end)}`,
    details: `${e.description}\n\n${e.url}`,
    location: e.location ?? e.url,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

// All show and session times are published in Pacific time. Formatting pins
// the zone so the server render and the browser render produce the same text.
export const TZ = "America/Los_Angeles";

const fmt = (opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("en-US", { timeZone: TZ, ...opts });

const dayKeyFmt = fmt({ year: "numeric", month: "2-digit", day: "2-digit" });
const timeFmt = fmt({ hour: "numeric", minute: "2-digit" });
const longDateFmt = fmt({ weekday: "long", month: "long", day: "numeric" });
const shortDateFmt = fmt({ weekday: "short", month: "short", day: "numeric" });
const monthFmt = fmt({ month: "long", year: "numeric" });
const partsFmt = fmt({ weekday: "short", month: "short", day: "numeric" });

// YYYY-MM-DD in Pacific time.
export function dayKey(iso: string | number | Date) {
  const p = dayKeyFmt.formatToParts(new Date(iso));
  const get = (t: string) => p.find((x) => x.type === t)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

export function timeRange(start: string, end: string) {
  const a = timeFmt.format(new Date(start)).replace(" ", " ");
  const b = timeFmt.format(new Date(end)).replace(" ", " ");
  return `${a} to ${b} PT`;
}

export function timeOf(iso: string) {
  return `${timeFmt.format(new Date(iso))} PT`;
}

export const longDate = (iso: string) => longDateFmt.format(new Date(iso));
export const shortDate = (iso: string) => shortDateFmt.format(new Date(iso));
export const monthLabel = (iso: string | Date) => monthFmt.format(new Date(iso));

export function dateParts(iso: string) {
  const p = partsFmt.formatToParts(new Date(iso));
  const get = (t: string) => p.find((x) => x.type === t)?.value ?? "";
  return { weekday: get("weekday"), month: get("month"), day: get("day") };
}

export function minutesBetween(start: string, end: string) {
  return Math.round((Date.parse(end) - Date.parse(start)) / 60000);
}

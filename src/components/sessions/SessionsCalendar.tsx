"use client";

import { ArrowUpRightIcon, CalendarPlusIcon, CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";
import { episodeByNumber, episodeTag } from "@/content/episodes";
import { sessionNotes } from "@/content/site";
import { show } from "@/content/show";
import { track } from "@/lib/analytics";
import type { EventCategory, LiveSession } from "@/lib/events";
import { downloadIcs } from "@/lib/ics";
import { useNowSeconds } from "@/lib/premiere";
import { dateParts, dayKey, minutesBetween, monthLabel, timeRange } from "@/lib/time";
import { button, cx } from "@/lib/ui";

type Filter = "all" | EventCategory;

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "finance", label: "Finance" },
  { id: "productivity", label: "Productivity" },
  { id: "leadership", label: "Leadership" },
  { id: "community", label: "Weekly meetup" },
];

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const PAGE = 5;

function withUtm(url: string, content: string) {
  const u = new URL(url);
  for (const [k, v] of Object.entries(show.eventsUtm)) u.searchParams.set(k, v);
  u.searchParams.set("utm_content", content);
  return u.toString();
}

function note(s: LiveSession) {
  return sessionNotes[s.name.toLowerCase()] ?? {};
}

function monthKeyOf(dk: string) {
  return dk.slice(0, 7);
}

function shiftMonth(mk: string, delta: number) {
  const [y, m] = mk.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + delta, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

function monthGrid(mk: string) {
  const [y, m] = mk.split("-").map(Number);
  const first = new Date(Date.UTC(y, m - 1, 1)).getUTCDay();
  const days = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const cells: (string | null)[] = Array(first).fill(null);
  for (let d = 1; d <= days; d++) cells.push(`${mk}-${String(d).padStart(2, "0")}`);
  while (cells.length % 7) cells.push(null);
  return cells;
}

function SessionCard({ s, nextUp, placement }: { s: LiveSession; nextUp?: boolean; placement: string }) {
  const p = dateParts(s.start);
  const n = note(s);
  const pairs = n.pairsWith ? episodeByNumber[n.pairsWith] : null;
  const content = `${s.id}_${dayKey(s.start)}`;
  return (
    <article className="grid grid-cols-[64px_minmax(0,1fr)] gap-4 rounded-2xl border border-line bg-raised p-5 sm:grid-cols-[76px_minmax(0,1fr)] sm:gap-5 sm:p-6">
      <div className="text-center">
        <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-muted">{p.weekday}</p>
        <p className="font-display text-[44px] leading-none sm:text-[52px]">{p.day}</p>
        <p className="mt-1 text-[12px] font-bold uppercase tracking-[0.08em] text-muted">{p.month}</p>
      </div>
      <div className="min-w-0">
        {nextUp && (
          <span className="mb-2 inline-flex h-6 items-center rounded-full bg-accent px-2.5 text-[11px] font-bold uppercase tracking-[0.06em] text-on-accent">
            Next up
          </span>
        )}
        <h4 className="text-[18px] font-bold leading-snug">{s.name}</h4>
        <p className="mt-1 text-[13px] text-muted">
          {timeRange(s.start, s.end)}. Free, online, {minutesBetween(s.start, s.end)} min.
        </p>
        <p className="mt-2.5 text-[15px] leading-relaxed text-ink-soft">{n.line ?? s.description}</p>
        {pairs && (
          <p className="mt-2 text-[13px] text-muted">
            Pairs with <span className="font-semibold text-ink">{episodeTag(pairs.number)}, {pairs.title}</span>
          </p>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
          <a
            href={withUtm(s.url, content)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              track("session_register_clicked", { session: s.name, session_date: dayKey(s.start), category: s.category, placement })
            }
            className={cx(button.outline, "h-10 px-4")}
          >
            Register free
            <ArrowUpRightIcon size={16} weight="bold" aria-hidden />
          </a>
          <button
            type="button"
            className={button.text}
            onClick={() => {
              track("session_added_to_calendar", { session: s.name, session_date: dayKey(s.start) });
              downloadIcs(
                { uid: s.id, title: s.name, description: n.line ?? s.description, start: s.start, end: s.end, url: s.url, location: "Online" },
                s.id,
              );
            }}
          >
            <CalendarPlusIcon size={16} weight="bold" aria-hidden />
            Add to calendar
          </button>
          <span className="text-[12px] text-muted">Opens the F3 Insights site</span>
        </div>
      </div>
    </article>
  );
}

export function SessionsCalendar({ sessions, renderedAt }: { sessions: LiveSession[]; renderedAt: number }) {
  // Server render and hydration use the render time; the live clock takes
  // over right after, so past sessions drop off without a mismatch.
  const now = (useNowSeconds() ?? Math.floor(renderedAt / 1000)) * 1000;
  const reduce = useReducedMotion();
  const today = dayKey(now);

  const upcoming = useMemo(() => sessions.filter((s) => Date.parse(s.end) > now), [sessions, now]);
  const featured = upcoming.filter((s) => !s.recurring);
  const weekly = upcoming.filter((s) => s.recurring);

  const byDay = useMemo(() => {
    const map = new Map<string, LiveSession[]>();
    for (const s of upcoming) {
      const k = dayKey(s.start);
      map.set(k, [...(map.get(k) ?? []), s]);
    }
    return map;
  }, [upcoming]);

  const firstMonth = monthKeyOf(today);
  const lastMonth = upcoming.length ? monthKeyOf(dayKey(upcoming[upcoming.length - 1].start)) : firstMonth;

  const [month, setMonth] = useState(firstMonth);
  const [day, setDay] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [expanded, setExpanded] = useState(false);

  const viewMonth = month < firstMonth ? firstMonth : month;

  let list: LiveSession[];
  if (day) list = byDay.get(day) ?? [];
  else if (filter === "community") list = weekly.slice(0, 4);
  else list = featured.filter((s) => filter === "all" || s.category === filter);

  const visible = day || expanded ? list : list.slice(0, PAGE);
  const nextUpId = featured[0]?.id;
  const nextWeekly = weekly[0];

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12">
      {/* Month grid */}
      <div className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-2xl border border-line bg-raised p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <p className="font-display text-[34px]">{monthLabel(`${viewMonth}-15T12:00:00Z`)}</p>
            <div className="flex gap-1.5">
              <button
                type="button"
                aria-label="Previous month"
                disabled={viewMonth <= firstMonth}
                onClick={() => {
                  const m = shiftMonth(viewMonth, -1);
                  setMonth(m);
                  setDay(null);
                  track("sessions_month_changed", { month: m, direction: "prev" });
                }}
                className="grid size-9 place-items-center rounded-full border border-line transition-colors hover:border-ink disabled:opacity-30"
              >
                <CaretLeftIcon size={16} weight="bold" />
              </button>
              <button
                type="button"
                aria-label="Next month"
                disabled={viewMonth >= lastMonth}
                onClick={() => {
                  const m = shiftMonth(viewMonth, 1);
                  setMonth(m);
                  setDay(null);
                  track("sessions_month_changed", { month: m, direction: "next" });
                }}
                className="grid size-9 place-items-center rounded-full border border-line transition-colors hover:border-ink disabled:opacity-30"
              >
                <CaretRightIcon size={16} weight="bold" />
              </button>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-7 gap-1 text-center text-[12px] font-bold text-muted">
            {WEEKDAYS.map((d, i) => (
              <span key={i}>{d}</span>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-7 gap-1">
            {monthGrid(viewMonth).map((dk, i) => {
              if (!dk) return <span key={`blank-${i}`} />;
              const items = byDay.get(dk) ?? [];
              const has = items.length > 0;
              const selected = day === dk;
              const isToday = dk === today;
              const hasFeatured = items.some((s) => !s.recurring);
              const label = `${dk}${has ? `, ${items.map((s) => s.name).join(", ")}` : ""}`;
              return (
                <button
                  key={dk}
                  type="button"
                  disabled={!has}
                  aria-pressed={selected}
                  aria-label={label}
                  onClick={() => {
                    const next = selected ? null : dk;
                    setDay(next);
                    if (next) track("sessions_day_selected", { date: dk, count: items.length });
                  }}
                  className={cx(
                    "relative flex aspect-square flex-col items-center justify-center rounded-xl text-[14px] font-semibold tabular-nums transition-colors",
                    selected ? "bg-ink text-paper" : has ? "hover:bg-line/70" : "text-muted/60",
                    isToday && !selected && "ring-1 ring-ink",
                  )}
                >
                  {Number(dk.slice(8))}
                  {has && (
                    <span
                      className={cx(
                        "absolute bottom-1.5 h-1 rounded-full",
                        hasFeatured ? "w-4 bg-accent" : "w-2 bg-muted",
                      )}
                      aria-hidden
                    />
                  )}
                </button>
              );
            })}
          </div>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-muted">
            <span className="inline-flex items-center gap-2">
              <span className="h-1 w-4 rounded-full bg-accent" aria-hidden /> Working session
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-1 w-2 rounded-full bg-muted" aria-hidden /> Weekly meetup
            </span>
          </div>
        </div>
      </div>

      {/* Agenda */}
      <div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter sessions">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={!day && filter === f.id}
              onClick={() => {
                setFilter(f.id);
                setDay(null);
                setExpanded(false);
                track("sessions_filter_changed", { category: f.id });
              }}
              className={cx(
                "h-9 rounded-full border px-4 text-[13px] font-semibold transition-colors",
                !day && filter === f.id ? "border-ink bg-ink text-paper" : "border-line hover:border-ink",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {day && (
          <p className="mt-5 flex items-center gap-3 text-[14px] text-ink-soft">
            Showing {dateParts(`${day}T19:00:00Z`).weekday}, {dateParts(`${day}T19:00:00Z`).month} {Number(day.slice(8))}.
            <button type="button" className={button.text} onClick={() => setDay(null)}>
              Show all
            </button>
          </p>
        )}

        {!day && filter === "all" && nextWeekly && (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-ink px-5 py-4 text-paper">
            <p className="text-[14px] leading-snug">
              <span className="font-bold">Every Saturday, {timeRange(nextWeekly.start, nextWeekly.end)}:</span>{" "}
              Coffee and AI Coding. {note(nextWeekly).line}
            </p>
            <a
              href={withUtm(nextWeekly.url, `${nextWeekly.id}_${dayKey(nextWeekly.start)}`)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                track("session_register_clicked", {
                  session: nextWeekly.name,
                  session_date: dayKey(nextWeekly.start),
                  category: "community",
                  placement: "weekly_strip",
                })
              }
              className="inline-flex items-center gap-1.5 text-[13px] font-bold underline decoration-paper/40 underline-offset-4 hover:decoration-paper"
            >
              Register free
              <ArrowUpRightIcon size={14} weight="bold" aria-hidden />
            </a>
          </div>
        )}

        <div className="mt-5 grid gap-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((s) => (
              <motion.div
                key={`${s.id}-${s.start}`}
                layout={!reduce}
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, scale: 0.98, transition: { duration: 0.15 } }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <SessionCard s={s} nextUp={s.id === nextUpId} placement={day ? "calendar_day" : "agenda"} />
              </motion.div>
            ))}
          </AnimatePresence>

          {visible.length === 0 && (
            <div className="rounded-2xl border border-dashed border-line p-8 text-center">
              <p className="text-[15px] font-semibold">Nothing scheduled in this group right now.</p>
              <p className="mt-1 text-[14px] text-muted">F3 Insights adds new sessions here as it announces them.</p>
              <button
                type="button"
                className={cx(button.outline, "mt-4")}
                onClick={() => {
                  setFilter("all");
                  setDay(null);
                }}
              >
                Show all sessions
              </button>
            </div>
          )}

          {!day && list.length > PAGE && (
            <button type="button" className={cx(button.outline, "justify-self-start")} onClick={() => setExpanded((v) => !v)}>
              {expanded ? "Show fewer" : `Show ${list.length - PAGE} more`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

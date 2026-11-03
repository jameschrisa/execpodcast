"use client";

import {
  ArrowsClockwiseIcon,
  ArrowUpRightIcon,
  CaretLeftIcon,
  CaretRightIcon,
  MagnifyingGlassIcon,
  XIcon,
} from "@phosphor-icons/react";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { episodeByNumber, episodeTag } from "@/content/episodes";
import { track } from "@/lib/analytics";
import type { LiveSession } from "@/lib/events";
import {
  categoryName,
  monthGrid,
  monthKeyOf,
  sessionBlurb,
  sessionNote,
  shiftMonth,
  statusLabel,
  visibleFilters,
  withUtm,
  type Filter,
} from "@/lib/sessions";
import { dateParts, dayKey, fullDate, longDate, minutesBetween, monthLabel, shortTime, timeRange } from "@/lib/time";
import { button, cx } from "@/lib/ui";
import { SessionActions } from "./SessionCard";

type View = "month" | "list";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MAX_IN_CELL = 3;
const MAX_QUERY_TRACKED = 40;

// Whole minutes since epoch on the client, null during server render and
// hydration. Ticks once a minute so the page does not re-render every second.
function subscribeMinute(cb: () => void) {
  const id = window.setInterval(cb, 15_000);
  return () => window.clearInterval(id);
}
const minuteNow = () => Math.floor(Date.now() / 60_000);
const minuteServer = () => null;

const chip = "inline-flex h-6 items-center rounded-full border border-line px-2.5 text-[12px] font-semibold text-ink-soft";

function compactTime(iso: string) {
  return shortTime(iso).replace(":00", "").replace(/\s/g, "").toLowerCase();
}

function Badges({ s }: { s: LiveSession }) {
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      <span className={chip}>{categoryName[s.category]}</span>
      {statusLabel(s) && <span className={cx(chip, "border-ink text-ink")}>{statusLabel(s)}</span>}
      {s.recurring && (
        <span className={cx(chip, "gap-1.5")}>
          <ArrowsClockwiseIcon size={12} weight="bold" aria-hidden />
          Recurring
        </span>
      )}
    </span>
  );
}

function SessionRow({ s, past, onOpen }: { s: LiveSession; past: boolean; onOpen: () => void }) {
  const p = dateParts(s.start);
  return (
    <li className={cx("flex items-stretch gap-3 rounded-2xl border border-line bg-raised", past && "opacity-70")}>
      <button
        type="button"
        onClick={onOpen}
        className="grid min-w-0 flex-1 grid-cols-[56px_minmax(0,1fr)] gap-4 rounded-2xl p-4 text-left transition-colors hover:bg-line/40 sm:p-5"
      >
        <span className="text-center">
          <span className="block text-[12px] font-bold uppercase tracking-[0.08em] text-muted">{p.weekday}</span>
          <span className="font-display block text-[40px] leading-none">{p.day}</span>
          <span className="mt-0.5 block text-[12px] font-bold uppercase tracking-[0.08em] text-muted">{p.month}</span>
        </span>
        <span className="min-w-0">
          <span className="block text-[17px] font-bold leading-snug">{s.name}</span>
          <span className="mt-1 block text-[13px] text-muted">
            {timeRange(s.start, s.end)}, {minutesBetween(s.start, s.end)} min
          </span>
          <span className="mt-2 block">
            <Badges s={s} />
          </span>
        </span>
      </button>
      {!past && s.status !== "full" && (
        <a
          href={withUtm(s.url, `sessions_page_list_${s.id}_${dayKey(s.start)}`)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Register free for ${s.name}`}
          onClick={() =>
            track("session_register_clicked", {
              session: s.name,
              session_date: dayKey(s.start),
              category: s.category,
              placement: "sessions_page_list",
            })
          }
          className={cx(button.text, "hidden self-center pr-5 sm:inline-flex")}
        >
          Register
          <ArrowUpRightIcon size={14} weight="bold" aria-hidden />
        </a>
      )}
    </li>
  );
}

function DetailList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-4">
      <h3 className="text-[14px] font-bold">{title}</h3>
      <ul className="mt-1.5 list-disc space-y-1 pl-5 text-[14px] leading-relaxed text-ink-soft">
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </div>
  );
}

function SessionDialog({ s, ended, onClose }: { s: LiveSession | null; ended: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (s && !d.open) d.showModal();
    if (!s && d.open) d.close();
  }, [s]);

  useEffect(() => {
    if (!s) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [s]);

  const pairs = s ? sessionNote(s).pairsWith : undefined;
  const episode = pairs ? episodeByNumber[pairs] : null;

  return (
    <dialog
      ref={ref}
      aria-labelledby="session-dialog-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) e.currentTarget.close();
      }}
      className="m-auto w-[calc(100%-32px)] max-w-[600px] rounded-2xl border border-line bg-raised p-0 text-ink shadow-[var(--shadow)] backdrop:bg-black/50"
    >
      {s && (
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <h2 id="session-dialog-title" className="font-display text-[clamp(30px,6vw,44px)]">
              {s.name}
            </h2>
            <button
              type="button"
              aria-label="Close session details"
              onClick={() => ref.current?.close()}
              className="grid size-10 shrink-0 place-items-center rounded-full border border-line transition-colors hover:border-ink"
            >
              <XIcon size={16} weight="bold" aria-hidden />
            </button>
          </div>
          <div className="mt-3">
            <Badges s={s} />
          </div>

          <dl className="mt-6 grid grid-cols-[88px_minmax(0,1fr)] gap-x-4 gap-y-2 text-[15px]">
            <dt className="text-muted">Date</dt>
            <dd className="font-semibold">{fullDate(s.start)}</dd>
            <dt className="text-muted">Time</dt>
            <dd className="font-semibold">
              {timeRange(s.start, s.end)} (Pacific Time)
              {s.timezone && s.timezone !== "PT" && <span className="font-normal text-muted">, listed as {s.timezone}</span>}
            </dd>
            {s.format && (
              <>
                <dt className="text-muted">Format</dt>
                <dd className="font-semibold">{s.format}</dd>
              </>
            )}
            <dt className="text-muted">Length</dt>
            <dd className="font-semibold">{minutesBetween(s.start, s.end)} minutes, free and online</dd>
          </dl>

          {sessionBlurb(s) && <p className="mt-5 text-[16px] font-semibold leading-relaxed">{sessionBlurb(s)}</p>}
          {s.description &&
            s.description.split(/\n\s*\n/).map((para, i) => (
              <p key={i} className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-ink-soft">
                {para}
              </p>
            ))}
          {s.agenda.length > 0 && <DetailList title="Agenda" items={s.agenda} />}
          {s.takeaways.length > 0 && <DetailList title="What you leave with" items={s.takeaways} />}
          {s.prerequisites && (
            <p className="mt-4 text-[14px] leading-relaxed text-ink-soft">
              <span className="font-semibold text-ink">Before you come:</span> {s.prerequisites}
            </p>
          )}
          {episode && (
            <p className="mt-3 text-[14px] text-muted">
              Pairs with{" "}
              <span className="font-semibold text-ink">
                {episodeTag(episode.number)}, {episode.title}
              </span>
            </p>
          )}

          {ended ? (
            <p className="mt-6 text-[15px] font-semibold">This session has ended.</p>
          ) : (
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
              {s.status === "full" && <p className="basis-full text-[14px] font-semibold">This session is full.</p>}
              <SessionActions
                s={s}
                placement="sessions_page_dialog"
                utmContent={`sessions_page_dialog_${s.id}_${dayKey(s.start)}`}
                buttonClass={button.primary}
              />
            </div>
          )}
          {!ended && <p className="mt-3 text-[12px] text-muted">Registration opens on the F3 Insights site.</p>}
        </div>
      )}
    </dialog>
  );
}

export function SessionsExplorer({ sessions, renderedAt }: { sessions: LiveSession[]; renderedAt: number }) {
  const minute = useSyncExternalStore(subscribeMinute, minuteNow, minuteServer);
  const now = (minute ?? Math.floor(renderedAt / 60_000)) * 60_000;
  const today = dayKey(now);
  const currentMonth = monthKeyOf(today);

  const [view, setView] = useState<View>("month");
  const [picked, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [showPast, setShowPast] = useState(false);
  const [month, setMonth] = useState<string | null>(null);
  const [day, setDay] = useState<string | null>(null);
  const [selected, setSelected] = useState<LiveSession | null>(null);
  const searchTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(searchTimer.current), []);

  const isPast = (s: LiveSession) => Date.parse(s.end) <= now;
  const shownFilters = visibleFilters(sessions.filter((s) => showPast || !isPast(s)));
  // If the picked category has no sessions in this view, fall back to All.
  const filter: Filter = shownFilters.some((f) => f.id === picked) ? picked : "all";
  const needle = query.trim().toLowerCase();
  const hiddenPast = sessions.filter(isPast).length;

  const pool = useMemo(
    () => sessions.filter((s) => (showPast || Date.parse(s.end) > now) && (filter === "all" || s.category === filter)),
    [sessions, showPast, filter, now],
  );
  const visible = useMemo(() => (needle ? pool.filter((s) => s.name.toLowerCase().includes(needle)) : pool), [pool, needle]);

  const byDay = useMemo(() => {
    const map = new Map<string, LiveSession[]>();
    for (const s of visible) {
      const k = dayKey(s.start);
      map.set(k, [...(map.get(k) ?? []), s]);
    }
    return map;
  }, [visible]);

  const groups = useMemo(() => {
    const out: { month: string; items: LiveSession[] }[] = [];
    for (const s of visible) {
      const mk = monthKeyOf(dayKey(s.start));
      const last = out[out.length - 1];
      if (last && last.month === mk) last.items.push(s);
      else out.push({ month: mk, items: [s] });
    }
    return out;
  }, [visible]);

  const firstMonth = showPast && sessions.length ? monthKeyOf(dayKey(sessions[0].start)) : currentMonth;
  const lastSession = sessions[sessions.length - 1];
  const lastMonth = lastSession && monthKeyOf(dayKey(lastSession.start)) > firstMonth ? monthKeyOf(dayKey(lastSession.start)) : firstMonth;
  const requested = month ?? currentMonth;
  const viewMonth = requested < firstMonth ? firstMonth : requested > lastMonth ? lastMonth : requested;
  const monthCount = visible.filter((s) => monthKeyOf(dayKey(s.start)) === viewMonth).length;
  const dayItems = day ? (byDay.get(day) ?? []) : [];

  const filtersActive = filter !== "all" || needle !== "";

  function open(s: LiveSession, from: "month" | "list" | "day") {
    setSelected(s);
    track("session_opened", { session: s.name, session_date: dayKey(s.start), category: s.category, view: from });
  }

  function go(m: string, direction: "prev" | "next" | "today") {
    setMonth(m);
    setDay(null);
    track("sessions_month_changed", { month: m, direction });
  }

  function onSearch(value: string) {
    setQuery(value);
    window.clearTimeout(searchTimer.current);
    const text = value.trim().toLowerCase();
    if (!text) return;
    const results = pool.filter((s) => s.name.toLowerCase().includes(text)).length;
    searchTimer.current = window.setTimeout(() => {
      track("sessions_search", {
        query: text.length <= MAX_QUERY_TRACKED ? text : "",
        query_length: text.length,
        results,
      });
    }, 600);
  }

  function clearFilters() {
    setFilter("all");
    setQuery("");
    window.clearTimeout(searchTimer.current);
  }

  const toggle = (active: boolean) =>
    cx(
      "h-11 md:h-9 rounded-full px-4 text-[13px] font-semibold transition-colors",
      active ? "bg-ink text-paper" : "text-ink hover:bg-line/70",
    );

  return (
    <div className="mt-10">
      <div className="flex flex-wrap items-center gap-3">
        <div role="group" aria-label="View" className="inline-flex gap-1 rounded-full border border-line bg-raised p-1">
          {(["month", "list"] as const).map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={view === v}
              onClick={() => {
                setView(v);
                setDay(null);
                track("sessions_view_changed", { view: v });
              }}
              className={toggle(view === v)}
            >
              {v === "month" ? "Month" : "List"}
            </button>
          ))}
        </div>

        <div className="relative min-w-0 flex-1 basis-full sm:basis-64 sm:max-w-sm">
          <label htmlFor="sessions-search" className="sr-only">
            Search session titles
          </label>
          <MagnifyingGlassIcon
            size={16}
            weight="bold"
            aria-hidden
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            id="sessions-search"
            type="search"
            value={query}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search titles"
            autoComplete="off"
            className="h-11 w-full rounded-full border border-line bg-raised pl-10 pr-4 text-[15px] placeholder:text-muted"
          />
        </div>

        <button
          type="button"
          aria-pressed={showPast}
          onClick={() => {
            const next = !showPast;
            setShowPast(next);
            setDay(null);
            track("sessions_past_toggled", { shown: next });
          }}
          className={cx(
            "h-11 rounded-full border px-4 text-[13px] font-semibold transition-colors",
            showPast ? "border-ink bg-ink text-paper" : "border-line hover:border-ink",
          )}
        >
          Show past sessions
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        {shownFilters.map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={filter === f.id}
            onClick={() => {
              setFilter(f.id);
              setDay(null);
              track("sessions_filter_changed", { category: f.id });
            }}
            className={cx(
              "h-11 md:h-9 rounded-full border px-4 text-[13px] font-semibold transition-colors",
              filter === f.id ? "border-ink bg-ink text-paper" : "border-line hover:border-ink",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <p aria-live="polite" className="mt-5 text-[14px] text-muted">
        {visible.length} {showPast ? "" : "upcoming "}
        {visible.length === 1 ? "session" : "sessions"}
        {!showPast && hiddenPast > 0 && " (past sessions hidden)"}
      </p>

      {visible.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-line p-8 text-center">
          {sessions.length === 0 ? (
            <>
              <p className="text-[16px] font-semibold">No sessions are listed right now.</p>
              <p className="mt-1 text-[14px] text-muted">F3 Insights adds new sessions as it announces them.</p>
            </>
          ) : filtersActive ? (
            <>
              <p className="text-[16px] font-semibold">No sessions match.</p>
              <p className="mt-1 text-[14px] text-muted">Try a different title or category.</p>
              <button type="button" className={cx(button.outline, "mt-4")} onClick={clearFilters}>
                Clear filters
              </button>
            </>
          ) : (
            <>
              <p className="text-[16px] font-semibold">No upcoming sessions right now.</p>
              <p className="mt-1 text-[14px] text-muted">F3 Insights adds new sessions as it announces them.</p>
              {hiddenPast > 0 && (
                <button type="button" className={cx(button.outline, "mt-4")} onClick={() => setShowPast(true)}>
                  Show past sessions
                </button>
              )}
            </>
          )}
        </div>
      ) : view === "list" ? (
        <div className="mt-4 grid gap-10">
          {groups.map((g) => (
            <section key={g.month} aria-labelledby={`month-${g.month}`}>
              <h2 id={`month-${g.month}`} className="font-display text-[34px]">
                {monthLabel(`${g.month}-15T12:00:00Z`)}
              </h2>
              <ul className="mt-4 grid gap-3">
                {g.items.map((s) => (
                  <SessionRow key={`${s.id}-${s.start}`} s={s} past={isPast(s)} onOpen={() => open(s, "list")} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      ) : (
        <div className="mt-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-[clamp(34px,5vw,48px)]">{monthLabel(`${viewMonth}-15T12:00:00Z`)}</h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className={cx(button.outline, "h-11 px-4 md:h-9")}
                disabled={viewMonth === currentMonth && day === null}
                onClick={() => go(currentMonth, "today")}
              >
                Today
              </button>
              <button
                type="button"
                aria-label="Previous month"
                disabled={viewMonth <= firstMonth}
                onClick={() => go(shiftMonth(viewMonth, -1), "prev")}
                className="grid size-11 md:size-9 place-items-center rounded-full border border-line transition-colors hover:border-ink disabled:opacity-30"
              >
                <CaretLeftIcon size={16} weight="bold" aria-hidden />
              </button>
              <button
                type="button"
                aria-label="Next month"
                disabled={viewMonth >= lastMonth}
                onClick={() => go(shiftMonth(viewMonth, 1), "next")}
                className="grid size-11 md:size-9 place-items-center rounded-full border border-line transition-colors hover:border-ink disabled:opacity-30"
              >
                <CaretRightIcon size={16} weight="bold" aria-hidden />
              </button>
            </div>
          </div>

          <div role="group" aria-label={`Sessions in ${monthLabel(`${viewMonth}-15T12:00:00Z`)}`} className="mt-4 grid grid-cols-7 gap-px overflow-hidden rounded-2xl border border-line bg-line">
            {WEEKDAYS.map((d) => (
              <span key={d} className="bg-paper py-2 text-center text-[12px] font-bold text-muted">
                <span className="md:hidden">{d[0]}</span>
                <span className="hidden md:inline">{d}</span>
              </span>
            ))}
            {monthGrid(viewMonth).map((dk, i) => {
              if (!dk) return <div key={`blank-${i}`} className="min-h-[52px] bg-paper md:min-h-[124px]" />;
              const items = byDay.get(dk) ?? [];
              const isToday = dk === today;
              const selectedDay = day === dk;
              const num = Number(dk.slice(8));
              return (
                <div key={dk} className="min-h-[52px] min-w-0 bg-raised md:min-h-[124px] md:p-2">
                  {/* Phones: one button per day, markers only. */}
                  {items.length > 0 ? (
                    <button
                      type="button"
                      aria-pressed={selectedDay}
                      aria-label={`${longDate(`${dk}T19:00:00Z`)}, ${items.length} ${items.length === 1 ? "session" : "sessions"}`}
                      onClick={() => setDay(selectedDay ? null : dk)}
                      className={cx(
                        "flex h-full min-h-[52px] w-full flex-col items-center gap-1.5 pt-2 text-[14px] font-semibold tabular-nums transition-colors md:hidden",
                        selectedDay ? "bg-ink text-paper" : "hover:bg-line/50",
                      )}
                    >
                      <span className={cx(isToday && !selectedDay && "underline decoration-accent decoration-2 underline-offset-4")}>{num}</span>
                      <span className="flex gap-1" aria-hidden>
                        {items.slice(0, 3).map((s) => (
                          <span key={`${s.id}-${s.start}`} className={cx("h-1.5 w-3 rounded-full", s.recurring ? "bg-muted" : "bg-accent")} />
                        ))}
                      </span>
                    </button>
                  ) : (
                    <span
                      className={cx(
                        "flex h-full min-h-[52px] justify-center pt-2 text-[14px] tabular-nums text-muted/70 md:hidden",
                        isToday && "font-semibold text-ink underline decoration-accent decoration-2 underline-offset-4",
                      )}
                    >
                      {num}
                    </span>
                  )}

                  {/* Desktop: titles in the cell. */}
                  <div className="hidden min-w-0 md:block">
                    <span
                      className={cx(
                        "inline-grid size-6 place-items-center rounded-full text-[13px] font-semibold tabular-nums",
                        isToday ? "bg-ink text-paper" : items.length ? "text-ink" : "text-muted/70",
                      )}
                    >
                      {num}
                    </span>
                    <div className="mt-1 grid gap-1">
                      {items.slice(0, MAX_IN_CELL).map((s) => (
                        <button
                          key={`${s.id}-${s.start}`}
                          type="button"
                          onClick={() => open(s, "month")}
                          className={cx(
                            "flex w-full min-w-0 items-baseline gap-1.5 rounded-md border-l-[3px] px-1.5 py-1 text-left text-[12px] leading-tight transition-colors",
                            s.recurring ? "border-muted bg-line/50 hover:bg-line" : "border-accent bg-accent/10 hover:bg-accent/20",
                            isPast(s) && "opacity-60",
                          )}
                        >
                          <span className="shrink-0 tabular-nums text-muted">{compactTime(s.start)}</span>
                          <span className="truncate font-semibold">{s.name}</span>
                        </button>
                      ))}
                      {items.length > MAX_IN_CELL && (
                        <button
                          type="button"
                          onClick={() => setDay(dk)}
                          className="w-fit rounded-md px-1.5 py-0.5 text-left text-[12px] font-semibold text-ink-soft underline decoration-line underline-offset-4 hover:decoration-current"
                        >
                          {items.length - MAX_IN_CELL} more
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-muted">
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-4 rounded-full bg-accent" aria-hidden /> Working session
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-4 rounded-full bg-muted" aria-hidden /> Weekly meetup
            </span>
          </div>

          {monthCount === 0 && (
            <p className="mt-5 text-[14px] text-muted">
              No sessions in {monthLabel(`${viewMonth}-15T12:00:00Z`)}
              {filtersActive ? " for this search" : ""}. Use the arrows to look at other months.
            </p>
          )}

          {day && dayItems.length > 0 && (
            <section aria-labelledby="day-heading" className="mt-6">
              <div className="flex items-center justify-between gap-3">
                <h3 id="day-heading" className="text-[18px] font-bold">
                  {longDate(`${day}T19:00:00Z`)}
                </h3>
                <button type="button" className={button.text} onClick={() => setDay(null)}>
                  Close day
                </button>
              </div>
              <ul className="mt-3 grid gap-3">
                {dayItems.map((s) => (
                  <SessionRow key={`${s.id}-${s.start}`} s={s} past={isPast(s)} onOpen={() => open(s, "day")} />
                ))}
              </ul>
            </section>
          )}
        </div>
      )}

      <SessionDialog s={selected} ended={selected ? isPast(selected) : false} onClose={() => setSelected(null)} />
    </div>
  );
}

"use client";

import { show } from "@/content/show";
import { track } from "@/lib/analytics";
import { pad, usePremiere } from "@/lib/premiere";

// Eyebrow + live countdown in one line. Before hydration it reserves the
// countdown's width so nothing shifts.
export function PremiereLine({ dateLabel }: { dateLabel: string }) {
  const clock = usePremiere();

  if (clock?.state === "live") {
    return (
      <a
        href={show.liveEventUrl || show.channels.youtube.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track("platform_follow_clicked", { platform: "youtube", placement: "hero_live_eyebrow" })}
        className="flex w-fit items-center gap-2 text-[13px] font-bold uppercase tracking-[0.08em] text-accent-ink underline decoration-accent/40 underline-offset-4"
      >
        <span className="size-2 animate-pulse rounded-full bg-accent" aria-hidden />
        Live now on YouTube. Join the chat
      </a>
    );
  }

  if (clock?.state === "after") {
    return (
      <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-accent-ink">Episode 1 is up on YouTube</p>
    );
  }

  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] font-bold uppercase tracking-[0.08em]">
      <span className="text-accent-ink">Live video podcast</span>
      <span className="text-ink-soft">Premieres {dateLabel} on YouTube Live</span>
      <span
        className="inline-flex h-6 min-w-[112px] items-center justify-center rounded-full bg-ink px-2.5 text-[12px] normal-case tabular-nums tracking-normal text-paper"
        aria-live="off"
      >
        {clock ? (
          clock.state === "last-hour" ? (
            `In ${clock.minutes} min`
          ) : (
            `${clock.days}d ${pad(clock.hours)}h ${pad(clock.minutes)}m`
          )
        ) : (
          <span className="opacity-0">00d 00h 00m</span>
        )}
      </span>
    </p>
  );
}

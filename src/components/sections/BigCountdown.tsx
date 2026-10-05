"use client";

import { show } from "@/content/show";
import { pad, usePremiere } from "@/lib/premiere";

const etFmt = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", hour: "numeric", minute: "2-digit" });
const ptFmt = new Intl.DateTimeFormat("en-US", { timeZone: "America/Los_Angeles", hour: "numeric", minute: "2-digit" });

function LocalTime() {
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (zone === "America/Los_Angeles" || zone === "America/New_York") return null;
  const local = new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(show.premiereAt));
  return <p className="mt-1 text-[13px] text-white/60">That&apos;s {local} where you are.</p>;
}

export function BigCountdown({ dateLabel }: { dateLabel: string }) {
  const clock = usePremiere();
  const start = new Date(show.premiereAt);
  const times = `${ptFmt.format(start)} PT / ${etFmt.format(start)} ET`;

  if (clock?.state === "live" || clock?.state === "after") {
    return (
      <div>
        <p className="font-display text-[clamp(64px,9vw,140px)] text-[#f2f2ee]">
          {clock.state === "live" ? "Live now" : "Episode 1 is up"}
        </p>
        <p className="mt-3 text-[15px] text-white/70">{show.premiereEpisode}</p>
      </div>
    );
  }

  const units = clock
    ? [
        { v: String(clock.days), l: "Days" },
        { v: pad(clock.hours), l: "Hours" },
        { v: pad(clock.minutes), l: "Min" },
        { v: pad(clock.seconds), l: "Sec" },
      ]
    : ["Days", "Hours", "Min", "Sec"].map((l) => ({ v: "--", l }));

  const heading =
    clock?.state === "today" ? `Live today at ${times}` : clock?.state === "last-hour" ? `Live in ${clock.minutes} minutes` : "Premieres in";

  return (
    <div>
      <p className="text-[14px] font-semibold text-white/80">{heading}</p>
      <div className="mt-3 flex items-end gap-2.5 sm:gap-6" role="timer" aria-label={clock ? `${clock.days} days, ${clock.hours} hours, ${clock.minutes} minutes to the premiere` : "Countdown to the premiere"}>
        {units.map((u, i) => (
          <div key={u.l} className="flex items-end gap-2.5 sm:gap-6">
            <div>
              <p className="font-display text-[clamp(46px,8vw,128px)] tabular-nums text-[#f2f2ee]">{u.v}</p>
              <p className="mt-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-white/55">{u.l}</p>
            </div>
            {i < units.length - 1 && <span className="font-display pb-8 text-[clamp(30px,5vw,80px)] text-accent">:</span>}
          </div>
        ))}
      </div>
      <p className="mt-6 text-[15px] font-medium text-[#f2f2ee]">
        {dateLabel}, {times}
      </p>
      {clock && <LocalTime />}
    </div>
  );
}

"use client";

import { CalendarPlusIcon } from "@phosphor-icons/react";
import { premiereEnd, show } from "@/content/show";
import { track } from "@/lib/analytics";
import { downloadIcs } from "@/lib/ics";
import { liveAction, usePremiere } from "@/lib/premiere";
import { button, cx } from "@/lib/ui";

// The YouTube follow action, which changes label with the premiere state.
export function LiveButton({
  placement,
  variant = "outline",
  className,
}: {
  placement: string;
  variant?: keyof typeof button;
  className?: string;
}) {
  const clock = usePremiere();
  const action = liveAction(clock?.state);
  return (
    <a
      href={action.href}
      target="_blank"
      rel="noopener noreferrer"
      className={cx(button[variant], className)}
      onClick={() => track("platform_follow_clicked", { platform: "youtube", placement })}
    >
      {action.label}
    </a>
  );
}

export function addPremiereToCalendar(placement: string) {
  track("premiere_added_to_calendar", { placement });
  downloadIcs(
    {
      uid: "eu-s1-e01-premiere",
      title: `Executive Upskill premiere: ${show.premiereEpisode}`,
      description: "Live on YouTube. Bring a question for the chat.",
      start: show.premiereAt,
      end: premiereEnd(),
      url: show.liveEventUrl || show.channels.youtube.url,
      location: "YouTube Live",
    },
    "executive-upskill-premiere",
  );
}

export function AddPremiereButton({ placement, className }: { placement: string; className?: string }) {
  return (
    <button
      type="button"
      onClick={() => addPremiereToCalendar(placement)}
      className={cx(button.text, className)}
    >
      <CalendarPlusIcon size={16} weight="bold" aria-hidden />
      Add to calendar
    </button>
  );
}

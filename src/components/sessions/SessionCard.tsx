"use client";

import { ArrowUpRightIcon, CalendarPlusIcon } from "@phosphor-icons/react";
import { track } from "@/lib/analytics";
import type { LiveSession } from "@/lib/events";
import { downloadIcs } from "@/lib/ics";
import { sessionCalendarEvent, withUtm } from "@/lib/sessions";
import { dayKey } from "@/lib/time";
import { button, cx } from "@/lib/ui";

// Register and Add to calendar for one session. Shared by the homepage card
// and the /sessions detail dialog. `utmContent` tags the outbound link.
export function SessionActions({
  s,
  placement,
  utmContent,
  buttonClass = cx(button.outline, "h-10 px-4"),
}: {
  s: LiveSession;
  placement: string;
  utmContent: string;
  buttonClass?: string;
}) {
  return (
    <>
      {s.status === "full" ? (
        <a
          href={withUtm(s.url, utmContent)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("cta_clicked", { cta: "session_page_full", placement })}
          className={buttonClass}
        >
          See session page
          <ArrowUpRightIcon size={16} weight="bold" aria-hidden />
        </a>
      ) : (
        <a
          href={withUtm(s.url, utmContent)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            track("session_register_clicked", {
              session: s.name,
              session_date: dayKey(s.start),
              category: s.category,
              placement,
            })
          }
          className={buttonClass}
        >
          Register free
          <ArrowUpRightIcon size={16} weight="bold" aria-hidden />
        </a>
      )}
      <button
        type="button"
        className={button.text}
        onClick={() => {
          track("session_added_to_calendar", {
            session: s.name,
            session_date: dayKey(s.start),
            placement,
          });
          downloadIcs(sessionCalendarEvent(s), s.id);
        }}
      >
        <CalendarPlusIcon size={16} weight="bold" aria-hidden />
        Add to calendar
      </button>
    </>
  );
}

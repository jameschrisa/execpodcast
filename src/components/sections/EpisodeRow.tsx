"use client";

import { ArrowRightIcon } from "@phosphor-icons/react";
import type { LensId } from "@/content/hosts";
import { track } from "@/lib/analytics";

export const EPISODE_INTEREST_EVENT = "eu:episode-interest";

// A planned episode. Clicking flags interest (a PostHog signal the hosts can
// use to order the season) and opens the alerts form with that episode noted.
export function EpisodeRow({ number, title, lens, hostName }: { number: number; title: string; lens: LensId; hostName: string }) {
  const tag = String(number).padStart(2, "0");
  return (
    <a
      href="#participate"
      onClick={() => {
        track("episode_interest_clicked", { episode: `EP ${tag} ${title}`, lens });
        window.dispatchEvent(new CustomEvent(EPISODE_INTEREST_EVENT, { detail: `EP ${tag}: ${title}` }));
      }}
      className="group/row grid grid-cols-[44px_minmax(0,1fr)_20px] items-center gap-4 py-4"
      aria-label={`Episode ${number}, ${title}. Get alerts for this episode.`}
    >
      <span className="font-display grid size-11 place-items-center rounded-full border-2 border-current text-[20px]">{tag}</span>
      <span>
        <span className="block text-[15px] font-semibold leading-snug">{title}</span>
        <span className="mt-1 block text-[12px] opacity-75">Led by {hostName}</span>
      </span>
      <ArrowRightIcon size={18} weight="bold" className="transition-transform duration-300 group-hover/row:translate-x-1" aria-hidden />
    </a>
  );
}

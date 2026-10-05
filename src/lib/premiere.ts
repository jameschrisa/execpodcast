"use client";

import { useSyncExternalStore } from "react";
import { show } from "@/content/show";
import { dayKey } from "@/lib/time";

// One shared one-second clock for every countdown on the page.
const listeners = new Set<() => void>();
let timer: number | undefined;

function subscribe(cb: () => void) {
  listeners.add(cb);
  if (timer === undefined) timer = window.setInterval(() => listeners.forEach((l) => l()), 1000);
  return () => {
    listeners.delete(cb);
    if (listeners.size === 0 && timer !== undefined) {
      window.clearInterval(timer);
      timer = undefined;
    }
  };
}

const getSnapshot = () => Math.floor(Date.now() / 1000);
const getServerSnapshot = () => null;

// Seconds since epoch on the client, null during server render and hydration.
export function useNowSeconds(): number | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export type PremiereState = "countdown" | "today" | "last-hour" | "live" | "after";

export type PremiereClock = {
  state: PremiereState;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const START = Math.floor(Date.parse(show.premiereAt) / 1000);
const END = START + show.premiereLengthMinutes * 60;

export function premiereClock(now: number): PremiereClock {
  const diff = Math.max(0, START - now);
  const parts = {
    days: Math.floor(diff / 86400),
    hours: Math.floor((diff % 86400) / 3600),
    minutes: Math.floor((diff % 3600) / 60),
    seconds: diff % 60,
  };
  let state: PremiereState = "countdown";
  if (now >= END) state = "after";
  else if (now >= START) state = "live";
  else if (diff <= 3600) state = "last-hour";
  else if (dayKey(now * 1000) === dayKey(START * 1000)) state = "today";
  return { state, ...parts };
}

export function usePremiere(): PremiereClock | null {
  const now = useNowSeconds();
  return now === null ? null : premiereClock(now);
}

export const pad = (n: number) => String(n).padStart(2, "0");

// The follow action for the YouTube Live slot, by state.
export function liveAction(state: PremiereState | undefined) {
  const yt = show.channels.youtube;
  if (state === "live") return { label: "Watch live", href: show.liveEventUrl || yt.url };
  if (state === "after") return { label: "Watch the replay", href: show.liveEventUrl || yt.url };
  if (show.liveEventUrl) return { label: "Set YouTube reminder", href: show.liveEventUrl };
  return { label: "Subscribe on YouTube", href: yt.subscribeUrl };
}

const CUTOFF = Math.floor(Date.parse(show.premiereAt) / 1000) - show.questionCutoffHours * 3600;

// Whether questions still make it into Episode 1. Null before hydration.
export function useQuestionsOpen(): boolean | null {
  const now = useNowSeconds();
  return now === null ? null : now < CUTOFF;
}

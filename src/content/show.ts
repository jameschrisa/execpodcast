// Single source of truth for show-level facts. Edit here, not in components.
//
// TODO(before launch): confirm the premiere date/time, the YouTube Live event
// URL once the stream is scheduled, the question cutoff and the channel
// handles. The countdown, calendar files, JSON-LD and footer all read from here.

export const show = {
  name: "Executive Upskill",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://executiveupskill.live",
  campaignLine: "One question. Three lenses.",

  // Wednesday after the Thursday F3 sessions, before Election Day, inside
  // Q4 budget season. ISO 8601 with offset.
  premiereAt: process.env.NEXT_PUBLIC_PREMIERE_AT ?? "2026-10-28T11:00:00-07:00",
  premiereLengthMinutes: 90,
  premiereEpisode: "Your 2027 AI Budget, Argued Three Ways",

  // Set once the YouTube Live event exists. Until then every
  // "Set YouTube reminder" button falls back to "Subscribe on YouTube".
  liveEventUrl: process.env.NEXT_PUBLIC_YT_LIVE_URL ?? "",

  // Questions for the next episode close this long before air.
  questionCutoffHours: 48,
  pitchReplyBusinessDays: 10,

  channels: {
    youtube: {
      handle: "@ExecutiveUpskill",
      url: "https://www.youtube.com/@ExecutiveUpskill",
      subscribeUrl: "https://www.youtube.com/@ExecutiveUpskill?sub_confirmation=1",
    },
    shorts: {
      handle: "@ExecutiveUpskill",
      url: "https://www.youtube.com/@ExecutiveUpskill/shorts",
    },
    instagram: {
      handle: "@executiveupskill",
      url: "https://www.instagram.com/executiveupskill",
    },
    tiktok: {
      handle: "@executiveupskill",
      url: "https://www.tiktok.com/@executiveupskill",
    },
    linkedin: {
      handle: "Executive Upskill",
      url: "https://www.linkedin.com/showcase/executive-upskill/",
    },
  },

  // Affiliated free sessions. Outbound links carry these UTMs.
  eventsSource: "https://f3insights.com/events",
  eventsUtm: {
    utm_source: "executiveupskill",
    utm_medium: "referral",
    utm_campaign: "eu_f3_sessions",
  },
} as const;

export type PlatformId = "youtube" | "shorts" | "instagram" | "tiktok" | "linkedin";

export function questionCutoff() {
  return new Date(Date.parse(show.premiereAt) - show.questionCutoffHours * 3600_000).toISOString();
}

export function premiereEnd() {
  return new Date(Date.parse(show.premiereAt) + show.premiereLengthMinutes * 60_000).toISOString();
}

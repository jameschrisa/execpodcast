import posthog from "posthog-js";
import { getAttribution } from "@/lib/attribution";

const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const region = process.env.NEXT_PUBLIC_POSTHOG_REGION === "eu" ? "eu" : "us";

if (key) {
  try {
    const { props } = getAttribution();

    posthog.init(key, {
      api_host: "/ingest",
      ui_host: `https://${region}.posthog.com`,
      defaults: "2026-08-30",
      person_profiles: "identified_only",
      capture_pageleave: true,
      capture_performance: { web_vitals: true },
      capture_exceptions: true,
      enable_heatmaps: true,
      capture_dead_clicks: true,
      respect_dnt: true,
      session_recording: {
        maskAllInputs: true,
        maskTextSelector: "[data-ph-mask]",
      },
      // Attach channel attribution to every event, including the first
      // pageview, without depending on init order.
      before_send: (event) => {
        if (event) event.properties = { ...props, ...event.properties };
        return event;
      },
    });
  } catch (error) {
    console.warn("[analytics] PostHog failed to start", error);
  }
}

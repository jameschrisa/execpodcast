import posthog from "posthog-js";
import type { HostId, LensId } from "@/content/hosts";
import type { PlatformId } from "@/content/show";
import { attributionPersonProps } from "@/lib/attribution";

export type FormKind = "alerts" | "question" | "pitch";

// Every custom event the site sends. docs/TRACKING.md documents each one.
export type EventMap = {
  cta_clicked: { cta: string; placement: string };
  nav_clicked: { target: string; placement: "header" | "compact" | "mobile" | "footer" };
  platform_follow_clicked: { platform: PlatformId; placement: string };
  host_viewed: { host: HostId; method: "card" | "tab" | "link" };
  host_linkedin_clicked: { host: HostId; placement: string };
  lens_question_selected: { question: string; index: number };
  episode_interest_clicked: { episode: string; lens: LensId };
  sessions_filter_changed: { category: string };
  sessions_day_selected: { date: string; count: number };
  sessions_month_changed: { month: string; direction: "prev" | "next" };
  session_register_clicked: { session: string; session_date: string; category: string; placement: string };
  session_added_to_calendar: { session: string; session_date: string };
  premiere_added_to_calendar: { placement: string };
  join_tab_changed: { tab: FormKind; method: "click" | "link" };
  form_started: { form: FormKind };
  form_submitted: { form: FormKind; role?: string; host?: string; episode_interest?: string };
  form_failed: { form: FormKind; reason: string };
  lens_preference_selected: { lens: LensId };
  faq_opened: { question: string };
  section_viewed: { section: string };
  scroll_depth_reached: { percent: number };
  theme_changed: { theme: "light" | "dark" };
};

function ready() {
  return typeof window !== "undefined" && Boolean(posthog.__loaded);
}

export function track<E extends keyof EventMap>(event: E, props: EventMap[E]) {
  if (process.env.NODE_ENV === "development") console.debug("[track]", event, props);
  if (!ready()) return;
  posthog.capture(event, props);
}

// Ties the anonymous visitor to a person in PostHog, carrying first-touch and
// last-touch channel so lead reports can break down by where people came from.
export function identifyLead(email: string, traits: Record<string, string | undefined>) {
  if (!ready()) return;
  const { set, setOnce } = attributionPersonProps();
  const clean = Object.fromEntries(Object.entries(traits).filter(([, v]) => v));
  posthog.identify(email.trim().toLowerCase(), { email, ...clean, ...set }, setOnce);
}

export function setPersonProps(props: Record<string, string>) {
  if (!ready()) return;
  posthog.setPersonProperties(props);
}

export function distinctId(): string | undefined {
  return ready() ? posthog.get_distinct_id() : undefined;
}

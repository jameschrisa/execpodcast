"use client";

import { distinctId, identifyLead, track, type FormKind } from "@/lib/analytics";
import { getAttribution } from "@/lib/attribution";

export type SubmitResult = { ok: true } | { ok: false; message: string };

const MESSAGES: Record<string, string> = {
  invalid_email: "That email looks off. Check for a typo.",
  missing_question: "Add your question first.",
  missing_pitch: "Add the guest's name and the call they made.",
  rate_limited: "Too many tries in a minute. Wait a moment and send again.",
  not_configured: "Sign-ups are offline for a moment. Try again shortly.",
};

export async function submitParticipation(
  kind: FormKind,
  fields: Record<string, string | boolean | undefined>,
): Promise<SubmitResult> {
  const email = String(fields.email ?? "").trim();
  let attribution: Record<string, unknown> = {};
  try {
    attribution = getAttribution().props;
  } catch {
    // Attribution is best effort.
  }

  try {
    const res = await fetch("/api/participate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ kind, ...fields, email, distinctId: distinctId(), attribution }),
    });
    const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
    if (!res.ok || !data.ok) {
      const reason = data.error ?? `http_${res.status}`;
      track("form_failed", { form: kind, reason });
      return { ok: false, message: MESSAGES[reason] ?? "Something broke on our side. Try again in a minute." };
    }
  } catch {
    track("form_failed", { form: kind, reason: "network" });
    return { ok: false, message: "We couldn't reach the server. Check your connection and try again." };
  }

  identifyLead(email, {
    name: typeof fields.name === "string" ? fields.name : undefined,
    role: typeof fields.role === "string" ? fields.role : undefined,
    [`submitted_${kind}`]: "true",
  });
  track("form_submitted", {
    form: kind,
    role: typeof fields.role === "string" ? fields.role : undefined,
    host: typeof fields.host === "string" ? fields.host : undefined,
    episode_interest: typeof fields.episodeInterest === "string" ? fields.episodeInterest : undefined,
  });
  return { ok: true };
}

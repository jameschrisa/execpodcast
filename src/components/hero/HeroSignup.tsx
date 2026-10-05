"use client";

import { useRef, useState } from "react";
import { AlertsSuccess } from "@/components/premiere/AlertsSuccess";
import { LiveButton } from "@/components/premiere/PremiereActions";
import { track } from "@/lib/analytics";
import { submitParticipation } from "@/lib/participate";
import { button, cx } from "@/lib/ui";

export function HeroSignup() {
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const started = useRef(false);

  if (status === "done") {
    return (
      <div className="w-full max-w-[520px]">
        <AlertsSuccess placement="hero" compact />
      </div>
    );
  }

  return (
    <form
      noValidate
      className="w-full max-w-[560px]"
      onSubmit={async (e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const email = String(data.get("email") ?? "");
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
          setError("That email looks off. Check for a typo.");
          track("form_failed", { form: "alerts", reason: "client_invalid_email" });
          return;
        }
        setError(null);
        setStatus("sending");
        const result = await submitParticipation("alerts", {
          email,
          website: String(data.get("website") ?? ""),
          episodeInterest: "hero",
        });
        if (result.ok) setStatus("done");
        else {
          setStatus("idle");
          setError(result.message);
        }
      }}
    >
      <label htmlFor="hero-email" className="mb-2 block text-[13px] font-medium text-muted">
        Email. We send the live link when we start, then one email per episode.
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id="hero-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          placeholder="you@company.com"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "hero-email-error" : undefined}
          onFocus={() => {
            if (started.current) return;
            started.current = true;
            track("form_started", { form: "alerts" });
          }}
          className={cx(
            "h-12 w-full min-w-0 shrink-0 rounded-full border sm:w-auto sm:flex-1 bg-raised px-5 text-[15px] text-ink placeholder:text-muted/80 transition-colors focus:border-ink focus:outline-none",
            error ? "border-accent-ink" : "border-line",
          )}
        />
        {/* Honeypot: hidden from people, filled by bots. */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
        <button type="submit" disabled={status === "sending"} className={cx(button.primary, "h-12 px-6")}>
          {status === "sending" ? "Sending..." : "Get premiere alerts"}
        </button>
      </div>
      <div className="mt-2 flex min-h-6 flex-wrap items-center justify-between gap-x-4 gap-y-1">
        {error ? (
          <p id="hero-email-error" role="alert" className="text-[13px] font-medium text-accent-ink">
            {error}
          </p>
        ) : (
          <span />
        )}
        <LiveButton placement="hero_secondary" variant="text" />
      </div>
    </form>
  );
}

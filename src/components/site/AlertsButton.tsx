"use client";

import { track } from "@/lib/analytics";
import { liveAction, usePremiere } from "@/lib/premiere";
import { button, cx } from "@/lib/ui";

// The page's primary button. Before the premiere it captures email; while the
// stream is live every instance becomes "Watch live"; afterwards it asks for
// episode alerts. Server render and hydration use the pre-premiere label.
export function AlertsButton({
  placement,
  variant = "primary",
  className,
}: {
  placement: string;
  variant?: keyof typeof button;
  className?: string;
}) {
  const clock = usePremiere();

  if (clock?.state === "live") {
    const action = liveAction("live");
    return (
      <a
        href={action.href}
        target="_blank"
        rel="noopener noreferrer"
        className={cx(button[variant], className)}
        onClick={() => track("platform_follow_clicked", { platform: "youtube", placement: `${placement}_live` })}
      >
        <span className="size-2 animate-pulse rounded-full bg-current" aria-hidden />
        Watch live
      </a>
    );
  }

  const label = clock?.state === "after" ? "Get episode alerts" : "Get premiere alerts";

  return (
    <a
      href="#participate"
      className={cx(button[variant], className)}
      onClick={(e) => {
        track("cta_clicked", { cta: "premiere_alerts", placement });
        // If the hero email field is on screen, focus it instead of jumping.
        const field = document.getElementById("hero-email") as HTMLInputElement | null;
        if (!field) return;
        const r = field.getBoundingClientRect();
        if (r.top >= 0 && r.bottom <= window.innerHeight) {
          e.preventDefault();
          field.focus();
        }
      }}
    >
      {label}
    </a>
  );
}

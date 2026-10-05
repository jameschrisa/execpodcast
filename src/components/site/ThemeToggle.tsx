"use client";

import { MoonIcon, SunIcon } from "@phosphor-icons/react";
import { useSyncExternalStore } from "react";
import { track } from "@/lib/analytics";
import { cx } from "@/lib/ui";

type Theme = "light" | "dark";

function subscribe(cb: () => void) {
  const observer = new MutationObserver(cb);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

const read = (): Theme => (document.documentElement.dataset.theme === "dark" ? "dark" : "light");

export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore<Theme | null>(subscribe, read, () => null);
  const next: Theme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      aria-label={theme ? `Switch to ${next} mode` : "Toggle color theme"}
      className={cx(
        "grid size-9 place-items-center rounded-full border border-line text-ink transition-colors hover:border-ink",
        className,
      )}
      onClick={() => {
        document.documentElement.dataset.theme = next;
        try {
          localStorage.setItem("eu-theme", next);
        } catch {
          // Storage blocked. The choice holds for this page view.
        }
        track("theme_changed", { theme: next });
      }}
    >
      {theme === "dark" ? <SunIcon size={16} weight="bold" /> : <MoonIcon size={16} weight="bold" />}
    </button>
  );
}

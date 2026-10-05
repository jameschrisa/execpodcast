"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { track } from "@/lib/analytics";

// <details> toggle events don't bubble, so listen in the capture phase.
export function FaqTracker({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const onToggle = (e: Event) => {
      const el = e.target as HTMLDetailsElement;
      if (el.tagName !== "DETAILS" || !el.open) return;
      const question = el.querySelector("summary")?.childNodes[0]?.textContent?.trim() ?? "";
      track("faq_opened", { question });
    };
    root.addEventListener("toggle", onToggle, true);
    return () => root.removeEventListener("toggle", onToggle, true);
  }, []);
  return <div ref={ref}>{children}</div>;
}

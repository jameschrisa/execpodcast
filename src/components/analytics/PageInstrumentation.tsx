"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

const DEPTHS = [25, 50, 75, 100];

// Section views and scroll depth, both from IntersectionObserver (no scroll
// listeners). Sections opt in with data-section="name".
export function PageInstrumentation() {
  useEffect(() => {
    const seen = new Set<string>();
    const sections = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const name = (entry.target as HTMLElement).dataset.section;
          if (!name || seen.has(name)) continue;
          seen.add(name);
          track("section_viewed", { section: name });
          sections.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -45% 0px" },
    );
    document.querySelectorAll<HTMLElement>("[data-section]").forEach((el) => sections.observe(el));

    const depth = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        track("scroll_depth_reached", { percent: Number((entry.target as HTMLElement).dataset.depth) });
        depth.unobserve(entry.target);
      }
    });
    document.querySelectorAll<HTMLElement>("[data-depth]").forEach((el) => depth.observe(el));

    return () => {
      sections.disconnect();
      depth.disconnect();
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {DEPTHS.map((p) => (
        <span key={p} data-depth={p} className="absolute left-0 h-px w-px" style={{ top: `calc(${p}% - 2px)` }} />
      ))}
    </div>
  );
}

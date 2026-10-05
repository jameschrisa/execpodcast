"use client";

import { ListIcon, XIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { nav } from "@/content/site";
import { show } from "@/content/show";
import { track } from "@/lib/analytics";
import { pad, usePremiere } from "@/lib/premiere";
import { cx } from "@/lib/ui";
import { AlertsButton } from "./AlertsButton";
import { ThemeToggle } from "./ThemeToggle";

function LiveChip() {
  const clock = usePremiere();
  if (!clock) return <span className="h-7 w-[118px] rounded-full bg-line/60" aria-hidden />;
  if (clock.state === "live")
    return (
      <a
        href={show.liveEventUrl || show.channels.youtube.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track("platform_follow_clicked", { platform: "youtube", placement: "compact_live_chip" })}
        className="inline-flex h-7 items-center gap-2 rounded-full bg-accent px-3 text-[12px] font-bold uppercase tracking-wide text-on-accent"
      >
        <span className="size-1.5 animate-pulse rounded-full bg-on-accent" aria-hidden />
        Live now
      </a>
    );
  if (clock.state === "after") return null;
  return (
    <span className="inline-flex h-7 items-center rounded-full border border-line px-3 text-[12px] font-semibold tabular-nums text-muted">
      Live in {clock.days > 0 ? `${clock.days}d ` : ""}
      {pad(clock.hours)}h {pad(clock.minutes)}m
    </span>
  );
}

// Sticky bar. Always on for phones; on desktop it slides in once the masthead
// scrolls away (state change, so it earns the motion).
export function CompactNav() {
  const [shown, setShown] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const masthead = document.getElementById("masthead");
    if (!masthead) return;
    const io = new IntersectionObserver(([entry]) => setShown(!entry.isIntersecting), { threshold: 0 });
    io.observe(masthead);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div
      data-shown={shown}
      className={cx(
        "z-40 w-full max-md:sticky max-md:top-0 md:fixed md:inset-x-0 md:top-3 md:px-6",
        // invisible (not just off-screen) so keyboard focus skips it while hidden
        "transition-[transform,visibility] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:data-[shown=false]:invisible md:data-[shown=false]:-translate-y-[140%] motion-reduce:transition-none",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1352px] items-center gap-3 border-b border-line bg-paper/90 px-4 backdrop-blur-md md:rounded-2xl md:border md:pl-2 md:pr-2 md:shadow-[var(--shadow)]">
        <a href="#top" aria-label="Executive Upskill, back to top" onClick={() => setOpen(false)}>
          <Logo size={48} />
        </a>

        <nav aria-label="Sections" className="ml-6 hidden items-center gap-5 lg:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[13px] font-semibold text-ink-soft transition-colors hover:text-accent-ink"
              onClick={() => track("nav_clicked", { target: item.href, placement: "compact" })}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <span className="hidden md:inline-flex">
            <LiveChip />
          </span>
          <AlertsButton placement="compact_nav" className="h-10 px-4 max-sm:text-[13px]" />
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full border border-line lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <XIcon size={18} weight="bold" /> : <ListIcon size={18} weight="bold" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={reduce ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-2 max-w-[1352px] rounded-2xl border border-line bg-paper p-5 shadow-[var(--shadow)] max-md:mx-4 lg:hidden"
          >
            <nav aria-label="Menu" className="grid gap-1">
              {nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="font-display text-[34px] text-ink"
                  onClick={() => {
                    track("nav_clicked", { target: item.href, placement: "mobile" });
                    setOpen(false);
                  }}
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-[13px] font-semibold">
                <a href={show.channels.youtube.url} target="_blank" rel="noopener noreferrer" onClick={() => track("platform_follow_clicked", { platform: "youtube", placement: "mobile_menu" })}>
                  YouTube
                </a>
                <a href={show.channels.instagram.url} target="_blank" rel="noopener noreferrer" onClick={() => track("platform_follow_clicked", { platform: "instagram", placement: "mobile_menu" })}>
                  Instagram
                </a>
                <a href={show.channels.tiktok.url} target="_blank" rel="noopener noreferrer" onClick={() => track("platform_follow_clicked", { platform: "tiktok", placement: "mobile_menu" })}>
                  TikTok
                </a>
                <a href={show.channels.linkedin.url} target="_blank" rel="noopener noreferrer" onClick={() => track("platform_follow_clicked", { platform: "linkedin", placement: "mobile_menu" })}>
                  LinkedIn
                </a>
              </div>
              <ThemeToggle />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

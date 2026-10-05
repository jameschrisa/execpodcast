"use client";

import { LinkedinLogoIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { hosts, lensPhrase, type Host, type HostId } from "@/content/hosts";
import { track } from "@/lib/analytics";
import { button, container, cx } from "@/lib/ui";

const lensBorder: Record<Host["lens"], string> = {
  brand: "border-[var(--lens-brand)]",
  money: "border-[var(--lens-money-ring)]",
  venture: "border-ink",
};

// Laughing side profile at rest; hover (or tap) cuts to the take at the mic.
function Portrait({ host }: { host: Host }) {
  const [alt, setAlt] = useState(false);
  return (
    <button
      type="button"
      aria-label={`Show another photo of ${host.name}`}
      onClick={() => setAlt((v) => !v)}
      className="group relative block aspect-[4/5] w-full overflow-hidden rounded-2xl bg-scrim"
    >
      <Image
        src={host.photos.laugh}
        alt={`${host.name}, ${host.role} of Executive Upskill, laughing in the studio`}
        fill
        sizes="(min-width: 1024px) 40vw, 100vw"
        className="object-cover object-[50%_25%]"
      />
      <Image
        src={host.photos.talk}
        alt=""
        fill
        sizes="(min-width: 1024px) 40vw, 100vw"
        className={cx(
          "object-cover object-[50%_20%] transition-opacity duration-500 [@media(hover:hover)]:group-hover:opacity-100",
          alt ? "opacity-100" : "opacity-0",
        )}
      />
    </button>
  );
}

export function Hosts() {
  const [activeId, setActiveId] = useState<HostId>("james");
  const reduce = useReducedMotion();
  const host = hosts.find((h) => h.id === activeId)!;

  // /#host-greg (from a hero card, lens panel or shared link) selects that host.
  useEffect(() => {
    const sync = () => {
      const m = window.location.hash.match(/^#host-(james|greg|bryce)$/);
      if (m) setActiveId(m[1] as HostId);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  return (
    <section id="hosts" data-section="hosts" className={cx(container, "relative pt-24 md:pt-32")}>
      {hosts.map((h) => (
        <span key={h.id} id={`host-${h.id}`} className="absolute top-16" aria-hidden />
      ))}
      <h2 className="font-display text-[clamp(48px,6.4vw,96px)]">Meet the hosts</h2>

      <div role="tablist" aria-label="Hosts" className="mt-8 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
        {hosts.map((h) => (
          <button
            key={h.id}
            role="tab"
            id={`host-tab-${h.id}`}
            aria-selected={h.id === activeId}
            aria-controls="host-panel"
            onClick={() => {
              setActiveId(h.id);
              track("host_viewed", { host: h.id, method: "tab" });
            }}
            className={cx(
              "flex h-14 shrink-0 items-center gap-3 rounded-full border pl-1.5 pr-5 text-left transition-colors duration-300",
              h.id === activeId ? "border-ink bg-ink text-paper" : "border-line hover:border-ink",
            )}
          >
            <span className="relative size-11 overflow-hidden rounded-full">
              <Image src={h.photos.avatar} alt="" fill sizes="44px" className="object-cover" />
            </span>
            <span>
              <span className="block text-[14px] font-bold leading-tight">{h.name}</span>
              <span className="block text-[12px] opacity-70">{h.lensLabel}</span>
            </span>
          </button>
        ))}
      </div>

      <div id="host-panel" role="tabpanel" aria-labelledby={`host-tab-${activeId}`} className="mt-8">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={host.id}
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8, transition: { duration: 0.15 } }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14"
          >
            <Portrait host={host} />
            <div className="lg:pt-2">
              <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-accent-ink">
                {host.role}, {lensPhrase(host.lensLabel)}
              </p>
              <h3 className="font-display mt-3 text-[clamp(56px,6.6vw,108px)]">{host.name}</h3>
              <p className="mt-7 max-w-[62ch] text-[18px] leading-relaxed text-ink-soft">{host.bio}</p>
              <figure className={cx("mt-9 border-l-4 pl-5", lensBorder[host.lens])}>
                <figcaption className="text-[13px] font-semibold text-muted">The question he asks first</figcaption>
                <blockquote className="font-display mt-2 text-[clamp(32px,3.2vw,48px)] leading-[0.95]">
                  &ldquo;{host.asksFirst}&rdquo;
                </blockquote>
              </figure>
              <a
                href={host.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("host_linkedin_clicked", { host: host.id, placement: "hosts_section" })}
                className={cx(button.outline, "mt-9")}
              >
                <LinkedinLogoIcon size={18} weight="fill" aria-hidden />
                {host.firstName} on LinkedIn
              </a>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

"use client";

import { MicrophoneIcon } from "@phosphor-icons/react";
import { useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AlertsButton } from "@/components/site/AlertsButton";
import { hosts, type Host } from "@/content/hosts";
import { usePremiere } from "@/lib/premiere";
import { container, cx } from "@/lib/ui";

const ROTATE_MS = 4200;

// One video tile. All three webcam frames sit stacked inside it and the
// visible one cross-fades, so every slot changes at the same moment and no
// host ever shows twice mid-swap.
function Tile({ host, speaking, large }: { host: Host; speaking: boolean; large?: boolean }) {
  return (
    <div
      className={cx(
        "relative aspect-video overflow-hidden rounded-xl bg-black transition-shadow duration-300",
        speaking ? "shadow-[0_0_0_3px_var(--accent)]" : "shadow-[0_0_0_1px_rgb(255_255_255/0.06)]",
      )}
    >
      {hosts.map((h) => (
        <Image
          key={h.id}
          src={h.photos.cam}
          alt={h.id === host.id && large ? `${h.name} on the call from his home office` : ""}
          fill
          sizes={large ? "(min-width: 1024px) 60vw, 100vw" : "(min-width: 1024px) 28vw, 50vw"}
          className={cx(
            "object-cover transition-opacity duration-500 ease-out",
            h.id === host.id ? "opacity-100" : "opacity-0",
          )}
        />
      ))}
      <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-md bg-black/55 px-2 py-1 text-[12px] font-medium text-[#f2f2ee] backdrop-blur-sm sm:bottom-3 sm:left-3 sm:text-[13px]">
        <MicrophoneIcon size={13} weight="fill" aria-hidden />
        {host.name}
        {speaking && (
          <span className="ml-0.5 flex h-3 items-end gap-[2px]" aria-hidden>
            {[0, 1, 2].map((b) => (
              <span
                key={b}
                className="w-[3px] origin-bottom rounded-full bg-accent motion-safe:animate-[level_0.9s_ease-in-out_infinite]"
                style={{ height: "100%", animationDelay: `${b * 0.15}s` }}
              />
            ))}
          </span>
        )}
      </div>
    </div>
  );
}

// The three hosts on a video call, speaker view. The speaker tile passes
// between them like a real conversation; it pauses off screen and holds
// still for reduced motion.
export function CallBand({ dateLabel }: { dateLabel: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [speaker, setSpeaker] = useState(0);
  const [visible, setVisible] = useState(false);
  const after = usePremiere()?.state === "after";

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduce || !visible) return;
    const t = window.setInterval(() => setSpeaker((s) => (s + 1) % hosts.length), ROTATE_MS);
    return () => window.clearInterval(t);
  }, [reduce, visible]);

  const active = hosts[speaker];
  const others = hosts.filter((_, i) => i !== speaker);

  return (
    <section ref={ref} data-section="call" aria-labelledby="call-heading" className={cx(container, "pt-16 md:pt-24")}>
      <div className="rounded-2xl bg-[#161618] p-2.5 text-[#f2f2ee] ring-1 ring-white/5 sm:p-4">
        <div className="grid gap-2.5 sm:gap-3 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <Tile host={active} speaking large />
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-1 lg:content-start">
            {others.map((h, slot) => (
              <Tile key={slot} host={h} speaking={false} />
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-6 px-3 pb-3 pt-6 sm:px-4 md:pt-8">
          <div>
            <h2 id="call-heading" className="font-display text-[clamp(44px,6vw,96px)]">
              Pull up a chair
            </h2>
            <p className="mt-3 max-w-[50ch] text-[17px] leading-relaxed text-white/75">
              {after
                ? "Three operators on one call. New episodes stream live on YouTube. Bring a question for the chat."
                : `Three operators on one call. The premiere streams live on YouTube on ${dateLabel}. Bring a question for the chat.`}
            </p>
          </div>
          <AlertsButton placement="call_band" />
        </div>
      </div>
    </section>
  );
}

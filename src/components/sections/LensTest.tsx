"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { AlertsButton } from "@/components/site/AlertsButton";
import { hosts, lensPhrase } from "@/content/hosts";
import { lensQuestions } from "@/content/lens-test";
import { track } from "@/lib/analytics";
import { container, cx } from "@/lib/ui";

const bubbleTone: Record<string, string> = {
  brand: "lens-brand",
  money: "lens-money",
  venture: "lens-venture",
};

export function LensTest({ premiereLabel }: { premiereLabel: string }) {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const q = lensQuestions[active];

  return (
    <section id="lens-test" data-section="lens_test" className={cx(container, "pt-24 md:pt-32")}>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="font-display text-[clamp(48px,6.4vw,96px)]">One question. Three lenses.</h2>
          <p className="mt-4 max-w-[46ch] text-[18px] leading-relaxed text-ink-soft">
            Pick a question you&apos;re facing. Each host makes his call.
          </p>
          <div role="tablist" aria-label="Questions" className="mt-8 grid gap-2">
            {lensQuestions.map((item, i) => (
              <button
                key={item.id}
                role="tab"
                id={`lens-tab-${item.id}`}
                aria-selected={active === i}
                aria-controls="lens-panel"
                onClick={() => {
                  if (i === active) return;
                  setActive(i);
                  track("lens_question_selected", { question: item.question, index: i });
                }}
                className={cx(
                  "rounded-[26px] border px-5 py-3.5 text-left text-[15px] font-semibold leading-snug transition-[background-color,border-color,color,transform] duration-300 active:scale-[0.99]",
                  active === i ? "border-ink bg-ink text-paper" : "border-line hover:border-ink",
                )}
              >
                {item.question}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div id="lens-panel" role="tabpanel" aria-labelledby={`lens-tab-${q.id}`} aria-live="polite" className="grid gap-5">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={q.id} className="grid gap-5" exit={reduce ? undefined : { opacity: 0, transition: { duration: 0.15 } }}>
                <p className="font-display text-[clamp(30px,3vw,44px)] text-muted">{q.question}</p>
                {hosts.map((host, i) => {
                  const right = i === 1;
                  return (
                    <motion.figure
                      key={host.id}
                      initial={reduce ? false : { opacity: 0, y: 18, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 160, damping: 22, delay: reduce ? 0 : 0.08 + i * 0.14 }}
                      className={cx("flex items-end gap-3 sm:gap-4", right && "flex-row-reverse sm:pl-12", !right && "sm:pr-12")}
                    >
                      <span className="relative size-12 shrink-0 overflow-hidden rounded-full sm:size-14">
                        <Image src={host.photos.avatar} alt="" fill sizes="56px" className="object-cover" />
                      </span>
                      <div className={cx(bubbleTone[host.lens], "relative rounded-2xl bg-[var(--panel)] px-5 py-4 text-[var(--panel-text)]")}>
                        <span
                          aria-hidden
                          className={cx(
                            "absolute bottom-0 h-4 w-4 bg-[var(--panel)]",
                            right ? "-right-2 [clip-path:polygon(0_0,0_100%,100%_100%)]" : "-left-2 [clip-path:polygon(100%_0,0_100%,100%_100%)]",
                          )}
                        />
                        <figcaption className="text-[12px] font-bold uppercase tracking-[0.06em] opacity-75">
                          {host.firstName}, {lensPhrase(host.lensLabel)}
                        </figcaption>
                        <blockquote className="mt-1.5 text-[17px] leading-snug">{q.takes[host.id]}</blockquote>
                      </div>
                    </motion.figure>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-6">
            <p className="w-full text-[15px] font-medium">The full argument airs live on {premiereLabel}.</p>
            <AlertsButton placement="lens_test" />
            <a
              href="#ask"
              onClick={() => track("cta_clicked", { cta: "send_question", placement: "lens_test" })}
              className="text-[14px] font-semibold underline decoration-line underline-offset-4 hover:decoration-current"
            >
              Ask your own
            </a>
            <p className="w-full text-[12px] text-muted">Host opinions for discussion. Nothing here is financial, legal or investment advice.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

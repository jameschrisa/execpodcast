"use client";

import { CheckIcon } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import type { LensId } from "@/content/hosts";
import { show } from "@/content/show";
import { setPersonProps, track } from "@/lib/analytics";
import { cx } from "@/lib/ui";
import { AddPremiereButton, LiveButton } from "./PremiereActions";

const lensOptions: { id: LensId; label: string }[] = [
  { id: "brand", label: "Brand" },
  { id: "money", label: "AI and finance" },
  { id: "venture", label: "Venture" },
];

export function AlertsSuccess({ placement, compact = false }: { placement: string; compact?: boolean }) {
  const reduce = useReducedMotion();
  const [lens, setLens] = useState<LensId | null>(null);

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      role="status"
      className="grid gap-4"
    >
      <p className="flex items-start gap-2.5 text-[15px] font-medium leading-snug">
        <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent text-on-accent">
          <CheckIcon size={12} weight="bold" aria-hidden />
        </span>
        <span>
          {show.liveEventUrl
            ? "You're on the list. Set the YouTube reminder too, and YouTube will ping you when we start."
            : "You're on the list. Subscribe on YouTube too, so the stream shows up in your feed when we start."}
        </span>
      </p>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <LiveButton placement={`${placement}_success`} variant="dark" />
        <AddPremiereButton placement={`${placement}_success`} />
      </div>
      {!compact && (
        <fieldset className="grid gap-2">
          <legend className="text-[13px] text-muted">Which lens do you want more of? (optional)</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {lensOptions.map((o) => (
              <button
                key={o.id}
                type="button"
                aria-pressed={lens === o.id}
                onClick={() => {
                  setLens(o.id);
                  setPersonProps({ preferred_lens: o.id });
                  track("lens_preference_selected", { lens: o.id });
                }}
                className={cx(
                  "h-9 rounded-full border px-4 text-[13px] font-semibold transition-colors",
                  lens === o.id ? "border-ink bg-ink text-paper" : "border-line hover:border-ink",
                )}
              >
                {o.label}
              </button>
            ))}
          </div>
        </fieldset>
      )}
    </motion.div>
  );
}

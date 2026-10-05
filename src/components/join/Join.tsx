"use client";

import { CheckIcon, XIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { AlertsSuccess } from "@/components/premiere/AlertsSuccess";
import { CutoffNote } from "@/components/premiere/CutoffNote";
import { EPISODE_INTEREST_EVENT } from "@/components/sections/EpisodeRow";
import { Art, artRatios } from "@/components/ui/Art";
import { hosts } from "@/content/hosts";
import { show } from "@/content/show";
import { track, type FormKind } from "@/lib/analytics";
import { submitParticipation } from "@/lib/participate";
import { usePremiere } from "@/lib/premiere";
import { button, container, cx } from "@/lib/ui";
import { Field, Honeypot, TextArea, TextInput } from "./Field";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const tabs: { id: FormKind; label: string; blurb: string }[] = [
  { id: "alerts", label: "Get premiere alerts", blurb: "A reminder the day before, the live link, then one email per episode." },
  { id: "question", label: "Send a question", blurb: "We pick questions to argue on the live show." },
  { id: "pitch", label: "Pitch a guest", blurb: "A founder who made a hard call and will defend it." },
];

const HASH_TO_TAB: Record<string, FormKind> = { "#participate": "alerts", "#ask": "question", "#pitch": "pitch" };

function useFormStart(form: FormKind) {
  const started = useRef(false);
  return () => {
    if (started.current) return;
    started.current = true;
    track("form_started", { form });
  };
}

function Done({ children }: { children: React.ReactNode }) {
  return (
    <div role="status" className="flex items-start gap-3 rounded-2xl border border-line bg-paper p-6">
      <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-accent text-on-accent">
        <CheckIcon size={14} weight="bold" aria-hidden />
      </span>
      <p className="text-[16px] font-medium leading-relaxed">{children}</p>
    </div>
  );
}

function AlertsForm({ interest, clearInterest }: { interest: string | null; clearInterest: () => void }) {
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string>();
  const onStart = useFormStart("alerts");
  const after = usePremiere()?.state === "after";

  if (state === "done") return <AlertsSuccess placement="join" />;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "").trim();
    if (!EMAIL.test(email)) return setError("That email looks off. Check for a typo.");
    setError(undefined);
    setState("sending");
    const res = await submitParticipation("alerts", { email, episodeInterest: interest ?? undefined, website: String(fd.get("website") ?? "") });
    if (res.ok) setState("done");
    else {
      setState("idle");
      setError(res.message);
    }
  }

  return (
    <form noValidate onSubmit={onSubmit} onFocusCapture={onStart} className="grid gap-5">
      <div>
        <h3 className="font-display text-[clamp(36px,3.6vw,52px)]">{after ? "Know when Episode 2 goes live" : "Know when we go live"}</h3>
        <p className="mt-3 max-w-[56ch] text-[16px] leading-relaxed text-ink-soft">
          We send a reminder the day before and the live link when we start, then one email per episode.
        </p>
      </div>
      {interest && (
        <p className="flex w-fit items-center gap-2 rounded-full border border-line bg-paper py-1.5 pl-4 pr-1.5 text-[13px]">
          <span>
            You flagged <span className="font-semibold">{interest}</span>
          </span>
          <button type="button" onClick={clearInterest} aria-label="Remove flagged episode" className="grid size-6 place-items-center rounded-full hover:bg-line">
            <XIcon size={12} weight="bold" />
          </button>
        </p>
      )}
      <Field id="join-email" label="Email" helper="Unsubscribe in one click. We don't share your email." error={error}>
        <TextInput id="join-email" name="email" type="email" autoComplete="email" inputMode="email" placeholder="you@company.com" invalid={Boolean(error)} required />
      </Field>
      <Honeypot />
      <button type="submit" disabled={state === "sending"} className={cx(button.primary, "h-12 justify-self-start px-7")}>
        {state === "sending" ? "Sending..." : "Get premiere alerts"}
      </button>
    </form>
  );
}

function QuestionForm({ cutoffLabel }: { cutoffLabel: string }) {
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [count, setCount] = useState(0);
  const [aim, setAim] = useState("all");
  const onStart = useFormStart("question");

  if (state === "done")
    return <Done>Got it. If the hosts pick your question, we&apos;ll email you before that episode goes live.</Done>;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const question = String(fd.get("question") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const next: Record<string, string> = {};
    if (!question) next.question = "Add your question first.";
    if (!EMAIL.test(email)) next.email = "That email looks off. Check for a typo.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setState("sending");
    const res = await submitParticipation("question", {
      email,
      question,
      name: String(fd.get("name") ?? ""),
      role: String(fd.get("role") ?? ""),
      host: aim,
      anonymous: fd.get("anonymous") === "on",
      website: String(fd.get("website") ?? ""),
    });
    if (res.ok) setState("done");
    else {
      setState("idle");
      setErrors({ form: res.message });
    }
  }

  return (
    <form noValidate onSubmit={onSubmit} onFocusCapture={onStart} className="grid gap-5">
      <div>
        <h3 className="font-display text-[clamp(36px,3.6vw,52px)]">Ask, and we&apos;ll argue it live.</h3>
        <p className="mt-3 max-w-[56ch] text-[16px] leading-relaxed text-ink-soft">
          Send the decision you&apos;re stuck on. The hosts pick some to argue live through all three lenses.
        </p>
      </div>
      <Field id="q-question" label="Your question" error={errors.question} helper={`${count}/500`}>
        <TextArea
          id="q-question"
          name="question"
          maxLength={500}
          placeholder="We're deciding whether to... Our constraint is..."
          invalid={Boolean(errors.question)}
          onChange={(e) => setCount(e.target.value.length)}
          required
        />
      </Field>
      <fieldset className="grid gap-2">
        <legend className="text-[14px] font-semibold">Aim it at</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {[{ id: "all", label: "All three" }, ...hosts.map((h) => ({ id: h.id, label: h.firstName }))].map((o) => (
            <label
              key={o.id}
              className={cx(
                "flex h-9 cursor-pointer items-center rounded-full border px-4 text-[13px] font-semibold transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent",
                aim === o.id ? "border-ink bg-ink text-paper" : "border-line hover:border-ink",
              )}
            >
              <input type="radio" name="aim" value={o.id} checked={aim === o.id} onChange={() => setAim(o.id)} className="sr-only" />
              {o.label}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="q-name" label="First name" optional>
          <TextInput id="q-name" name="name" autoComplete="given-name" />
        </Field>
        <Field id="q-role" label="Role" optional>
          <TextInput id="q-role" name="role" placeholder="COO, $30M logistics company" autoComplete="organization-title" />
        </Field>
      </div>
      <Field id="q-email" label="Email" helper="So we can tell you if it airs." error={errors.email}>
        <TextInput id="q-email" name="email" type="email" autoComplete="email" inputMode="email" placeholder="you@company.com" invalid={Boolean(errors.email)} required />
      </Field>
      <label className="flex items-center gap-3 text-[15px]">
        <input type="checkbox" name="anonymous" className="size-5 rounded accent-[var(--accent)]" />
        Read it on air without my name
      </label>
      <Honeypot />
      {errors.form && (
        <p role="alert" className="text-[14px] font-medium text-accent-ink">
          {errors.form}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <button type="submit" disabled={state === "sending"} className={cx(button.primary, "h-12 px-7")}>
          {state === "sending" ? "Sending..." : "Send my question"}
        </button>
        <p className="text-[13px] text-muted">
          <CutoffNote cutoffLabel={cutoffLabel} />
        </p>
      </div>
    </form>
  );
}

function PitchForm() {
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [relation, setRelation] = useState<"self" | "other">("other");
  const onStart = useFormStart("pitch");

  if (state === "done")
    return (
      <Done>
        Pitch received. The hosts review each one, and if yours fits, we&apos;ll email you within {show.pitchReplyBusinessDays} business days.
      </Done>
    );

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const get = (k: string) => String(fd.get(k) ?? "").trim();
    const next: Record<string, string> = {};
    if (!get("guestName")) next.guestName = "Add the guest's name.";
    if (!/linkedin\.com\//i.test(get("guestLink"))) next.guestLink = "Paste their LinkedIn profile URL.";
    if (!get("guestRole")) next.guestRole = "Add their company and role.";
    if (!get("why")) next.why = "Tell us the call they made.";
    if (relation === "other" && !get("name")) next.name = "Add your name.";
    if (!EMAIL.test(get("email"))) next.email = "That email looks off. Check for a typo.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setState("sending");
    const res = await submitParticipation("pitch", {
      email: get("email"),
      name: relation === "self" ? get("guestName") : get("name"),
      guestName: get("guestName"),
      guestLink: get("guestLink"),
      guestRole: get("guestRole"),
      why: get("why"),
      relation,
      website: get("website"),
    });
    if (res.ok) setState("done");
    else {
      setState("idle");
      setErrors({ form: res.message });
    }
  }

  return (
    <form noValidate onSubmit={onSubmit} onFocusCapture={onStart} className="grid gap-5">
      <div>
        <h3 className="font-display text-[clamp(36px,3.6vw,52px)]">Pitch a founder worth arguing with</h3>
        <p className="mt-3 max-w-[56ch] text-[16px] leading-relaxed text-ink-soft">
          Pitch yourself or someone you know who made a hard call on AI, money or brand and will defend it live.
        </p>
      </div>
      <fieldset className="flex flex-wrap gap-2">
        <legend className="sr-only">Who are you pitching?</legend>
        {(
          [
            { id: "other", label: "I know them" },
            { id: "self", label: "This is me" },
          ] as const
        ).map((o) => (
          <label
            key={o.id}
            className={cx(
              "flex h-9 cursor-pointer items-center rounded-full border px-4 text-[13px] font-semibold transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent",
              relation === o.id ? "border-ink bg-ink text-paper" : "border-line hover:border-ink",
            )}
          >
            <input type="radio" name="relation" value={o.id} checked={relation === o.id} onChange={() => setRelation(o.id)} className="sr-only" />
            {o.label}
          </label>
        ))}
      </fieldset>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="p-guest" label={relation === "self" ? "Your name" : "Guest name"} error={errors.guestName}>
          <TextInput id="p-guest" name="guestName" invalid={Boolean(errors.guestName)} />
        </Field>
        <Field id="p-link" label="LinkedIn URL" error={errors.guestLink}>
          <TextInput id="p-link" name="guestLink" type="url" inputMode="url" placeholder="https://www.linkedin.com/in/..." invalid={Boolean(errors.guestLink)} />
        </Field>
      </div>
      <Field id="p-role" label="Company and role" error={errors.guestRole}>
        <TextInput id="p-role" name="guestRole" placeholder="Founder and CEO, a 60-person fintech" invalid={Boolean(errors.guestRole)} />
      </Field>
      <Field id="p-why" label="The call they made, and why it's worth arguing about" error={errors.why}>
        <TextArea id="p-why" name="why" maxLength={1000} invalid={Boolean(errors.why)} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        {relation === "other" && (
          <Field id="p-name" label="Your name" error={errors.name}>
            <TextInput id="p-name" name="name" autoComplete="name" invalid={Boolean(errors.name)} />
          </Field>
        )}
        <Field id="p-email" label="Your email" error={errors.email}>
          <TextInput id="p-email" name="email" type="email" autoComplete="email" inputMode="email" placeholder="you@company.com" invalid={Boolean(errors.email)} />
        </Field>
      </div>
      <Honeypot />
      {errors.form && (
        <p role="alert" className="text-[14px] font-medium text-accent-ink">
          {errors.form}
        </p>
      )}
      <button type="submit" disabled={state === "sending"} className={cx(button.primary, "h-12 justify-self-start px-7")}>
        {state === "sending" ? "Sending..." : "Send the pitch"}
      </button>
    </form>
  );
}

export function Join({ cutoffLabel }: { cutoffLabel: string }) {
  const [tab, setTab] = useState<FormKind>("alerts");
  const [interest, setInterest] = useState<string | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const sync = () => {
      const next = HASH_TO_TAB[window.location.hash];
      if (next) {
        setTab(next);
        track("join_tab_changed", { tab: next, method: "link" });
      }
    };
    const onInterest = (e: Event) => {
      setInterest((e as CustomEvent<string>).detail);
      setTab("alerts");
    };
    sync();
    window.addEventListener("hashchange", sync);
    window.addEventListener(EPISODE_INTEREST_EVENT, onInterest);
    return () => {
      window.removeEventListener("hashchange", sync);
      window.removeEventListener(EPISODE_INTEREST_EVENT, onInterest);
    };
  }, []);

  return (
    <section id="participate" data-section="participate" className={cx(container, "relative pt-24 md:pt-32")}>
      <span id="ask" className="absolute top-16" aria-hidden />
      <span id="pitch" className="absolute top-16" aria-hidden />
      <div className="grid gap-10 rounded-2xl border border-line bg-raised p-6 md:p-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 lg:p-14">
        <div className="flex flex-col">
          <h2 className="font-display text-[clamp(56px,7vw,112px)]">Join Season 1</h2>
          <div role="tablist" aria-label="Ways to take part" aria-orientation="vertical" className="mt-8 grid gap-2">
            {tabs.map((t) => (
              <button
                key={t.id}
                role="tab"
                id={`join-tab-${t.id}`}
                aria-selected={tab === t.id}
                aria-controls="join-panel"
                onClick={() => {
                  setTab(t.id);
                  track("join_tab_changed", { tab: t.id, method: "click" });
                }}
                className={cx(
                  "rounded-2xl border px-5 py-4 text-left transition-colors duration-300",
                  tab === t.id ? "border-ink bg-ink text-paper" : "border-line hover:border-ink",
                )}
              >
                <span className="block text-[16px] font-bold">{t.label}</span>
                <span className="mt-0.5 block text-[13px] opacity-75">{t.blurb}</span>
              </button>
            ))}
          </div>
          <Art
            src="/art/microphone.svg"
            alt="Linocut print of a ribbon microphone"
            ratio={artRatios["/art/microphone.svg"]}
            className="mt-10 hidden h-[220px] -rotate-[8deg] self-start text-ink lg:mt-auto lg:block"
          />
        </div>

        <div id="join-panel" role="tabpanel" aria-labelledby={`join-tab-${tab}`}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={tab}
              initial={reduce ? false : { opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? undefined : { opacity: 0, x: -10, transition: { duration: 0.15 } }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {tab === "alerts" && <AlertsForm interest={interest} clearInterest={() => setInterest(null)} />}
              {tab === "question" && <QuestionForm cutoffLabel={cutoffLabel} />}
              {tab === "pitch" && <PitchForm />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

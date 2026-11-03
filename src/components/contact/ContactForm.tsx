"use client";

import { CheckIcon } from "@phosphor-icons/react";
import { useRef, useState, type FormEvent } from "react";
import { Field, Honeypot, TextArea, TextInput } from "@/components/join/Field";
import { contact, contactMessageMax, contactTopics } from "@/content/contact";
import { track } from "@/lib/analytics";
import { submitParticipation } from "@/lib/participate";
import { button, cx } from "@/lib/ui";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [count, setCount] = useState(0);
  const started = useRef(false);

  function onStart() {
    if (started.current) return;
    started.current = true;
    track("form_started", { form: "contact" });
  }

  if (state === "done")
    return (
      <div role="status" className="flex items-start gap-3">
        <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-accent text-on-accent">
          <CheckIcon size={14} weight="bold" aria-hidden />
        </span>
        <div>
          <p className="text-[16px] font-medium leading-relaxed">{contact.success}</p>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{contact.successDetail}</p>
        </div>
      </div>
    );

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const get = (k: string) => String(fd.get(k) ?? "").trim();
    const next: Record<string, string> = {};
    if (!get("name")) next.name = "Add your name.";
    if (!EMAIL.test(get("email"))) next.email = "That email looks off. Check for a typo.";
    if (!get("message")) next.message = "Write your message first.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setState("sending");
    const res = await submitParticipation("contact", {
      name: get("name"),
      email: get("email"),
      topic: get("topic"),
      message: get("message"),
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
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="c-name" label="Name" error={errors.name}>
          <TextInput id="c-name" name="name" autoComplete="name" invalid={Boolean(errors.name)} required />
        </Field>
        <Field id="c-email" label="Email" error={errors.email}>
          <TextInput id="c-email" name="email" type="email" autoComplete="email" inputMode="email" placeholder="you@company.com" invalid={Boolean(errors.email)} required />
        </Field>
      </div>
      <Field id="c-topic" label="Topic">
        <select
          id="c-topic"
          name="topic"
          defaultValue="general"
          className={cx(
            "h-12 w-full rounded-xl border border-line bg-paper px-4 text-[15px] text-ink transition-colors focus:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
          )}
        >
          {contactTopics.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
      </Field>
      <Field id="c-message" label="Message" error={errors.message} helper={`${count}/${contactMessageMax}`}>
        <TextArea
          id="c-message"
          name="message"
          maxLength={contactMessageMax}
          className="min-h-[180px]"
          invalid={Boolean(errors.message)}
          onChange={(e) => setCount(e.target.value.length)}
          required
        />
      </Field>
      <Honeypot />
      {errors.form && (
        <p role="alert" className="text-[14px] font-medium text-accent-ink">
          {errors.form}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <button type="submit" disabled={state === "sending"} className={cx(button.primary, "h-12 px-7")}>
          {state === "sending" ? "Sending..." : "Send message"}
        </button>
        <p className="text-[13px] text-muted">{contact.privacy}</p>
      </div>
    </form>
  );
}

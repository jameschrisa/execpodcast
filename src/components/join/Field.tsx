import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { cx } from "@/lib/ui";

const control =
  "w-full rounded-xl border bg-paper px-4 text-[15px] text-ink placeholder:text-muted/80 transition-colors focus:border-ink focus:outline-none";

export function Field({
  id,
  label,
  helper,
  error,
  optional,
  children,
}: {
  id: string;
  label: string;
  helper?: string;
  error?: string;
  optional?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-[14px] font-semibold">
        {label}
        {optional && <span className="ml-1.5 font-normal text-muted">(optional)</span>}
      </label>
      {children}
      {helper && !error && (
        <p id={`${id}-help`} className="text-[13px] text-muted">
          {helper}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-[13px] font-medium text-accent-ink">
          {error}
        </p>
      )}
    </div>
  );
}

export function TextInput({ invalid, className, ...props }: InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  return (
    <input
      {...props}
      aria-invalid={invalid || undefined}
      aria-describedby={props.id ? (invalid ? `${props.id}-error` : `${props.id}-help`) : undefined}
      className={cx(control, "h-12", invalid ? "border-accent-ink" : "border-line", className)}
    />
  );
}

export function TextArea({ invalid, className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }) {
  return (
    <textarea
      {...props}
      aria-invalid={invalid || undefined}
      aria-describedby={props.id ? (invalid ? `${props.id}-error` : `${props.id}-help`) : undefined}
      className={cx(control, "min-h-[132px] resize-y py-3 leading-relaxed", invalid ? "border-accent-ink" : "border-line", className)}
    />
  );
}

export function Honeypot() {
  return <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />;
}

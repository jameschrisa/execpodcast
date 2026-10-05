// Button system. All buttons are full pills (see shape rule in globals.css).
const base =
  "inline-flex h-11 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full px-5 text-sm font-semibold transition-[transform,background-color,color,border-color] duration-200 ease-out active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

export const button = {
  primary: `${base} bg-accent text-on-accent hover:bg-ink hover:text-paper`,
  dark: `${base} bg-ink text-paper hover:bg-accent hover:text-on-accent`,
  outline: `${base} border border-ink/80 text-ink hover:bg-ink hover:text-paper`,
  ghostLight: `${base} border border-white/40 text-white hover:bg-white hover:text-[#121212]`,
  // Secondary action at text weight (no fill), per the one-filled-button rule.
  text: "inline-flex items-center gap-1.5 whitespace-nowrap text-[13px] font-semibold underline decoration-line underline-offset-4 transition-colors hover:decoration-current",
} as const;

export const container = "mx-auto w-full max-w-[1400px] px-4 md:px-6 lg:px-8";

export function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

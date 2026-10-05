import { cx } from "@/lib/ui";

const WORDS = [
  { text: "Executive", className: "text-ink" },
  { text: "Upskill", className: "text-accent" },
];

// Full-bleed condensed wordmark. Sized with container query units so it fills
// the container width at every breakpoint with no JS and no layout shift.
// Letters rise once on load (CSS, so it plays before hydration).
export function Wordmark({ className }: { className?: string }) {
  let i = 0;
  return (
    <div className={cx("[container-type:inline-size]", className)}>
      <h1 className="font-display wordmark-size whitespace-nowrap">
        <span className="sr-only">Executive Upskill</span>
        <span aria-hidden className="flex overflow-hidden pb-[0.02em] pt-[0.06em]">
          {WORDS.map((word, w) => (
            <span key={word.text} className={cx("flex", word.className, w > 0 && "ml-[0.08em]")}>
              {word.text.split("").map((ch) => {
                const delay = i++ * 28;
                return (
                  <span key={`${ch}-${delay}`} className="wordmark-letter inline-block" style={{ animationDelay: `${delay}ms` }}>
                    {ch}
                  </span>
                );
              })}
            </span>
          ))}
        </span>
      </h1>
    </div>
  );
}

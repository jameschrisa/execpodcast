import { faq } from "@/content/site";
import { container, cx } from "@/lib/ui";
import { FaqTracker } from "./FaqTracker";

export function faqItems(premiere: string, cutoff: string) {
  return faq.map((item) => ({ q: item.q, a: item.a.replace("{PREMIERE}", premiere).replace("{CUTOFF}", cutoff) }));
}

export function Faq({ premiere, cutoff }: { premiere: string; cutoff: string }) {
  const items = faqItems(premiere, cutoff);
  return (
    <section id="faq" data-section="faq" className={cx(container, "pt-24 md:pt-32")}>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
        <h2 className="font-display text-[clamp(48px,6.4vw,96px)]">Before you tune in</h2>
        <FaqTracker>
          <div className="divide-y divide-line border-y border-line">
            {items.map((item) => (
              <details key={item.q} name="faq" className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[18px] font-bold leading-snug [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span
                    aria-hidden
                    className="grid size-8 shrink-0 place-items-center rounded-full border border-line text-[18px] transition-transform duration-300 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="max-w-[64ch] pb-6 text-[16px] leading-relaxed text-ink-soft">{item.a}</p>
              </details>
            ))}
          </div>
        </FaqTracker>
      </div>
    </section>
  );
}

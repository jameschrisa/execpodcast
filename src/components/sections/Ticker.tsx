import { ChatTeardropIcon } from "@phosphor-icons/react/ssr";
import { ticker } from "@/content/site";
import { cx } from "@/lib/ui";

// Separator bubbles rotate through the three lens colors.
const bubble = ["text-accent", "text-[#9e9e9a]", "text-paper"];

export function Ticker() {
  const items = [...ticker, ...ticker];
  return (
    <section aria-label="Topics on the show" className="mt-16 overflow-hidden bg-ink text-paper md:mt-24">
      <ul className="sr-only">
        {ticker.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      <div aria-hidden className="group flex">
        <div className="marquee-track flex w-max items-center py-4 group-hover:[animation-play-state:paused] md:py-5">
          {items.map((t, i) => (
            <span key={`${t}-${i}`} className="font-display flex items-center whitespace-nowrap text-[28px] md:text-[40px]">
              <span className="px-6 md:px-8">{t}</span>
              <ChatTeardropIcon size={22} weight="fill" className={cx("shrink-0", bubble[i % 3])} />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

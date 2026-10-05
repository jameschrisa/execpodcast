import { hosts } from "@/content/hosts";
import { hero } from "@/content/site";
import { show } from "@/content/show";
import { shortDate } from "@/lib/time";
import { container, cx } from "@/lib/ui";
import { HeroSignup } from "./HeroSignup";
import { HostCard } from "./HostCard";
import { PremiereLine } from "./PremiereLine";
import { UpNext } from "./UpNext";
import { Wordmark } from "./Wordmark";

export function Hero() {
  const premiereLabel = shortDate(show.premiereAt);
  return (
    <section id="top" data-section="hero" className={cx(container, "pt-6 md:pt-8")}>
      <PremiereLine dateLabel={premiereLabel} />
      <Wordmark className="mt-3 md:mt-4" />

      <div className="mt-5 grid gap-5 md:mt-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-12">
        <p className="max-w-[46ch] text-[19px] leading-snug text-ink-soft md:text-[22px]">{hero.valueProp}</p>
        <HeroSignup />
      </div>

      <div className="mt-10 grid gap-8 md:mt-12 lg:grid-cols-[repeat(3,minmax(0,1fr))_minmax(250px,0.9fr)] lg:gap-6">
        {/* Phones and tablets: swipe row. Desktop: the cards join the grid. */}
        <div className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-4 md:scroll-px-6 [scrollbar-width:none] md:-mx-6 md:px-6 lg:contents">
          {hosts.map((host, i) => (
            <HostCard key={host.id} host={host} priority={i === 0} />
          ))}
        </div>
        <UpNext premiereLabel={premiereLabel} />
      </div>
    </section>
  );
}

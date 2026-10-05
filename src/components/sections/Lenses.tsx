import Image from "next/image";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { Art, artRatios } from "@/components/ui/Art";
import { episodeByNumber, lenses } from "@/content/episodes";
import { hostById } from "@/content/hosts";
import { container, cx } from "@/lib/ui";
import { EpisodeRow } from "./EpisodeRow";
import { Reveal } from "./Reveal";

export function Lenses() {
  return (
    <section id="lenses" data-section="lenses" className={cx(container, "pt-24 md:pt-32")}>
      <div className="flex items-end justify-between gap-6 border-b border-line pb-4">
        <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-accent-ink">Browse by lens</p>
        <TrackedLink
          href="#hosts"
          event="cta_clicked"
          props={{ cta: "meet_hosts", placement: "lenses_header" }}
          className="text-[13px] font-bold uppercase tracking-[0.06em] text-ink hover:text-accent-ink"
        >
          Meet the hosts
        </TrackedLink>
      </div>
      <h2 className="font-display mt-8 text-[clamp(48px,6.4vw,96px)]">Pick the lens you need</h2>
      <p className="mt-4 max-w-[60ch] text-[18px] leading-relaxed text-ink-soft">
        Season 1, sorted by the host who leads each episode. The other two still weigh in.
      </p>

      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {lenses.map((lens, i) => {
          const host = hostById[lens.host];
          return (
            <Reveal key={lens.id} delay={i * 0.08} className={cx(`lens-${lens.id}`, "panel-ring flex flex-col rounded-2xl p-6 md:p-7")}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-[clamp(44px,3.8vw,60px)]">{lens.title}</h3>
                  <div className="mt-4 flex items-center gap-2.5 text-[13px] font-semibold">
                    <span className="relative size-8 overflow-hidden rounded-full ring-2 ring-current/20">
                      <Image src={host.photos.avatar} alt="" fill sizes="32px" className="object-cover" />
                    </span>
                    {lens.label}, with {host.firstName}
                  </div>
                </div>
                <Art
                  src={lens.art}
                  alt={lens.artAlt}
                  ratio={artRatios[lens.art]}
                  className="h-[112px] shrink-0 -rotate-[6deg] transition-transform duration-500 hover:rotate-0 md:h-[128px]"
                />
              </div>

              <div className="mt-6 divide-y divide-current/15 border-t border-current/15">
                {lens.episodes.map((n) => (
                  <EpisodeRow key={n} number={n} title={episodeByNumber[n].title} lens={lens.id} hostName={host.name} />
                ))}
              </div>

              <div className="mt-auto flex items-center justify-between gap-4 pt-5 text-[13px]">
                <span className="opacity-75">Planned for Season 1</span>
                <TrackedLink
                  href={`#host-${host.id}`}
                  event="host_viewed"
                  props={{ host: host.id, method: "link" }}
                  className="font-bold underline decoration-current/30 underline-offset-4 hover:decoration-current"
                >
                  Meet {host.firstName}
                </TrackedLink>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

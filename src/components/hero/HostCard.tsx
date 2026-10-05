import { ArrowUpRightIcon } from "@phosphor-icons/react/ssr";
import Image from "next/image";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { lensPhrase, type Host } from "@/content/hosts";
import { cx } from "@/lib/ui";

const tail: Record<Host["lens"], string> = {
  brand: "bg-[var(--lens-brand)]",
  money: "bg-[var(--lens-money-ring)]",
  venture: "bg-[var(--lens-venture)]",
};

// Tall portrait card with the host's opening question set over the photo.
// Candid take at the mic; hover cuts to the laughing take.
export function HostCard({ host, priority }: { host: Host; priority?: boolean }) {
  return (
    <TrackedLink
      href={`#host-${host.id}`}
      event="host_viewed"
      props={{ host: host.id, method: "card" }}
      className="group block w-[78%] shrink-0 snap-start sm:w-[46%] lg:w-auto"
      aria-label={`${host.name}, ${host.role}, ${host.lensLabel}. ${host.hook}`}
    >
      <div className="relative">
        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-scrim">
          <Image
            src={host.photos.card}
            alt=""
            fill
            sizes="(min-width: 1024px) 22vw, (min-width: 640px) 46vw, 78vw"
            loading="eager"
            fetchPriority={priority ? "high" : "auto"}
            className="object-cover object-[50%_20%] transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
          />
          <Image
            src={host.photos.laugh}
            alt=""
            fill
            sizes="(min-width: 1024px) 22vw, (min-width: 640px) 46vw, 78vw"
            className="object-cover object-[50%_20%] opacity-0 transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04] group-hover:opacity-100 group-focus-visible:opacity-100"
          />
          <div className="absolute inset-x-0 bottom-0 h-[64%] bg-gradient-to-t from-scrim via-scrim/75 to-transparent" />
          <p className="font-display absolute bottom-5 left-5 right-[76px] text-[clamp(30px,2.6vw,44px)] text-[#f2f2ee]">
            {host.hook}
          </p>
          <span className="absolute bottom-5 right-5 grid size-11 place-items-center rounded-full bg-accent text-on-accent transition-transform duration-300 group-hover:rotate-45">
            <ArrowUpRightIcon size={20} weight="bold" aria-hidden />
          </span>
        </div>
        {/* Speech-bubble tail in the host's lens color */}
        <span
          aria-hidden
          className={cx("absolute -bottom-[13px] right-9 h-[14px] w-[22px] [clip-path:polygon(0_0,100%_0,100%_100%)]", tail[host.lens])}
        />
      </div>
      <div className="mt-5 pr-4">
        <p className="text-[16px] font-bold leading-tight">{host.name}</p>
        <p className="mt-1 text-[13px] text-ink-soft">
          {host.role}, {lensPhrase(host.lensLabel)}
        </p>
      </div>
    </TrackedLink>
  );
}

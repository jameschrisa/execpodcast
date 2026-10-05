import { TrackedLink } from "@/components/analytics/TrackedLink";
import { Art, artRatios } from "@/components/ui/Art";
import { Logo } from "@/components/ui/Logo";
import { nav } from "@/content/site";
import { show } from "@/content/show";
import { container, cx } from "@/lib/ui";
import { AlertsButton } from "./AlertsButton";
import { ThemeToggle } from "./ThemeToggle";

const linkClass = "block w-fit text-[12px] font-semibold uppercase leading-5 tracking-[0.06em] text-ink transition-colors hover:text-accent-ink";

const socials = [
  { label: "YouTube", href: show.channels.youtube.url, platform: "youtube" as const },
  { label: "Instagram", href: show.channels.instagram.url, platform: "instagram" as const },
  { label: "TikTok", href: show.channels.tiktok.url, platform: "tiktok" as const },
];

// Editorial masthead, desktop only. Phones get the sticky CompactNav instead.
export function SiteHeader() {
  return (
    <header id="masthead" className={cx(container, "hidden pt-6 md:block")}>
      <div className="grid grid-cols-[1.3fr_1fr_1fr_auto_1fr_auto] items-start gap-6 lg:gap-10">
        <a href="#top" aria-label="Executive Upskill, back to top" className="w-fit">
          <Logo size={76} />
        </a>

        <nav aria-label="Primary" className="contents">
          <div className="space-y-0.5">
            {nav.slice(0, 3).map((item) => (
              <TrackedLink key={item.href} href={item.href} className={linkClass} event="nav_clicked" props={{ target: item.href, placement: "header" }}>
                {item.label}
              </TrackedLink>
            ))}
          </div>
          <div className="space-y-0.5">
            {nav.slice(3).map((item) => (
              <TrackedLink key={item.href} href={item.href} className={linkClass} event="nav_clicked" props={{ target: item.href, placement: "header" }}>
                {item.label}
              </TrackedLink>
            ))}
            <TrackedLink href="#faq" className={linkClass} event="nav_clicked" props={{ target: "#faq", placement: "header" }}>
              FAQ
            </TrackedLink>
          </div>
        </nav>

        <Art
          src="/art/microphone.svg"
          alt="Linocut print of a ribbon microphone"
          ratio={artRatios["/art/microphone.svg"]}
          className="-mt-1 h-[72px] -rotate-[8deg] text-ink"
        />

        <div className="space-y-0.5 justify-self-end">
          {socials.map((s) => (
            <TrackedLink
              key={s.label}
              href={s.href}
              external
              className={linkClass}
              event="platform_follow_clicked"
              props={{ platform: s.platform, placement: "header" }}
            >
              {s.label}
            </TrackedLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <AlertsButton placement="header" />
        </div>
      </div>
    </header>
  );
}

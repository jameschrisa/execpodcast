import { LinkedinLogoIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { LiveButton } from "@/components/premiere/PremiereActions";
import { Logo } from "@/components/ui/Logo";
import { PlatformIcon } from "@/components/ui/PlatformIcon";
import { hosts } from "@/content/hosts";
import { nav } from "@/content/site";
import { show } from "@/content/show";
import { container, cx } from "@/lib/ui";
import { AlertsButton } from "./AlertsButton";
import { ThemeToggle } from "./ThemeToggle";

const platforms = [
  { id: "youtube" as const, label: "YouTube", href: show.channels.youtube.url },
  { id: "instagram" as const, label: "Instagram", href: show.channels.instagram.url },
  { id: "tiktok" as const, label: "TikTok", href: show.channels.tiktok.url },
];

const heading = "text-[13px] font-bold uppercase tracking-[0.08em] text-muted";
const link = "text-[15px] font-medium text-ink transition-colors hover:text-accent-ink";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line md:mt-32">
      <div className={cx(container, "py-14 md:py-20")}>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
          <div>
            <Logo size={72} className="mb-8" />
            <p className="font-display max-w-[12ch] text-[clamp(52px,7vw,112px)]">
              Bring a hard question to the <span className="text-accent">live chat.</span>
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <AlertsButton placement="footer" />
              <LiveButton placement="footer" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:pt-4">
            <div className="grid content-start gap-3">
              <p className={heading}>Show</p>
              {nav.map((item) => (
                <TrackedLink key={item.href} href={item.href} event="nav_clicked" props={{ target: item.href, placement: "footer" }} className={link}>
                  {item.label}
                </TrackedLink>
              ))}
            </div>
            <div className="grid content-start gap-3">
              <p className={heading}>Watch</p>
              {platforms.map((p) => (
                <TrackedLink
                  key={p.id}
                  href={p.href}
                  external
                  event="platform_follow_clicked"
                  props={{ platform: p.id, placement: "footer" }}
                  className={cx(link, "inline-flex items-center gap-2")}
                >
                  <PlatformIcon platform={p.id} size={16} />
                  {p.label}
                </TrackedLink>
              ))}
            </div>
            <div className="grid content-start gap-3">
              <p className={heading}>Hosts</p>
              {hosts.map((h) => (
                <TrackedLink
                  key={h.id}
                  href={h.linkedin}
                  external
                  event="host_linkedin_clicked"
                  props={{ host: h.id, placement: "footer" }}
                  className={cx(link, "inline-flex items-center gap-2")}
                >
                  <LinkedinLogoIcon size={16} weight="fill" aria-hidden />
                  {h.name}
                </TrackedLink>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6 text-[13px] text-muted">
          <p>F3 Insights, an Executive Upskill affiliate, runs the live sessions listed on this page.</p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="hover:text-ink">
              Privacy
            </Link>
            <span>&copy; 2026 Executive Upskill</span>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}

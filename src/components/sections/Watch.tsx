import Image from "next/image";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { AddPremiereButton, LiveButton } from "@/components/premiere/PremiereActions";
import { AlertsButton } from "@/components/site/AlertsButton";
import { PlatformIcon } from "@/components/ui/PlatformIcon";
import { hostById } from "@/content/hosts";
import { platforms } from "@/content/site";
import { show, type PlatformId } from "@/content/show";
import { shortDate } from "@/lib/time";
import { button, container, cx } from "@/lib/ui";
import { BigCountdown } from "./BigCountdown";

function FollowLink({ platform, className }: { platform: Exclude<PlatformId, "youtube">; className?: string }) {
  const href = show.channels[platform].url;
  return (
    <TrackedLink
      href={href}
      external
      event="platform_follow_clicked"
      props={{ platform, placement: "watch_bento" }}
      className={cx(button.outline, className)}
    >
      <PlatformIcon platform={platform} size={18} />
      {platforms[platform].cta}
    </TrackedLink>
  );
}

function CellHead({ platform, handle }: { platform: PlatformId; handle: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <PlatformIcon platform={platform} size={22} />
      <span className="text-[15px] font-bold">{platforms[platform].name}</span>
      <span className="text-[13px] text-current/60">{handle}</span>
    </div>
  );
}

export function Watch() {
  const dateLabel = shortDate(show.premiereAt);
  return (
    <section id="watch" data-section="watch" className={cx(container, "pt-20 md:pt-28")}>
      <h2 className="font-display max-w-[16ch] text-[clamp(48px,6.4vw,96px)]">Watch live or catch the clips</h2>
      <p className="mt-5 max-w-[62ch] text-[18px] leading-relaxed text-ink-soft">
        The full episode streams on YouTube Live, and you can ask in the chat. We cut the best exchanges into clips for
        Shorts, Instagram and TikTok.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-12 md:gap-5">
        {/* YouTube Live: the premiere itself */}
        <article className="relative isolate overflow-hidden rounded-2xl bg-scrim p-6 text-[#f2f2ee] ring-1 ring-white/5 md:col-span-8 md:row-span-2 md:p-9 lg:p-10">
          <Image
            src="/photos/call-gallery.jpg"
            alt=""
            fill
            sizes="(min-width: 768px) 66vw, 100vw"
            className="-z-10 object-cover object-[70%_50%] opacity-60"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-scrim via-scrim/85 to-scrim/25" />
          <div className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-scrim/90 to-transparent" />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CellHead platform="youtube" handle={show.channels.youtube.handle} />
            <span className="text-[13px] text-white/60">Episode 1: {show.premiereEpisode}</span>
          </div>
          <div className="mt-10 md:mt-14">
            <BigCountdown dateLabel={dateLabel} />
          </div>
          <p className="mt-8 max-w-[52ch] text-[15px] leading-relaxed text-white/75">{platforms.youtube.reason}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <AlertsButton placement="watch_live_cell" />
            <LiveButton placement="watch_live_cell" variant="ghostLight" />
            <AddPremiereButton placement="watch_live_cell" className="ml-1 text-white decoration-white/30" />
          </div>
        </article>

        {/* Shorts: tall cell, vertical format */}
        <article className="group relative flex min-h-[520px] flex-col justify-end overflow-hidden rounded-2xl bg-scrim text-[#f2f2ee] md:col-span-4 md:row-span-2">
          <Image
            src="/photos/greg-laugh.jpg"
            alt="Greg Fisher laughing on set"
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover object-[45%_20%] transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
          />
          <div className="absolute inset-x-0 bottom-0 h-[65%] bg-gradient-to-t from-scrim via-scrim/70 to-transparent" />
          <div className="relative p-6 md:p-7">
            <CellHead platform="shorts" handle={show.channels.shorts.handle} />
            <p className="mt-3 text-[15px] leading-relaxed text-white/80">{platforms.shorts.reason}</p>
            <TrackedLink
              href={show.channels.shorts.url}
              external
              event="platform_follow_clicked"
              props={{ platform: "shorts", placement: "watch_bento" }}
              className={cx(button.ghostLight, "mt-5")}
            >
              {platforms.shorts.cta}
            </TrackedLink>
          </div>
        </article>

        {/* Instagram */}
        <article className="lens-money panel-ring grid grid-cols-[minmax(0,1fr)_auto] items-end gap-5 rounded-2xl p-6 md:col-span-6 md:p-7">
          <div>
            <CellHead platform="instagram" handle={show.channels.instagram.handle} />
            <p className="mt-3 max-w-[38ch] text-[15px] leading-relaxed">{platforms.instagram.reason}</p>
            <FollowLink platform="instagram" className="mt-5 border-current text-current" />
          </div>
          <div className="relative h-[168px] w-[124px] overflow-hidden rounded-xl md:h-[196px] md:w-[146px]">
            <Image src={hostById.james.photos.cam} alt="James Christopher on a video call" fill sizes="150px" className="object-cover object-[64%_30%]" />
          </div>
        </article>

        {/* TikTok */}
        <article className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-5 rounded-2xl border border-line bg-raised p-6 md:col-span-6 md:p-7">
          <div>
            <CellHead platform="tiktok" handle={show.channels.tiktok.handle} />
            <p className="mt-3 max-w-[38ch] text-[15px] leading-relaxed text-ink-soft">{platforms.tiktok.reason}</p>
            <FollowLink platform="tiktok" className="mt-5" />
          </div>
          <div className="relative h-[168px] w-[124px] overflow-hidden rounded-xl md:h-[196px] md:w-[146px]">
            <Image src={hostById.bryce.photos.cam} alt="Bryce Gilleland on a video call" fill sizes="150px" className="object-cover object-[50%_35%]" />
          </div>
        </article>
      </div>
    </section>
  );
}

import { TrackedLink } from "@/components/analytics/TrackedLink";
import { CutoffNote } from "@/components/premiere/CutoffNote";
import { episodeByNumber, episodeTag, upNext } from "@/content/episodes";
import { questionCutoff } from "@/content/show";
import { shortDate, timeOf } from "@/lib/time";
import { button, cx } from "@/lib/ui";

const lensName = { brand: "Brand lens", money: "AI and finance lens", venture: "Venture lens", all: "All three lenses" } as const;

export function UpNext({ premiereLabel }: { premiereLabel: string }) {
  const cutoff = questionCutoff();
  return (
    <aside aria-labelledby="up-next" className="flex flex-col">
      <div className="flex items-baseline justify-between">
        <h2 id="up-next" className="text-[13px] font-bold uppercase tracking-[0.08em] text-accent-ink">
          Up next
        </h2>
        <span className="text-[12px] font-medium text-muted">Season 1</span>
      </div>
      <ol className="mt-3 divide-y divide-line border-t border-line">
        {upNext.map((n) => {
          const ep = episodeByNumber[n];
          const meta = n === 1 ? `${episodeTag(n)}, premiere, ${premiereLabel}` : `${episodeTag(n)}, ${lensName[ep.lens]}`;
          return (
            <li key={n} className="py-3.5">
              <p className="text-[15px] font-semibold leading-snug">{ep.title}</p>
              <p className="mt-1 text-[12px] text-muted">{meta}</p>
            </li>
          );
        })}
      </ol>
      <p className="mt-3 text-[13px] leading-snug text-ink-soft">
        <CutoffNote cutoffLabel={`${shortDate(cutoff)}, ${timeOf(cutoff)}`} />{" "}
        <TrackedLink
          href="#ask"
          event="cta_clicked"
          props={{ cta: "send_question", placement: "up_next" }}
          className="font-semibold underline decoration-line underline-offset-4 hover:decoration-current"
        >
          Send a question
        </TrackedLink>
      </p>
      <TrackedLink
        href="#lenses"
        event="cta_clicked"
        props={{ cta: "full_season", placement: "up_next" }}
        className={cx(button.outline, "mt-5 w-full lg:mt-auto")}
      >
        Full season
      </TrackedLink>
    </aside>
  );
}

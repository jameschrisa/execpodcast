# Handoff: Executive Upskill site

Updated 2026-10-16. Start here, then read `AGENTS.md`, `README.md` and `docs/TRACKING.md` before you change code.

## The project

Launch site for **Executive Upskill**, a live video podcast:

- James Christopher, host and moderator, brand lens
- Greg Fisher, co-host, AI and finance lens
- Bryce Gilleland, co-host, venture lens

The premiere streams on YouTube Live on Wednesday, October 28, 2026 at 11:00 PT. Clips go to YouTube Shorts, Instagram, TikTok and LinkedIn.

The site's job:

- Collect premiere alert signups, questions for the live show and guest pitches.
- Record which social channel sent each visitor.

| | |
|---|---|
| Repo | github.com/jameschrisa/execpodcast (public), branch `main` |
| Stack | Next.js 16.3.8 App Router (Turbopack), React 19.2, Tailwind CSS 4, Motion, Phosphor icons, PostHog (`posthog-js` + `posthog-node`) |
| Live site | https://executiveupskill.live (`www` redirects to it) |
| Hosting | Vercel project `execpodcast` in the `jchrisas-projects` team. Every push to `main` deploys to production. |
| Status | Deployed and live. Forms need a PostHog key before launch (see "Open work"). |
| Next job | "Open work" below, then the social posts in "Pending: F3 Insights toolbox posts" |

## Set up on a new computer

1. Install Node 20.9 or newer. The site was built and tested on Node 24.14.
2. Clone the repo and install the dependencies:
   ```bash
   git clone https://github.com/jameschrisa/execpodcast.git
   ```
   ```bash
   cd execpodcast && npm install && cp .env.example .env.local
   ```
3. Run `npm run dev` for local work, or `npm run build && npm start` for the production build. Check photo changes on the production build, because the dev server's image loading was unreliable in Claude's browser pane.
4. Git identity: commits use James's GitHub no-reply address so his work email stays out of this public repo. Set it in the clone:
   ```bash
   git config user.name "James Christopher" && git config user.email "122914987+jameschrisa@users.noreply.github.com"
   ```
5. Pushing needs a GitHub fine-grained token with **Contents: Read and write** on `execpodcast`. Paste it as the password the first time git asks.
6. The image scripts in `scripts/` need Python with `pip install pillow numpy`. You only need them to redo photos.

Before each commit, check that all three pass: `npx tsc --noEmit`, `npm run lint` and `npm run build`.

## Rules for this project

- **No F3 Insights branding outside the events section.** The site stands alone. F3 Insights appears only in two places:
  - The live sessions calendar.
  - The footer line "F3 Insights, an Executive Upskill affiliate, runs the live sessions listed on this page."
- **Copy style ("stop-slop"):**
  - Make plain statements.
  - No em dashes and no filler adverbs.
  - No "not X, it's Y" lines and no throat-clearing.
- **Canva:** ask James before saving or committing anything in Canva.
- **Email privacy:** never put James's email address into an external service, form, header or URL.
- **Next.js 16 changed a lot.** Read the guide in `node_modules/next/dist/docs/` before writing Next code (see `AGENTS.md`). For example, `priority` on `next/image` is deprecated; this code uses `loading="eager"`.
- **Replacing a photo:**
  - Give the new file a new name; the `-real` suffix exists for this.
  - `next/image` and browsers cache by URL, so an overwritten file keeps showing the old image.
  - Locally, also delete `.next/cache/images`.
- **Light mode is the default.** Dark mode turns on only when a visitor picks it with the toggle (saved in localStorage as `eu-theme`). The site ignores the OS color setting on purpose.

## What's built

Sections in page order (`src/app/page.tsx`):

1. **CompactNav and SiteHeader.**
   - Logo: a black square, "EXECUTIVE" in white over "UPSKILL" in red, drawn as SVG in `src/components/ui/Logo.tsx`.
2. **Hero.**
   - Full-width wordmark, premiere countdown and email signup.
   - Three host cards. Each card's resting photo swaps to a laughing photo on hover.
   - Up-next episode list.
3. **Ticker.**
4. **CallBand ("Pull up a chair").**
   - The three hosts on a video call in speaker view. The speaker changes every 4.2 seconds.
   - Pauses when off screen and holds still under reduced motion.
5. **Watch.** Cells for YouTube Live, Shorts, Instagram and TikTok.
6. **Lenses.** Three panels with three episodes each:
   - "Brand meets the bot" (James)
   - "Make the AI pay" (Greg)
   - "Bet before consensus" (Bryce)
7. **LensTest.** Four questions. The visitor picks a take, then the site shows which host said it.
8. **Hosts.** Tabbed bios, "The question he asks first" and LinkedIn links.
9. **Sessions (the F3 Insights events calendar).**
   - Reads the schema.org Event markup on f3insights.com/events every 6 hours.
   - Falls back to `src/content/events-snapshot.json`.
   - Offers .ics calendar files.
10. **Join.** Forms for live-show questions and guest pitches.
11. **Faq, then SiteFooter.**

Other moving parts:

- **Premiere state machine** (`src/lib/premiere.ts`): countdown, day-of, last hour, live and after. The calls to action change with each state.
- **Forms** post to `/api/participate`:
  - Validation, a honeypot field and a per-IP throttle.
  - A server-side PostHog `lead_captured` event.
  - An optional copy to `LEADS_WEBHOOK_URL`.
- **Analytics.** Full detail is in `docs/TRACKING.md`.
  - PostHog loads through an `/ingest` reverse proxy (`next.config.ts`).
  - Channel attribution order: UTM, ad click IDs, in-app browser, referrer, direct.
  - First and last touch go on every event.
  - Link-in-bio short paths (`/yt`, `/ig`, `/tt`, `/li`, `/ask`, `/pitch` and others) live in `src/content/short-links.ts`.
- **Share images and icons:**
  - `opengraph-image.tsx`, `twitter-image.tsx`, `icon.tsx` and `apple-icon.tsx` in `src/app/`.
  - All set in Anton, because the share-image renderer can't read variable fonts.
- **Content** lives in `src/content/`. The table in `README.md` says which file holds what.

## Decisions already made (keep them)

- **James:**
  - Title: "Host & moderator, brand lens".
  - Bio: written by James; it opens with his patents in machine learning and sensor technology.
- **Credential lines:** none under any host's bio.
- **Greg:**
  - Title: "Co-host, AI and finance lens".
  - Bio: ends with his lecturing at UC San Diego's Rady School of Management. The CPA/MBA sentence is gone.
  - Lens panel headline: "Make the AI pay".
- **Bryce:** title "Co-host, venture lens".
- **`lensPhrase()` in `src/content/hosts.ts`** keeps "AI" capitalized when a lens label follows a comma.
- **Photos:**
  - James and Bryce use real photos. The originals are in `references/real/`; `scripts/real-photos.py` crops them.
  - James's hero card has its own resting photo (`james-card-real.jpg`). Its hover photo stays `james-laugh-real.jpg`.
  - Greg still uses AI-generated photos (made in Canva, retouched by `scripts/retouch.py`) until he sends real ones.
  - The video-call image (`public/photos/call-gallery.jpg`) comes from `scripts/call-composite.py`.
- **Artwork:** linocut-style prints traced to SVG (`public/art/`), shown as CSS masks so they recolor with the theme. The adult look replaced an earlier version that read as too kid-like.
- **Episode 10** is "What Survived the Blockchain Hype".

## Deployment (done 2026-10-04)

### Vercel project

- Project `execpodcast`, team `jchrisas-projects` (vercel.com/jchrisas-projects/execpodcast).
- Connected to `jameschrisa/execpodcast`. A push to `main` deploys to production. Other branches get preview URLs.
- Framework preset Next.js, Node.js 24.x, default build command and output.
- Deployment protection is Vercel Authentication on `all_except_custom_domains`. The `*.vercel.app` URLs ask for a Vercel login. `executiveupskill.live` is public.
- To fetch a protected `.vercel.app` URL from the terminal, use `vercel curl <path> --deployment <url> --scope jchrisas-projects`.
- This folder is linked (`.vercel/`, gitignored). The Vercel CLI is logged in as `jameschrisa`.

### Domain

- `executiveupskill.live` is registered at Namecheap. DNS stays at Namecheap:
  - `A @ 76.76.21.21`
  - `CNAME www cname.vercel-dns.com`
- Both domains are attached to the project. `www` 308-redirects to the apex. SSL is issued by Vercel.

### Environment variables

Every key is in `.env.example`.

| Variable | Production | Preview | Status |
|---|---|---|---|
| `NEXT_PUBLIC_POSTHOG_KEY` | live project key (`phc_...`) | a separate test project key, or blank | **Not set.** Needed before launch |
| `NEXT_PUBLIC_POSTHOG_REGION` | `us` | `us` | Set |
| `NEXT_PUBLIC_SITE_URL` | `https://executiveupskill.live` | blank | Set |
| `NEXT_PUBLIC_PREMIERE_AT` | `2026-10-28T11:00:00-07:00` | same | Set |
| `NEXT_PUBLIC_YT_LIVE_URL` | the scheduled YouTube Live URL | same | Not set. Buttons fall back to "Subscribe on YouTube" |
| `LEADS_WEBHOOK_URL` | optional | optional, use a test hook | Not set |

Things that catch people out:

- Next.js bakes `NEXT_PUBLIC_*` values in at build time. After you change one, redeploy (`vercel deploy --prod --scope jchrisas-projects`, or push to `main`).
- `/api/participate` returns a 503 (`not_configured`) when neither the PostHog key nor the webhook is set. **The live forms fail until one of them is set.** Set at least one for Preview too.
- `vercel env add NAME preview` loops on a branch prompt when run non-interactively, even with `--value` and `--yes`. Add Preview variables in the dashboard, or with the REST API (`POST /v10/projects/<id>/env`).
- The claude.ai Vercel connector can read this project but got 403 on writes. Use the CLI or REST API for changes.

### Code changes made for deployment

- Every domain reference now points to `executiveupskill.live`, not `.com` (`src/content/show.ts`, `.env.example`).
- `src/app/robots.ts` disallows all crawling when `VERCEL_ENV` is set and isn't `production`, so previews stay out of search.
- `package.json` has `"engines": { "node": ">=20.9" }`.

### Notes kept from the deploy plan

- **Rate limiting:** the form limit is in memory and per server instance (`src/app/api/participate/route.ts`). Fine for launch. If spam shows up, move it to Upstash Redis from the Vercel Marketplace.
- **Share images:** built once at build time from `src/assets/Anton-Regular.ttf` and `public/photos/call-gallery.jpg`. If anyone makes them render per request, add those files to `outputFileTracingIncludes` in `next.config.ts`.
- **Refresh:** the home page rebuilds every 6 hours (`revalidate = 21600`) so the events calendar stays current. No cron job needed.

### Smoke test

Passed on 2026-10-16 against `executiveupskill.live`: home, `/privacy`, `/robots.txt`, `/sitemap.xml`, `/opengraph-image` and the `www` redirect. `/yt` redirects with UTMs.

Still to check once the PostHog key is set:

- The alerts form succeeds, and `lead_captured` appears in PostHog. If the webhook is set, it receives the submission too.
- PostHog Activity shows a pageview from `executiveupskill.live`. That confirms the `/ingest` proxy works.
- The theme toggle works and remembers your choice; the countdown shows the right date in your time zone.
- Share-card check: paste the URL into LinkedIn Post Inspector.
- On a phone, the email field, countdown and the mobile menu's social links fit without sideways scrolling.

## Changes since the first deploy

- **Hero caption** (`hero.valueProp` in `src/content/site.ts`): "Three operators talk AI, business and brand from the seats they've held. Live on YouTube, clipped for your feed."
- **LinkedIn added as a channel** (`linkedin` in `show.channels`, `PlatformId`, `PlatformIcon`, `platforms` in `site.ts`):
  - Showcase page: https://www.linkedin.com/showcase/executive-upskill/
  - Shows in the header, footer, mobile menu, a full-width card in the Watch section, the FAQ and the JSON-LD `sameAs` list.
  - Clicks track as `platform_follow_clicked` with `platform: "linkedin"`.
- **Social handles confirmed** in `src/content/show.ts`:
  - Instagram: `@exec.upskill` (https://www.instagram.com/exec.upskill)
  - TikTok: `@execupskill` (https://www.tiktok.com/@execupskill)
  - YouTube: still the placeholder `@ExecutiveUpskill`.
- When adding a channel URL, drop share-tracking query strings (`?_r=`, `?_t=`, `?stkn=`, `utm_source=qr`).

## Pending: F3 Insights toolbox posts

James asked to post three F3 Insights creatives from the **Executive Upskill** accounts (LinkedIn page, Instagram, TikTok). There is no Executive Upskill account on X, so X is skipped.

- **Images:** on James's Desktop as `f3i-github-post-01.png` (square, light, "18 departments"), `f3i-github-post-02.png` (16:9, "Your Whole Back Office, as AI Agents") and `f3i-github-post-03.png` (square, dark, "198 / 152 / 1,448").
- **Link:** https://github.com/F3-Insights/automation-toolbox (the org's only public repo; its description confirms 198 agents and 152 skills).
- **Status:** not posted. Claude in Chrome was not connected (no browsers found). Next session: connect the extension in a Chrome that is logged in to all three accounts, then post one platform at a time. Fill each post and stop before the publish button so James approves it.
- **Brand note:** this puts F3 Insights content on Executive Upskill channels, which the site otherwise keeps to the events section. James chose this. Captions speak about F3 Insights in the third person.

| Platform | Images, in order |
|---|---|
| LinkedIn page | 03, 01, 02 as one multi-image post |
| Instagram | carousel 03, 01 (a carousel crops every slide to the first image's shape, so 02 would lose its edges) |
| TikTok | photo carousel 03, 01 |

Captions:

**LinkedIn**
> F3 Insights, the team behind our live sessions, is releasing its AI toolbox.
>
> 198 agents and 152 skills for Claude Code, across 18 business departments: accounting, finance, reporting, sales, marketing, compliance, strategy, software, projects and the chief of staff.
>
> They close the books, build forecasts, write executive reports, run engagements and ship software. 1,448 tests check the work.
>
> It's free and source-available. Take what fits your team and change the rest.
>
> https://github.com/F3-Insights/automation-toolbox

**Instagram**
> F3 Insights is releasing its AI toolbox: 198 agents and 152 skills for Claude Code, across 18 business departments, from accounting to the chief of staff.
>
> Free and source-available on GitHub: F3-Insights/automation-toolbox
>
> #ClaudeCode #AIAgents #FinanceOps #BusinessAutomation #AITools

**TikTok**
> A whole back office, as AI agents. F3 Insights just released 198 agents and 152 skills for Claude Code. Free on GitHub: F3-Insights/automation-toolbox #claudecode #aiagents #accounting #automation #smallbusiness

The 1,448 tests and 18 departments come from the creatives and were not checked against the repo.

## Open work

1. **Set `NEXT_PUBLIC_POSTHOG_KEY`** (Production, plus a test key or `LEADS_WEBHOOK_URL` for Preview), then redeploy. Until then the live forms return 503.
2. **Schedule the YouTube Live event**, set `NEXT_PUBLIC_YT_LIVE_URL`, redeploy.
3. **Confirm the YouTube handle** and update `show.channels.youtube` and `show.channels.shorts`.
4. **Meta description** in `src/app/layout.tsx` still says "argue AI, money and brand". Asked James whether to match the new hero caption ("talk AI, business and brand"); no answer yet.
5. **Post the F3 Insights toolbox creatives** (section above).

## Open questions for James

These were offered earlier and never answered:

- Spell out "University of California, San Diego" in Greg's bio instead of "UC San Diego"?
- Remove the credentials still in Bryce's bio (the Co-GP title and the Berkeley Haas MBA)?
- Use a simpler logo for the small compact nav bar?

Waiting on someone:

- **Real photos of Greg.** To use them:
  1. Put them in `references/real/greg/`.
  2. Add crop boxes to `CROPS` in `scripts/real-photos.py` and run it.
  3. Switch `hosts.ts` to `photos("greg", "-real")`.
  4. Re-run `scripts/call-composite.py`.

## Launch checklist (also in README.md)

- [ ] Confirm the premiere date and time, schedule the YouTube Live event, then set `NEXT_PUBLIC_YT_LIVE_URL`.
- [ ] Confirm the YouTube handle in `src/content/show.ts`. It is still a placeholder (`@ExecutiveUpskill`). Instagram (`@exec.upskill`), TikTok (`@execupskill`) and LinkedIn are confirmed.
- [ ] Each host approves his bio, photos, card question and four lens-test takes.
- [ ] Confirm "We don't share your email" matches your email tool's practice.
- [x] Set `NEXT_PUBLIC_SITE_URL` to the real domain (`https://executiveupskill.live`).
- [ ] Add the PostHog key and build the dashboard in `docs/TRACKING.md`.
- [ ] Put the short paths in each platform bio (`executiveupskill.live/ig`, `/tt`, `/li`, `/yt`).

## Kickoff prompt for the next session

Paste this into Claude Code from the cloned folder:

> Read HANDOFF.md, AGENTS.md, README.md and docs/TRACKING.md. The site is live on Vercel at executiveupskill.live. Work through "Open work" in HANDOFF.md, starting with whatever I give you (PostHog key, YouTube Live URL or handle). If Claude in Chrome is connected, help me post the F3 Insights toolbox creatives from "Pending: F3 Insights toolbox posts", stopping before each publish button.

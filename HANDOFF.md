# Handoff: Executive Upskill site

Updated 2026-10-04. Start here, then read `AGENTS.md`, `README.md` and `docs/TRACKING.md` before you change code.

## The project

Launch site for **Executive Upskill**, a live video podcast:

- James Christopher, host and moderator, brand lens
- Greg Fisher, co-host, AI and finance lens
- Bryce Gilleland, co-host, venture lens

The premiere streams on YouTube Live on Wednesday, October 28, 2026 at 11:00 PT. Clips go to YouTube Shorts, Instagram and TikTok.

The site's job:

- Collect premiere alert signups, questions for the live show and guest pitches.
- Record which social channel sent each visitor.

| | |
|---|---|
| Repo | github.com/jameschrisa/execpodcast (public), branch `main` |
| Stack | Next.js 16.3.8 App Router (Turbopack), React 19.2, Tailwind CSS 4, Motion, Phosphor icons, PostHog (`posthog-js` + `posthog-node`) |
| Status | Built and verified locally on a production build. Not deployed yet. |
| Next job | Deploy on Vercel (section below) |

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

## Next: deploy on Vercel

### 1. Import the project

1. In Vercel, go to Add New > Project and import `jameschrisa/execpodcast`.
2. The Next.js preset is detected on its own. Keep the default build command and output.
3. In Project Settings, set the Node.js version to 22.x or 24.x.

### 2. Environment variables

Every key is in `.env.example`.

| Variable | Production | Preview | Notes |
|---|---|---|---|
| `NEXT_PUBLIC_POSTHOG_KEY` | live project key (`phc_...`) | a separate test project key, or blank | Keeps preview clicks out of launch numbers |
| `NEXT_PUBLIC_POSTHOG_REGION` | `us` or `eu` | same | `next.config.ts` also reads it at build time for the proxy |
| `NEXT_PUBLIC_SITE_URL` | `https://executiveupskill.live` | leave blank | Used for canonical links, sitemap, share images and structured data |
| `NEXT_PUBLIC_PREMIERE_AT` | `2026-10-28T11:00:00-07:00` | same | Drives every countdown and calendar file |
| `NEXT_PUBLIC_YT_LIVE_URL` | the scheduled YouTube Live URL | same | Until it's set, buttons fall back to "Subscribe on YouTube" |
| `LEADS_WEBHOOK_URL` | optional | optional, use a test hook | Server only |

Two things catch people out:

- Next.js bakes `NEXT_PUBLIC_*` values in at build time. After you change one, redeploy.
- Every Vercel deployment runs with `NODE_ENV=production`, previews included. `/api/participate` returns a 503 (`not_configured`) when neither the PostHog key nor the webhook is set. Set at least one for Preview, or the forms fail on preview URLs.

### 3. Domain

- Confirm `executiveupskill.live` is registered. The site assumes that domain for canonical links, the sitemap, share images and structured data.
- Add it under Domains, along with a `www` redirect.

### 4. Prep work not done yet

- **Search engines:** `src/app/robots.ts` allows crawling everywhere. Vercel normally sends `X-Robots-Tag: noindex` on preview URLs; check with `curl -I` on the first preview. If it doesn't, make `robots.ts` disallow everything when `VERCEL_ENV !== "production"`.
- **Node version:** consider adding `"engines": { "node": ">=20.9" }` to `package.json`.
- **Rate limiting:** the form limit is in memory and per server instance (`src/app/api/participate/route.ts`). That's fine for launch. If spam shows up, move it to Upstash Redis from the Vercel Marketplace.
- **Share images on Vercel:**
  - The share images and icons are built once at build time. They read `src/assets/Anton-Regular.ttf` and `public/photos/call-gallery.jpg` from disk, which works on Vercel.
  - If anyone makes them render on each request, add those two files to `outputFileTracingIncludes` in `next.config.ts`.
- **Refresh:** the home page rebuilds every 6 hours (`revalidate = 21600`) so the events calendar stays current. No cron job needed.

### 5. Smoke test after the first deploy

- The page loads in light mode, and the countdown shows the right date in your time zone.
- The theme toggle works and remembers your choice.
- The alerts form succeeds, and `lead_captured` appears in PostHog. If the webhook is set, it receives the submission too.
- PostHog Activity shows a pageview from the deployed URL. That confirms the `/ingest` proxy works.
- `/yt`, `/ig` and `/ask` redirect, with UTMs on the destination.
- Share-card check: paste the URL into LinkedIn Post Inspector and see the share card.
- `/privacy`, `/robots.txt` and `/sitemap.xml` load.
- On a phone, the email field and countdown fit without sideways scrolling.

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
- [ ] Set `NEXT_PUBLIC_SITE_URL` to the real domain.
- [ ] Add the PostHog key and build the dashboard in `docs/TRACKING.md`.
- [ ] Put the short paths in each platform bio.

## Kickoff prompt for the next session

Paste this into Claude Code from the cloned folder:

> Read HANDOFF.md, AGENTS.md, README.md and docs/TRACKING.md. Then prep this site for deployment on Vercel. Make the code changes listed under "Prep work not done yet", run type checks, lint and a production build, and walk me through what to set in the Vercel dashboard, including each environment variable for Production and Preview.

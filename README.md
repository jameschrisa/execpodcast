# Executive Upskill

Launch site for **Executive Upskill**, a live video podcast with James Christopher (host and moderator, brand lens), Greg Fisher (AI and finance lens) and Bryce Gilleland (venture lens). Premieres on YouTube Live, with clips on YouTube Shorts, Instagram and TikTok.

Next.js 16 (App Router) + Tailwind CSS 4 + Motion + PostHog.

## Run it

```bash
npm install
cp .env.example .env.local   # add your PostHog key
npm run dev
```

Open http://localhost:3000. `npm run build && npm start` runs the production build.

## Edit the content

| What | File |
|---|---|
| Premiere date and time, channel handles, YouTube Live link, question cutoff | `src/content/show.ts` (or the `NEXT_PUBLIC_*` env vars) |
| Host bios, card questions, "the question he asks first" | `src/content/hosts.ts` |
| Season 1 episodes and lens panels | `src/content/episodes.ts` |
| Lens test questions and host takes | `src/content/lens-test.ts` |
| Nav, hero line, ticker, platform blurbs, FAQ, session "Pairs with" notes | `src/content/site.ts` |
| Link-in-bio short paths | `src/content/short-links.ts` |

The sessions calendar (homepage section and the full `/sessions` page, plus the subscribable feed at `/sessions/calendar.ics`) reads the schedule from https://f3insights.com/api/events and refreshes every six hours. If that fails it tries the schema.org Event markup on https://f3insights.com/events, then `src/content/events-snapshot.json`. Past sessions drop off the upcoming list on their own. To resync with F3, see "Resync with F3" in HANDOFF.md.

## Forms

The premiere alerts, question, guest pitch and contact (`/contact`) forms post to `/api/participate`. Each submission is recorded in PostHog as `lead_captured` on the person (keyed by email) and, if `LEADS_WEBHOOK_URL` is set, forwarded as JSON to the webhook. In production that is a Google Apps Script on the "Executive Upskill leads" sheet (`docs/leads-webhook.gs`; setup in HANDOFF.md). With neither configured (local dev), submissions print to the server log.

## Analytics

See [docs/TRACKING.md](docs/TRACKING.md) for PostHog setup, channel attribution, the short paths to put in each platform bio, the event dictionary and the dashboard to build.

## Brand kit

`brand/` holds the logo files, tokens, social and video assets, Lucide icons and the brand guide (`brand/README.md`, `brand/guide.html`, and HTML and PDF print versions). Agents should read `brand/brand.json`. Details in HANDOFF.md.

## Images

- `public/photos/*`: candid home-studio and webcam photos of the hosts, AI-generated in Canva from the character sheets in `references/`. The untouched originals live in `references/studio-raw/`. To redo the retouch (light skin smoothing, flatter warm grade, grain) or the video-call composite, run `python3 scripts/retouch.py` then `python3 scripts/call-composite.py` (needs `pip install pillow numpy`). Retouch strength per host is set at the top of `scripts/retouch.py`. Real photos go in `references/real/<host>/` and are cropped into place by `python3 scripts/real-photos.py` (crop boxes at the top of that script); hosts with real photos skip the generated set. James and Bryce currently use real photos. A host can have a separate `card` shot for the hero card (James does). Have each host approve his images before launch.
- `public/art/*`: linocut prints, AI-generated in Canva and traced to SVG. They render as CSS masks so they recolor with the theme.

## Before launch

- [x] Confirm the premiere date and time (Nov 18, 2026, 11:00 PT).
- [ ] Set `NEXT_PUBLIC_YT_LIVE_URL` to the premiere replay.
- [x] Confirm the Instagram and TikTok handles.
- [ ] Confirm the YouTube handle in `src/content/show.ts`.
- [ ] Each host approves his bio, card question and four lens-test takes.
- [ ] Confirm "We don't share your email" matches your email tool's practice.
- [x] Set `NEXT_PUBLIC_SITE_URL` to the real domain.
- [x] Add the PostHog key and the leads webhook.
- [ ] Build the PostHog dashboard in docs/TRACKING.md.
- [ ] Put the short paths in each bio.

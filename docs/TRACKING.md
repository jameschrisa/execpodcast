# Tracking and attribution plan

PostHog runs every measurement on this site. This file covers setup, how channel attribution works, the link-in-bio paths, the event dictionary and the PostHog insights to build.

## 1. Setup (15 minutes)

1. Create a project at [us.posthog.com](https://us.posthog.com) (or EU). Copy the **Project API key** (`phc_...`).
2. Set `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_REGION` in `.env.local` and in your host's environment settings. Redeploy.
3. In PostHog **Settings > Project**:
   - Session replay: turn on. (The site masks every form input in recordings.)
   - Heatmaps and Web vitals: turn on.
   - Exception autocapture: turn on.
   - Toolbar > Authorized URLs: add your production domain so you can view heatmaps on the live page.
4. Optional: set `LEADS_WEBHOOK_URL` to forward every form submission to Zapier, Make, Slack, HubSpot or a Google Sheet.

The browser sends events to `/ingest` on your own domain, and Next.js forwards them to PostHog (see `next.config.ts`). Ad blockers that block `posthog.com` don't block this path.

Visitors who send Do Not Track get no analytics.

## 2. How a visit gets its channel

`src/lib/attribution.ts` decides the channel once per page load, using the first signal it finds:

| Order | Signal | Example | Why it matters |
|---|---|---|---|
| 1 | UTM tags | `?utm_source=instagram&utm_medium=social` | Our short links and tagged posts |
| 2 | Ad click IDs | `ttclid`, `li_fat_id`, `twclid`, `gclid`, `fbclid` | Paid and Meta traffic |
| 3 | In-app browser | Instagram, TikTok, LinkedIn, Facebook webviews | These apps often strip the referrer |
| 4 | Referrer domain | youtube.com, chatgpt.com, google.com | Untagged links |
| 5 | Nothing | | `direct` |

Channels: `youtube`, `youtube_shorts`, `instagram`, `tiktok`, `linkedin`, `x`, `facebook`, `reddit`, `email`, `outreach`, `ai_assistant`, `search`, `referral`, `direct`.

Every event carries these properties:

| Property | Meaning |
|---|---|
| `channel`, `channel_signal`, `in_app_browser` | This visit |
| `first_touch_*` | The first visit on this device (kept in local storage) |
| `last_touch_*` | The most recent non-direct visit |

`*` covers `channel`, `signal`, `source`, `medium`, `campaign`, `content`, `referrer_domain`, `paid`, `at`.

When someone submits a form, the site calls `posthog.identify(email)`. First-touch values go on the person with `$set_once`, last-touch with `$set`. That merges their anonymous browsing into one person, so you can answer "which channel produced this signup" at the person level.

## 3. Link-in-bio short paths

Defined in `src/content/short-links.ts`. Each path 302-redirects to the homepage with UTMs.

| Path | Put it here | utm_source / medium / campaign / content |
|---|---|---|
| `/yt` | YouTube channel header link and About | youtube / social / eu_evergreen / channel-link |
| `/ys` | Shorts end card (say it, show it) | youtube / social / eu_s1_e01 / shorts-endcard |
| `/live` | YouTube Live description | youtube / social / eu_s1_e01 / live-desc |
| `/chat` | Pinned message in the live chat | youtube / social / eu_s1_e01 / live-chat |
| `/ig` | Instagram bio, Reels end card | instagram / social / eu_evergreen / bio |
| `/tt` | TikTok bio, clip end card | tiktok / social / eu_evergreen / bio |
| `/li` | Show LinkedIn page | linkedin / social / eu_evergreen / company-page |
| `/li-james`, `/li-greg`, `/li-bryce` | Each host's LinkedIn Featured and About | linkedin / social / eu_evergreen / li-featured_{host} |
| `/ask` | Said on air, shown as a lower third | youtube / social / eu_s1_e01 / on-air (opens the question form) |
| `/pitch` | Founder outreach, host DMs | outreach / referral / eu_evergreen / pitch-link (opens the pitch form) |
| `/alerts` | Email signatures, slides, QR codes | email-signature / email / eu_evergreen / signature |

Each week, change `CURRENT_EPISODE` in `short-links.ts` (`eu_s1_e02`, `eu_s1_e03`, ...) so `/ys`, `/live`, `/chat` and `/ask` credit the episode that is airing.

Shorts, Reels and TikTok captions can't hold clickable links. Put the short path on the end card and say it out loud, and read per-clip results in each platform's own analytics.

### Tagging posts by hand

- Host LinkedIn posts: `?utm_source=linkedin&utm_medium=social&utm_campaign=eu_s1_e04&utm_content=li-post_greg` (use `li-comment_greg` when the link sits in the first comment).
- Instagram Story link stickers: `utm_content=story_e01-03` (episode, frame).
- Paid social: `utm_medium=paid-social`, `utm_content={hook-slug}_{ratio}`, for example `board-hook_4x5`. The site marks these visits `paid: true`.
- Alert emails: `utm_source=alerts-email&utm_medium=email&utm_content=reminder-24h` (or `date-announce`, `go-live`, `replay`).

## 4. Event dictionary

Autocapture, pageviews, page leaves, web vitals, heatmaps, dead clicks and exceptions are on. These custom events sit on top:

| Event | When | Key properties |
|---|---|---|
| `cta_clicked` | Any "Get premiere alerts", "Send a question", "Full season" or "Meet the hosts" button | `cta`, `placement` |
| `nav_clicked` | Header, sticky bar, mobile menu or footer link | `target`, `placement` |
| `platform_follow_clicked` | Any YouTube, Shorts, Instagram or TikTok link | `platform`, `placement` |
| `host_viewed` | Host card, tab or "Meet {host}" link | `host`, `method` |
| `host_linkedin_clicked` | A host's LinkedIn link | `host`, `placement` |
| `lens_question_selected` | A question chip in the lens test | `question`, `index` |
| `episode_interest_clicked` | A planned episode row in a lens panel | `episode`, `lens` |
| `lens_preference_selected` | "Which lens do you want more of?" after signup | `lens` (also set as person property `preferred_lens`) |
| `premiere_added_to_calendar` | "Add to calendar" for the premiere | `placement` |
| `sessions_filter_changed`, `sessions_day_selected`, `sessions_month_changed` | Events calendar use | `category`, `date`, `month` |
| `session_register_clicked` | "Register free" on an F3 Insights session | `session`, `session_date`, `category`, `placement` |
| `session_added_to_calendar` | "Add to calendar" on a session | `session`, `session_date` |
| `join_tab_changed` | Switching between alerts, question and pitch | `tab`, `method` |
| `form_started` | First focus in a form | `form` |
| `form_submitted` | Successful submit | `form`, `role`, `host`, `episode_interest` |
| `form_failed` | Validation or server error | `form`, `reason` |
| `faq_opened` | An FAQ item opens | `question` |
| `section_viewed` | A section reaches the middle of the screen | `section` |
| `scroll_depth_reached` | 25, 50, 75, 100 percent of the page | `percent` |
| `theme_changed` | Light or dark toggle | `theme` |
| `lead_captured` (server) | The API stored a submission | `kind`, form fields, all attribution properties |

`lead_captured` comes from the server (`src/app/api/participate/route.ts`), so it survives blocked browser scripts. It holds the question text and pitch details, so the team can read submissions inside PostHog.

## 5. Insights to build (one dashboard: "Season 1 launch")

1. **Alert signups by first-touch channel.** Trends, `form_submitted` where `form = alerts`, breakdown `first_touch_channel`, daily.
2. **Premiere funnel.** Funnel: `$pageview` > `section_viewed (section = watch)` > `form_started (form = alerts)` > `form_submitted (form = alerts)`. Breakdown `channel`. Shows which channel sends visitors who sign up, not just visitors.
3. **Visitors by channel.** Trends, unique users on `$pageview`, breakdown `channel`. Add a second series filtered to `in_app_browser is set` to see how much traffic the social apps send without a referrer.
4. **Follow clicks.** Trends, `platform_follow_clicked`, breakdown `platform` then `placement`. Tells you which cell or button moves people to each platform.
5. **What people want to hear.** Trends (total), `episode_interest_clicked` breakdown `episode`, plus `lens_question_selected` breakdown `question`. Use this to order the season.
6. **Questions and pitches.** Trends, `lead_captured` breakdown `kind`. Open the events list to read them.
7. **Affiliate sessions.** Trends, `session_register_clicked` breakdown `session`. Ask F3 Insights to report registrations by `utm_content` so you can see completions too.
8. **Page depth.** Trends, `scroll_depth_reached` breakdown `percent`, and `section_viewed` breakdown `section`.

Cohort worth saving: persons where `first_touch_channel` is `instagram` or `tiktok` and `submitted_alerts = true`. Compare their live-show turnout (from your email tool) against LinkedIn-sourced signups.

PostHog's built-in **Web analytics** dashboard also reads the `$initial_utm_*` and referrer properties on its own.

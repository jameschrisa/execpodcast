# Executive Upskill brand kit

Everything here is taken from what the live site (executiveupskill.live) does today. Sources are `src/app/globals.css`, `src/app/layout.tsx`, `src/components/`, `src/content/` and `HANDOFF.md`. Where the site disagrees with itself, the disagreement is listed under Open questions and left alone.

## Positioning

**Who it is for.** Executives and operators who have to make decisions about AI and need to hear them argued from more than one seat: marketing and brand leaders, finance leaders, founders and investors. The FAQ names the guest profile too: founders and operators who made a hard call on AI, money or brand and will defend it on camera.

**What the show is.** Executive Upskill is a live video podcast. The premiere streams on YouTube Live on Wednesday, November 18, 2026 at 11:00 PT, 90 minutes, with the episode "Your 2027 AI Budget, Argued Three Ways". Clips go to YouTube Shorts, Instagram, TikTok and LinkedIn. The site collects premiere alert signups, questions for the live show and guest pitches. Season 1 is 12 planned episodes.

**The three lenses.** One question, three hosts, three seats.

| Lens | Host | Site label | Lens headline | Asks first |
|---|---|---|---|---|
| Brand | James Christopher, host and moderator | Brand lens | Brand meets the bot | "Who's the human in this loop, and can they say no?" |
| Money | Greg Fisher, co-host | AI and finance lens | Make the AI pay | "Which line on the P&L moves, and when?" |
| Venture | Bryce Gilleland, co-host | Venture lens | Bet before consensus | "If this works, who keeps the money?" |

**What makes it different.**
- The hosts argue. Each one makes his own call on the same question, and they disagree on camera.
- They speak from seats they have held: a marketing executive with ML patents, a finance executive of about 20 years, a fund Co-GP who runs the fund's operations on AI agents he designed.
- Viewers can ask live. The hosts take questions from the chat, and questions that name a real decision get picked.
- It is built for the gap between meetings: one argument per clip.

## Messaging

**Campaign line.** One question. Three lenses.

**Hero value prop (the site's headline copy).** Three operators talk AI, business and brand from the seats they've held. Live on YouTube, clipped for your feed.

**Value proposition in one sentence.** Three operators argue the AI decision you are facing from the brand, finance and venture seats, live, and you can ask them in the chat.

**Show description, short (meta description in layout.tsx).** A brand operator, a finance executive and a venture investor argue AI, money and brand live on YouTube. Get premiere alerts.

**Show description, long.** Executive Upskill is a live video podcast. A brand operator, a finance executive and a venture investor take one question at a time and each make a call. The full episode streams on YouTube Live and you can ask in the chat. The best exchanges are cut into clips for YouTube Shorts, Instagram, TikTok and LinkedIn. It is free.

**Host one-liners.**
- James Christopher, host and moderator, brand lens: marketing executive of 20+ years who holds patents in machine learning and advanced sensor technology, and advises startups on AI transformation. Hook: "Who checks the bot?"
- Greg Fisher, co-host, AI and finance lens: has run finance for about 20 years across healthcare, biotech, manufacturing, consumer electronics and professional services; raises margins and builds the reporting systems a company can scale on. Hook: "Who's paying for all these pilots?"
- Bryce Gilleland, co-host, venture lens: 20+ years running teams and funding founders; Co-GP of the Cal Innovation Fund, which he runs on AI agents he designed. Hook: "Is your moat a prompt?"

**Calls to action as used on the site.**
- Get premiere alerts
- Know when we go live
- Set YouTube reminder (falls back to Subscribe on YouTube until the live event URL exists)
- Subscribe on YouTube / Watch Shorts / Follow on Instagram / Follow on TikTok / Follow on LinkedIn
- Send my question
- Pitch a founder worth arguing with
- Meet the hosts / Meet James (first name of the host)
- Join Season 1
- Pull up a chair

**Section headlines in use.** Pick the lens you need. Watch live or catch the clips. Meet the hosts. Ask, and we'll argue it live. Know when Episode 2 goes live.

**Words we use.** operators, seats, lens, argue, call (as in "make the call"), live, clip, pilot, P&L, margin, moat, review gate, human in the loop, decision, "argued three ways".

**Words we avoid.** Anything on the hard-ban list in `~/.claude/standards/anti-ai-banned.txt`. Also avoid vague claims about AI "transforming" things. The site names the person, the number or the decision instead.

## Voice and tone

The voice is direct and specific, spoken by people who have done the job. It asks a pointed question, gives a concrete test, and skips the pitch.

- **Short, concrete, second person.** "Name the person who reviews the agent's work before a customer sees it. If you can't name them, you're hiring a liability."
- **Money talk is plain arithmetic.** "Price the agent with the hours someone spends checking its work. Compare that number to the salary, then decide."
- **Takes a side.** "Rebrand around the problem you own, so you still stand out when your competitors say AI too."
- **Clip descriptions state the payoff.** "One argument per clip, short enough for the gap between meetings."
- **Calls to action are verbs and promises.** "Ask, and we'll argue it live." "We send a reminder the day before and the live link when we start, then one email per episode."
- **Contractions are normal.** "you're", "we'll", "hosts' notes".
- **Display headlines are short and uppercase** (the cut forces it): "PICK THE LENS YOU NEED", "MEET THE HOSTS".
- **Host takes are first person.** "I run my fund's operations on agents I designed. Start with a workflow you can write down step by step."

Tone shifts: confident and a little dry in headlines, plain and helpful in forms and FAQ ("Yes, it's free."), never hype.

## Logo

The logo is a square: EXECUTIVE in off-white over UPSKILL in orange, both stretched to the same width inside a near-black square. It is the site mark, the home-screen icon and the basis for the favicon. All files are outlined paths, so no font is needed to use them.

Square geometry (from `src/components/ui/Logo.tsx`): 100-unit viewBox, 9-unit padding, 82 units of text width. EXECUTIVE sits on baseline 45.6 at font-size 19.85, UPSKILL on baseline 68.35 at 26.5, both set in Archivo at wdth 62, weight 900. Colors are #0e0e0e (square), #f2f2ee (EXECUTIVE) and #ff4d12 (UPSKILL).

| File | Use |
|---|---|
| `logo/executive-upskill-mark.svg` | Primary. Black square, off-white and orange. Works on any background because it carries its own square. |
| `logo/executive-upskill-mark-light.svg` | Paper square (#f7f7f5), ink (#121212) EXECUTIVE, orange UPSKILL. For placing on dark or photographic areas where a black square would vanish or feel heavy. |
| `logo/executive-upskill-mark-mono-black.svg` | One color, #000000, letters only on a transparent background. For print, stamps, embossing, one-color jobs. |
| `logo/executive-upskill-mark-mono-white.svg` | One color, #ffffff, letters only on a transparent background. For use over dark or photo backgrounds. Invisible on white, so preview it on a dark surface. |
| `logo/executive-upskill-monogram.svg` | EU favicon monogram: Anton, E in #f2f2ee, U in #ff4d12, on #0e0e0e. For tabs, avatars and any size under 48px. |
| `logo/executive-upskill-wordmark.svg` | Horizontal hero wordmark: EXECUTIVE in ink #121212, UPSKILL in orange #ff4d12, transparent background, for light surfaces. |
| `logo/executive-upskill-wordmark-dark.svg` | Same on dark surfaces: #f2f2ee and the dark-theme accent #ff5a1f. |

Mono variants are letters only (no square knock-out). That keeps the two words readable on any background and avoids a second square shape.

The horizontal wordmark follows the hero: one line, the display cut, -0.01em letter spacing, a 0.08em gap before UPSKILL. Its width is about 7.15 times its font size, close to the site's `--wordmark-em` default of 7.17. The SVG viewBox is 74 units tall and includes 2 units above and below for round-letter overshoot.

**Clear space.** Keep at least 9% of the mark's width (the square's own padding, 9 of 100 units) free on every side of the square. For the wordmark, keep clear space equal to the cap height of the letter L. These are working rules derived from the mark's built-in padding, not site rules.

**Minimum sizes.** Square mark: 32 px wide on screen, 12 mm in print. Below 48 px use the monogram, as the site does for the favicon ("the full words are illegible at 16px"). Wordmark: 120 px wide.

**Dark-mode edge rule.** On dark paper the black square meets near-black, so the site draws a 2-unit stroke of white at 16% opacity (`rgb(255 255 255 / 0.16)`) around the square (`[data-theme="dark"] .logo-mark rect`). Reproduce it when placing the mark on #0e0e0d to #171716 surfaces. The SVG files do not include it.

**Do not.**
- Re-set the words in another font or let the two lines differ in width.
- Change the colors, swap which word is orange, or put the orange word on a similar orange.
- Add shadows, gradients, outlines or a rounded-corner square (the square has sharp corners).
- Rotate, skew or tilt the mark.
- Place the mono white file on light backgrounds or the mono black on dark ones.
- Stretch the square into a rectangle.

PNG exports are in `logo/png/`, named with their pixel size.

## Color

Light is the default theme for every visitor. Dark applies only when the visitor picks it with the toggle (`data-theme="dark"`, stored as `eu-theme`). The palette is off-white paper, off-black ink and one accent, the "on-air" orange.

| Token | Light | Dark | Role |
|---|---|---|---|
| `--paper` | #f7f7f5 | #0e0e0d | Page background, `themeColor` |
| `--paper-raised` | #ffffff | #171716 | Raised surfaces, inputs |
| `--ink` | #121212 | #f2f2ee | Body and headline text |
| `--ink-soft` | #2a2a28 | #d6d6d1 | Lede and long-form text |
| `--muted` | #5a5a57 | #a3a39f | Secondary text, captions |
| `--line` | #e2e2dd | #2a2a28 | Hairlines, dividers |
| `--accent` | #ff4d12 | #ff5a1f | Fills, icons, display type |
| `--accent-ink` | #b93408 | #ff6a33 | Small accent-colored text |
| `--on-accent` | #121212 | #0e0e0d | Text on accent fills |
| `--scrim` | #121212 | #0b0b0a | Overlays on photos |
| `--shadow` | `0 1px 0 rgb(18 18 18 / 0.04), 0 18px 40px -24px rgb(18 18 18 / 0.25)` | `0 1px 0 rgb(0 0 0 / 0.3), 0 18px 40px -24px rgb(0 0 0 / 0.7)` | Card lift |

Logo colors do not change with the theme: #0e0e0e, #f2f2ee, #ff4d12.

**Lens colors.** Each lens panel carries identity color, with a ring color for the inset border and a text color.

| Lens | Panel light | Ring light | Text light | Panel dark | Ring dark | Text dark |
|---|---|---|---|---|---|---|
| Brand (orange) | #ff4d12 | #e03c05 | #121212 | #ff5a1f | #ff7a47 | #0e0e0d |
| Money (concrete) | #d9dad5 | #bdbfb8 | #121212 | #262724 | #3a3b37 | #f2f2ee |
| Venture (ink) | #151515 | #343432 | #f2f2ee | #f2f2ee | #d6d6d1 | #121212 |

The Venture panel inverts in dark mode, so it reads as the light panel there.

**Contrast, measured (WCAG ratios).**
- Accent rule: `--accent` is for fills, icons and display type. Text in the accent color at small sizes uses `--accent-ink`.
- #ff4d12 on paper #f7f7f5 is 3.1:1. That passes only for large display type and graphics, so never set body or caption text in `--accent` on light.
- #b93408 (`--accent-ink`) on paper is 5.5:1 and on white 5.9:1. Passes AA for small text.
- Dark mode: #ff5a1f on #0e0e0d is 6.2:1 and #ff6a33 on #0e0e0d is 6.8:1, so both pass for text. The site still uses `--accent-ink` for small text for consistency.
- `--on-accent` #121212 on #ff4d12 is 5.6:1, so text on orange fills is fine.
- Body: #121212 on paper 17.5:1, #5a5a57 (muted) on paper 6.5:1, #a3a39f (muted dark) on #0e0e0d 7.6:1.

Selection color is accent with on-accent text. Focus ring is a 2px solid accent outline with 3px offset.

## Typography

| Role | Family | Where from |
|---|---|---|
| Display | Archivo, variable, width axis | https://fonts.google.com/specimen/Archivo (source file: `ofl/archivo/Archivo[wdth,wght].ttf` in github.com/google/fonts) |
| Body | Geist | https://fonts.google.com/specimen/Geist |
| Logo fallback | Anton | https://fonts.google.com/specimen/Anton (also at `src/assets/Anton-Regular.ttf`) |

**The display cut.** Archivo with the width axis at 62 (its narrowest), weight 900, uppercase.

```
font-family: "Archivo", "Arial Narrow", sans-serif;
font-variation-settings: "wdth" 62;
font-weight: 900;
letter-spacing: -0.01em;
word-spacing: 0.06em;
line-height: 0.88;
text-transform: uppercase;
```

Where the variable width axis is not available (slides, some video tools), use Anton, which is what the favicon, home-screen icon and share card use. It is close to the cut but not identical.

**Sizes in use.**
- Section headlines: `clamp(48px, 6.4vw, 96px)`. Hero-scale headlines `clamp(56px, 7vw, 112px)`. Lens panel titles `clamp(44px, 3.8vw, 60px)`. Form headlines `clamp(36px, 3.6vw, 52px)`. Host names `clamp(56px, 6.6vw, 108px)`.
- Hero wordmark: full container width, font-size = container width divided by 7.17.
- Hero lede: 19px, 22px from the md breakpoint, tight leading, in `--ink-soft`.
- Section lede and bios: 18px, relaxed leading, `--ink-soft`.
- Form and card copy: 16px. UI text: 15, 14, 13 and 12px.
- Buttons: 14px, semibold (600), 44px tall (48px for form submits).
- Small labels: 13px, bold, uppercase, 0.08em tracking (0.06em in some links), in `--accent-ink`.

**Fallbacks.** Display: "Arial Narrow", then sans-serif. Body: ui-sans-serif, system-ui, sans-serif. Antialiased text with `optimizeLegibility`.

## Visual language

**Shape rule.** Cards and panels: 16px radius. Buttons and chips: full pill. Inputs: 12px. Nothing else. Focus outlines use a 6px radius. Avatars are circles with a 2px ring at 20% of the current color.

**Buttons.** Four pills: primary (accent fill, on-accent text, turns ink on hover), dark (ink fill, turns accent on hover), outline (1px ink border, fills ink on hover) and text (no fill, underlined, for secondary actions). One filled button per area.

**Lens panels.** A 16px card with an inset printed-card border: a 6px inner band in the panel color, then a 2px ring in the ring color. Display title, host avatar chip, a linocut print rotated -6 degrees (straightens on hover), and a list of episodes divided by hairlines in the current text color at 15% opacity.

**Grain.** A fixed full-screen film grain over the whole page (SVG fractal noise, baseFrequency 0.9, 2 octaves, 160px tile), at 5% opacity in light and 7% in dark. It is non-interactive and sits at z-index 60.

**Illustrations.** Single-color linocut-style prints traced to SVG: `public/art/megaphone.svg` (Brand), `adding-machine.svg` (Money), `knight.svg` (Venture), `microphone.svg`. They are drawn with `fill="currentColor"` and shown as CSS masks, so they take the text color of the panel and invert with the theme. The adult print look replaced an earlier version that read as too kid-like. Keep them single color.

**Photography.** Candid home-studio frames of the hosts: three-quarter at the mic, a laughing side profile, and square face crops for avatars. Host cards are 3:4 with a 16px radius, a scrim gradient (`--scrim`) rising over the lower 64% under the text, and a hook line set as live text. The laughing take shows on hover. A composite video-call image (`call-gallery.jpg`) shows all three hosts and is the social share photo. James and Bryce use real photos. Greg's are generated and retouched until real ones arrive.

**Motion.**
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo) for the wordmark rise, FAQ disclosure height (0.35s) and reveals.
- Wordmark: each letter rises from below over 0.9s with a 28ms stagger per letter, once on load.
- Buttons: 200ms ease-out with a 0.98 press scale.
- Marquee ticker: 38s linear loop.
- Live indicator: a pulsing accent dot.
- Everything above switches off under `prefers-reduced-motion: reduce`.

**Layout habits.** Content container max 1400px with 16, 24 and 32px side padding by breakpoint. Sections start 96 to 128px apart. A section opens with a hairline row (small label left, link right), then a large uppercase display headline, then a lede. Hosts become a swipe row on phones and a grid on desktop. Scroll padding is 88px under a sticky nav.

## Applying it

**Social card (1200 x 630).** Background #161618 (the share card's own value). Left column: small label "LIVE VIDEO PODCAST" in #ff4d12, then EXECUTIVE in #f2f2ee over UPSKILL in #ff4d12 at about 112px in Anton, then "ONE QUESTION. THREE LENSES." at 36px in #f2f2ee, then "PREMIERES NOV 18 ON YOUTUBE LIVE" at 26px, #f2f2ee at 80%. Right: the call photo at 620 x 349 with an 18px radius.

**Slide title.** Paper #f7f7f5 background, headline in the display cut (Anton if the cut is unavailable), uppercase, #121212, line height 0.88, one phrase in #ff4d12 at display size only. Lede in Geist, #2a2a28. Square mark in a corner, with clear space. Dark variant: #0e0e0d paper, #f2f2ee text, #ff5a1f accent.

**Email header.** Paper #f7f7f5, the horizontal wordmark at 560 px wide, then a 1px #e2e2dd rule. Body in Geist (fallback system-ui) at 16px, #2a2a28. Button as a pill: #ff4d12 fill, #121212 text, 14px semibold, 44px tall. Small orange text must be #b93408.

**Video lower third.** A 16px-radius bar in #0e0e0d at 90% opacity (the scrim is #0b0b0a in dark). Name in the display cut at #f2f2ee, role line in Geist 16px #d6d6d1, a lens chip as a full pill using the host's lens panel color and text color (Brand #ff4d12 with #121212, Money #262724 with #f2f2ee, Venture #f2f2ee with #121212). Ease in with `cubic-bezier(0.16, 1, 0.3, 1)` over 0.9s, letters staggered at 28ms if animating the name. Keep text clear of platform UI safe areas.

## Brand assets

Ready-to-use files in `assets/`. Each is an SVG with outlined text (no font needed) and a PNG at its exact pixel size. They use only copy from the site: the campaign line, the hero tail, the show name and the premiere date (Wed Nov 18, 11:00 PT). Social surfaces and video cards sit on the logo black. The share card, email header and slides default to light paper.

| Folder | Files |
|---|---|
| `assets/profile/` | `profile-1080` (Instagram, TikTok, LinkedIn page), `profile-800` (YouTube). The square mark at 90% so every letter sits inside the circle crop. |
| `assets/banners/` | `youtube-banner-2560x1440` (key content inside the 1546 x 423 safe area), `youtube-banner-2560x1440-safe-area-guide` (same art with the safe area marked, reference only), `linkedin-cover-1128x191`, `x-header-1500x500`. |
| `assets/social/` | `og-share-card-1200x630`. Palette colors only, replacing the off-palette #161618. |
| `assets/email/` | `email-header-1200x300`. |
| `assets/video/` | `lower-third-james`, `lower-third-greg`, `lower-third-bryce` (1920 x 1080, transparent), `title-card-1920x1080`, `end-card-1920x1080`. Names, roles and lens colors come from `src/content/hosts.ts`. |
| `assets/slides/` | `slide-title-{light,dark}-1920x1080`, `slide-content-{light,dark}-1920x1080`. |

**Rebuild.** `scripts/build-all.sh` runs `build-icons.py`, `gen-assets.py` and `render-svg.mjs`. It needs a folder with `lucide-static@0.577.0`, `@resvg/resvg-js@2.6.2` and `geist@1.9.1` installed (kept outside the site's `package.json`), a Python environment with `fonttools`, `uharfbuzz` and `brotli`, and the Archivo variable font. `scripts/build-guide.py` then rebuilds `guide.html` and `brand.json`. Do not edit the generated SVG or PNG files by hand.

## Icons

Lucide, pinned to lucide-static 0.577.0 (ISC license in `icons/LICENSE`). Lucide 1.x removed its brand icons, so 0.577.0 stays pinned to keep YouTube, Instagram and LinkedIn. Raw SVGs are in `icons/svg/`. `icons/icons.json` maps each brand concept to a Lucide icon, the Phosphor icon on the site it replaces (or null) and a usage note. PNG sets of the lens and platform icons at 24, 48 and 96 px, in ink (#121212) and paper (#f2f2ee), are in `icons/png/`.

Rules: 24px grid, 2px stroke (1.75 at 16px), `currentColor`, round caps and joins. The orange accent is only for live or active state.

Lens icons follow the linocut prints: Brand megaphone, AI and finance calculator (adding machine), Venture chess-knight.

**Phosphor to Lucide.** ArrowRight to arrow-right, ArrowUpRight to arrow-up-right, ArrowsClockwise to refresh-cw, CalendarPlus to calendar-plus, CaretLeft and CaretRight to chevron-left and chevron-right, ChatTeardrop to message-circle, Check to check, InstagramLogo to instagram, LinkedinLogo to linkedin, List to menu, MagnifyingGlass to search, Microphone to mic, Moon to moon, Sun to sun, X to x, YoutubeLogo to youtube.

**Gaps.** TiktokLogo has no Lucide match. `music-2` is the fallback, and the official glyph stays where the platform requires it. The site uses Phosphor fill weights for the brand logos, ChatTeardrop and Microphone, and Lucide is outline only, so those look lighter.

## Guide and machine-readable spec

`guide.html` is a tabbed reference (overview, logo, color, type, icons, visual, voice, assets, agents) for people and agents. Tabs route by hash (`#color`). `brand.json` holds the same spec for tools: tokens, fonts, logo files, icon map, asset paths, voice rules, banned terms and open questions. The guide embeds the same JSON in `script#brand-data`.

## Assets index

```
brand/
  README.md
  logo/
    executive-upskill-mark.svg
    executive-upskill-mark-light.svg
    executive-upskill-mark-mono-black.svg
    executive-upskill-mark-mono-white.svg
    executive-upskill-monogram.svg
    executive-upskill-wordmark.svg
    executive-upskill-wordmark-dark.svg
    png/
      executive-upskill-mark-{2048,1024,512,256,128}.png
      executive-upskill-mark-light-{1024,512}.png
      executive-upskill-monogram-{512,180,32}.png
      executive-upskill-wordmark-2400w.png
      executive-upskill-wordmark-dark-2400w.png
  tokens/
    tokens.css
    tokens.json
  assets/{profile,banners,social,email,video,slides}/   SVG + PNG pairs
  icons/
    LICENSE, icons.json
    svg/    png/
  guide.html
  brand.json
  scripts/
    build-logo.py  build-icons.py  gen-assets.py  render-svg.mjs
    build-guide.py  guide.template.html  build-all.sh
```

Site assets used by the brand: `public/art/*.svg`, `public/photos/`, `src/assets/Anton-Regular.ttf`, `src/app/icon.tsx`, `src/app/apple-icon.tsx`, `src/lib/share-image.tsx`.

**Regenerate the logo.** `pip install fonttools uharfbuzz`, download `Archivo[wdth,wght].ttf` from github.com/google/fonts (`ofl/archivo`), then run `python3 brand/scripts/build-logo.py "<path to Archivo[wdth,wght].ttf>" src/assets/Anton-Regular.ttf brand/logo`. The script instances Archivo at wdth 62 and weight 900, shapes with kerning, and scales each word to 82 units like `textLength` with `lengthAdjust="spacingAndGlyphs"`. PNGs were rendered from the SVGs with ImageMagick at 1200 dpi.

## Open questions

Noted, not resolved.

1. **Meta description vs hero.** `layout.tsx` says the hosts "argue AI, money and brand". The hero says they "talk AI, business and brand". "Money" and "business" are different words for the middle lens, and "argue" and "talk" are different verbs.
2. **Name of the middle lens.** CSS and tokens call it Money (`--lens-money`). Content calls it "AI and finance lens". The lens headline is "Make the AI pay".
3. **Logo accent in dark mode.** The site's React logo fills UPSKILL with `var(--accent)`, so it renders #ff5a1f in dark mode. The favicon and the standalone SVGs use #ff4d12. The kit uses #ff4d12 for the mark and #ff5a1f only for the dark wordmark.
4. **Three logo renderings use different fonts.** The in-page mark and wordmark use Archivo. The favicon, home-screen icon and share card use Anton, because the image renderer cannot read variable fonts. The two cuts look alike but are not the same.
5. **Share card background.** The card uses #161618, which is not in the palette (paper dark is #0e0e0d, logo black is #0e0e0e, Venture panel is #151515).
6. **Uppercase accent labels.** The site sets small bold uppercase labels in `--accent-ink` above headings ("Browse by lens"). The rest of the kit is silent on whether new work should keep that pattern.
7. **Handles differ by platform.** YouTube @ExecutiveUpskill, Instagram @exec.upskill, TikTok @execupskill, the LinkedIn page "Executive Upskill".
8. **Draft copy.** The lens-test takes are drafts that each host should approve before launch, so quote them cautiously. The episode titles are working titles.
9. **Greg's photos** are generated until real ones arrive, so photography guidance covers two sources.
10. **Theme color.** `viewport.themeColor` is #f7f7f5 only, with no dark value.

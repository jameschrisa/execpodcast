#!/usr/bin/env python3
"""Copy the chosen Lucide SVGs into brand/icons/svg, write icons.json and the
brand-colored PNG sources.

Usage: python3 build-icons.py LUCIDE_STATIC_DIR BRAND_DIR
  LUCIDE_STATIC_DIR is node_modules/lucide-static of the pinned version below.
  (npm i lucide-static@0.577.0 in a scratch folder, not in the site's package.json.)
Then render PNGs: see build-all.sh.
"""
import sys, os, json, shutil, re

LUCIDE_VERSION = "0.577.0"
src, brand = sys.argv[1:3]
svgdir = os.path.join(brand, "icons", "svg")
os.makedirs(svgdir, exist_ok=True)

# (concept, lucide name, phosphor icon in use on the site or None, usage)
ICONS = [
 ("lens-brand", "megaphone", None, "Brand lens and the moderator seat. Matches the megaphone print on the Brand panel."),
 ("lens-money", "calculator", None, "AI and finance lens. Matches the adding-machine print on the Money panel."),
 ("lens-venture", "chess-knight", None, "Venture lens. Matches the knight print on the Venture panel."),
 ("live-premiere", "radio", None, "Live and premiere. The only icon that takes the orange accent, and only while a stream is live or a premiere is active."),
 ("episodes", "list-video", None, "Episode lists and the episodes nav item."),
 ("sessions-calendar", "calendar-days", None, "Live sessions calendar and date rows."),
 ("add-to-calendar", "calendar-plus", "CalendarPlus", "Add to calendar buttons (Google, Outlook, .ics)."),
 ("subscribe-rss", "rss", None, "RSS feed and podcast-feed subscribe links."),
 ("register", "ticket-check", None, "Register for a session. Pairs with the F3 Insights register link."),
 ("contact-mail", "mail", None, "Contact form, email links and the email header."),
 ("guest-pitch", "mic", "Microphone", "Pitch a founder worth arguing with. Also the call-in band."),
 ("question", "message-circle-question", None, "Send my question and the ask-the-hosts form."),
 ("chat", "message-circle", "ChatTeardrop", "Chat bubbles in the topic ticker. Phosphor fill weight becomes Lucide outline."),
 ("alerts-bell", "bell-ring", None, "Premiere alerts and reminders."),
 ("platform-youtube", "youtube", "YoutubeLogo", "YouTube and YouTube Live channel links."),
 ("platform-shorts", "youtube", "YoutubeLogo", "YouTube Shorts. The site uses the YouTube glyph for Shorts too, so the label does the work."),
 ("platform-instagram", "instagram", "InstagramLogo", "Instagram channel links."),
 ("platform-tiktok", "music-2", "TiktokLogo", "TikTok. Lucide has no TikTok glyph, so music-2 is the fallback. Where the official mark is required, keep the official glyph."),
 ("platform-linkedin", "linkedin", "LinkedinLogo", "LinkedIn page and host profile links."),
 ("share", "share-2", None, "Share a clip, episode or session."),
 ("external-link", "arrow-up-right", "ArrowUpRight", "Links that leave the site. Alternate: external-link."),
 ("clock", "clock", None, "Start time and duration."),
 ("time-zone", "globe", None, "Time zone label next to a start time."),
 ("seats-users", "users", None, "Seats and attendee counts."),
 ("status-open", "circle-check", None, "Session status: open."),
 ("status-limited", "circle-alert", None, "Session status: limited seats."),
 ("status-full", "circle-x", None, "Session status: full."),
 ("status-cancelled", "ban", None, "Session status: cancelled."),
 ("arrow-right", "arrow-right", "ArrowRight", "Forward links and primary calls to action."),
 ("previous", "chevron-left", "CaretLeft", "Calendar and carousel previous."),
 ("next", "chevron-right", "CaretRight", "Calendar and carousel next."),
 ("check", "check", "Check", "Selected state and confirmations."),
 ("close", "x", "X", "Close dialogs, menus and filters."),
 ("menu", "menu", "List", "Mobile navigation toggle."),
 ("search", "search", "MagnifyingGlass", "Session search field."),
 ("refresh", "refresh-cw", "ArrowsClockwise", "Reload the sessions snapshot."),
 ("theme-light", "sun", "Sun", "Theme toggle, light state."),
 ("theme-dark", "moon", "Moon", "Theme toggle, dark state."),
]
for _, name, _, _ in ICONS:
    shutil.copyfile(os.path.join(src, "icons", name + ".svg"), os.path.join(svgdir, name + ".svg"))
shutil.copyfile(os.path.join(src, "LICENSE"), os.path.join(brand, "icons", "LICENSE"))
out = [{"concept": c, "lucide": n, "phosphorOnSite": p, "usage": u} for c, n, p, u in ICONS]
json.dump(out, open(os.path.join(brand, "icons", "icons.json"), "w"), indent=2)
open(os.path.join(brand, "icons", "icons.json"), "a").write("\n")
print("icons:", len({n for _, n, _, _ in ICONS}), "files,", len(ICONS), "concepts, lucide-static", LUCIDE_VERSION)

# PNG sources: lens + platform icons, ink and paper colors, 24/48/96
tmp = os.path.join(brand, "icons", ".png-src")
os.makedirs(tmp, exist_ok=True)
PNG_SET = ["megaphone", "calculator", "chess-knight", "youtube", "instagram", "music-2", "linkedin"]
COLORS = {"ink": "#121212", "paper": "#f2f2ee"}
jobs = []
for n in PNG_SET:
    raw = open(os.path.join(svgdir, n + ".svg")).read()
    inner = re.sub(r"<!--.*?-->\s*", "", raw, flags=re.S)
    inner = re.search(r">(.*)</svg>", inner, re.S).group(1)
    for cn, hexv in COLORS.items():
        for px in (24, 48, 96):
            s = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{px}" height="{px}" viewBox="0 0 24 24" fill="none" '
                 f'stroke="{hexv}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">{inner}</svg>\n')
            base = f"{n}-{cn}-{px}"
            open(os.path.join(tmp, base + ".svg"), "w").write(s)
            jobs.append(f"{tmp}/{base}.svg:{brand}/icons/png/{base}.png")
open(os.path.join(tmp, "jobs.txt"), "w").write("\n".join(jobs) + "\n")

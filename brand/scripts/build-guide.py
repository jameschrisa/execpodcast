#!/usr/bin/env python3
"""Build brand/guide.html and brand/brand.json from the kit's own files.
Usage: python3 build-guide.py BRAND_DIR
Reads tokens/tokens.json, logo/*.svg, icons/icons.json + icons/svg, assets/**.png, README.md (open questions)
and ~/.claude/standards/anti-ai-banned.txt. Fills guide.template.html.
"""
import sys, os, re, json, html, struct, glob
B = sys.argv[1]; HERE = os.path.dirname(os.path.abspath(__file__))
tok = json.load(open(f"{B}/tokens/tokens.json"))
icons = json.load(open(f"{B}/icons/icons.json"))
LUCIDE = "0.577.0"
esc = html.escape

def lum(h):
    c = [int(h[i:i+2], 16) / 255 for i in (1, 3, 5)]
    c = [x / 12.92 if x <= 0.03928 else ((x + 0.055) / 1.055) ** 2.4 for x in c]
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
def cr(a, b):
    la, lb = lum(a), lum(b)
    if la < lb: la, lb = lb, la
    return (la + 0.05) / (lb + 0.05)
def on(bg): return "on-d" if cr(bg, "#f2f2ee") > cr(bg, "#121212") else "on-l"

L, D = tok["color"]["light"], tok["color"]["dark"]
roles = {"paper": "Page background, themeColor", "paper-raised": "Raised surfaces, inputs", "ink": "Body and headline text",
         "ink-soft": "Lede and long-form text", "muted": "Secondary text, captions", "line": "Hairlines, dividers",
         "accent": "Fills, icons, display type. Not for small text on light", "accent-ink": "Small accent-colored text",
         "on-accent": "Text on accent fills", "scrim": "Overlays on photos"}

# constant (non-switching) color tokens for swatches and logo tiles
const = ["--logo-ink:#121212;", "--logo-white:#f2f2ee;", "--tile-light:#f7f7f5;", "--tile-dark:#0e0e0d;"]
sw = ""
for k in roles:
    const.append(f"--c-l-{k}:{L[k]};"); const.append(f"--c-d-{k}:{D[k]};")
    def chip(theme, h, pk):
        return (f'<div class="chip {on(h)}" style="background:var(--c-{theme}-{k})"><div><b>{theme_name[theme]}</b><br>'
                f'<span class="hexrow"><code>{h}</code><button class="btn sm" type="button" data-copy="{h}">Copy</button></span></div>'
                f'<span>{cr(h, tok["color"]["light" if theme=="l" else "dark"]["paper"]):.1f}:1 on paper</span></div>')
    theme_name = {"l": "Light", "d": "Dark"}
    sw += (f'<div class="sw"><div class="chips">{chip("l", L[k], "paper")}{chip("d", D[k], "paper")}</div>'
           f'<div class="info"><b>{k}</b><code>--{k}</code> {esc(roles[k])}</div></div>')
lsw = ""
for lens in ("brand", "money", "venture"):
    for part, suffix in (("panel", ""), ("ring", "-ring"), ("text", "-text")):
        key = lens + suffix
        lh, dh = tok["lens"]["light"][key], tok["lens"]["dark"][key]
        const.append(f"--c-l-lens-{key}:{lh};"); const.append(f"--c-d-lens-{key}:{dh}")
        const[-1] += ";" if not const[-1].endswith(";") else ""
        def lc(theme, h):
            return (f'<div class="chip {on(h)}" style="background:var(--c-{theme}-lens-{key})"><div><b>{theme_name[theme]}</b><br>'
                    f'<span class="hexrow"><code>{h}</code><button class="btn sm" type="button" data-copy="{h}">Copy</button></span></div></div>')
        lsw += f'<div class="sw"><div class="chips">{lc("l", lh)}{lc("d", dh)}</div><div class="info"><b>{lens} {part}</b><code>--lens-{key}</code></div></div>'
for k, v in tok["color"]["logo"].items():
    const.append(f"--c-logo-{k}:{v};")
    lsw += (f'<div class="sw"><div class="chips"><div class="chip {on(v)}" style="grid-column:span 2;background:var(--c-logo-{k})"><span class="hexrow"><code>{v}</code>'
            f'<button class="btn sm" type="button" data-copy="{v}">Copy</button></span></div></div><div class="info"><b>logo {k}</b>Does not change with the theme</div></div>')

contrast = [
 ("#ff4d12 on paper #f7f7f5", "#ff4d12", "#f7f7f5", "passes only for large display type and graphics. Never body or caption text in accent on light."),
 ("#b93408 (accent-ink) on paper", "#b93408", "#f7f7f5", "passes AA for small text."),
 ("#b93408 on white #ffffff", "#b93408", "#ffffff", "passes AA for small text."),
 ("#ff5a1f on dark paper #0e0e0d", "#ff5a1f", "#0e0e0d", "passes for text in dark mode."),
 ("#ff6a33 (dark accent-ink) on #0e0e0d", "#ff6a33", "#0e0e0d", "passes for text in dark mode."),
 ("#121212 (on-accent) on #ff4d12", "#121212", "#ff4d12", "text on orange fills is fine."),
 ("#121212 on paper", "#121212", "#f7f7f5", "body text."),
 ("#5a5a57 (muted) on paper", "#5a5a57", "#f7f7f5", "secondary text."),
 ("#a3a39f (muted dark) on #0e0e0d", "#a3a39f", "#0e0e0d", "secondary text in dark mode."),
]
contrast_html = "".join(f"<li><b>{a}</b>: {cr(f, b):.1f}:1, {esc(n)}</li>" for a, f, b, n in contrast)
contrast_json = [{"pair": a, "ratio": round(cr(f, b), 2), "note": n} for a, f, b, n in contrast]

# logo tiles
def readsvg(path):
    s = open(path).read()
    s = re.sub(r'\s(width|height)="[^"]*"', "", s, count=2)
    return s
logo_files = [
 ("executive-upskill-mark.svg", "Primary. Black square, off-white and orange. Works on any background because it carries its own square.", "l"),
 ("executive-upskill-mark-light.svg", "Paper square, ink EXECUTIVE, orange UPSKILL. For dark or photographic areas where a black square would feel heavy.", "d"),
 ("executive-upskill-mark-mono-black.svg", "One color #000000, letters only. Print, stamps, embossing.", "l"),
 ("executive-upskill-mark-mono-white.svg", "One color #ffffff, letters only. Dark or photo backgrounds. Invisible on white.", "d"),
 ("executive-upskill-monogram.svg", "EU monogram in Anton on #0e0e0e. Tabs, avatars, anything under 48px.", "l"),
 ("executive-upskill-wordmark.svg", "Horizontal hero wordmark, ink and #ff4d12, transparent. For light surfaces.", "l"),
 ("executive-upskill-wordmark-dark.svg", "Same on dark surfaces: #f2f2ee and #ff5a1f.", "d"),
]
tiles, logo_rows = "", ""
for f, use, theme in logo_files:
    tiles += (f'<div class="card"><div class="tile {theme}" style="margin-bottom:12px"><div style="width:{"260px" if "wordmark" in f else "140px"};max-width:100%">{readsvg(f"{B}/logo/{f}")}</div></div>'
              f'<h4>{f[:-4]}</h4><p><code>brand/logo/{f}</code></p><p>{esc(use)}</p></div>')
    logo_rows += f"<tr><td><code>brand/logo/{f}</code></td><td>{esc(use)}</td></tr>"
mark_small = readsvg(f"{B}/logo/executive-upskill-mark.svg")

# icons
symbols, grid, phos_rows, seen = "", "", "", set()
for i in icons:
    n = i["lucide"]
    if n not in seen:
        seen.add(n)
        raw = re.sub(r"<!--.*?-->\s*", "", open(f"{B}/icons/svg/{n}.svg").read(), flags=re.S)
        inner = re.search(r">(.*)</svg>", raw, re.S).group(1)
        symbols += f'<symbol id="i-{n}" viewBox="0 0 24 24">{inner}</symbol>'
    live = " live" if i["concept"] == "live-premiere" else ""
    ph = f' (Phosphor {i["phosphorOnSite"]})' if i["phosphorOnSite"] else ""
    grid += (f'<div class="ico{live}"><svg aria-hidden="true"><use href="#i-{n}"/></svg><div><b>{i["concept"]}</b>'
             f'<span>{n}{ph}</span><br><span>{esc(i["usage"])}</span></div></div>')
    if i["phosphorOnSite"]:
        phos_rows += f'<tr><td>{i["phosphorOnSite"]}</td><td>{n}</td></tr>'

# assets
groups = {"profile": "Profile picture", "banners": "Banner", "social": "Share card", "email": "Email header", "video": "Video", "slides": "Slide master"}
uses = {
 "profile-1080": "Instagram, TikTok and LinkedIn page profile picture. Letters sit inside the inscribed circle.",
 "profile-800": "YouTube channel profile picture. Same art, circle-safe.",
 "youtube-banner-2560x1440": "YouTube channel art. Key content inside the 1546 x 423 safe area.",
 "youtube-banner-2560x1440-safe-area-guide": "Same banner with the safe area marked. Reference only, do not upload.",
 "linkedin-cover-1128x191": "LinkedIn page cover. Left 300px stays clear for the page logo.",
 "x-header-1500x500": "X header. Content sits right of center, clear of the avatar.",
 "og-share-card-1200x630": "Open Graph and share card. Palette colors only.",
 "email-header-1200x300": "Email header at 2x (shows at 600 x 150).",
 "lower-third-james": "Lower third, James Christopher, host and moderator, Brand lens. Transparent PNG.",
 "lower-third-greg": "Lower third, Greg Fisher, co-host, AI and finance lens. Transparent PNG.",
 "lower-third-bryce": "Lower third, Bryce Gilleland, co-host, Venture lens. Transparent PNG.",
 "title-card-1920x1080": "Video title card with the premiere episode title and date.",
 "end-card-1920x1080": "End card: Subscribe and the five platform names with handles.",
 "slide-title-light-1920x1080": "Title slide background, light.", "slide-title-dark-1920x1080": "Title slide background, dark.",
 "slide-content-light-1920x1080": "Content slide background, light.", "slide-content-dark-1920x1080": "Content slide background, dark.",
}
def png_size(p):
    d = open(p, "rb").read(24); return struct.unpack(">II", d[16:24])
assets, asset_rows = [], ""
for g in groups:
    for p in sorted(glob.glob(f"{B}/assets/{g}/*.png")):
        name = os.path.basename(p)[:-4]; w, h = png_size(p); rel = f"brand/assets/{g}/{name}"
        assets.append({"group": g, "svg": rel + ".svg", "png": rel + ".png", "width": w, "height": h, "use": uses.get(name, "")})
        asset_rows += f"<tr><td><code>{rel}.svg</code><br><code>{rel}.png</code></td><td>{w} x {h}</td><td>{esc(uses.get(name, ''))}</td></tr>"

# open questions from README
readme = open(f"{B}/README.md").read()
oq = readme.split("## Open questions", 1)[1]
oq = re.findall(r"^\d+\.\s+(.*)$", oq, re.M)
oq_plain = [re.sub(r"\*\*", "", q) for q in oq]
oq_html = "".join("<li>" + re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", esc(q).replace("&#x27;", "'")) + "</li>" for q in oq)

banned = [l.strip() for l in open(os.path.expanduser("~/.claude/standards/anti-ai-banned.txt")) if l.strip() and not l.startswith("#")]

agent_rules = [
 "Use only the logo files in brand/logo. Never retype the name in a font, recolor it, add effects, or stretch the square.",
 "Respect clear space (9% of mark width) and minimum sizes: mark 32 px, monogram under 48 px, wordmark 120 px.",
 "Colors come from brand/tokens/tokens.json. Web, email and slides default to light. Use dark only when asked.",
 "Small text in the accent color uses accent-ink (#b93408 light, #ff6a33 dark). #ff4d12 is for fills, icons and display type.",
 "Headlines use the display cut: Archivo wdth 62, weight 900, uppercase, -0.01em, line-height 0.88. Body is Geist. Anton only where the width axis is unavailable.",
 "Shapes: cards and panels 16px radius, buttons and chips full pill, inputs 12px. Nothing else.",
 "Icons are Lucide " + LUCIDE + " from brand/icons/svg: 24px grid, 2px stroke (1.75 at 16px), currentColor, round caps. Orange only for live or active state.",
 "Lens colors follow the theme. Brand is orange, Money is concrete, Venture is ink in light and inverts in dark.",
 "Use real copy only: the hero line, the show name, the campaign line, the host names and roles from src/content/hosts.ts, the premiere date Wed Nov 18 2026 11:00 PT.",
 "Never write an em dash, en dash or horizontal bar (U+2014, U+2013, U+2015). Numeric ranges use a hyphen.",
 "Check copy against voice.bannedTerms. No antithesis frames, no semicolons in copy, no hedging, no recap closers.",
 "No eyebrow or kicker labels above headings. Copy fills its container width: size the container, not the paragraph.",
 "Share cards use palette colors only. Do not use #161618.",
 "Channel handles: YouTube @ExecutiveUpskill, Instagram @exec.upskill, TikTok @execupskill, LinkedIn page Executive Upskill.",
 "Lens-test takes are drafts and episode titles are working titles. Quote them with care.",
 "Motion uses cubic-bezier(0.16, 1, 0.3, 1) and switches off under prefers-reduced-motion.",
 "Regenerate assets with brand/scripts/build-all.sh instead of editing SVG or PNG files by hand.",
 "Treat the open questions as undecided. Do not settle them inside a deliverable.",
]

spec = {
 "name": "Executive Upskill", "site": "https://executiveupskill.live",
 "positioning": {
  "what": "A live video podcast. Three operators argue one AI decision at a time from the brand, finance and venture seats.",
  "audience": "Executives and operators deciding about AI: marketing and brand leaders, finance leaders, founders and investors.",
  "campaignLine": "One question. Three lenses.",
  "heroLine": "Three operators talk AI, business and brand from the seats they've held. Live on YouTube, clipped for your feed.",
  "premiere": {"date": "2026-11-18T11:00:00-08:00", "display": "Wed Nov 18, 11:00 PT", "platform": "YouTube Live", "minutes": 90, "episode": "Your 2027 AI Budget, Argued Three Ways"},
  "lenses": [
   {"id": "brand", "host": "James Christopher", "role": "Host and moderator", "label": "Brand lens", "headline": "Brand meets the bot", "asksFirst": "Who's the human in this loop, and can they say no?"},
   {"id": "money", "host": "Greg Fisher", "role": "Co-host", "label": "AI and finance lens", "headline": "Make the AI pay", "asksFirst": "Which line on the P&L moves, and when?"},
   {"id": "venture", "host": "Bryce Gilleland", "role": "Co-host", "label": "Venture lens", "headline": "Bet before consensus", "asksFirst": "If this works, who keeps the money?"}],
  "channels": {"youtube": "@ExecutiveUpskill", "shorts": "@ExecutiveUpskill", "instagram": "@exec.upskill", "tiktok": "@execupskill", "linkedin": "Executive Upskill"}},
 "tokens": tok,
 "fonts": tok["font"],
 "logo": {"files": [{"path": f"brand/logo/{f}", "use": u} for f, u, _ in logo_files], "pngDir": "brand/logo/png",
          "clearSpace": "9% of mark width on every side. Wordmark: cap height of the letter L.",
          "minimumSize": {"mark": "32 px screen, 12 mm print", "monogram": "use below 48 px", "wordmark": "120 px"},
          "darkEdge": "2-unit stroke, rgb(255 255 255 / 0.16) around the square on dark surfaces"},
 "icons": {"library": "lucide-static", "version": LUCIDE, "license": "brand/icons/LICENSE (ISC)", "svgDir": "brand/icons/svg", "pngDir": "brand/icons/png",
           "rules": {"grid": "24px", "stroke": "2px (1.75 at 16px)", "color": "currentColor", "caps": "round", "accent": "orange only for live or active state"},
           "map": icons},
 "assets": assets,
 "voice": {"summary": "Direct, specific, second person, takes a side, never hype.",
           "rules": ["No em dash, en dash or horizontal bar", "No banned terms", "No antithesis frames", "No semicolons in copy", "No eyebrow labels above headings", "Vary sentence length", "Contractions are normal"],
           "wordsWeUse": ["operators", "seats", "lens", "argue", "call", "live", "clip", "pilot", "P&L", "margin", "moat", "review gate", "human in the loop", "decision", "argued three ways"],
           "callsToAction": ["Get premiere alerts", "Know when we go live", "Set YouTube reminder", "Subscribe on YouTube", "Watch Shorts", "Follow on Instagram", "Follow on TikTok", "Follow on LinkedIn", "Send my question", "Pitch a founder worth arguing with", "Meet the hosts", "Join Season 1", "Pull up a chair"],
           "bannedTermsSource": "~/.claude/standards/anti-ai-banned.txt", "bannedTerms": banned},
 "contrast": contrast_json,
 "agentRules": agent_rules,
 "openQuestions": oq_plain,
}
js = json.dumps(spec, indent=2, ensure_ascii=False)
open(f"{B}/brand.json", "w").write(js + "\n")
embedded = json.dumps(spec, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")

tabs_ids = ["overview", "logo", "color", "type", "icons", "visual", "voice", "assets", "agents"]
tabs = "".join(f'<button class="tab" role="tab" type="button" id="tab-{t}" data-tab="{t}" aria-controls="panel-{t}" aria-selected="{"true" if t=="overview" else "false"}" tabindex="{0 if t=="overview" else -1}">{t}</button>' for t in tabs_ids)

t = open(f"{HERE}/guide.template.html").read()
rep = {"CONST_COLORS": "\n".join(const), "ICON_SYMBOLS": symbols, "LOGO_MARK_SMALL": mark_small, "TABS": tabs, "OPEN_QUESTIONS": oq_html,
       "LOGO_TILES": tiles, "SWATCHES": sw, "LENS_SWATCHES": lsw, "CONTRAST_RULES": contrast_html, "LUCIDE_VERSION": LUCIDE,
       "ICON_GRID": grid, "PHOSPHOR_ROWS": phos_rows, "ASSET_ROWS": asset_rows, "LOGO_ROWS": logo_rows,
       "AGENT_RULES": "".join(f"<li>{esc(r)}</li>" for r in agent_rules), "BRAND_JSON": embedded}
for k, v in rep.items(): t = t.replace("{{" + k + "}}", v)
assert "{{" not in t, re.findall(r"\{\{\w+\}\}", t)
open(f"{B}/guide.html", "w").write(t)
print("guide.html", len(t.encode()), "bytes; brand.json", len(js.encode()))

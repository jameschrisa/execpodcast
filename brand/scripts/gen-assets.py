#!/usr/bin/env python3
"""Generate the Executive Upskill brand assets (profile pictures, banners,
share card, email header, video overlays, slide masters) as SVG with outlined
text. PNGs are rendered afterwards by render-svg.mjs (see build-all.sh).

Usage:
  python3 gen-assets.py ARCHIVO_VF_TTF ANTON_TTF GEIST_REGULAR_TTF GEIST_BOLD_TTF BRAND_DIR
Needs: pip install fonttools uharfbuzz
Geist TTFs ship in the npm package `geist` (dist/fonts/geist-sans). Logo paths
are read from BRAND_DIR/logo/*.svg and icons from BRAND_DIR/icons/svg.
"""
import sys, os, io, re
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
import uharfbuzz as hb

archivo_p, anton_p, geist_p, geistb_p, BRAND = sys.argv[1:6]
OUT = os.path.join(BRAND, "assets")

# ---------- palette (tokens.json) ----------
PAPER, RAISED, INK, INKSOFT, MUTED, LINE = "#f7f7f5", "#ffffff", "#121212", "#2a2a28", "#5a5a57", "#e2e2dd"
ACCENT, ACCENT_INK = "#ff4d12", "#b93408"
LBLACK, LWHITE = "#0e0e0e", "#f2f2ee"
DPAPER, DSOFT, DLINE = "#0e0e0d", "#d6d6d1", "#2a2a28"
LENS = {  # label, panel, ring, text  (on dark surfaces: the dark-theme money and venture panels)
    "brand":   ("BRAND LENS",          "#ff4d12", "#e03c05", "#121212"),
    "money":   ("AI AND FINANCE LENS", "#262724", "#3a3b37", "#f2f2ee"),
    "venture": ("VENTURE LENS",        "#f2f2ee", "#d6d6d1", "#121212"),
}
LENS_LIGHT = {  # panels on a paper surface (light theme values)
    "brand":   ("#ff4d12", "#e03c05", "#121212"),
    "money":   ("#d9dad5", "#bdbfb8", "#121212"),
    "venture": ("#151515", "#343432", "#f2f2ee"),
}
EASE = "cubic-bezier(0.16, 1, 0.3, 1)"

# ---------- fonts ----------
class Face:
    def __init__(self, font, data):
        self.font, self.data = font, data
        self.gs = font.getGlyphSet(); self.order = font.getGlyphOrder()
        self.upem = font["head"].unitsPerEm
        self.hbfont = hb.Font(hb.Face(data))
        self.cmap = font.getBestCmap()
    def shape(self, text):
        b = hb.Buffer(); b.add_str(text); b.guess_segment_properties()
        hb.shape(self.hbfont, b, {"kern": True, "liga": False})
        return [(self.order[i.codepoint], p.x_advance, p.x_offset, p.y_offset) for i, p in zip(b.glyph_infos, b.glyph_positions)]

vf = TTFont(archivo_p)
inst = instancer.instantiateVariableFont(vf, {"wdth": 62, "wght": 900})
buf = io.BytesIO(); inst.save(buf)
DISPLAY = Face(TTFont(io.BytesIO(buf.getvalue())), buf.getvalue())
ANTON = Face(TTFont(anton_p), open(anton_p, "rb").read())
BODY = Face(TTFont(geist_p), open(geist_p, "rb").read())
BOLD = Face(TTFont(geistb_p), open(geistb_p, "rb").read())

def _num(v): return ("%.3f" % v).rstrip("0").rstrip(".")

def text(face, s, x, y, size, fill, anchor="l", ls=0.0, ws=0.0, upper=False, opacity=None):
    """Outlined text. ls and ws are em fractions (letter-spacing, word-spacing)."""
    if upper: s = s.upper()
    run = face.shape(s); k = size / face.upem
    pen = SVGPathPen(face.gs, ntos=_num)
    advs = []
    for (name, adv, xo, yo), ch in zip(run, s):
        a = adv * k + ls * size + (ws * size if ch == " " else 0)
        advs.append(a)
    width = sum(advs) - ls * size
    x0 = x - (width / 2 if anchor == "m" else width if anchor == "r" else 0)
    cx = 0.0
    for (name, adv, xo, yo), a in zip(run, advs):
        face.gs[name].draw(TransformPen(pen, (k, 0, 0, -k, x0 + cx + xo * k, y - yo * k)))
        cx += a
    op = f' fill-opacity="{opacity}"' if opacity is not None else ""
    return f'<path fill="{fill}"{op} d="{pen.getCommands()}"/>', width

def width_of(face, s, size, ls=0.0, ws=0.0, upper=False):
    return text(face, s, 0, 0, size, "#000", ls=ls, ws=ws, upper=upper)[1]

def disp(s, x, y, size, fill, anchor="l"):
    """Display cut: Archivo wdth 62 / 900, uppercase, -0.01em, word-spacing 0.06em."""
    return text(DISPLAY, s, x, y, size, fill, anchor, ls=-0.01, ws=0.06, upper=True)

CAP = 0.70  # Archivo cap height in em

def fit_disp(s, width):
    return width / width_of(DISPLAY, s, 1.0, ls=-0.01, ws=0.06, upper=True)

# ---------- logo pieces (read from the committed logo SVGs) ----------
def logo_paths(name):
    s = open(os.path.join(BRAND, "logo", name)).read()
    return re.findall(r'<path fill="[^"]+" d="([^"]+)"', s)
M_EX, M_UP = logo_paths("executive-upskill-mark.svg")
W_EX, W_UP = logo_paths("executive-upskill-wordmark.svg")
WM_W, WM_H = 715.4, 74.0
STACK_TOP, STACK_H = 31.943, 36.5   # text block of the square mark, in its 100-unit space

def mark(x, y, size, bg=LBLACK, c1=LWHITE, c2=ACCENT):
    s = size / 100
    r = f'<rect width="100" height="100" fill="{bg}"/>' if bg else ""
    return f'<g transform="translate({_num(x)} {_num(y)}) scale({s:.5f})">{r}<path fill="{c1}" d="{M_EX}"/><path fill="{c2}" d="{M_UP}"/></g>'

def stack(x, y, w, c1=LWHITE, c2=ACCENT):
    """EXECUTIVE over UPSKILL, both w wide, without the square. (x, y) = top-left of the text block. Returns (svg, height)."""
    s = w / 82
    return (f'<g transform="translate({_num(x - 9 * s)} {_num(y - STACK_TOP * s)}) scale({s:.5f})">'
            f'<path fill="{c1}" d="{M_EX}"/><path fill="{c2}" d="{M_UP}"/></g>'), STACK_H * s

def wordmark(x, cy, w, c1=LWHITE, c2=ACCENT, anchor="l"):
    """Horizontal wordmark, w wide, vertically centred on cy (cap-height centre). Returns (svg, cap height)."""
    s = w / WM_W
    if anchor == "m": x -= w / 2
    if anchor == "r": x -= w
    return (f'<g transform="translate({_num(x)} {_num(cy - 37.6 * s)}) scale({s:.5f})">'
            f'<path fill="{c1}" d="{W_EX}"/><path fill="{c2}" d="{W_UP}"/></g>'), 68.8 * s

# ---------- icons (Lucide, from brand/icons/svg) ----------
def icon(name, x, y, size, color, sw=2):
    raw = open(os.path.join(BRAND, "icons", "svg", name + ".svg")).read()
    inner = re.search(r">(.*)</svg>", re.sub(r"<!--.*?-->\s*", "", raw, flags=re.S), re.S).group(1)
    s = size / 24
    return (f'<g transform="translate({_num(x)} {_num(y)}) scale({s:.4f})" fill="none" stroke="{color}" stroke-width="{sw}" '
            f'stroke-linecap="round" stroke-linejoin="round">{inner}</g>')

# ---------- shapes ----------
def rect(x, y, w, h, fill, rx=0, stroke=None, sw=0, opacity=None):
    st = f' stroke="{stroke}" stroke-width="{sw}"' if stroke else ""
    op = f' fill-opacity="{opacity}"' if opacity is not None else ""
    return f'<rect x="{_num(x)}" y="{_num(y)}" width="{_num(w)}" height="{_num(h)}" rx="{_num(rx)}" fill="{fill}"{op}{st}/>'

def pill(x, y, h, label, bg, fg, ring=None, size=None, pad=None):
    """Full pill with bold uppercase tracked label. Returns (svg, width)."""
    size = size or h * 0.36; pad = pad if pad is not None else h * 0.5
    tw = width_of(BOLD, label, size, ls=0.08)
    w = tw + 2 * pad
    t, _ = text(BOLD, label, x + pad, y + h / 2 + size * 0.36, size, fg, ls=0.08)
    ringsvg = rect(x + 1, y + 1, w - 2, h - 2, bg, rx=(h - 2) / 2, stroke=ring, sw=2) if ring else rect(x, y, w, h, bg, rx=h / 2)
    return ringsvg + t, w

GRAIN = ('<filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.9" '
         'numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>')
def grain(w, h, op=0.05):
    return f'<rect width="{w}" height="{h}" filter="url(#grain)" opacity="{op}"/>'

def svg(w, h, body, title, defs="", bg=None):
    b = rect(0, 0, w, h, bg) if bg else ""
    d = f"<defs>{defs}</defs>\n" if defs else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" role="img" aria-label="{title}">\n'
            f'<title>{title}</title>\n{d}{b}\n{body}\n</svg>\n')

written = []
def save(group, name, w, h, body, title, defs="", bg=None):
    d = os.path.join(OUT, group); os.makedirs(d, exist_ok=True)
    p = os.path.join(d, name + ".svg")
    open(p, "w").write(svg(w, h, body, title, defs, bg)); written.append(p)

SHOW = "Executive Upskill"
TAG = "One question. Three lenses."
PREM = "Premieres Wed Nov 18, 11:00 PT on YouTube Live"
PREM_SHORT = "Wed Nov 18, 11:00 PT"
HERO_TAIL = "Live on YouTube, clipped for your feed."

# ===================== 1. profile pictures =====================
# Square mark scaled to 90% on the logo black, so every letter sits inside the inscribed circle
# (text corner is 44.8 of 100 units from centre, scaled 0.9 = 40.3, circle radius is 50).
for px, nm in ((1080, "profile-1080"), (800, "profile-800")):
    sz = px * 0.90; off = (px - sz) / 2
    save("profile", nm, px, px, mark(off, off, sz), SHOW, bg=LBLACK)

# ===================== 2. banners =====================
def lens_chips_dark(x, y, h, gap, size=None):
    out, cx = "", x
    for k in ("brand", "money", "venture"):
        lab, bg, ring, fg = LENS[k]
        s, w = pill(cx, y, h, lab, bg, fg, ring=ring if k == "money" else None, size=size)
        out += s; cx += w + gap
    return out, cx - gap - x

def chips_width(h, gap, size=None):
    tot = 0
    for k in LENS:
        lab = LENS[k][0]; sz = size or h * 0.36
        tot += width_of(BOLD, lab, sz, ls=0.08) + h
    return tot + 2 * gap

# YouTube channel art 2560x1440, safe area 1546x423 centred
W, H = 2560, 1440
sx0, sy0, sw_, sh_ = (W - 1546) // 2, (H - 423) // 2, 1546, 423
cx = W / 2
wm, caph = wordmark(cx, sy0 + 105, 1180, anchor="m")
tag, _ = disp(TAG, cx, sy0 + 105 + 66 + 82 + 0.0, 82, LWHITE, "m")  # baseline
chips_h = 52
cw = chips_width(chips_h, 20)
chips, _ = lens_chips_dark(cx - cw / 2, sy0 + sh_ - chips_h - 6, chips_h, 20)
dateline, _ = text(BODY, f"Live on YouTube. {PREM_SHORT}.", cx, sy0 + 105 + 66 + 82 + 52, 32, DSOFT, "m")
body = wm + tag + dateline + chips + grain(W, H)
save("banners", "youtube-banner-2560x1440", W, H, body, SHOW + " YouTube channel art", GRAIN, bg=LBLACK)
guide = (f'<rect width="{W}" height="{H}" fill="none" stroke="{ACCENT}" stroke-width="6"/>'
         f'<rect x="{sx0}" y="{sy0}" width="{sw_}" height="{sh_}" fill="{ACCENT}" fill-opacity="0.12" stroke="{ACCENT}" stroke-width="6" stroke-dasharray="24 14"/>')
gt, _ = text(BOLD, "SAFE AREA 1546 x 423 (all devices)", sx0 + 16, sy0 - 18, 30, ACCENT, ls=0.08)
gt2, _ = text(BOLD, "FULL CANVAS 2560 x 1440 (TV)", 16, 52, 30, ACCENT, ls=0.08)
save("banners", "youtube-banner-2560x1440-safe-area-guide", W, H, body + guide + gt + gt2, SHOW + " YouTube banner with safe area marked", GRAIN, bg=LBLACK)

# LinkedIn cover 1128x191: the page logo overlaps the lower left, so content starts at x=300
W, H = 1128, 191
wm, _ = wordmark(300, 66, 520)
tag, _ = disp(TAG, 300, 146, 46, LWHITE)
dt, _ = text(BODY, PREM_SHORT, W - 48, 96, 24, DSOFT, "r")
dt2, _ = text(BODY, "Live on YouTube", W - 48, 66, 24, LWHITE, "r")
body = wm + tag + dt2 + dt + rect(0, H - 8, W / 3, 8, LENS["brand"][1]) + rect(W / 3, H - 8, W / 3, 8, "#d9dad5") + rect(2 * W / 3, H - 8, W / 3, 8, LWHITE) + grain(W, H)
save("banners", "linkedin-cover-1128x191", W, H, body, SHOW + " LinkedIn cover", GRAIN, bg=LBLACK)

# X / Twitter header 1500x500: avatar overlaps lower left, so content is centred right of x=300
W, H = 1500, 500
cx = 880
wm, _ = wordmark(cx, 165, 760, anchor="m")
tag, _ = disp(TAG, cx, 165 + 56 + 88, 88, LWHITE, "m")
dt, _ = text(BODY, f"Live on YouTube. {PREM_SHORT}.", cx, 165 + 56 + 88 + 52, 30, DSOFT, "m")
body = wm + tag + dt + grain(W, H)
save("banners", "x-header-1500x500", W, H, body, SHOW + " X header", GRAIN, bg=LBLACK)

# ===================== 3. share card 1200x630 (palette only, light) =====================
W, H = 1200, 630
st, sth = stack(72, 88, 560, INK, ACCENT)
tag, _ = disp(TAG, 72, 88 + sth + 74, 44, INK)
prem, _ = text(BODY, PREM, 72, 88 + sth + 74 + 56, 26, INKSOFT)
panels, py = "", 72
for k, (nm, lab) in zip(("brand", "money", "venture"), (("James Christopher", "Brand"), ("Greg Fisher", "AI and finance"), ("Bryce Gilleland", "Venture"))):
    bg_, ring, fg = LENS_LIGHT[k]
    panels += rect(676, py, 452, 152, bg_, rx=16) + rect(676 + 6, py + 6, 452 - 12, 152 - 12, "none", rx=12, stroke=ring, sw=2)
    n_, _ = disp(nm, 676 + 34, py + 34 + 44 * CAP + 2, 44, fg)
    l_, _ = text(BOLD, lab.upper() + " LENS", 676 + 34, py + 118, 17, fg, ls=0.08)
    panels += n_ + l_; py += 152 + 21
body = st + tag + prem + panels
save("social", "og-share-card-1200x630", W, H, body, SHOW + " share card", bg=PAPER)

# ===================== 4. email header 1200x300 =====================
W, H = 1200, 300
wm, _ = wordmark(72, 112, 740, INK, ACCENT)
tg, _ = text(BODY, TAG, 72, 222, 34, INKSOFT)
dt, _ = text(BODY, f"Live on YouTube. {PREM_SHORT}.", W - 72, 222, 26, MUTED, "r")
body = wm + tg + dt + rect(0, H - 2, W, 2, LINE)
save("email", "email-header-1200x300", W, H, body, SHOW + " email header", bg=PAPER)

# ===================== 5. video =====================
VW, VH = 1920, 1080
HOSTS = [  # src/content/hosts.ts
    ("james", "James Christopher", "Host and moderator", "brand"),
    ("greg", "Greg Fisher", "Co-host", "money"),
    ("bryce", "Bryce Gilleland", "Co-host", "venture"),
]
for hid, name, role, lens in HOSTS:
    lab, bg_, ring, fg = LENS[lens]
    nsize = 68
    nw = width_of(DISPLAY, name, nsize, ls=-0.01, ws=0.06, upper=True)
    rsize = 28
    rw = width_of(BODY, role, rsize)
    ch = 44
    chip_probe = pill(0, 0, ch, lab, bg_, fg)[1]
    row_w = chip_probe + 20 + rw
    pad_x, pad_t, pad_b = 44, 38, 34
    bw = max(nw, row_w) + 2 * pad_x
    bh = pad_t + nsize * CAP + 28 + ch + pad_b
    bx, by = 96, VH - 96 - bh
    body = rect(bx, by, bw, bh, DPAPER, rx=16, opacity=0.9)
    n_, _ = disp(name, bx + pad_x, by + pad_t + nsize * CAP, nsize, LWHITE)
    ry = by + pad_t + nsize * CAP + 28
    p_, pw_ = pill(bx + pad_x, ry, ch, lab, bg_, fg, ring=ring if lens == "money" else None)
    r_, _ = text(BODY, role, bx + pad_x + pw_ + 20, ry + ch / 2 + rsize * 0.35, rsize, DSOFT)
    save("video", f"lower-third-{hid}", VW, VH, body + n_ + p_ + r_, f"Lower third, {name}")

# title card (premiere episode title from src/content/show.ts)
wm, _ = wordmark(120, 150, 560)
ep1, _ = disp("Your 2027 AI Budget,", 120, 430, 190, LWHITE)
ep2, _ = disp("Argued Three Ways", 120, 430 + 176, 190, ACCENT)
dt, _ = text(BODY, PREM, 120, 760, 40, DSOFT)
cw = chips_width(56, 24)
chips, _ = lens_chips_dark(120, 880, 56, 24)
body = wm + ep1 + ep2 + dt + chips + grain(VW, VH)
save("video", "title-card-1920x1080", VW, VH, body, SHOW + " title card", GRAIN, bg=LBLACK)

# end card
sub, sw2 = disp("Subscribe", 120, 120 + 230 * CAP + 20, 230, ACCENT)
tl, _ = text(BODY, HERO_TAIL, 120, 470, 40, LWHITE)
rows, ry = "", 560
for ic, label, handle in (("youtube", "YouTube Live", "@ExecutiveUpskill"), ("youtube", "YouTube Shorts", "@ExecutiveUpskill"),
                          ("instagram", "Instagram", "@exec.upskill"), ("music-2", "TikTok", "@execupskill"),
                          ("linkedin", "LinkedIn", "Executive Upskill")):
    rows += icon(ic, 120, ry - 4, 44, LWHITE, 1.75)
    l_, lw_ = text(BOLD, label, 188, ry + 30, 34, LWHITE)
    h_, _ = text(BODY, handle, 188 + 330, ry + 30, 34, DSOFT)
    rows += l_ + h_; ry += 80
mk = mark(1920 - 120 - 520, 1080 - 120 - 520, 520)
save("video", "end-card-1920x1080", VW, VH, sub + tl + rows + mk + grain(VW, VH), SHOW + " end card", GRAIN, bg=LBLACK)

# ===================== 6. slide masters 1920x1080 =====================
def footer(y, fg, line, themed_bg):
    t, _ = text(BODY, "executiveupskill.live", 96, y + 52, 22, fg)
    r, _ = text(BODY, TAG, VW - 96, y + 52, 22, fg, "r")
    return rect(96, y, VW - 192, 2, line) + t + r
for variant, bg_, ink, soft, line, c1, c2 in (("light", PAPER, INK, MUTED, LINE, INK, ACCENT), ("dark", DPAPER, LWHITE, "#a3a39f", DLINE, LWHITE, "#ff5a1f")):
    # title slide: square mark top-left, lens strip along the bottom
    strip_c = ("#ff4d12", "#d9dad5", "#151515") if variant == "light" else ("#ff5a1f", "#262724", "#f2f2ee")
    sw3 = VW / 3
    body = mark(96, 96, 200, bg=LBLACK) + footer(930, soft, line, bg_)
    body += rect(0, VH - 24, sw3, 24, strip_c[0]) + rect(sw3, VH - 24, sw3, 24, strip_c[1]) + rect(2 * sw3, VH - 24, sw3, 24, strip_c[2])
    save("slides", f"slide-title-{variant}-1920x1080", VW, VH, body, f"{SHOW} title slide, {variant}", bg=bg_)
    # content slide: wordmark top-left, hairline under it, footer
    wm, _ = wordmark(96, 96, 300, c1, c2)
    body = wm + rect(96, 150, VW - 192, 2, line) + footer(980, soft, line, bg_)
    save("slides", f"slide-content-{variant}-1920x1080", VW, VH, body, f"{SHOW} content slide, {variant}", bg=bg_)

# manifest for build-all.sh
open(os.path.join(OUT, ".jobs"), "w").write("\n".join(written) + "\n")
print("wrote", len(written), "svg files")

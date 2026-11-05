#!/usr/bin/env python3
"""Regenerate the Executive Upskill logo SVGs as outlined paths (no <text>).

Usage:
  python3 build-logo.py ARCHIVO_VARIABLE_TTF ANTON_TTF OUT_DIR

Needs: pip install fonttools uharfbuzz
ARCHIVO_VARIABLE_TTF is Archivo[wdth,wght].ttf from github.com/google/fonts (ofl/archivo).
ANTON_TTF is src/assets/Anton-Regular.ttf in the site repo.
"""
import sys, os, io
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
import uharfbuzz as hb

archivo_path, anton_path, out = sys.argv[1:4]
os.makedirs(out, exist_ok=True)

# Archivo at the site's display cut: wdth 62, weight 900
vf = TTFont(archivo_path)
inst = instancer.instantiateVariableFont(vf, {"wdth": 62, "wght": 900})
buf = io.BytesIO(); inst.save(buf); archivo_bytes = buf.getvalue()
archivo = TTFont(io.BytesIO(archivo_bytes))
anton = TTFont(anton_path)
anton_bytes = open(anton_path, "rb").read()

def shape(font, data, text):
    face = hb.Face(data); f = hb.Font(face)
    b = hb.Buffer(); b.add_str(text); b.guess_segment_properties()
    hb.shape(f, b, {"kern": True, "liga": False})
    order = font.getGlyphOrder()
    return [(order[i.codepoint], p.x_advance, p.x_offset, p.y_offset) for i, p in zip(b.glyph_infos, b.glyph_positions)]

def outline(font, data, text, x, y, size, width=None, spacing=0.0):
    """Path data for `text` with left edge x, baseline y, font size `size`.
    If width is given, glyphs and spacing are stretched horizontally so the
    total advance equals width (SVG textLength + spacingAndGlyphs).
    spacing is extra em-fraction added after every glyph (CSS letter-spacing)."""
    upem = font["head"].unitsPerEm
    gs = font.getGlyphSet()
    run = shape(font, data, text)
    k = size / upem
    nat = sum(a for _, a, _, _ in run) * k + spacing * size * len(run)
    sx = (width / nat) if width else 1.0
    pen = SVGPathPen(gs, ntos=lambda v: ("%.3f" % v).rstrip("0").rstrip("."))
    cx = 0.0
    for name, adv, xo, yo in run:
        t = (k * sx, 0, 0, -k, x + (cx + xo * k) * sx, y - yo * k)
        gs[name].draw(TransformPen(pen, t))
        cx += adv * k + spacing * size
    return pen.getCommands(), nat * sx, nat

def svg(w, h, body, title, vb=None):
    vb = vb or f"0 0 {w} {h}"
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" width="{w}" height="{h}" role="img" aria-label="{title}">\n'
            f'<title>{title}</title>\n{body}</svg>\n')

def write(name, s):
    open(os.path.join(out, name), "w").write(s); print("wrote", name)

# ---- square mark (geometry from Logo.tsx) ----
ex, exw, exn = outline(archivo, archivo_bytes, "EXECUTIVE", 9, 45.6, 19.85, 82)
up, upw, upn = outline(archivo, archivo_bytes, "UPSKILL", 9, 68.35, 26.5, 82)
print("natural widths (units): EXECUTIVE %.2f UPSKILL %.2f (site comment says 81.99 / 82.0)" % (exn, upn))

def mark(bg, c1, c2, name, label):
    rect = f'<rect width="100" height="100" fill="{bg}"/>\n' if bg else ""
    body = rect + f'<path fill="{c1}" d="{ex}"/>\n<path fill="{c2}" d="{up}"/>\n'
    write(name, svg(100, 100, body, label))

mark("#0e0e0e", "#f2f2ee", "#ff4d12", "executive-upskill-mark.svg", "Executive Upskill")
mark("#f7f7f5", "#121212", "#ff4d12", "executive-upskill-mark-light.svg", "Executive Upskill")
# mono: letters only on transparent background, one color
for col, nm in (("#000000", "black"), ("#ffffff", "white")):
    body = f'<path fill="{col}" d="{ex}"/>\n<path fill="{col}" d="{up}"/>\n'
    write(f"executive-upskill-mark-mono-{nm}.svg", svg(100, 100, body, "Executive Upskill"))

# ---- monogram (icon.tsx: 64px, Anton 44px, letter-spacing -1px, centered) ----
S = 64; fs = 44
upem = anton["head"].unitsPerEm
gs = anton.getGlyphSet(); cmap = anton.getBestCmap()
adv = lambda ch: gs[cmap[ord(ch)]].width * fs / upem
total = adv("E") + adv("U") - 2  # two letters, -1px spacing after each
x0 = (S - total) / 2
# vertical: flex centres the line box. Line height normal = (asc+desc+gap)/upem * fs
hh = anton["hhea"]; lh = (hh.ascent - hh.descent + hh.lineGap) * fs / upem
base = (S - lh) / 2 + hh.ascent * fs / upem
e, _, _ = outline(anton, anton_bytes, "E", x0, base, fs)
u, _, _ = outline(anton, anton_bytes, "U", x0 + adv("E") - 1, base, fs)
body = f'<rect width="64" height="64" fill="#0e0e0e"/>\n<path fill="#f2f2ee" d="{e}"/>\n<path fill="#ff4d12" d="{u}"/>\n'
write("executive-upskill-monogram.svg", svg(64, 64, body, "Executive Upskill monogram"))

# ---- horizontal wordmark (hero Wordmark.tsx) ----
# One line, display cut, letter-spacing -0.01em on every letter (each letter is its own
# span so there is no kerning), 0.08em gap before UPSKILL. Em units, size 100 -> 1 unit = 0.01em.
SZ = 100
def run_nokern(text, x, color):
    upem_ = archivo["head"].unitsPerEm
    gs_ = archivo.getGlyphSet(); cm = archivo.getBestCmap(); k = SZ / upem_
    pen = SVGPathPen(gs_, ntos=lambda v: ("%.3f" % v).rstrip("0").rstrip("."))
    for ch in text:
        g = cm[ord(ch)]
        gs_[g].draw(TransformPen(pen, (k, 0, 0, -k, x, ASC)))
        x += gs_[g].width * k - 0.01 * SZ
    return pen.getCommands(), x
ASC = 72  # baseline; cap height is 0.70em, 2 units of room above and below for round-letter overshoot
w1, x1 = run_nokern("EXECUTIVE", 0, "")
w2, x2 = run_nokern("UPSKILL", x1 + 0.08 * SZ, "")
W = x2 + 0.01 * SZ  # drop trailing spacing
print("wordmark em-width: %.3f (site --wordmark-em default 7.17)" % (W / SZ))
H = 74
def wm(c1, c2, name, bg=None):
    r = f'<rect width="{W:.2f}" height="{H}" fill="{bg}"/>\n' if bg else ""
    write(name, svg(round(W, 2), H, r + f'<path fill="{c1}" d="{w1}"/>\n<path fill="{c2}" d="{w2}"/>\n', "Executive Upskill"))
wm("#121212", "#ff4d12", "executive-upskill-wordmark.svg")
wm("#f2f2ee", "#ff5a1f", "executive-upskill-wordmark-dark.svg")

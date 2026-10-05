"""Builds public/photos/call-gallery.jpg: the three webcam frames as a video-call
gallery (two on top, one below), with name tags. Run after scripts/retouch.py and
scripts/real-photos.py; a host's real webcam frame wins over the generated one.

    python3 scripts/call-composite.py
"""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
STUDIO = ROOT / "public" / "photos"

W, H = 1920, 1080
TILE_W, TILE_H, GAP = 900, 506, 24
BG = (22, 22, 24)
ACCENT = (255, 77, 18)

tiles = [
    ("james-cam", "James Christopher", (W // 2 - TILE_W - GAP // 2, 22)),
    ("greg-cam", "Greg Fisher", (W // 2 + GAP // 2, 22)),
    ("bryce-cam", "Bryce Gilleland", ((W - TILE_W) // 2, 22 + TILE_H + GAP)),
]


def font(size: int):
    for path in ["/System/Library/Fonts/SFNS.ttf", "/System/Library/Fonts/Helvetica.ttc"]:
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            continue
    return ImageFont.load_default()


def rounded(img: Image.Image, radius: int) -> Image.Image:
    mask = Image.new("L", img.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, img.width - 1, img.height - 1], radius, fill=255)
    out = Image.new("RGBA", img.size)
    out.paste(img, (0, 0), mask)
    return out


canvas = Image.new("RGB", (W, H), BG)
label_font = font(26)
for i, (name, label, (x, y)) in enumerate(tiles):
    real = STUDIO / f"{name}-real.jpg"
    frame = Image.open(real if real.exists() else STUDIO / f"{name}.jpg").convert("RGB")
    frame = frame.resize((TILE_W, int(frame.height * TILE_W / frame.width)), Image.LANCZOS)
    top = max(0, (frame.height - TILE_H) // 2)
    frame = frame.crop((0, top, TILE_W, top + TILE_H))
    tile = rounded(frame, 18)
    canvas.paste(tile, (x, y), tile)
    d = ImageDraw.Draw(canvas, "RGBA")
    if i == 0:  # active speaker ring
        d.rounded_rectangle([x - 3, y - 3, x + TILE_W + 2, y + TILE_H + 2], 21, outline=ACCENT, width=5)
    tw = d.textlength(label, font=label_font)
    d.rounded_rectangle([x + 16, y + TILE_H - 58, x + 16 + tw + 32, y + TILE_H - 16], 10, fill=(0, 0, 0, 150))
    d.text((x + 32, y + TILE_H - 52), label, font=label_font, fill=(242, 242, 238))

canvas.save(STUDIO / "call-gallery.jpg", quality=86, optimize=True, progressive=True)
print("wrote", STUDIO / "call-gallery.jpg")

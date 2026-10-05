"""Crops real host photos (references/real/<host>/) into the site's image slots.

    python3 scripts/real-photos.py

Real photos are used as shot: crop and resize only, no retouch or grade.
Output names carry a "-real" suffix so browsers and the image optimizer don't
serve the old generated files from cache.

Slots:
  card    4:5 portrait   hero card at rest (optional; falls back to talk)
  talk    4:5 portrait   hero card when no card shot, hosts section hover
  laugh   4:5 portrait   hosts section portrait
  avatar  1:1 face crop  lens panels, lens test bubbles, host tabs
  cam     16:9 webcam    video-call section and call composite
"""

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
REAL = ROOT / "references" / "real"
OUT = ROOT / "public" / "photos"

# host -> slot -> (source file, crop box (left, top, right, bottom), output size or None)
CROPS = {
    "james": {
        "card": ("card.webp", (130, 0, 1133, 1254), None),
        "talk": ("interview.webp", (385, 0, 1138, 941), None),
        "laugh": ("studio.webp", (140, 0, 1143, 1254), None),
        "avatar": ("studio.webp", (220, 80, 1000, 860), (320, 320)),
        "cam": ("webcam.png", (0, 0, 905, 509), None),  # drops the call app's toolbar strip
    },
    "bryce": {
        "talk": ("studio.webp", (0, 0, 1122, 1402), None),
        # Tighter crop of the same frame, so the hosts-section hover eases out to the wide shot.
        "laugh": ("studio.webp", (110, 0, 1010, 1125), None),
        "avatar": ("studio.webp", (165, 0, 905, 740), (320, 320)),
        "cam": ("webcam.webp", (0, 250, 1292, 977), None),
    },
}


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for host, slots in CROPS.items():
        for slot, (src, box, size) in slots.items():
            img = Image.open(REAL / host / src).convert("RGB").crop(box)
            if size:
                img = img.resize(size, Image.LANCZOS)
            path = OUT / f"{host}-{slot}-real.jpg"
            img.save(path, quality=88, optimize=True, progressive=True)
            print(f"{path.name}: {img.size[0]}x{img.size[1]}")


if __name__ == "__main__":
    main()

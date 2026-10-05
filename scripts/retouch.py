"""Light retouch + low-production grade for the host photos.

    python3 scripts/retouch.py            # references/studio-raw/*.jpg -> public/photos/*.jpg

Needs Pillow and numpy (pip install pillow numpy).

1. Skin softening by frequency separation, limited to skin-toned pixels so hair,
   eyes, glasses and clothing keep their detail. The mid band (fine lines,
   under-eye texture) is reduced more than the fine band (pores), which keeps
   skin from looking plastic. Strength is set per host.
2. A flatter, warmer, slightly desaturated grade with lifted blacks and fine
   grain, so the photos read like a phone or webcam in a spare room rather
   than a lit studio.
"""

from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "references" / "studio-raw"
REAL = ROOT / "references" / "real"  # hosts with real photos skip the generated set
OUT = ROOT / "public" / "photos"

# (mid-band reduction, fine-band reduction) on skin. Higher = smoother.
STRENGTH = {
    "james": (0.45, 0.2),
    "bryce": (0.45, 0.2),
    "greg": (0.3, 0.12),
}


def blur(arr: np.ndarray, radius: float) -> np.ndarray:
    img = Image.fromarray(np.clip(arr * 255, 0, 255).astype(np.uint8))
    return np.asarray(img.filter(ImageFilter.GaussianBlur(radius)), dtype=np.float32) / 255


def skin_mask(rgb: np.ndarray, feather: float) -> np.ndarray:
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    y = 0.299 * r + 0.587 * g + 0.114 * b
    cb = 0.5 + (b - y) * 0.564
    cr = 0.5 + (r - y) * 0.713
    m = ((cb > 0.30) & (cb < 0.50) & (cr > 0.52) & (cr < 0.68) & (y > 0.18)).astype(np.float32)
    m = np.asarray(Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(feather)), dtype=np.float32) / 255
    return np.clip(m * 1.2, 0, 1)[..., None]


def edge_guard(rgb: np.ndarray, w: int) -> np.ndarray:
    """1 on flat skin, falling to 0 on strong edges (glasses, eyes, lips, hairline)."""
    lum = (0.299 * rgb[..., 0] + 0.587 * rgb[..., 1] + 0.114 * rgb[..., 2])
    soft = blur(np.repeat(lum[..., None], 3, -1), max(1.0, w * 0.0012))[..., 0]
    gy, gx = np.gradient(soft)
    mag = np.hypot(gx, gy)
    mag = blur(np.repeat(mag[..., None], 3, -1), max(1.5, w * 0.002))[..., 0]
    return np.clip(1 - mag / 0.02, 0, 1)[..., None]


def retouch(rgb: np.ndarray, mid_k: float, fine_k: float) -> np.ndarray:
    w = rgb.shape[1]
    r_fine, r_mid = max(1.2, w * 0.0013), max(3.5, w * 0.0045)
    fine_base = blur(rgb, r_fine)
    mid_base = blur(rgb, r_mid)
    fine = rgb - fine_base
    mid = fine_base - mid_base
    m = skin_mask(rgb, feather=w * 0.0025) * edge_guard(rgb, w)
    return mid_base + mid * (1 - mid_k * m) + fine * (1 - fine_k * m)


def grade(rgb: np.ndarray, seed: int) -> np.ndarray:
    out = (rgb - 0.5) * 0.93 + 0.5  # flatter contrast
    out = out * 0.955 + 0.03  # lift blacks, roll off highlights
    lum = (0.299 * out[..., 0] + 0.587 * out[..., 1] + 0.114 * out[..., 2])[..., None]
    out = lum + (out - lum) * 0.92  # a touch less saturated
    out = out * np.array([1.02, 1.0, 0.965], dtype=np.float32)  # warmer
    rng = np.random.default_rng(seed)
    grain = rng.normal(0, 0.011, out.shape[:2]).astype(np.float32)[..., None]
    return np.clip(out + grain, 0, 1)


def process(path: Path, index: int) -> None:
    host = path.stem.split("-")[0]
    if (REAL / host).is_dir():
        print(f"{path.name}: skipped, {host} has real photos (scripts/real-photos.py)")
        return
    mid_k, fine_k = STRENGTH.get(host, (0.45, 0.25))
    rgb = np.asarray(Image.open(path).convert("RGB"), dtype=np.float32) / 255
    out = grade(retouch(rgb, mid_k, fine_k), seed=index)
    img = Image.fromarray((out * 255 + 0.5).astype(np.uint8))
    img.save(OUT / path.name, quality=86, optimize=True, progressive=True)
    print(f"{path.name}: mid {mid_k}, fine {fine_k}")


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    for i, p in enumerate(sorted(RAW.glob("*.jpg"))):
        process(p, i)

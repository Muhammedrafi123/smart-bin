"""Prepare deck assets: duotone photography and device mockups.

Run from the project root:  python deck/build-assets.py
"""

import json
import os

from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SHOTS = os.path.join(ROOT, "docs", "screens")
OUT = os.path.join(ROOT, "deck", "assets")
os.makedirs(OUT, exist_ok=True)

# ENGO palette
INK = (14, 26, 21)
DEEP = (8, 38, 26)
MID = (36, 138, 94)
LIGHT = (220, 245, 229)


def duotone(src, dst, dark=(6, 30, 21), light=(190, 221, 203), size=None):
    """Map an image onto a two-colour ramp so photography sits in the palette."""
    im = Image.open(src).convert("L")
    if size:
        im = crop_cover(im, size)
    ramp = []
    for i in range(256):
        t = i / 255
        ramp.append(tuple(int(dark[c] + (light[c] - dark[c]) * t) for c in range(3)))
    out = Image.new("RGB", im.size)
    px = im.load()
    op = out.load()
    for y in range(im.height):
        for x in range(im.width):
            op[x, y] = ramp[px[x, y]]
    out.save(dst, quality=88)
    print("  duotone ->", os.path.basename(dst), out.size)


def crop_cover(im, size):
    """object-fit: cover."""
    tw, th = size
    scale = max(tw / im.width, th / im.height)
    nw, nh = int(im.width * scale + 0.5), int(im.height * scale + 0.5)
    im = im.resize((nw, nh), Image.LANCZOS)
    left = (nw - tw) // 2
    top = (nh - th) // 2
    return im.crop((left, top, left + tw, top + th))


def darken(src, dst, amount=0.62, size=None, tint=DEEP):
    im = Image.open(src).convert("RGB")
    if size:
        im = crop_cover(im, size)
    overlay = Image.new("RGB", im.size, tint)
    im = Image.blend(im, overlay, amount)
    im.save(dst, quality=88)
    print("  darkened ->", os.path.basename(dst), im.size)


def rounded_mask(size, radius):
    m = Image.new("L", size, 0)
    ImageDraw.Draw(m).rounded_rectangle([0, 0, size[0] - 1, size[1] - 1], radius, fill=255)
    return m


MANIFEST = {}


def mockup(name, src, bezel=34, pad=110, blur=38, shadow_dy=46, shadow_alpha=105):
    """Wrap a screenshot in a bezel with a baked soft shadow (transparent PNG)."""
    shot = Image.open(src).convert("RGB")
    sw, sh = shot.size
    screen_r = int(sw * 0.072)
    dev_w, dev_h = sw + bezel * 2, sh + bezel * 2
    dev_r = screen_r + bezel

    device = Image.new("RGBA", (dev_w, dev_h), (0, 0, 0, 0))
    body = Image.new("RGBA", (dev_w, dev_h), INK + (255,))
    device.paste(body, (0, 0), rounded_mask((dev_w, dev_h), dev_r))
    device.paste(shot, (bezel, bezel), rounded_mask((sw, sh), screen_r))

    canvas = Image.new("RGBA", (dev_w + pad * 2, dev_h + pad * 2 + shadow_dy), (0, 0, 0, 0))
    shadow = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    ImageDraw.Draw(shadow).rounded_rectangle(
        [pad, pad + shadow_dy, pad + dev_w, pad + shadow_dy + dev_h],
        dev_r,
        fill=(6, 22, 15, shadow_alpha),
    )
    shadow = shadow.filter(ImageFilter.GaussianBlur(blur))
    canvas = Image.alpha_composite(canvas, shadow)
    canvas.paste(device, (pad, pad), device)

    dst = os.path.join(OUT, f"phone-{name}.png")
    canvas.save(dst)
    MANIFEST[name] = list(canvas.size)
    print("  mockup ->", os.path.basename(dst), canvas.size)


print("photography")
darken(
    os.path.join(ROOT, "src", "assets", "images", "leaves-hero.jpg"),
    os.path.join(OUT, "bg-forest.jpg"),
    amount=0.63,
    size=(2000, 1125),
)
duotone(
    os.path.join(OUT, "photo-waste.jpg"),
    os.path.join(OUT, "photo-waste-duotone.jpg"),
    size=(1100, 1500),
)

print("device mockups")
for name, shot in [
    ("home", "05-home"),
    ("rfid", "06-deposit-rfid"),
    ("unlocked", "07-deposit-unlocked"),
    ("weighing", "08-deposit-weighing"),
    ("analyzing", "09-deposit-analyzing"),
    ("result", "15-result-accepted"),
    ("result-tall", "15b-result-tall"),
    ("result-bad", "16-result-incorrect"),
    ("rewards", "11-rewards"),
    ("penalties", "12-penalties"),
    ("history", "10-history"),
    ("profile", "13-profile"),
    ("identify", "03-rfid-tap"),
    ("splash", "01-splash"),
]:
    mockup(name, os.path.join(SHOTS, f"{shot}.png"))

with open(os.path.join(OUT, "mockups.json"), "w") as fh:
    json.dump(MANIFEST, fh, indent=2, sort_keys=True)
print("")
print("wrote mockups.json with", len(MANIFEST), "entries")

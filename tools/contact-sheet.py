#!/usr/bin/env python3
"""Assemble a review PDF from a screenshot directory.

One page per screenshot, downscaled to something a phone can actually open,
Day and Night interleaved so the two aesthetics can be compared without
scrolling past fourteen pages of one of them.
"""
import sys, os
from PIL import Image

src = sys.argv[1]
out = sys.argv[2]
kind = sys.argv[3] if len(sys.argv) > 3 else "desktop"
MAX_W, MAX_H = 1100, 3400   # tall pages get sliced by the capture tool already

ORDER = ["index", "foundations", "components", "patterns",
         "principles", "accessibility", "agents"]

def sort_key(name):
    base = name[:-4]
    theme = "day" if base.startswith("day-") else "night"
    rest = base.split("-", 1)[1]
    page = next((p for p in ORDER if rest.startswith(p)), rest)
    slice_no = rest[len(page):].strip("-")
    return (ORDER.index(page) if page in ORDER else 99, slice_no, theme)

files = sorted((f for f in os.listdir(src)
                if f.endswith(".png") and kind in f), key=sort_key)

pages = []
for f in files:
    im = Image.open(os.path.join(src, f)).convert("RGB")
    w, h = im.size
    scale = min(MAX_W / w, MAX_H / h, 1.0)
    if scale < 1.0:
        im = im.resize((int(w * scale), int(h * scale)), Image.LANCZOS)
    pages.append(im)
    print(f"  {f}  {w}x{h} -> {im.size[0]}x{im.size[1]}")

if not pages:
    sys.exit("no screenshots matched")

pages[0].save(out, save_all=True, append_images=pages[1:],
              resolution=110, quality=78)
print(f"\n{out}  {len(pages)} pages  {os.path.getsize(out)/1e6:.1f} MB")

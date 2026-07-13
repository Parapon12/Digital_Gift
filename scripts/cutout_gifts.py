"""Flood-fill remove background from corners for true PNG transparency."""
from PIL import Image
from collections import deque
import os
import shutil

SRC_A = r"C:\Users\User\.cursor\projects\c-Users-User-OneDrive-Desktop-Digital-Gift\assets\gift-box-a.png"
SRC_B = r"C:\Users\User\.cursor\projects\c-Users-User-OneDrive-Desktop-Digital-Gift\assets\gift-box-b.png"
SRC_HERO = r"C:\Users\User\.cursor\projects\c-Users-User-OneDrive-Desktop-Digital-Gift\assets\gift-hero-banner.png"
OUT_DIR = r"C:\Users\User\OneDrive\Desktop\Digital Gift\frontend\public\brand"


def color_dist(a, b):
    return abs(a[0] - b[0]) + abs(a[1] - b[1]) + abs(a[2] - b[2])


def flood_cutout(path, out_path, thresh=42):
    im = Image.open(path).convert("RGBA")
    w, h = im.size
    px = im.load()
    visited = [[False] * w for _ in range(h)]
    q = deque()

    seeds = [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1),
             (w // 2, 0), (w // 2, h - 1), (0, h // 2), (w - 1, h // 2)]
    for x, y in seeds:
        q.append((x, y))
        visited[y][x] = True

    def is_bg_like(rgb, ref):
        r, g, b = rgb
        # keep saturated / purple ribbon / cream box (warmer) from flood
        # background is near-neutral light gray/white
        neutral = abs(r - g) < 18 and abs(g - b) < 18 and abs(r - b) < 18
        bright = (r + g + b) / 3 > 200
        close = color_dist(rgb, ref) < thresh
        return (neutral and bright) or close

    # use top-left as reference bg
    ref = px[2][2][:3] if False else px[2, 2][:3]
    refs = [px[s[0], s[1]][:3] for s in seeds]

    while q:
        x, y = q.popleft()
        r, g, b, a = px[x, y]
        # match any seed-like bg
        if not any(is_bg_like((r, g, b), rf) for rf in refs):
            continue
        px[x, y] = (r, g, b, 0)
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < w and 0 <= ny < h and not visited[ny][nx]:
                visited[ny][nx] = True
                nr, ng, nb, _ = px[nx, ny]
                if any(is_bg_like((nr, ng, nb), rf) for rf in refs):
                    q.append((nx, ny))

    # second pass: kill leftover checker / light fringe not connected? optional erode fringe
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            # lonely near-white fringe
            if (r + g + b) / 3 > 248 and abs(r - g) < 8:
                # if majority of neighbors transparent, clear
                neigh = 0
                trans = 0
                for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                    if 0 <= nx < w and 0 <= ny < h:
                        neigh += 1
                        if px[nx, ny][3] == 0:
                            trans += 1
                if neigh and trans >= 3:
                    px[x, y] = (r, g, b, 0)

    bbox = im.getbbox()
    if bbox:
        pad = 16
        l, t, r, b = bbox
        im = im.crop((max(0, l - pad), max(0, t - pad), min(w, r + pad), min(h, b + pad)))
    im.save(out_path, "PNG")
    alpha = im.split()[-1]
    print(os.path.basename(out_path), im.size, "alpha", alpha.getextrema())


os.makedirs(OUT_DIR, exist_ok=True)
flood_cutout(SRC_A, os.path.join(OUT_DIR, "gift-box-a.png"), thresh=48)
flood_cutout(SRC_B, os.path.join(OUT_DIR, "gift-box-b.png"), thresh=48)
shutil.copy2(SRC_HERO, os.path.join(OUT_DIR, "gift-hero-banner.png"))
print("done")

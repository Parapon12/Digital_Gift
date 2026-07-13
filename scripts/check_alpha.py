from PIL import Image
import os

paths = [
    r"C:\Users\User\.cursor\projects\c-Users-User-OneDrive-Desktop-Digital-Gift\assets\gift-box-a.png",
    r"C:\Users\User\.cursor\projects\c-Users-User-OneDrive-Desktop-Digital-Gift\assets\gift-box-b.png",
    r"C:\Users\User\.cursor\projects\c-Users-User-OneDrive-Desktop-Digital-Gift\assets\gift-hero-banner.png",
    r"C:\Users\User\OneDrive\Desktop\Digital Gift\frontend\public\brand\gift-box-a.png",
    r"C:\Users\User\OneDrive\Desktop\Digital Gift\frontend\public\brand\gift-box-b.png",
]

for p in paths:
    if not os.path.exists(p):
        print("MISSING", p)
        continue
    im = Image.open(p)
    print(os.path.basename(p), im.mode, im.size, "->", p[-50:])
    rgba = im.convert("RGBA")
    a = rgba.split()[-1]
    print("  alpha extrema", a.getextrema())
    # sample corner pixels
    w, h = rgba.size
    for name, xy in [("tl", (2, 2)), ("tr", (w - 3, 2)), ("bl", (2, h - 3)), ("br", (w - 3, h - 3))]:
        print(" ", name, rgba.getpixel(xy))

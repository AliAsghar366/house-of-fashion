#!/usr/bin/env python3
"""Generate remaining reels with optimized settings for speed."""
import os, sys, math
import numpy as np
from PIL import Image, ImageDraw, ImageFont

sys.path.insert(0, os.path.dirname(__file__))
from generate_reels import REELS, OUT_DIR, COLORS, lerp_color, ease_in_out

# Faster settings: lower res, fewer fps, shorter duration
W, H = 720, 1280
FPS = 24
DURATION = 15
TOTAL_FRAMES = FPS * DURATION


def create_gradient_bg_fast(w, h, color1, color2):
    pixels = np.zeros((h, w, 3), dtype=np.uint8)
    for c in range(3):
        gradient = np.linspace(color1[c], color2[c], h).reshape(h, 1)
        pixels[:, :, c] = np.broadcast_to(gradient, (h, w))
    return Image.fromarray(pixels)


def draw_text_centered(draw, text, y, font, fill, width=W, line_spacing=8):
    lines = text.split("\n")
    for line in lines:
        bbox = draw.textbbox((0, 0), line, font=font)
        lw = bbox[2] - bbox[0]
        x = (width - lw) // 2
        draw.text((x, y), line, font=font, fill=fill)
        y += (bbox[3] - bbox[1]) + line_spacing
    return y


def get_font(name, size):
    paths = [
        f"{name}.ttf", f"{name}.ttc",
        f"/usr/share/fonts/truetype/dejavu/DejaVuSans{'-Bold' if 'Bold' in name or 'bd' in name else ''}.ttf",
        "arialbd.ttf" if "Bold" in name else "arial.ttf",
        "C:/Windows/Fonts/arial.ttf",
    ]
    for p in paths:
        try:
            return ImageFont.truetype(p, size)
        except (OSError, IOError):
            continue
    return ImageFont.load_default()


def generate_reel_fast(reel, output_path):
    print(f"  Reel {reel['id']:02d}: {reel['title'].replace(chr(10), ' ')}...")

    bg1, bg2 = reel["bg1"], reel["bg2"]
    accent, ink, cream = reel["accent"], COLORS["ink"], COLORS["cream"]

    bg_normal = create_gradient_bg_fast(W, H, bg1, bg2)
    bg_shifted = create_gradient_bg_fast(W, H, bg2, bg1)

    title_font = get_font("arialbd", 52)
    sub_font = get_font("arial", 28)
    tag_font = get_font("arialbd", 36)
    cta_font = get_font("arialbd", 28)
    brand_font = get_font("arialbd", 22)
    brand_sm_font = get_font("arial", 20)

    frames = []
    for fi in range(TOTAL_FRAMES):
        t = fi / TOTAL_FRAMES
        bg = bg_normal.copy() if t < 0.5 else bg_shifted.copy()
        draw = ImageDraw.Draw(bg)

        # Decorative circles
        for i in range(3):
            phase = t * 2 * math.pi + i * 2.0
            cx = int(W * (0.15 + 0.2 * i) + 20 * math.sin(phase))
            cy = int(H * (0.1 + 0.2 * i) + 30 * math.cos(phase * 0.7))
            r = 30 + int(15 * math.sin(phase * 0.5))
            draw.ellipse([cx-r, cy-r, cx+r, cy+r], fill=tuple(min(255, c+60) for c in bg1))

        # Brand bar (fade in)
        bar_a = ease_in_out(min(1, t * 5))
        if bar_a > 0.01:
            bh = int(50 * bar_a)
            draw.rounded_rectangle([30, 40, W-30, 40+bh], radius=12, fill=ink)
            draw.text((W//2 - 120, 47), "HOUSE OF FASHION", font=brand_font, fill=cream)

        # Emoji (pulse)
        es = 1.0 + 0.12 * math.sin(t * 6 * math.pi)
        esz = int(120 * es)
        ey = int(H * 0.22 + 20 * math.sin(t * 2 * math.pi))
        try:
            ef = ImageFont.truetype("seguiemj.ttf", esz)
        except:
            ef = get_font("arial", esz)
        eb = draw.textbbox((0, 0), reel["emoji"], font=ef)
        draw.text(((W - eb[2] + eb[0]) // 2, ey), reel["emoji"], font=ef)

        # Title (slide up + fade in)
        tp = ease_in_out(min(1, max(0, (t - 0.1) / 0.3)))
        if tp > 0.01:
            ty = int(H * 0.40 + 30 * (1 - tp))
            sc = tuple(min(255, c + 30) for c in accent)
            draw_text_centered(draw, reel["title"], ty + 3, title_font, sc)
            draw_text_centered(draw, reel["title"], ty, title_font, ink)

        # Subtitle
        sp = ease_in_out(min(1, max(0, (t - 0.25) / 0.3)))
        if sp > 0.01:
            sy = int(H * 0.55 + 20 * (1 - sp))
            draw_text_centered(draw, reel["subtitle"], sy, sub_font, ink)

        # Accent line
        lp = ease_in_out(min(1, max(0, (t - 0.3) / 0.25)))
        if lp > 0.01:
            lw = int(280 * lp)
            lx = (W - lw) // 2
            ly = int(H * 0.62)
            draw.rounded_rectangle([lx, ly, lx+lw, ly+4], radius=2, fill=accent)

        # Tag
        tag_p = ease_in_out(min(1, max(0, (t - 0.4) / 0.3)))
        if tag_p > 0.01:
            ty2 = int(H * 0.68 + 15 * (1 - tag_p))
            tag_text = reel["subtitle"].split("\n")[0]
            tb = draw.textbbox((0, 0), tag_text, font=tag_font)
            tw = tb[2] - tb[0]
            tx = (W - tw) // 2 - 20
            draw.rounded_rectangle([tx, ty2-8, tx+tw+40, ty2+48], radius=12, fill=accent)
            draw.text((tx+20, ty2), tag_text, font=tag_font, fill=ink)

        # CTA button
        cta_p = ease_in_out(min(1, max(0, (t - 0.5) / 0.3)))
        if cta_p > 0.01:
            bounce = 1.0 + 0.04 * math.sin(t * 8 * math.pi)
            bw = int(320 * cta_p * bounce)
            bh = int(50 * cta_p)
            bx = (W - bw) // 2
            by = int(H * 0.80)
            draw.rounded_rectangle([bx, by, bx+bw, by+bh], radius=15, fill=ink)
            cb = draw.textbbox((0, 0), "SHOP NOW", font=cta_font)
            draw.text(((W - cb[2] + cb[0]) // 2, by + 8), "SHOP NOW", font=cta_font, fill=cream)

        # Closing (last 2 seconds)
        if t > 0.87:
            ct = (t - 0.87) / 0.13
            overlay = Image.new("RGB", (W, H), ink)
            bg = Image.blend(bg, overlay, ct * 0.7)
            if ct > 0.3:
                cd = ImageDraw.Draw(bg)
                cf = get_font("arialbd", 48)
                cd.text(((W - 380) // 2, H // 2 - 30), "HOUSE OF FASHION", font=cf, fill=cream)
                cd.text(((W - 220) // 2, H // 2 + 40), "houseoffashion.pk", font=brand_sm_font, fill=COLORS["primary"])

        frames.append(np.array(bg))

    import imageio.v3 as iio
    iio.imwrite(output_path, np.stack(frames, axis=0), fps=FPS)
    sz = os.path.getsize(output_path) / 1024
    print(f"    Saved {output_path} ({sz:.0f} KB)")


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    # Generate reels 14-24 (reel-14 was incomplete, rest not started)
    for reel in REELS:
        output_path = os.path.join(OUT_DIR, f"reel-{reel['id']:02d}.mp4")
        if os.path.exists(output_path) and os.path.getsize(output_path) > 100000:
            print(f"  Skipping reel {reel['id']:02d} (exists, {os.path.getsize(output_path)//1024}KB)")
            continue
        generate_reel_fast(reel, output_path)

    # Summary
    total = 0
    count = 0
    for f in sorted(os.listdir(OUT_DIR)):
        if f.endswith(".mp4"):
            sz = os.path.getsize(os.path.join(OUT_DIR, f))
            total += sz
            count += 1
            print(f"  {f}: {sz // 1024}KB")
    print(f"\nTotal: {count} files, {total // (1024*1024)} MB")


if __name__ == "__main__":
    main()

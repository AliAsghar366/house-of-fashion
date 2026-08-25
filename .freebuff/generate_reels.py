#!/usr/bin/env python3
"""
Generate 24 promotional reel videos for House of Fashion Instagram.
Each video: 1080x1920 (9:16), 20 seconds, 30fps, audioless.
"""

import os
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFont

# ── Config ──────────────────────────────────────────────────────────────
W, H = 1088, 1920
FPS = 30
DURATION = 20  # seconds
TOTAL_FRAMES = FPS * DURATION
OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "reels")

# Website theme colors
COLORS = {
    "cream": (255, 248, 231),
    "primary": (254, 243, 176),
    "secondary": (232, 115, 74),
    "accent": (254, 243, 176),
    "mint": (97, 206, 112),
    "ink": (25, 21, 16),
    "bar": (191, 201, 179),
    "lavender": (255, 243, 208),
}

# Reel definitions
REELS = [
    {"id": 1, "title": "Summer\nFragrances", "subtitle": "Up to 30% off", "emoji": "🌸", "bg1": (255, 182, 193), "bg2": (255, 218, 224), "accent": (232, 115, 74)},
    {"id": 2, "title": "Handbag\nDrop", "subtitle": "New arrivals weekly", "emoji": "👜", "bg1": (255, 224, 130), "bg2": (255, 243, 176), "accent": (97, 206, 112)},
    {"id": 3, "title": "Jewelry\nSale", "subtitle": "Statement pieces\nfrom Rs 800", "emoji": "💎", "bg1": (255, 243, 176), "bg2": (255, 248, 231), "accent": (232, 115, 74)},
    {"id": 4, "title": "Cushion\nCollection", "subtitle": "Cozy up this winter", "emoji": "🛋️", "bg1": (255, 200, 130), "bg2": (255, 243, 176), "accent": (191, 201, 179)},
    {"id": 5, "title": "Sunglasses\nWeek", "subtitle": "UV400 protection", "emoji": "🕶️", "bg1": (200, 200, 210), "bg2": (230, 230, 240), "accent": (25, 21, 16)},
    {"id": 6, "title": "Silk\nScarves", "subtitle": "Hand-rolled luxury", "emoji": "🧣", "bg1": (210, 180, 255), "bg2": (255, 200, 230), "accent": (232, 115, 74)},
    {"id": 7, "title": "Leather\nWallets", "subtitle": "Genuine leather", "emoji": "👛", "bg1": (255, 210, 140), "bg2": (255, 180, 100), "accent": (25, 21, 16)},
    {"id": 8, "title": "Hair Clips\n& Pins", "subtitle": "Pearl & velvet", "emoji": "🎀", "bg1": (255, 190, 210), "bg2": (255, 220, 230), "accent": (254, 243, 176)},
    {"id": 9, "title": "Watch\nCollection", "subtitle": "Minimalist to bold", "emoji": "⌚", "bg1": (180, 180, 190), "bg2": (220, 220, 230), "accent": (254, 243, 176)},
    {"id": 10, "title": "Scented\nCandles", "subtitle": "Set the mood", "emoji": "🕯️", "bg1": (255, 200, 150), "bg2": (255, 235, 200), "accent": (232, 115, 74)},
    {"id": 11, "title": "Decorative\nVases", "subtitle": "Sculptural pieces", "emoji": "🏺", "bg1": (255, 180, 160), "bg2": (255, 220, 200), "accent": (97, 206, 112)},
    {"id": 12, "title": "Premium\nBelts", "subtitle": "Genuine leather", "emoji": "👗", "bg1": (255, 224, 160), "bg2": (255, 245, 200), "accent": (25, 21, 16)},
    {"id": 13, "title": "Men's\nShalwar Kameez", "subtitle": "Classic & formal", "emoji": "🧵", "bg1": (160, 220, 160), "bg2": (200, 240, 200), "accent": (25, 21, 16)},
    {"id": 14, "title": "Lawn\nSuits", "subtitle": "Unstitched 3-piece", "emoji": "🧶", "bg1": (150, 220, 210), "bg2": (200, 240, 235), "accent": (232, 115, 74)},
    {"id": 15, "title": "Kids'\nWear", "subtitle": "Festival-ready", "emoji": "🧒", "bg1": (160, 200, 255), "bg2": (200, 220, 255), "accent": (232, 115, 74)},
    {"id": 16, "title": "Kitchen\nStorage", "subtitle": "Airtight & stackable", "emoji": "🥡", "bg1": (160, 220, 160), "bg2": (210, 245, 180), "accent": (25, 21, 16)},
    {"id": 17, "title": "Desk\nStationery", "subtitle": "Aesthetic essentials", "emoji": "✏️", "bg1": (200, 180, 255), "bg2": (230, 210, 255), "accent": (25, 21, 16)},
    {"id": 18, "title": "Bathroom\nFinds", "subtitle": "Miniso-style upgrades", "emoji": "🧴", "bg1": (150, 220, 240), "bg2": (200, 235, 250), "accent": (25, 21, 16)},
    {"id": 19, "title": "Bedsheet\nSets", "subtitle": "Sleep in luxury", "emoji": "🛏️", "bg1": (180, 180, 255), "bg2": (210, 210, 255), "accent": (254, 243, 176)},
    {"id": 20, "title": "FLASH\nSALE", "subtitle": "Up to 40% off", "emoji": "🔥", "bg1": (255, 100, 80), "bg2": (255, 180, 100), "accent": (255, 248, 231)},
    {"id": 21, "title": "FREE\nSHIPPING", "subtitle": "Orders over Rs 5000", "emoji": "🚚", "bg1": (100, 200, 100), "bg2": (180, 240, 180), "accent": (25, 21, 16)},
    {"id": 22, "title": "NEW\nARRIVALS", "subtitle": "Just dropped this week", "emoji": "✨", "bg1": (255, 220, 100), "bg2": (255, 240, 160), "accent": (25, 21, 16)},
    {"id": 23, "title": "BULK\nORDERS", "subtitle": "Wholesale pricing", "emoji": "📦", "bg1": (180, 180, 190), "bg2": (210, 210, 220), "accent": (25, 21, 16)},
    {"id": 24, "title": "GIFT\nIDEAS", "subtitle": "Perfect for every occasion", "emoji": "🎁", "bg1": (255, 180, 220), "bg2": (200, 180, 255), "accent": (254, 243, 176)},
]


def lerp_color(c1, c2, t):
    """Linearly interpolate between two RGB colors."""
    return tuple(int(c1[i] + (c2[i] - c1[i]) * t) for i in range(3))


def ease_in_out(t):
    """Smooth ease-in-out curve."""
    return t * t * (3 - 2 * t)


def draw_rounded_rect(draw, bbox, radius, fill):
    """Draw a rounded rectangle."""
    x0, y0, x1, y1 = bbox
    draw.rounded_rectangle(bbox, radius=radius, fill=fill)


def create_gradient_bg(w, h, color1, color2, angle_deg=0):
    """Create a gradient background."""
    img = Image.new("RGB", (w, h))
    pixels = np.zeros((h, w, 3), dtype=np.uint8)
    angle = math.radians(angle_deg)
    cos_a, sin_a = math.cos(angle), math.sin(angle)
    max_dist = abs(w * cos_a) + abs(h * sin_a)

    for y in range(h):
        for x in range(0, w, 4):  # Step by 4 for speed
            dist = (x * cos_a + y * sin_a) / max_dist
            t = (dist + 1) / 2
            t = max(0, min(1, t))
            c = lerp_color(color1, color2, t)
            pixels[y, x:x+4] = c

    return Image.fromarray(pixels)


def create_gradient_bg_fast(w, h, color1, color2):
    """Create a vertical gradient background (fast numpy version)."""
    pixels = np.zeros((h, w, 3), dtype=np.uint8)
    for c in range(3):
        gradient = np.linspace(color1[c], color2[c], h).reshape(h, 1)
        pixels[:, :, c] = np.broadcast_to(gradient, (h, w))
    return Image.fromarray(pixels)


def draw_text_centered(draw, text, y, font, fill, line_spacing=10, width=W):
    """Draw multi-line text centered."""
    lines = text.split("\n")
    line_sizes = []
    for line in lines:
        bbox = draw.textbbox((0, 0), line, font=font)
        lw = bbox[2] - bbox[0]
        lh = bbox[3] - bbox[1]
        line_sizes.append((lw, lh, line))

    cy = y
    for lw, lh, line in line_sizes:
        x = (width - lw) // 2
        draw.text((x, cy), line, font=font, fill=fill)
        cy += lh + line_spacing

    return cy


def draw_big_emoji(img, emoji_text, x, y, size):
    """Draw emoji as large text (rendered via PIL)."""
    draw = ImageDraw.Draw(img)
    try:
        font = ImageFont.truetype("seguiemj.ttf", size)
    except (OSError, IOError):
        try:
            font = ImageFont.truetype("/usr/share/fonts/truetype/noto/NotoColorEmoji.ttf", size)
        except (OSError, IOError):
            font = ImageFont.load_default()
    draw.text((x, y), emoji_text, font=font, fill=(0, 0, 0, 0))


def generate_reel(reel, output_path):
    """Generate a single reel video."""
    print(f"  Generating reel {reel['id']}: {reel['title'].replace(chr(10), ' ')}...")

    bg1 = reel["bg1"]
    bg2 = reel["bg2"]
    accent = reel["accent"]
    ink = COLORS["ink"]
    cream = COLORS["cream"]
    primary = COLORS["primary"]

    # Pre-generate gradient backgrounds
    bg_normal = create_gradient_bg_fast(W, H, bg1, bg2)
    bg_shifted = create_gradient_bg_fast(W, H, bg2, bg1)

    frames = []
    for frame_idx in range(TOTAL_FRAMES):
        t = frame_idx / TOTAL_FRAMES  # 0..1 over whole video
        sec = frame_idx / FPS  # current time in seconds

        # Choose background
        if t < 0.5:
            bg = bg_normal.copy()
        else:
            bg = bg_shifted.copy()

        draw = ImageDraw.Draw(bg)

        # ── Floating decorative circles ──
        for i in range(4):
            phase = t * 2 * math.pi + i * 1.5
            cx = int(W * (0.2 + 0.15 * i) + 30 * math.sin(phase))
            cy = int(H * (0.1 + 0.15 * i) + 40 * math.cos(phase * 0.7))
            r = 60 + int(20 * math.sin(phase * 0.5))
            alpha_color = tuple(min(255, c + 80) for c in bg1)
            draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=alpha_color)

        # ── Top bar: brand name ──
        bar_alpha = ease_in_out(min(1, t * 4))  # Fade in first 0.25s
        if bar_alpha > 0.01:
            bar_h = int(80 * bar_alpha)
            draw_rounded_rect(draw, [40, 60, W - 40, 60 + bar_h], 20, ink)
            try:
                brand_font = ImageFont.truetype("arialbd.ttf", 32)
            except (OSError, IOError):
                try:
                    brand_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 32)
                except (OSError, IOError):
                    brand_font = ImageFont.load_default()
            draw.text((W // 2 - 180, 68), "HOUSE OF FASHION", font=brand_font, fill=cream)

        # ── Main emoji (pulsing) ──
        emoji_scale = 1.0 + 0.15 * math.sin(t * 6 * math.pi)
        emoji_size = int(200 * emoji_scale)
        emoji_x = (W - emoji_size) // 2
        emoji_y = int(H * 0.25 - emoji_size // 2 + 30 * math.sin(t * 2 * math.pi))

        # Draw emoji as text
        try:
            emoji_font = ImageFont.truetype("seguiemj.ttf", emoji_size)
        except (OSError, IOError):
            try:
                emoji_font = ImageFont.truetype("/usr/share/fonts/truetype/noto/NotoColorEmoji.ttf", emoji_size)
            except (OSError, IOError):
                emoji_font = ImageFont.load_default()
        ew = draw.textbbox((0, 0), reel["emoji"], font=emoji_font)
        draw.text(((W - ew[2] + ew[0]) // 2, emoji_y), reel["emoji"], font=emoji_font)

        # ── Main title (slide up + fade in) ──
        title_progress = ease_in_out(min(1, max(0, (t - 0.1) / 0.3)))
        if title_progress > 0.01:
            title_y = int(H * 0.42 + 50 * (1 - title_progress))
            try:
                title_font = ImageFont.truetype("arialbd.ttf", 88)
            except (OSError, IOError):
                try:
                    title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 88)
                except (OSError, IOError):
                    title_font = ImageFont.load_default()

            # Text shadow
            shadow_color = tuple(min(255, c + 40) for c in accent)
            draw_text_centered(draw, reel["title"], title_y + 4, title_font, shadow_color)
            draw_text_centered(draw, reel["title"], title_y, title_font, ink)

        # ── Subtitle (slide up + fade in after title) ──
        sub_progress = ease_in_out(min(1, max(0, (t - 0.25) / 0.3)))
        if sub_progress > 0.01:
            sub_y = int(H * 0.55 + 30 * (1 - sub_progress))
            try:
                sub_font = ImageFont.truetype("arial.ttf", 42)
            except (OSError, IOError):
                try:
                    sub_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 42)
                except (OSError, IOError):
                    sub_font = ImageFont.load_default()
            draw_text_centered(draw, reel["subtitle"], sub_y, sub_font, ink)

        # ── Accent line (grow from center) ──
        line_progress = ease_in_out(min(1, max(0, (t - 0.3) / 0.25)))
        if line_progress > 0.01:
            line_w = int(400 * line_progress)
            lx = (W - line_w) // 2
            ly = int(H * 0.62)
            draw_rounded_rect(draw, [lx, ly, lx + line_w, ly + 6], 3, accent)

        # ── Price / tagline pulse ──
        tag_progress = ease_in_out(min(1, max(0, (t - 0.4) / 0.3)))
        if tag_progress > 0.01:
            tag_y = int(H * 0.68 + 20 * (1 - tag_progress))
            try:
                tag_font = ImageFont.truetype("arialbd.ttf", 56)
            except (OSError, IOError):
                try:
                    tag_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 56)
                except (OSError, IOError):
                    tag_font = ImageFont.load_default()

            # Price tag background
            tag_text = reel["subtitle"].split("\n")[0]
            tb = draw.textbbox((0, 0), tag_text, font=tag_font)
            tw = tb[2] - tb[0]
            tx = (W - tw) // 2 - 30
            draw_rounded_rect(draw, [tx, tag_y - 10, tx + tw + 60, tag_y + 70], 15, accent)
            draw.text((tx + 30, tag_y), tag_text, font=tag_font, fill=ink)

        # ── Bottom CTA button (bounce in) ──
        cta_progress = ease_in_out(min(1, max(0, (t - 0.5) / 0.3)))
        if cta_progress > 0.01:
            bounce = 1.0 + 0.05 * math.sin(t * 8 * math.pi)
            btn_w = int(500 * cta_progress * bounce)
            btn_h = int(80 * cta_progress)
            btn_x = (W - btn_w) // 2
            btn_y = int(H * 0.78)

            draw_rounded_rect(draw, [btn_x, btn_y, btn_x + btn_w, btn_y + btn_h], 20, ink)
            try:
                cta_font = ImageFont.truetype("arialbd.ttf", 36)
            except (OSError, IOError):
                try:
                    cta_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 36)
                except (OSError, IOError):
                    cta_font = ImageFont.load_default()
            cta_text = "SHOP NOW"
            cb = draw.textbbox((0, 0), cta_text, font=cta_font)
            draw.text(((W - cb[2] + cb[0]) // 2, btn_y + 18), cta_text, font=cta_font, fill=cream)

        # ── Swiping indicator dots at bottom ──
        dot_y = H - 100
        n_dots = 5
        for d in range(n_dots):
            dx = W // 2 + (d - n_dots // 2) * 30
            active = (d == reel["id"] % n_dots)
            r = 8 if active else 5
            c = ink if active else COLORS["bar"]
            draw.ellipse([dx - r, dot_y - r, dx + r, dot_y + r], fill=c)

        # ── Closing animation (last 3 seconds) ──
        if t > 0.85:
            close_t = (t - 0.85) / 0.15
            overlay_alpha = int(255 * ease_in_out(close_t))
            overlay = Image.new("RGB", (W, H), ink)
            bg = Image.blend(bg, overlay, close_t * 0.7)

            # Show brand name centered at close
            if close_t > 0.3:
                try:
                    close_font = ImageFont.truetype("arialbd.ttf", 72)
                except (OSError, IOError):
                    try:
                        close_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 72)
                    except (OSError, IOError):
                        close_font = ImageFont.load_default()
                close_draw = ImageDraw.Draw(bg)
                close_draw.text(((W - 500) // 2, H // 2 - 40), "HOUSE OF FASHION", font=close_font, fill=cream)
                try:
                    small_font = ImageFont.truetype("arial.ttf", 32)
                except (OSError, IOError):
                    try:
                        small_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 32)
                    except (OSError, IOError):
                        small_font = ImageFont.load_default()
                close_draw.text(((W - 300) // 2, H // 2 + 60), "houseoffashion.pk", font=small_font, fill=COLORS["primary"])

        # Convert to numpy array
        frame = np.array(bg)
        frames.append(frame)

    # Write all frames
    import imageio.v3 as iio
    # Convert to uint8 numpy array
    frames_array = np.stack(frames, axis=0)
    iio.imwrite(output_path, frames_array, fps=FPS)
    size_mb = os.path.getsize(output_path) / (1024 * 1024)
    print(f"    Saved {output_path} ({size_mb:.1f} MB)")


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    print(f"Generating {len(REELS)} promotional reels...")
    print(f"Output: {OUT_DIR}")
    print(f"Resolution: {W}x{H}, {FPS}fps, {DURATION}s each")
    print()

    for reel in REELS:
        output_path = os.path.join(OUT_DIR, f"reel-{reel['id']:02d}.mp4")
        generate_reel(reel, output_path)

    print()
    print(f"All {len(REELS)} reels generated in {OUT_DIR}")
    total_size = sum(
        os.path.getsize(os.path.join(OUT_DIR, f))
        for f in os.listdir(OUT_DIR)
        if f.endswith(".mp4")
    ) / (1024 * 1024)
    print(f"Total size: {total_size:.1f} MB")


if __name__ == "__main__":
    main()

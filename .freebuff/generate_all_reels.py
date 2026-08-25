#!/usr/bin/env python3
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from generate_reels import generate_reel, REELS, OUT_DIR

os.makedirs(OUT_DIR, exist_ok=True)

for reel in REELS:
    output_path = os.path.join(OUT_DIR, f"reel-{reel['id']:02d}.mp4")
    if os.path.exists(output_path) and os.path.getsize(output_path) > 1000:
        print(f"  Skipping reel {reel['id']:02d} (already exists, {os.path.getsize(output_path)//1024}KB)")
        continue
    generate_reel(reel, output_path)

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

#!/usr/bin/env node
/**
 * encode-all-reels.mjs
 * Encodes captured JPEG frame sequences into .webm video files using ffmpeg.
 */
import { execSync } from "child_process";
import { readdirSync, existsSync, statSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const REELS_DIR = join(ROOT, "public", "reels");

// Get ffmpeg path - import dynamically since it's a .mjs file
const { createRequire } = await import("module");
const require = createRequire(import.meta.url);
let ffmpegPath;
try {
  ffmpegPath = require("ffmpeg-static");
} catch {
  console.error("❌ ffmpeg-static not installed. Run: npm install ffmpeg-static");
  process.exit(1);
}

async function main() {
  console.log("\n🎬 Encoding all reel frames into .webm videos...\n");
  console.log(`   ffmpeg: ${ffmpegPath}\n`);

  const frameDirs = readdirSync(REELS_DIR)
    .filter((d) => d.endsWith("-frames"))
    .sort();

  let encoded = 0;
  let skipped = 0;
  let failed = 0;

  for (const dirName of frameDirs) {
    const reelNum = parseInt(dirName.match(/reel-(\d+)/)?.[1] || "0");
    const padded = String(reelNum).padStart(2, "0");
    const dirPath = join(REELS_DIR, dirName);
    const outWebm = join(REELS_DIR, `reel-${padded}.webm`);
    const outMp4 = join(REELS_DIR, `reel-${padded}.mp4`);

    // Skip if we already have a .mp4 (from previous session)
    if (existsSync(outMp4) && statSync(outMp4).size > 10000) {
      console.log(`  ⏭️  #${padded} — already has .mp4 (${(statSync(outMp4).size / 1024).toFixed(0)}KB), skipping`);
      skipped++;
      continue;
    }

    // Skip if webm already exists and is recent
    if (existsSync(outWebm) && statSync(outWebm).size > 10000) {
      console.log(`  ⏭️  #${padded} — already encoded (${(statSync(outWebm).size / 1024).toFixed(0)}KB), skipping`);
      skipped++;
      continue;
    }

    // Count frames
    const frameFiles = readdirSync(dirPath)
      .filter((f) => f.endsWith(".jpg"))
      .sort();

    if (frameFiles.length < 5) {
      console.log(`  ⚠️  #${padded} — only ${frameFiles.length} frames, skipping`);
      skipped++;
      continue;
    }

    try {
      // ffmpeg: read JPEG sequence → encode as WebM (VP8 + Vorbis)
      // fps = frame count / duration (reels are 15 seconds)
      const fps = frameFiles.length / 15;

      const inputPattern = join(dirPath, "frame-%04d.jpg");
      const cmd = [
        `"${ffmpegPath}"`,
        "-y", // overwrite
        "-framerate", fps.toFixed(2),
        "-i", `"${inputPattern}"`,
        "-c:v", "libvpx",
        "-b:v", "2M",
        "-c:a", "libvorbis",
        "-an", // no audio
        "-pix_fmt", "yuv420p",
        "-vf", "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2",
        `-t`, "16", // slightly longer than 15s for safety
        `"${outWebm}"`,
      ].join(" ");

      execSync(cmd, { stdio: "pipe", timeout: 120000 });

      const sizeKB = (statSync(outWebm).size / 1024).toFixed(0);
      console.log(`  ✅ #${padded} — ${frameFiles.length} frames → ${sizeKB}KB .webm`);
      encoded++;
    } catch (err) {
      const errMsg = err.stderr ? err.stderr.toString().split("\n").slice(-3).join(" ") : err.message;
      console.log(`  ❌ #${padded} — FAILED: ${errMsg}`);
      failed++;
    }
  }

  console.log(`\n✨ Done! ${encoded} encoded, ${skipped} skipped, ${failed} failed`);
  console.log(`📁 Output: ${REELS_DIR}`);
}

main().catch(console.error);

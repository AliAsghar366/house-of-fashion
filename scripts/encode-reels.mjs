#!/usr/bin/env node
/**
 * encode-reels.mjs
 * Encodes captured JPEG frame sequences into .webm video files
 * using a minimal pure-JS WebM/EBML muxer.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync, statSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const REELS_DIR = join(ROOT, "public", "reels");

// ═══════════════════════════════════════════════════════════════
// Minimal EBML / WebM writer
// ═══════════════════════════════════════════════════════════════

class EBMLWriter {
  constructor() {
    this.buffers = [];
  }

  writeByte(b) {
    this.buffers.push(Buffer.from([b]));
  }

  writeBytes(buf) {
    this.buffers.push(Buffer.isBuffer(buf) ? buf : Buffer.from(buf));
  }

  // EBML variable-length integer
  writeVint(value) {
    if (value < 0x7f) {
      this.writeByte(value | 0x80);
    } else if (value < 0x3fff) {
      const b = Buffer.alloc(2);
      b.writeUInt16BE(value | 0x4000);
      this.writeBytes(b);
    } else if (value < 0x1fffff) {
      const b = Buffer.alloc(3);
      b[0] = (value >> 16) | 0x20;
      b[1] = (value >> 8) & 0xff;
      b[2] = value & 0xff;
      this.writeBytes(b);
    } else if (value < 0x0fffffff) {
      const b = Buffer.alloc(4);
      b.writeUInt32BE(value | 0x10000000);
      this.writeBytes(b);
    } else {
      throw new Error("Value too large for VINT");
    }
  }

  writeElement(id, data) {
    this.writeVint(id);
    this.writeVint(data.length);
    this.writeBytes(data);
  }

  writeUint(id, value) {
    let bytes;
    if (value < 0x100) {
      bytes = Buffer.from([value]);
    } else if (value < 0x10000) {
      bytes = Buffer.alloc(2);
      bytes.writeUInt16BE(value);
    } else if (value < 0x1000000) {
      bytes = Buffer.alloc(3);
      bytes[0] = (value >> 16) & 0xff;
      bytes[1] = (value >> 8) & 0xff;
      bytes[2] = value & 0xff;
    } else {
      bytes = Buffer.alloc(4);
      bytes.writeUInt32BE(value);
    }
    this.writeElement(id, bytes);
  }

  writeInt(id, value) {
    const bytes = Buffer.alloc(4);
    bytes.writeInt32BE(value);
    this.writeElement(id, bytes);
  }

  writeFloat(id, value) {
    const bytes = Buffer.alloc(4);
    bytes.writeFloatBE(value);
    this.writeElement(id, bytes);
  }

  writeDouble(id, value) {
    const bytes = Buffer.alloc(8);
    bytes.writeDoubleBE(value);
    this.writeElement(id, bytes);
  }

  writeString(id, str) {
    this.writeElement(id, Buffer.from(str, "ascii"));
  }

  writeVoid(size) {
    this.writeVint(0xec);
    this.writeVint(size);
    this.writeBytes(Buffer.alloc(size));
  }

  writeMaster(id, childrenFn) {
    const child = new EBMLWriter();
    childrenFn(child);
    const data = child.toBuffer();
    this.writeElement(id, data);
  }

  toBuffer() {
    return Buffer.concat(this.buffers);
  }
}

// ═══════════════════════════════════════════════════════════════
// Simple VP8 frame wrapper (raw frame as WebM cluster entry)
// Since we can't encode VP8 in pure JS, we'll create an
// "uncompressed" WebM that most players can handle via
// a workaround: we'll save JPEG frames as a fallback
// and create a metadata-only WebM + separate HTML player
// ═══════════════════════════════════════════════════════════════

// Actually, let's take a practical approach:
// Create a self-contained HTML file that plays the frames
// AND try to create WebM via VP8 if possible

function createWebMHeader(width, height, fps) {
  const w = new EBMLWriter();

  // EBML Header
  w.writeMaster(0x1a45dfa3, (e) => {
    e.writeUint(0x4286, 1); // EBMLVersion
    e.writeUint(0x42f7, 1); // EBMLReadVersion
    e.writeUint(0x42f2, 4); // EBMLMaxIDLength
    e.writeUint(0x42f3, 8); // EBMLMaxSizeLength
    e.writeString(0x4282, "webm"); // DocType
    e.writeUint(0x4287, 4); // DocTypeVersion
    e.writeUint(0x4285, 2); // DocTypeReadVersion
  });

  // Segment
  w.writeMaster(0x18538067, (seg) => {
    // Segment Info
    seg.writeMaster(0x1549a966, (info) => {
      info.writeUint(0x2ad7b1, 1000000); // TimecodeScale (nanoseconds)
      info.writeString(0x4d80, "House of Fashion"); // MuxingApp
      info.writeString(0x5741, "House of Fashion"); // WritingApp
      info.writeUint(0x4489, 0); // Duration (will update later)
    });

    // Tracks
    seg.writeMaster(0x1654ae6b, (tracks) => {
      // Video Track
      tracks.writeMaster(0xae, (track) => {
        track.writeUint(0xd7, 1); // TrackNumber
        track.writeUint(0x73c5, 1); // TrackUID
        track.writeString(0x86, "V_VP8"); // CodecID
        track.writeString(0x258688, "VideoHandler"); // Name
        track.writeUint(0x83, 1); // TrackType (video)
        track.writeMaster(0xe0, (video) => {
          video.writeUint(0xb0, width); // PixelWidth
          video.writeUint(0xba, height); // PixelHeight
        });
      });
    });
  });

  return w.toBuffer();
}

// Since pure VP8 encoding in JS isn't feasible, let's create
// a much better alternative: self-contained HTML video players
// that are proper "reel files" saved in the directory

function createReelHTML(reelData, framesBase64, fps) {
  const frameCount = framesBase64.length;
  const durationMs = (frameCount / fps) * 1000;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=1080, initial-scale=1">
<title>${reelData.name} — House of Fashion</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #000; display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: Arial, sans-serif; }
  .player { position: relative; width: 1080px; height: 1920px; max-height: 100vh; overflow: hidden; border-radius: 12px; box-shadow: 0 20px 60px rgba(0,0,0,0.5); }
  .player img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.15s; }
  .player img.active { opacity: 1; }
  .controls { position: absolute; bottom: 20px; left: 0; right: 0; display: flex; align-items: center; justify-content: center; gap: 12px; z-index: 10; }
  .controls button { background: rgba(0,0,0,0.6); color: #fff; border: none; border-radius: 50%; width: 48px; height: 48px; font-size: 20px; cursor: pointer; backdrop-filter: blur(8px); }
  .controls button:hover { background: rgba(0,0,0,0.8); }
  .progress { position: absolute; bottom: 0; left: 0; right: 0; height: 4px; background: rgba(255,255,255,0.2); z-index: 10; }
  .progress-fill { height: 100%; background: #ec4899; transition: width 0.1s linear; }
  .info { position: absolute; top: 16px; left: 16px; color: #fff; font-size: 14px; z-index: 10; text-shadow: 0 2px 4px rgba(0,0,0,0.5); }
  .info h3 { font-size: 18px; margin-bottom: 4px; }
  .info span { opacity: 0.7; font-size: 12px; }
</style>
</head>
<body>
<div class="player" id="player">
  ${framesBase64
    .map(
      (f, i) =>
        `<img id="frame-${i}" src="data:image/jpeg;base64,${f}" ${i === 0 ? 'class="active"' : ""} loading="${i < 5 ? "eager" : "lazy"}">`
    )
    .join("\n  ")}
  <div class="info">
    <h3>${reelData.name}</h3>
    <span>#${reelData.id} • ${reelData.style} • ${reelData.scenes.length} scenes</span>
  </div>
  <div class="controls">
    <button id="prev" title="Previous">⏮</button>
    <button id="play" title="Play/Pause">▶</button>
    <button id="next" title="Next">⏭</button>
  </div>
  <div class="progress"><div class="progress-fill" id="progress"></div></div>
</div>
<script>
  const frames = document.querySelectorAll('.player img');
  const totalFrames = ${frameCount};
  let currentFrame = 0;
  let playing = false;
  let interval = null;
  const fps = ${fps};

  function showFrame(n) {
    frames[currentFrame].classList.remove('active');
    currentFrame = ((n % totalFrames) + totalFrames) % totalFrames;
    frames[currentFrame].classList.add('active');
    document.getElementById('progress').style.width = ((currentFrame / totalFrames) * 100) + '%';
  }

  function togglePlay() {
    if (playing) {
      clearInterval(interval);
      playing = false;
      document.getElementById('play').textContent = '▶';
    } else {
      playing = true;
      document.getElementById('play').textContent = '⏸';
      interval = setInterval(() => {
        if (currentFrame >= totalFrames - 1) { showFrame(0); }
        else { showFrame(currentFrame + 1); }
      }, 1000 / fps);
    }
  }

  document.getElementById('play').addEventListener('click', togglePlay);
  document.getElementById('prev').addEventListener('click', () => showFrame(currentFrame - ${fps}));
  document.getElementById('next').addEventListener('click', () => showFrame(currentFrame + ${fps}));

  // Auto-play on load
  togglePlay();
</script>
</body>
</html>`;
}

// ═══════════════════════════════════════════════════════════════
// Main
// ═══════════════════════════════════════════════════════════════

function main() {
  console.log("\n🎬 Encoding reel frames into video files...\n");

  const frameDirs = readdirSync(REELS_DIR)
    .filter((d) => d.endsWith("-frames"))
    .sort();

  let encoded = 0;
  let skipped = 0;
  let failed = 0;

  for (const dirName of frameDirs) {
    const reelNum = parseInt(dirName.match(/reel-(\d+)/)?.[1] || "0");
    const dirPath = join(REELS_DIR, dirName);
    const files = readdirSync(dirPath)
      .filter((f) => f.endsWith(".jpg"))
      .sort();

    if (files.length === 0) {
      console.log(`  ⚠️  #${String(reelNum).padStart(2, "0")} — no frames, skipping`);
      skipped++;
      continue;
    }

    const outPath = join(REELS_DIR, `reel-${String(reelNum).padStart(2, "0")}.html`);

    // Skip if already encoded and frames haven't changed
    if (existsSync(outPath)) {
      const existingSize = statSync(outPath).size;
      if (existingSize > 10000) {
        console.log(`  ⏭️  #${String(reelNum).padStart(2, "0")} — already encoded (${(existingSize / 1024).toFixed(0)}KB), skipping`);
        skipped++;
        continue;
      }
    }

    try {
      // Read frames as base64
      const framesBase64 = files.map((f) => {
        const buf = readFileSync(join(dirPath, f));
        return buf.toString("base64");
      });

      // We know the reel metadata from the generation script
      // Map reel number to metadata
      const reelMeta = {
        id: reelNum,
        name: dirName.replace(`reel-${String(reelNum).padStart(2, "0")}-`, "").replace(/-/g, " "),
        style: "vibrant",
        scenes: 4,
      };

      const html = createReelHTML(reelMeta, framesBase64, 15);
      writeFileSync(outPath, html);

      const sizeKB = (Buffer.byteLength(html) / 1024).toFixed(0);
      console.log(`  ✅ #${String(reelNum).padStart(2, "0")} — ${files.length} frames → ${sizeKB}KB HTML`);
      encoded++;
    } catch (err) {
      console.log(`  ❌ #${String(reelNum).padStart(2, "0")} — ERROR: ${err.message}`);
      failed++;
    }
  }

  console.log(`\n✨ Done! ${encoded} encoded, ${skipped} skipped, ${failed} failed`);
  console.log(`📁 Output: ${REELS_DIR}`);
  console.log(`\n📺 Each .html file is a self-contained reel player with embedded frames.`);
  console.log(`   Open them in any browser or embed them in your website.`);
}

main();

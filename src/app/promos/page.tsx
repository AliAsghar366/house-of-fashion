"use client";

import { useState, useMemo, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Play, Pause, X, Grid3x3, LayoutList, Download, ExternalLink } from "lucide-react";
import { REEL_TEMPLATES } from "@/data/reels";

const STYLES = ["all", "bold", "elegant", "playful", "minimal", "luxury", "vibrant", "dark", "pastel"] as const;

function getVideoSrc(reelId: number): string {
  // Reels 1-24 have .mp4, reels 25-50 have .webm
  if (reelId <= 24) {
    return `/reels/reel-${String(reelId).padStart(2, "0")}.mp4`;
  }
  return `/reels/reel-${String(reelId).padStart(2, "0")}.webm`;
}

// ─── Reel Card ───────────────────────────────────────────────
function ReelCard({
  reel,
  onClick,
}: {
  reel: (typeof REEL_TEMPLATES)[0];
  onClick: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="cursor-pointer group"
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      onMouseEnter={() => {
        setIsHovered(true);
        videoRef.current?.play().catch(() => {});
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
      }}
    >
      <div className="relative rounded-xl overflow-hidden aspect-[9/16] border-2 border-ink/10 shadow-lg hover:shadow-xl transition-shadow bg-ink/5">
        {/* Video preview */}
        <video
          ref={videoRef}
          src={getVideoSrc(reel.id)}
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
          poster=""
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

        {/* Reel number */}
        <div className="absolute top-2 left-2">
          <span className="rounded-full bg-ink/50 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
            #{reel.id}
          </span>
        </div>

        {/* Play indicator */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="rounded-full bg-ink/50 p-1.5 backdrop-blur-sm">
            <Play size={12} className="text-white" />
          </div>
        </div>

        {/* Content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="font-display text-sm text-white leading-tight drop-shadow-lg">
            {reel.name}
          </h3>
          <p className="text-[10px] text-white/70 mt-0.5">{reel.tagline}</p>
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[9px] font-medium text-white/80 capitalize backdrop-blur-sm">
              {reel.style}
            </span>
            <span className="text-[9px] text-white/50">{reel.duration}s</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Expanded Video Player ───────────────────────────────────
function VideoPlayer({
  reel,
  onClose,
}: {
  reel: (typeof REEL_TEMPLATES)[0];
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = getVideoSrc(reel.id);
    a.download = `reel-${reel.id}-${reel.name.toLowerCase().replace(/\s+/g, "-")}${reel.id <= 24 ? ".mp4" : ".webm"}`;
    a.click();
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-[360px]"
        initial={{ scale: 0.8, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 40 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Video viewport */}
        <div className="relative rounded-2xl overflow-hidden aspect-[9/16] shadow-2xl border-2 border-white/10 bg-ink">
          <video
            ref={videoRef}
            src={getVideoSrc(reel.id)}
            autoPlay
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            onClick={togglePlay}
          />

          {/* Pause overlay */}
          {!isPlaying && (
            <div
              className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer"
              onClick={togglePlay}
            >
              <div className="rounded-full bg-white/30 p-4 backdrop-blur-sm">
                <Play size={32} className="text-white ml-1" />
              </div>
            </div>
          )}

          {/* Reel info overlay */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
            <span className="rounded-full bg-ink/50 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
              #{reel.id}
            </span>
            <span className="rounded-full bg-ink/50 px-2 py-0.5 text-[10px] text-white/70 backdrop-blur-sm">
              {reel.duration}s
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 mt-4">
          <button
            onClick={togglePlay}
            className="rounded-full bg-white/10 hover:bg-white/20 p-3 text-white transition-colors"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>

          <button
            onClick={handleDownload}
            className="rounded-full bg-secondary hover:bg-secondary/80 px-4 py-2 text-white text-sm font-semibold transition-colors flex items-center gap-2"
          >
            <Download size={14} />
            Download {reel.id <= 24 ? "MP4" : "WebM"}
          </button>

          <button
            onClick={onClose}
            className="rounded-full bg-white/10 hover:bg-white/20 p-3 text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Reel details */}
        <div className="text-center mt-3">
          <h3 className="font-display text-lg text-white">{reel.name}</h3>
          <p className="text-white/60 text-xs mt-0.5">{reel.tagline}</p>
          <div className="flex justify-center gap-1 mt-2">
            {reel.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/40">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Page ───────────────────────────────────────────────
export default function PromosPage() {
  const [search, setSearch] = useState("");
  const [styleFilter, setStyleFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [view, setView] = useState<"grid" | "list">("grid");

  const filteredReels = useMemo(() => {
    return REEL_TEMPLATES.filter((reel) => {
      const matchSearch =
        search === "" ||
        reel.name.toLowerCase().includes(search.toLowerCase()) ||
        reel.tagline.toLowerCase().includes(search.toLowerCase()) ||
        reel.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      const matchStyle = styleFilter === "all" || reel.style === styleFilter;
      return matchSearch && matchStyle;
    });
  }, [search, styleFilter]);

  const expandedReel = expandedId !== null ? REEL_TEMPLATES.find((r) => r.id === expandedId) : null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.h1
          className="font-display text-4xl sm:text-5xl lg:text-6xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          50 Promotional Reels
        </motion.h1>
        <motion.p
          className="mt-3 text-ink/60 max-w-xl mx-auto text-sm sm:text-base"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Pre-rendered promotional videos ready for Instagram, TikTok, and Facebook.
          Click any reel to preview, then download the video file.
        </motion.p>
        <motion.div
          className="flex items-center justify-center gap-4 mt-4 text-xs text-ink/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span>📱 1080×1920 Portrait</span>
          <span>•</span>
          <span>🎬 15s Each</span>
          <span>•</span>
          <span>⬇️ Direct Download</span>
        </motion.div>
      </div>

      {/* Controls Bar */}
      <motion.div
        className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        {/* Search */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
          <input
            type="text"
            placeholder="Search reels... (e.g. sale, eid, jewelry)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border-2 border-ink/10 bg-white pl-9 pr-4 py-2.5 text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:border-secondary transition-colors"
          />
        </div>

        {/* Style filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {STYLES.map((style) => (
            <button
              key={style}
              onClick={() => setStyleFilter(style)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                styleFilter === style
                  ? "bg-ink text-cream shadow-md"
                  : "bg-white text-ink/60 border border-ink/10 hover:border-ink/30"
              }`}
            >
              {style}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setView("grid")}
            className={`p-2 rounded-lg transition-colors ${view === "grid" ? "bg-ink text-cream" : "bg-white text-ink/40 hover:text-ink/60"}`}
          >
            <Grid3x3 size={16} />
          </button>
          <button
            onClick={() => setView("list")}
            className={`p-2 rounded-lg transition-colors ${view === "list" ? "bg-ink text-cream" : "bg-white text-ink/40 hover:text-ink/60"}`}
          >
            <LayoutList size={16} />
          </button>
        </div>
      </motion.div>

      {/* Results count */}
      <div className="mb-4 text-xs text-ink/40 font-medium">
        Showing {filteredReels.length} of {REEL_TEMPLATES.length} reels
      </div>

      {/* Grid / List */}
      {view === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {filteredReels.map((reel, idx) => (
            <motion.div
              key={reel.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.02 }}
            >
              <ReelCard reel={reel} onClick={() => setExpandedId(reel.id)} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredReels.map((reel, idx) => (
            <motion.div
              key={reel.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.02 }}
              onClick={() => setExpandedId(reel.id)}
              className="flex items-center gap-4 rounded-xl border-2 border-ink/10 bg-white p-3 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group"
            >
              {/* Video thumbnail */}
              <div className="w-16 h-28 rounded-lg overflow-hidden flex-shrink-0 relative bg-ink/5">
                <video
                  src={getVideoSrc(reel.id)}
                  muted
                  preload="metadata"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play size={16} className="text-white" />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-ink/30">#{reel.id}</span>
                  <h3 className="font-display text-base truncate">{reel.name}</h3>
                </div>
                <p className="text-xs text-ink/50 mt-0.5">{reel.tagline}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="rounded-full bg-ink/5 px-2 py-0.5 text-[10px] font-medium text-ink/50 capitalize">
                    {reel.style}
                  </span>
                  <span className="text-[10px] text-ink/30">{reel.duration}s</span>
                  <span className="text-[10px] text-ink/30">{reel.id <= 24 ? "MP4" : "WebM"}</span>
                </div>
              </div>

              <div className="text-ink/20 group-hover:text-secondary transition-colors">
                <ExternalLink size={16} />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {filteredReels.length === 0 && (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">🔍</p>
          <p className="font-display text-xl text-ink/40">No reels found</p>
          <p className="text-sm text-ink/30 mt-1">Try a different search or filter</p>
        </div>
      )}

      {/* Expanded Player */}
      <AnimatePresence>
        {expandedReel && (
          <VideoPlayer reel={expandedReel} onClose={() => setExpandedId(null)} />
        )}
      </AnimatePresence>

      {/* File listing */}
      <motion.div
        className="mt-12 rounded-xl border-2 border-ink/10 bg-white p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="font-display text-xl mb-3">📁 Saved Video Files</h2>
        <p className="text-sm text-ink/60 mb-4">
          All 50 reels are saved as video files in the <code className="bg-ink/5 px-1 rounded">public/reels/</code> directory.
          Reels 1-24 are MP4, reels 25-50 are WebM. All are 1080×1920 portrait format at 15 seconds each.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 text-xs">
          {Array.from({ length: 50 }, (_, i) => {
            const reel = REEL_TEMPLATES[i];
            const ext = reel.id <= 24 ? "mp4" : "webm";
            return (
              <div key={i} className="flex items-center gap-1.5 text-ink/40">
                <span className="w-5 text-right font-mono text-ink/30">#{String(reel.id).padStart(2, "0")}</span>
                <span className="truncate">{reel.name.toLowerCase().replace(/\s+/g, "-")}.{ext}</span>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-ink hover:bg-primary-dark transition-colors"
          >
            Back to Store
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-lg bg-ink px-5 py-2.5 text-sm font-semibold text-cream hover:bg-ink/85 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

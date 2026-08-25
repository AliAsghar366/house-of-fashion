"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Play, Download, ExternalLink, Grid3x3, LayoutList } from "lucide-react";
import { REEL_TEMPLATES } from "@/data/reels";
import { ReelPlayer } from "@/components/ReelPlayer";

const STYLES = ["all", "bold", "elegant", "playful", "minimal", "luxury", "vibrant", "dark", "pastel"] as const;

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
          50 AI-Generated Reels
        </motion.h1>
        <motion.p
          className="mt-3 text-ink/60 max-w-xl mx-auto text-sm sm:text-base"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Professional promotional reels for your social media. Click any reel to preview the animation,
          then export it as a video file — ready for Instagram, TikTok, or Facebook.
        </motion.p>
        <motion.div
          className="flex items-center justify-center gap-4 mt-4 text-xs text-ink/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span>📱 9:16 Portrait</span>
          <span>•</span>
          <span>🎬 3-4 Scenes Each</span>
          <span>•</span>
          <span>⬇️ Export as Video</span>
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

        {/* Style filter pills */}
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
              onClick={() => setExpandedId(reel.id)}
            >
              <ReelPlayer reel={reel} />
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
              {/* Mini thumbnail */}
              <div
                className={`w-16 h-28 rounded-lg bg-gradient-to-b ${reel.scenes[0].bg} flex items-center justify-center flex-shrink-0 relative overflow-hidden`}
              >
                <span className="text-2xl">{reel.scenes[0].emoji}</span>
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
                  <span className="text-[10px] text-ink/30">{reel.scenes.length} scenes</span>
                  <span className="text-[10px] text-ink/30">{reel.duration}s</span>
                </div>
              </div>

              {/* Arrow */}
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
          <ReelPlayer
            reel={expandedReel}
            isExpanded={true}
            onClose={() => setExpandedId(null)}
          />
        )}
      </AnimatePresence>

      {/* Instructions */}
      <motion.div
        className="mt-12 rounded-xl border-2 border-ink/10 bg-white p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="font-display text-xl mb-3">📱 How to Use These Reels</h2>
        <ol className="space-y-2 text-sm text-ink/70">
          <li><strong>1.</strong> Click any reel card above to open the full-screen player</li>
          <li><strong>2.</strong> Press play to watch the animated scenes auto-advance</li>
          <li><strong>3.</strong> Click &quot;Export Video&quot; to download as a .webm video file</li>
          <li><strong>4.</strong> Convert to MP4 using any free tool (CloudConvert, FFmpeg, etc.)</li>
          <li><strong>5.</strong> Add trending audio in Instagram/TikTok before posting</li>
          <li><strong>6.</strong> Post with hashtags like #HouseOfFashion #PakistaniFashion #OOTD</li>
        </ol>
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
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 rounded-lg border-2 border-ink/10 px-5 py-2.5 text-sm font-semibold text-ink hover:bg-ink/5 transition-colors"
          >
            <ExternalLink size={14} /> Admin Panel
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

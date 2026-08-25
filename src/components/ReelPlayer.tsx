"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Download, Maximize2, X } from "lucide-react";
import type { ReelTemplate } from "@/data/reels";

// ─── Effect helpers ───────────────────────────────────────────
function getEffectVariants(effect?: string) {
  switch (effect) {
    case "zoom":
      return {
        initial: { scale: 0.3, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 1.5, opacity: 0 },
      } as const;
    case "slide-up":
      return {
        initial: { y: 120, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: -120, opacity: 0 },
      } as const;
    case "fade-scale":
      return {
        initial: { scale: 0.8, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 0.8, opacity: 0 },
      } as const;
    case "spin-in":
      return {
        initial: { rotate: -180, scale: 0, opacity: 0 },
        animate: { rotate: 0, scale: 1, opacity: 1 },
        exit: { rotate: 180, scale: 0, opacity: 0 },
      } as const;
    case "bounce-in":
      return {
        initial: { scale: 0.1, opacity: 0 },
        animate: { scale: 1, opacity: 1, transition: { type: "spring" as const, stiffness: 200, damping: 12 } },
        exit: { scale: 0.1, opacity: 0 },
      } as const;
    case "glitch":
      return {
        initial: { x: -20, opacity: 0, filter: "blur(4px)" },
        animate: { x: 0, opacity: 1, filter: "blur(0px)" },
        exit: { x: 20, opacity: 0, filter: "blur(4px)" },
      } as const;
    case "ripple":
      return {
        initial: { scale: 0, opacity: 0, borderRadius: "50%" },
        animate: { scale: 1, opacity: 1, borderRadius: "0%" },
        exit: { scale: 2, opacity: 0 },
      } as const;
    case "float":
      return {
        initial: { y: 40, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: -40, opacity: 0 },
      } as const;
    case "shimmer":
      return {
        initial: { opacity: 0, backgroundPosition: "-200% 0" },
        animate: { opacity: 1, backgroundPosition: "200% 0" },
        exit: { opacity: 0 },
      } as const;
    default:
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      } as const;
  }
}

// ─── Floating particles ──────────────────────────────────────
function Particles() {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 2 + Math.random() * 6,
    duration: 3 + Math.random() * 4,
    delay: Math.random() * 2,
    opacity: 0.15 + Math.random() * 0.25,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            opacity: [p.opacity, p.opacity * 1.5, p.opacity],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ─── Scene renderer ──────────────────────────────────────────
function SceneSlide({ scene, isActive }: { scene: ReelTemplate["scenes"][0]; isActive: boolean }) {
  const variants = getEffectVariants(scene.effect);
  const textColor = scene.textColor || "text-ink";

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          key={scene.title}
          className={`absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b ${scene.bg} p-6 text-center`}
          initial={variants.initial}
          animate={variants.animate}
          exit={variants.exit}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Particles />

          {scene.emoji && (
            <motion.div
              className="text-7xl mb-4"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              {scene.emoji}
            </motion.div>
          )}

          <motion.h2
            className={`font-display text-4xl sm:text-5xl leading-tight whitespace-pre-line ${textColor}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {scene.title}
          </motion.h2>

          {scene.subtitle && (
            <motion.p
              className={`mt-3 text-lg font-medium ${textColor} opacity-80`}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 0.8 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              {scene.subtitle}
            </motion.p>
          )}

          {/* Bottom branding bar */}
          <motion.div
            className="absolute bottom-4 left-0 right-0 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <span className={`text-xs font-semibold tracking-wider ${textColor} opacity-50 uppercase`}>
              House of Fashion
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Main ReelPlayer ─────────────────────────────────────────
type ReelPlayerProps = {
  reel: ReelTemplate;
  isExpanded?: boolean;
  onClose?: () => void;
};

export function ReelPlayer({ reel, isExpanded, onClose }: ReelPlayerProps) {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const sceneDuration = (reel.duration * 1000) / reel.scenes.length;

  // Auto-play on expand
  useEffect(() => {
    if (isExpanded) {
      setCurrentScene(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isExpanded]);

  // Scene advancement
  useEffect(() => {
    if (!isPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setCurrentScene((prev) => {
        const next = prev + 1;
        if (next >= reel.scenes.length) {
          setIsPlaying(false);
          return 0;
        }
        setProgress((next / reel.scenes.length) * 100);
        return next;
      });
    }, sceneDuration);

    setProgress((currentScene / reel.scenes.length) * 100);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentScene, reel.scenes.length, sceneDuration]);

  const togglePlay = useCallback(() => {
    if (currentScene >= reel.scenes.length - 1 && !isPlaying) {
      setCurrentScene(0);
      setProgress(0);
    }
    setIsPlaying((p) => !p);
  }, [currentScene, reel.scenes.length, isPlaying]);

  // Export as video using MediaRecorder
  const exportVideo = useCallback(async () => {
    if (!containerRef.current || isRecording) return;

    try {
      setIsRecording(true);
      recordedChunksRef.current = [];

      // Use html-canvas capture via canvas API
      const canvas = document.createElement("canvas");
      canvas.width = 1080;
      canvas.height = 1920;
      const ctx = canvas.getContext("2d")!;
      const stream = canvas.captureStream(30);

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm;codecs=vp9",
        videoBitsPerSecond: 5000000,
      });

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `reel-${reel.id}-${reel.name.toLowerCase().replace(/\s+/g, "-")}.webm`;
        a.click();
        URL.revokeObjectURL(url);
        setIsRecording(false);
      };

      mediaRecorder.start();

      // Render each scene to canvas
      for (let i = 0; i < reel.scenes.length; i++) {
        const scene = reel.scenes[i];
        const frameCount = Math.round(sceneDuration / (1000 / 30)); // 30fps

        for (let f = 0; f < frameCount; f++) {
          const t = f / frameCount;

          // Draw gradient background
          const gradient = ctx.createLinearGradient(0, 0, 0, 1920);
          const colors = scene.bg
            .replace("from-", "")
            .replace("via-", "")
            .replace("to-", "")
            .split(" ")
            .map((c) => {
              const map: Record<string, string> = {
                "pink-300": "#f9a8d4",
                "pink-400": "#f472b6",
                "pink-500": "#ec4899",
                "rose-200": "#fecdd3",
                "rose-300": "#fda4af",
                "rose-400": "#fb7185",
                "rose-500": "#f43f5e",
                "fuchsia-300": "#e879f9",
                "fuchsia-400": "#d946ef",
                "fuchsia-500": "#d946ef",
                "purple-200": "#e9d5ff",
                "purple-300": "#d8b4fe",
                "purple-400": "#c084fc",
                "purple-500": "#a855f7",
                "amber-100": "#fef3c7",
                "amber-200": "#fde68a",
                "amber-300": "#fcd34d",
                "amber-400": "#fbbf24",
                "amber-500": "#f59e0b",
                "amber-600": "#d97706",
                "yellow-100": "#fef9c3",
                "yellow-200": "#fef08a",
                "yellow-300": "#fde047",
                "yellow-400": "#facc15",
                "yellow-500": "#eab308",
                "orange-100": "#ffedd5",
                "orange-200": "#fed7aa",
                "orange-300": "#fdba74",
                "orange-400": "#fb923c",
                "orange-500": "#f97316",
                "red-300": "#fca5a5",
                "red-400": "#f87171",
                "red-500": "#ef4444",
                "red-600": "#dc2626",
                "red-700": "#b91c1c",
                "green-200": "#bbf7d0",
                "green-300": "#86efac",
                "green-400": "#4ade80",
                "green-500": "#22c55e",
                "green-600": "#16a34a",
                "green-700": "#15803d",
                "emerald-100": "#d1fae5",
                "emerald-200": "#a7f3d0",
                "emerald-300": "#6ee7b7",
                "emerald-400": "#34d399",
                "emerald-500": "#10b981",
                "emerald-600": "#059669",
                "teal-100": "#ccfbf1",
                "teal-200": "#99f6e4",
                "teal-300": "#5eead4",
                "teal-400": "#2dd4bf",
                "teal-500": "#14b8a6",
                "teal-600": "#0d9488",
                "cyan-100": "#cffafe",
                "cyan-200": "#a5f3fc",
                "cyan-300": "#67e8f9",
                "cyan-400": "#22d3ee",
                "cyan-500": "#06b6d4",
                "sky-100": "#e0f2fe",
                "sky-200": "#bae6fd",
                "sky-300": "#7dd3fc",
                "sky-400": "#38bdf8",
                "sky-500": "#0ea5e9",
                "blue-100": "#dbeafe",
                "blue-200": "#bfdbfe",
                "blue-300": "#93c5fd",
                "blue-400": "#60a5fa",
                "blue-500": "#3b82f6",
                "blue-600": "#2563eb",
                "indigo-100": "#e0e7ff",
                "indigo-200": "#c7d2fe",
                "indigo-300": "#a5b4fc",
                "indigo-400": "#818cf8",
                "indigo-500": "#6366f1",
                "indigo-600": "#4f46e5",
                "violet-100": "#ede9fe",
                "violet-200": "#ddd6fe",
                "violet-300": "#c4b5fd",
                "violet-400": "#a78bfa",
                "violet-500": "#8b5cf6",
                "violet-600": "#7c3aed",
                "gray-100": "#f3f4f6",
                "gray-200": "#e5e7eb",
                "gray-300": "#d1d5db",
                "gray-400": "#9ca3af",
                "gray-500": "#6b7280",
                "gray-600": "#4b5563",
                "gray-700": "#374151",
                "gray-800": "#1f2937",
                "slate-100": "#f1f5f9",
                "slate-200": "#e2e8f0",
                "slate-300": "#cbd5e1",
                "slate-400": "#94a3b8",
                "slate-500": "#64748b",
                "slate-600": "#475569",
                "zinc-100": "#f4f4f5",
                "zinc-200": "#e4e4e7",
                "zinc-300": "#d4d4d8",
                "ink": "#191510",
                white: "#ffffff",
              };
              return map[c] || "#cccccc";
            });

          gradient.addColorStop(0, colors[0] || "#cccccc");
          if (colors[1]) gradient.addColorStop(0.5, colors[1]);
          if (colors[2]) gradient.addColorStop(1, colors[2]);
          else if (colors[0]) gradient.addColorStop(1, colors[0]);

          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, 1080, 1920);

          // Animated zoom effect
          const scale = scene.effect === "zoom" ? 0.9 + t * 0.2 : 1;
          const alpha = Math.min(1, t * 3);

          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.translate(540, 960);
          ctx.scale(scale, scale);
          ctx.translate(-540, -960);

          // Draw emoji
          if (scene.emoji) {
            ctx.font = "120px serif";
            ctx.textAlign = "center";
            const emojiY = 680 + Math.sin(t * Math.PI * 2) * 15;
            ctx.fillText(scene.emoji, 540, emojiY);
          }

          // Draw title
          const titleLines = scene.title.split("\n");
          ctx.fillStyle = scene.textColor === "text-cream" || scene.textColor === "text-white" ? "#fff8e7" : "#191510";
          ctx.font = "bold 80px Georgia, serif";
          ctx.textAlign = "center";
          titleLines.forEach((line, li) => {
            ctx.fillText(line, 540, 850 + li * 90);
          });

          // Draw subtitle
          if (scene.subtitle) {
            ctx.font = "36px Arial, sans-serif";
            ctx.fillStyle =
              scene.textColor === "text-cream" || scene.textColor === "text-white"
                ? "rgba(255,248,231,0.8)"
                : "rgba(25,21,16,0.7)";
            ctx.fillText(scene.subtitle, 540, 860 + titleLines.length * 90 + 40);
          }

          // Draw branding
          ctx.font = "20px Arial, sans-serif";
          ctx.fillStyle = "rgba(128,128,128,0.5)";
          ctx.textAlign = "center";
          ctx.fillText("HOUSE OF FASHION", 540, 1870);

          // Draw progress bar
          const barProgress = (i + t) / reel.scenes.length;
          ctx.fillStyle = "rgba(0,0,0,0.2)";
          ctx.fillRect(0, 1890, 1080, 6);
          ctx.fillStyle = "rgba(255,255,255,0.8)";
          ctx.fillRect(0, 1890, 1080 * barProgress, 6);

          ctx.restore();
        }
      }

      mediaRecorder.stop();
    } catch (err) {
      console.error("Export failed:", err);
      setIsRecording(false);
      alert("Video export failed. Try using a screen recorder instead.");
    }
  }, [reel, sceneDuration, isRecording]);

  // ─── Thumbnail Card (compact) ──────────────────────────────
  const firstScene = reel.scenes[0];

  if (!isExpanded) {
    return (
      <motion.div
        className="cursor-pointer group"
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.97 }}
      >
        <div
          className={`relative rounded-xl overflow-hidden aspect-[9/16] bg-gradient-to-b ${firstScene.bg} border-2 border-ink/10 shadow-lg hover:shadow-xl transition-shadow`}
        >
          {/* Floating particles */}
          <Particles />

          {/* Content */}
          <div className="relative h-full flex flex-col items-center justify-center p-4 text-center">
            {firstScene.emoji && (
              <motion.span
                className="text-5xl mb-3"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {firstScene.emoji}
              </motion.span>
            )}

            <h3 className={`font-display text-xl leading-tight whitespace-pre-line ${firstScene.textColor || "text-ink"}`}>
              {firstScene.title}
            </h3>

            {firstScene.subtitle && (
              <p className={`text-xs mt-1 opacity-70 ${firstScene.textColor || "text-ink"}`}>
                {firstScene.subtitle}
              </p>
            )}
          </div>

          {/* Reel number badge */}
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

          {/* CTA at bottom */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent p-3 pt-8">
            <span className="text-[10px] font-bold text-white uppercase tracking-wider opacity-80">
              {reel.style} • {reel.scenes.length} scenes
            </span>
          </div>
        </div>
      </motion.div>
    );
  }

  // ─── Expanded Player ───────────────────────────────────────
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
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
        {/* The reel viewport */}
        <div
          ref={containerRef}
          className="relative rounded-2xl overflow-hidden aspect-[9/16] shadow-2xl border-2 border-white/10"
        >
          {reel.scenes.map((scene, idx) => (
            <SceneSlide key={idx} scene={scene} isActive={currentScene === idx} />
          ))}

          {/* Progress dots */}
          <div className="absolute bottom-14 left-0 right-0 flex justify-center gap-1.5 z-10">
            {reel.scenes.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 rounded-full transition-all duration-300 ${
                  idx <= currentScene ? "bg-white w-6" : "bg-white/30 w-3"
                }`}
              />
            ))}
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
            onClick={exportVideo}
            disabled={isRecording}
            className="rounded-full bg-secondary hover:bg-secondary/80 px-4 py-2 text-white text-sm font-semibold transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Download size={14} />
            {isRecording ? "Recording..." : "Export Video"}
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="rounded-full bg-white/10 hover:bg-white/20 p-3 text-white transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Reel info */}
        <div className="text-center mt-3">
          <p className="text-white/70 text-xs font-medium">{reel.tagline}</p>
          <div className="flex justify-center gap-1 mt-1">
            {reel.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/50">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

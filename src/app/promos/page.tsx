"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, ArrowRight, ExternalLink, Download } from "lucide-react";
import { categories } from "@/data/categories";

// 20+ promotional reel cards with different themes
const PROMOS = [
  { id: 1, title: "Summer Fragrances", subtitle: "Up to 30% off", emoji: "🌸", gradient: "from-pink-300 to-rose-200", category: "perfumes" },
  { id: 2, title: "Handbag Drop", subtitle: "New arrivals weekly", emoji: "👜", gradient: "from-amber-200 to-yellow-100", category: "handbags" },
  { id: 3, title: "Jewelry Sale", subtitle: "Statement pieces from Rs 800", emoji: "💎", gradient: "from-yellow-200 to-amber-100", category: "jewelry" },
  { id: 4, title: "Cushion Collection", subtitle: "Cozy up this winter", emoji: "🛋️", gradient: "from-orange-200 to-amber-100", category: "cushions" },
  { id: 5, title: "Sunglasses Week", subtitle: "UV400 protection", emoji: "🕶️", gradient: "from-gray-200 to-slate-100", category: "sunglasses" },
  { id: 6, title: "Silk Scarves", subtitle: "Hand-rolled luxury", emoji: "🧣", gradient: "from-purple-200 to-pink-100", category: "scarves" },
  { id: 7, title: "Leather Wallets", subtitle: "Genuine leather", emoji: "👛", gradient: "from-amber-300 to-orange-100", category: "wallets" },
  { id: 8, title: "Hair Clips & Pins", subtitle: "Pearl & velvet", emoji: "🎀", gradient: "from-pink-200 to-rose-100", category: "hair-accessories" },
  { id: 9, title: "Watch Collection", subtitle: "Minimalist to bold", emoji: "⌚", gradient: "from-gray-300 to-zinc-100", category: "watches" },
  { id: 10, title: "Scented Candles", subtitle: "Set the mood", emoji: "🕯️", gradient: "from-orange-200 to-amber-50", category: "candles" },
  { id: 11, title: "Decorative Vases", subtitle: "Sculptural pieces", emoji: "🏺", gradient: "from-rose-200 to-orange-50", category: "vases" },
  { id: 12, title: "Premium Belts", subtitle: "Genuine leather", emoji: "👗", gradient: "from-amber-200 to-yellow-50", category: "belts" },
  { id: 13, title: "Men's Shalwar Kameez", subtitle: "Classic & formal", emoji: "🧵", gradient: "from-green-200 to-emerald-50", category: "mens-shalwar-kameez" },
  { id: 14, title: "Lawn Suits", subtitle: "Unstitched 3-piece", emoji: "🧶", gradient: "from-teal-200 to-cyan-50", category: "womens-lawn-suits" },
  { id: 15, title: "Kids' Wear", subtitle: "Festival-ready outfits", emoji: "🧒", gradient: "from-blue-200 to-indigo-50", category: "kids-traditional-wear" },
  { id: 16, title: "Kitchen Storage", subtitle: "Airtight & stackable", emoji: "🥡", gradient: "from-green-200 to-lime-50", category: "kitchen-storage" },
  { id: 17, title: "Desk Stationery", subtitle: "Aesthetic essentials", emoji: "✏️", gradient: "from-purple-200 to-violet-50", category: "stationery-desk" },
  { id: 18, title: "Bathroom Finds", subtitle: "Miniso-style upgrades", emoji: "🧴", gradient: "from-cyan-200 to-sky-50", category: "bathroom-accessories" },
  { id: 19, title: "Bedsheet Sets", subtitle: "Sleep in luxury", emoji: "🛏️", gradient: "from-indigo-200 to-blue-50", category: "bedsheets" },
  { id: 20, title: "Flash Sale", subtitle: "Up to 40% off", emoji: "🔥", gradient: "from-red-300 to-orange-100", category: "shop" },
  { id: 21, title: "Free Shipping", subtitle: "Orders over Rs 5000", emoji: "🚚", gradient: "from-green-300 to-emerald-100", category: "shop" },
  { id: 22, title: "New Arrivals", subtitle: "Just dropped this week", emoji: "✨", gradient: "from-yellow-200 to-amber-100", category: "shop" },
  { id: 23, title: "Bulk Orders", subtitle: "Wholesale pricing available", emoji: "📦", gradient: "from-slate-200 to-gray-100", category: "shop" },
  { id: 24, title: "Gift Ideas", subtitle: "Perfect for every occasion", emoji: "🎁", gradient: "from-pink-300 to-purple-100", category: "shop" },
];

export default function PromosPage() {
  const [playingId, setPlayingId] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="font-display text-4xl sm:text-5xl">Promotional Reels</h1>
        <p className="mt-2 text-ink/60 max-w-lg mx-auto">
          24 Instagram-ready promo cards — screen-record each one for a 20-second reel. Each card animates automatically with the website theme.
        </p>
        <p className="mt-2 text-xs text-ink/40">
          Tip: Click any card to preview the animation. Screen-record at 1080×1920 for Instagram Reels.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {PROMOS.map((promo, idx) => (
          <motion.div
            key={promo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.03 }}
          >
            <div
              onClick={() => setPlayingId(playingId === promo.id ? null : promo.id)}
              className="cursor-pointer"
            >
              {/* Reel Card (9:16 aspect ratio for Instagram) */}
              <div
                className={`relative rounded-xl overflow-hidden aspect-[9/16] bg-gradient-to-b ${promo.gradient} border-2 border-ink/10 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all group`}
              >
                {/* Animated background pattern */}
                <div className="absolute inset-0 overflow-hidden">
                  <motion.div
                    className="absolute top-0 left-0 w-full h-full opacity-10"
                    animate={playingId === promo.id ? {
                      backgroundPosition: ["0% 0%", "100% 100%"],
                    } : {}}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    style={{
                      backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(0,0,0,0.1) 20px, rgba(0,0,0,0.1) 40px)",
                      backgroundSize: "200% 200%",
                    }}
                  />
                </div>

                {/* Content */}
                <div className="relative h-full flex flex-col items-center justify-between p-4 text-center">
                  <motion.span
                    className="text-6xl"
                    animate={playingId === promo.id ? {
                      scale: [1, 1.2, 1],
                      rotate: [0, 5, -5, 0],
                    } : {}}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    {promo.emoji}
                  </motion.span>

                  <div>
                    <motion.h3
                      className="font-display text-xl text-ink leading-tight"
                      animate={playingId === promo.id ? { y: [0, -5, 0] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {promo.title}
                    </motion.h3>
                    <p className="text-sm text-ink/70 mt-1 font-semibold">{promo.subtitle}</p>
                  </div>

                  <Link
                    href={promo.category === "shop" ? "/shop" : `/shop/${promo.category}`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 rounded-full bg-ink text-cream px-4 py-2 text-xs font-bold hover:bg-ink/85 transition-colors"
                  >
                    Shop Now <ArrowRight size={12} />
                  </Link>
                </div>

                {/* Play/Pause indicator */}
                <div className="absolute top-2 right-2">
                  <div className="rounded-full bg-ink/50 p-1.5">
                    {playingId === promo.id ? (
                      <div className="w-3 h-3 flex gap-0.5">
                        <div className="w-1 h-3 bg-white rounded-full" />
                        <div className="w-1 h-3 bg-white rounded-full" />
                      </div>
                    ) : (
                      <Play size={12} className="text-white" />
                    )}
                  </div>
                </div>

                {/* Reel number */}
                <div className="absolute top-2 left-2">
                  <span className="rounded-full bg-ink/50 px-2 py-0.5 text-[10px] font-bold text-white">
                    #{promo.id}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Instructions */}
      <div className="mt-12 rounded-xl border-2 border-ink/10 bg-white p-6">
        <h2 className="font-display text-xl mb-3">📱 How to Create Instagram Reels</h2>
        <ol className="space-y-2 text-sm text-ink/70">
          <li>1. Click any card above to start its animation</li>
          <li>2. Use your phone&apos;s screen recorder (or a desktop tool like OBS)</li>
          <li>3. Record for 15-20 seconds — the animation loops automatically</li>
          <li>4. Crop to 1080×1920 (9:16 portrait) for Instagram Reels</li>
          <li>5. Add trending audio in the Instagram app</li>
          <li>6. Post with hashtags like #HouseOfFashion #PakistaniFashion #OOTD</li>
        </ol>
        <div className="mt-4 flex gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-ink hover:bg-primary-dark transition-colors"
          >
            Back to Store
          </Link>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 rounded-lg bg-ink px-5 py-2.5 text-sm font-semibold text-cream hover:bg-ink/85 transition-colors"
          >
            <ExternalLink size={14} /> Admin Panel
          </Link>
        </div>
      </div>
    </div>
  );
}

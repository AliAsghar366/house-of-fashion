"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { categories } from "@/data/categories";

// 6 Hero banners with different themes matching the website palette
const BANNERS = [
  {
    id: 1,
    title: "Fresh Fragrances",
    subtitle: "Scents that turn heads",
    gradient: "from-[#fef3b0] via-[#fff3d0] to-[#fff8e7]",
    accentColor: "#e8734a",
    image: "/images/products/perfumes/1.jpg",
    link: "/shop/perfumes",
    emoji: "🌸",
  },
  {
    id: 2,
    title: "Handbag Collection",
    subtitle: "Carry it with attitude",
    gradient: "from-[#fff8e7] via-[#fef3b0] to-[#61ce70]/20",
    accentColor: "#61ce70",
    image: "/images/products/handbags/2.jpg",
    link: "/shop/handbags",
    emoji: "👜",
  },
  {
    id: 3,
    title: "Jewelry & Gems",
    subtitle: "Shine on your own terms",
    gradient: "from-[#fff3d0] via-[#fef3b0] to-[#e8734a]/10",
    accentColor: "#fef3b0",
    image: "/images/products/jewelry/3.jpg",
    link: "/shop/jewelry",
    emoji: "💎",
  },
  {
    id: 4,
    title: "Traditional Wear",
    subtitle: "Timeless elegance, modern style",
    gradient: "from-[#61ce70]/10 via-[#fef3b0] to-[#fff8e7]",
    accentColor: "#61ce70",
    image: "/images/products/womens-lawn-suits/1.jpg",
    link: "/shop/womens-lawn-suits",
    emoji: "🧶",
  },
  {
    id: 5,
    title: "Home & Decor",
    subtitle: "Style every corner",
    gradient: "from-[#fff8e7] via-[#fff3d0] to-[#fef3b0]",
    accentColor: "#e8734a",
    image: "/images/products/cushions/2.jpg",
    link: "/shop/cushions",
    emoji: "🛋️",
  },
  {
    id: 6,
    title: "Watches & Eyewear",
    subtitle: "Details that define you",
    gradient: "from-[#fef3b0] via-[#fff8e7] to-[#fff3d0]",
    accentColor: "#191510",
    image: "/images/products/watches/1.jpg",
    link: "/shop/watches",
    emoji: "⌚",
  },
];

export function Hero() {
  const [activeBanner, setActiveBanner] = useState(0);
  const current = BANNERS[activeBanner];

  // Quick-link category buttons (top categories)
  const quickCategories = categories.slice(0, 8);

  return (
    <section className="relative overflow-hidden">
      {/* Banner Glider */}
      <div className={`relative bg-gradient-to-br ${current.gradient} transition-all duration-700`}>
        <div className="absolute -top-16 -left-16 h-64 w-64 bg-primary/20 blob animate-float" />
        <div className="absolute top-1/2 -right-20 h-72 w-72 bg-mint/30 blob-alt animate-float-slow" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center min-h-[480px]">
          {/* Left: Text Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
            >
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-ink shadow-sm">
                <Sparkles size={14} /> {current.emoji} {current.subtitle}
              </span>
              <h1 className="mt-5 font-display text-4xl sm:text-6xl leading-[1.05] tracking-tight">
                {current.title}
              </h1>
              <p className="mt-5 max-w-md text-base sm:text-lg text-ink/70">
                {current.subtitle} — explore our curated collection with wholesale
                pricing, all shipped across Pakistan in PKR.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={current.link}
                  className="group inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3.5 font-semibold text-ink fuzzy-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
                >
                  Shop Now
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-ink px-7 py-3.5 font-semibold hover:bg-ink hover:text-cream transition-colors"
                >
                  Browse All Niches
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-6 text-sm text-ink/60">
                <div><span className="font-display text-xl text-ink">19</span> niches</div>
                <div><span className="font-display text-xl text-ink">100+</span> products</div>
                <div><span className="font-display text-xl text-ink">4.5★</span> avg rating</div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Right: Banner Image + Dots */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="relative h-[320px] sm:h-[400px] rounded-2xl overflow-hidden border-4 border-white shadow-2xl"
              >
                <Image
                  src={current.image}
                  alt={current.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                <span className="absolute bottom-4 left-4 text-4xl">{current.emoji}</span>
              </motion.div>
            </AnimatePresence>

            {/* Banner Navigation Dots */}
            <div className="flex justify-center gap-2 mt-4">
              {BANNERS.map((banner, idx) => (
                <button
                  key={banner.id}
                  onClick={() => setActiveBanner(idx)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    idx === activeBanner
                      ? "bg-ink scale-125"
                      : "bg-ink/30 hover:bg-ink/50"
                  }`}
                  aria-label={`View ${banner.title}`}
                />
              ))}
            </div>

            {/* Thumbnail Strip */}
            <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-none">
              {BANNERS.map((banner, idx) => (
                <button
                  key={banner.id}
                  onClick={() => setActiveBanner(idx)}
                  className={`relative shrink-0 h-14 w-14 rounded-lg overflow-hidden border-2 transition-all ${
                    idx === activeBanner
                      ? "border-ink shadow-lg scale-105"
                      : "border-white/50 opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={banner.image}
                    alt={banner.title}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Category Quick-Link Buttons */}
      <div className="bg-white border-b-2 border-ink/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4">
          <p className="text-xs font-semibold text-ink/50 mb-3 uppercase tracking-wider">Quick Links</p>
          <div className="flex flex-wrap gap-2">
            {quickCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/shop/${cat.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#fef3b0]/60 border border-[#191510]/10 px-4 py-2 text-xs font-semibold text-ink hover:bg-[#fef3b0] hover:border-[#e8734a]/30 transition-all"
              >
                <span>{cat.emoji}</span>
                <span>{cat.name}</span>
              </Link>
            ))}
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 rounded-full bg-ink text-cream px-4 py-2 text-xs font-semibold hover:bg-ink/85 transition-colors"
            >
              View All →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

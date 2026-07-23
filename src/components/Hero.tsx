"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-lavender">
      <div className="absolute -top-16 -left-16 h-64 w-64 bg-primary/20 blob animate-float" />
      <div className="absolute top-1/2 -right-20 h-72 w-72 bg-mint/30 blob-alt animate-float-slow" />
      <div className="absolute bottom-0 left-1/3 h-40 w-40 bg-accent/30 blob animate-float" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-ink shadow-sm">
            <Sparkles size={14} /> 100+ products, fresh drops weekly
          </span>
          <h1 className="mt-5 font-display text-4xl sm:text-6xl leading-[1.05] tracking-tight">
            Accessorize your
            <span className="block text-ink">whole vibe.</span>
          </h1>
          <p className="mt-5 max-w-md text-base sm:text-lg text-ink/70">
            Fashion accessories, plush cushions and signature fragrances — all
            in PKR, all shipped across Pakistan, all ridiculously easy to fall
            in love with.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3.5 font-semibold text-ink fuzzy-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
            >
              Shop the Drop
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-full border-2 border-ink px-7 py-3.5 font-semibold hover:bg-ink hover:text-cream transition-colors"
            >
              Browse Niches
            </Link>
          </div>
          <div className="mt-8 flex items-center gap-6 text-sm text-ink/60">
            <div><span className="font-display text-xl text-ink">12</span> niches</div>
            <div><span className="font-display text-xl text-ink">100+</span> products</div>
            <div><span className="font-display text-xl text-ink">4.5★</span> avg rating</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative h-[380px] sm:h-[460px]"
        >
          <motion.div
            className="absolute top-0 right-6 h-52 w-40 sm:h-64 sm:w-48 rounded-lg overflow-hidden border-4 border-white shadow-2xl rotate-6"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image src="/images/products/perfumes/2.jpg" alt="Perfume" fill className="object-cover" sizes="200px" />
          </motion.div>
          <motion.div
            className="absolute bottom-6 left-2 h-48 w-40 sm:h-56 sm:w-48 rounded-lg overflow-hidden border-4 border-white shadow-2xl -rotate-6"
            animate={{ y: [0, 14, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image src="/images/products/handbags/3.jpg" alt="Handbag" fill className="object-cover" sizes="200px" />
          </motion.div>
          <motion.div
            className="absolute top-1/3 left-1/4 h-40 w-40 sm:h-48 sm:w-48 rounded-full overflow-hidden border-4 border-white shadow-2xl"
            animate={{ y: [0, -8, 0], rotate: [0, 4, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image src="/images/products/cushions/1.jpg" alt="Cushion" fill className="object-cover" sizes="200px" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

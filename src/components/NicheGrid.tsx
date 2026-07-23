"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { categories } from "@/data/categories";

export function NicheGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="font-display text-3xl sm:text-4xl">Shop by Niche</h2>
          <p className="mt-1 text-ink/60">Twelve worlds, one very good cart.</p>
        </div>
        <Link href="/shop" className="hidden sm:block text-sm font-semibold text-ink hover:underline">
          View all →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: (i % 4) * 0.06 }}
          >
            <Link
              href={`/shop/${cat.slug}`}
              className="group relative flex flex-col overflow-hidden rounded-lg border-2 border-ink/10 bg-white hover:border-primary/40 hover:-translate-y-1 hover:shadow-xl transition-all"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-lavender">
                <Image
                  src={`/images/products/${cat.imageFolder}/1.jpg`}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
                <span className="absolute top-2 left-2 text-2xl">{cat.emoji}</span>
              </div>
              <div className="p-3.5">
                <h3 className="font-semibold text-sm leading-tight">{cat.name}</h3>
                <p className="mt-0.5 text-xs text-ink/65 line-clamp-1">{cat.tagline}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

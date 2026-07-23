"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X, Scale } from "lucide-react";
import { useCompare } from "@/context/CompareContext";
import { getProduct } from "@/data/products";

export function CompareBar() {
  const { slugs, toggleCompare, clearCompare } = useCompare();

  if (slugs.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-4 left-1/2 z-40 w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 rounded-lg border-2 border-ink/10 bg-white p-3 shadow-2xl"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 flex-1 overflow-x-auto scrollbar-none">
            {slugs.map((slug) => {
              const p = getProduct(slug);
              if (!p) return null;
              return (
                <div key={slug} className="relative shrink-0">
                  <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-lavender">
                    <Image src={p.images[0]} alt={p.name} fill className="object-cover" sizes="48px" />
                  </div>
                  <button
                    onClick={() => toggleCompare(slug)}
                    className="absolute -top-1.5 -right-1.5 rounded-full bg-ink p-0.5 text-cream"
                    aria-label="Remove from compare"
                  >
                    <X size={10} />
                  </button>
                </div>
              );
            })}
          </div>
          <Link
            href="/compare"
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-secondary px-4 py-2.5 text-xs font-semibold text-white hover:bg-secondary/90 transition-colors"
          >
            <Scale size={14} /> Compare ({slugs.length})
          </Link>
          <button
            onClick={clearCompare}
            className="shrink-0 rounded-full p-2 text-ink/55 hover:bg-ink/5"
            aria-label="Clear compare"
          >
            <X size={16} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

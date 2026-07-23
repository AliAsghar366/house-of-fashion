"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ZoomIn, X } from "lucide-react";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  function next() {
    setActive((a) => (a + 1) % images.length);
  }
  function prev() {
    setActive((a) => (a - 1 + images.length) % images.length);
  }

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-lg border-2 border-ink/10 bg-lavender">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0"
          >
            <Image
              src={images[active]}
              alt={`${name} photo ${active + 1}`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-md hover:bg-white transition-colors"
          aria-label="Previous image"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-md hover:bg-white transition-colors"
          aria-label="Next image"
        >
          <ChevronRight size={18} />
        </button>
        <button
          onClick={() => setZoomed(true)}
          className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold shadow-md hover:bg-white transition-colors"
        >
          <ZoomIn size={14} /> Zoom
        </button>
        <span className="absolute bottom-3 left-3 rounded-full bg-ink/70 px-2.5 py-1 text-[11px] font-semibold text-cream">
          {active + 1} / {images.length}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-5 gap-2">
        {images.map((img, i) => (
          <button
            key={img + i}
            onClick={() => setActive(i)}
            className={`relative aspect-square overflow-hidden rounded-xl border-2 transition-colors ${
              active === i ? "border-primary" : "border-transparent hover:border-ink/20"
            }`}
          >
            <Image src={img} alt={`${name} thumbnail ${i + 1}`} fill sizes="100px" className="object-cover" />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {zoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomed(false)}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/90 p-6"
          >
            <button
              onClick={() => setZoomed(false)}
              className="absolute top-5 right-5 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
              aria-label="Close zoom"
            >
              <X size={24} />
            </button>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="relative h-full w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={images[active]} alt={name} fill className="object-contain" sizes="100vw" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

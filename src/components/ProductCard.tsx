"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Scale } from "lucide-react";
import type { Product } from "@/data/products";
import { formatPKR } from "@/lib/currency";
import { tieredUnitPrice } from "@/lib/pricing";
import { StarRating } from "./StarRating";
import { useWishlist } from "@/context/WishlistContext";
import { useCompare } from "@/context/CompareContext";
import { useCart } from "@/context/CartContext";
import { AuthGate } from "./AuthGate";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const [hovered, setHovered] = useState(false);
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { isComparing, toggleCompare, isFull } = useCompare();
  const { addToCart } = useCart();

  const unitPrice = tieredUnitPrice(product.tiers, 1);
  const bulkPrice = product.tiers[product.tiers.length - 1].price;
  const wishlisted = isWishlisted(product.slug);
  const comparing = isComparing(product.slug);

  function quickAdd(e: React.MouseEvent) {
    e.preventDefault();
    const variantLabel = product.variants
      .map((v) => v.options[0])
      .join(" / ");
    addToCart(product.slug, "default", variantLabel, product.moq);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: (index % 8) * 0.04 }}
      whileHover={{ y: -6 }}
      className="group relative flex flex-col rounded-lg border-2 border-ink/10 bg-white overflow-hidden hover:border-primary/40 hover:shadow-xl transition-[border-color,box-shadow]"
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div
          className="relative aspect-square overflow-hidden bg-lavender"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover transition-opacity duration-300 ${
              hovered ? "opacity-0" : "opacity-100"
            }`}
          />
          <Image
            src={product.images[1] ?? product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover transition-opacity duration-300 ${
              hovered ? "opacity-100" : "opacity-0"
            }`}
          />

          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.stock === 0 && (
              <span className="rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-bold text-white">
                SOLD OUT
              </span>
            )}
            {product.isNew && (
              <span className="rounded-full bg-mint px-2.5 py-1 text-[10px] font-bold text-ink">
                NEW
              </span>
            )}
            {product.isBestseller && (
              <span className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold text-ink">
                BESTSELLER
              </span>
            )}
          </div>

          <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleWishlist(product.slug);
              }}
              className={`rounded-full p-2 shadow-md transition-colors ${
                wishlisted ? "bg-primary text-ink" : "bg-white/90 text-ink hover:bg-primary hover:text-ink"
              }`}
              aria-label="Toggle wishlist"
            >
              <Heart size={15} className={wishlisted ? "fill-current" : ""} />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                if (!comparing && isFull) return;
                toggleCompare(product.slug);
              }}
              className={`rounded-full p-2 shadow-md transition-colors ${
                comparing ? "bg-secondary text-white" : "bg-white/90 text-ink hover:bg-secondary hover:text-white"
              }`}
              aria-label="Toggle compare"
            >
              <Scale size={15} />
            </button>
          </div>

          {product.stock === 0 ? (
            <div className="absolute bottom-2 left-2 right-2 flex gap-1.5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
              <div className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-red-500/90 py-2 text-xs font-bold text-white">
                Sold Out
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleWishlist(product.slug);
                }}
                className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                  wishlisted ? "bg-secondary text-white" : "bg-white/90 text-ink hover:bg-secondary hover:text-white"
                }`}
                aria-label="Add to wishlist"
              >
                <Heart size={14} className={wishlisted ? "fill-current" : ""} />
              </button>
            </div>
          ) : (
            <div className="absolute bottom-2 left-2 right-2 flex gap-1.5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
              <AuthGate>
                <button
                  onClick={quickAdd}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-ink/90 py-2 text-xs font-semibold text-cream"
                >
                  <ShoppingBag size={14} /> Add to Cart
                </button>
              </AuthGate>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleWishlist(product.slug);
                }}
                className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                  wishlisted ? "bg-secondary text-white" : "bg-white/90 text-ink hover:bg-secondary hover:text-white"
                }`}
                aria-label="Add to wishlist"
              >
                <Heart size={14} className={wishlisted ? "fill-current" : ""} />
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-1.5 p-3.5">
          <p className="text-[11px] uppercase tracking-wide text-secondary font-semibold">
            {product.niche.replace("-", " ")}
          </p>
          <h3 className="line-clamp-1 font-semibold text-sm">{product.name}</h3>
          <StarRating rating={product.rating} reviewCount={product.reviewCount} size={12} />
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="font-display text-lg text-ink">{formatPKR(unitPrice)}</span>
            {bulkPrice < unitPrice && (
              <span className="text-[11px] text-ink/55 line-through">{formatPKR(unitPrice * 1.15)}</span>
            )}
          </div>
          <p className="text-[11px] text-ink/65">
            MOQ {product.moq} · from {formatPKR(bulkPrice)}/pc in bulk
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

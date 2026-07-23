"use client";

import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { getProduct } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";

export default function WishlistPage() {
  const { slugs } = useWishlist();
  const products = slugs
    .map((s) => getProduct(s))
    .filter((p): p is NonNullable<typeof p> => !!p);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <h1 className="font-display text-3xl sm:text-4xl mb-2 flex items-center gap-2">
        <Heart size={30} className="text-ink fill-ink" /> Your Wishlist
      </h1>
      <p className="text-ink/60 mb-8">{products.length} saved item{products.length !== 1 ? "s" : ""}</p>

      {products.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-6xl mb-4">💌</p>
          <p className="font-display text-2xl">Nothing saved yet</p>
          <p className="mt-2 text-ink/60">Tap the heart on any product to save it for later.</p>
          <Link
            href="/shop"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3.5 font-semibold text-ink fuzzy-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
          >
            Explore Products <ArrowRight size={18} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

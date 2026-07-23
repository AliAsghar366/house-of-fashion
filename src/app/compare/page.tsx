"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Scale, X, ShoppingBag } from "lucide-react";
import { useCompare } from "@/context/CompareContext";
import { useCart } from "@/context/CartContext";
import { getProduct } from "@/data/products";
import { formatPKR } from "@/lib/currency";
import { StarRating } from "@/components/StarRating";

export default function ComparePage() {
  const { slugs, toggleCompare, clearCompare } = useCompare();
  const { addToCart } = useCart();
  const products = slugs
    .map((s) => getProduct(s))
    .filter((p): p is NonNullable<typeof p> => !!p);

  if (products.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-24 text-center">
        <p className="text-6xl mb-4">⚖️</p>
        <h1 className="font-display text-3xl">Nothing to compare yet</h1>
        <p className="mt-2 text-ink/60">
          Tap the scale icon on up to 4 products to line them up side by side.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3.5 font-semibold text-ink fuzzy-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
        >
          Explore Products <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl sm:text-4xl flex items-center gap-2">
          <Scale size={30} className="text-secondary" /> Compare Products
        </h1>
        <button
          onClick={clearCompare}
          className="text-sm font-semibold text-ink/65 hover:text-red-500 transition-colors"
        >
          Clear all
        </button>
      </div>

      <div className="overflow-x-auto">
        <div className="grid gap-4 min-w-[640px]" style={{ gridTemplateColumns: `repeat(${products.length}, minmax(220px, 1fr))` }}>
          {products.map((p) => (
            <div key={p.id} className="rounded-lg border-2 border-ink/10 bg-white p-4 flex flex-col">
              <button
                onClick={() => toggleCompare(p.slug)}
                className="self-end rounded-full p-1 text-ink/65 hover:bg-red-50 hover:text-red-500 mb-1"
                aria-label="Remove from compare"
              >
                <X size={16} />
              </button>
              <Link href={`/product/${p.slug}`} className="relative aspect-square overflow-hidden rounded-xl bg-lavender mb-3">
                <Image src={p.images[0]} alt={p.name} fill className="object-cover" sizes="220px" />
              </Link>
              <Link href={`/product/${p.slug}`} className="font-semibold text-sm hover:text-ink transition-colors line-clamp-2">
                {p.name}
              </Link>
              <div className="mt-1"><StarRating rating={p.rating} reviewCount={p.reviewCount} size={11} /></div>
              <p className="font-display text-xl text-ink mt-2">{formatPKR(p.tiers[0].price)}</p>

              <dl className="mt-4 space-y-2 text-xs">
                <Row label="Category" value={p.category.replace("-", " ")} />
                <Row label="MOQ" value={`${p.moq} pcs`} />
                <Row label="Bulk price" value={formatPKR(p.tiers[p.tiers.length - 1].price) + "/pc"} />
                <Row label="Stock" value={`${p.stock} units`} />
                {p.variants.map((v) => (
                  <Row key={v.label} label={v.label} value={v.options.join(", ")} />
                ))}
              </dl>

              <button
                onClick={() => addToCart(p.slug, "default", p.variants.map((v) => v.options[0]).join(" / "), p.moq)}
                className="mt-4 flex items-center justify-center gap-1.5 rounded-full bg-ink py-2.5 text-xs font-semibold text-cream hover:bg-ink/80 transition-colors"
              >
                <ShoppingBag size={14} /> Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2 border-b border-ink/5 pb-1.5">
      <dt className="text-ink/65 capitalize">{label}</dt>
      <dd className="font-medium text-right capitalize">{value}</dd>
    </div>
  );
}

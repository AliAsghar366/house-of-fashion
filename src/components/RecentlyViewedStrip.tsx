"use client";

import { useRecentlyViewed } from "@/context/RecentlyViewedContext";
import { getProduct } from "@/data/products";
import { ProductCard } from "./ProductCard";

export function RecentlyViewedStrip({ excludeSlug }: { excludeSlug?: string }) {
  const { slugs } = useRecentlyViewed();
  const items = slugs
    .filter((s) => s !== excludeSlug)
    .map((s) => getProduct(s))
    .filter((p): p is NonNullable<typeof p> => !!p)
    .slice(0, 4);

  if (items.length === 0) return null;

  return (
    <section className="mt-14">
      <h2 className="font-display text-2xl mb-5">Recently Viewed</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {items.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </section>
  );
}

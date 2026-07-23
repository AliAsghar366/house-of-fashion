import Link from "next/link";
import type { Product } from "@/data/products";
import { ProductCard } from "./ProductCard";

export function ProductGrid({
  products,
  title,
  subtitle,
  viewAllHref,
}: {
  products: Product[];
  title?: string;
  subtitle?: string;
  viewAllHref?: string;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      {title && (
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl">{title}</h2>
            {subtitle && <p className="mt-1 text-ink/60">{subtitle}</p>}
          </div>
          {viewAllHref && (
            <Link href={viewAllHref} className="hidden sm:block text-sm font-semibold text-ink hover:underline">
              View all →
            </Link>
          )}
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </section>
  );
}

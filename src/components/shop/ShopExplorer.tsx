"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { products as allProducts } from "@/data/products";
import { getCategory } from "@/data/categories";
import { ProductCard } from "@/components/ProductCard";
import { FiltersSidebar, ShopFilters } from "./FiltersSidebar";

const PAGE_SIZE = 24;
const PRICE_CEILING = 20000;

type SortKey = "relevance" | "price-asc" | "price-desc" | "rating" | "newest" | "bestselling";

export function ShopExplorer({ fixedCategory }: { fixedCategory?: string }) {
  const searchParams = useSearchParams();
  const query = (searchParams.get("q") ?? "").toLowerCase().trim();
  const initialSort = (searchParams.get("sort") as SortKey) ?? "relevance";

  const [filters, setFilters] = useState<ShopFilters>({
    selectedCategories: fixedCategory ? [fixedCategory] : [],
    maxPrice: PRICE_CEILING,
    minRating: 0,
  });
  const [sort, setSort] = useState<SortKey>(initialSort);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    let list = allProducts;

    if (fixedCategory) {
      list = list.filter((p) => p.category === fixedCategory);
    } else if (filters.selectedCategories.length > 0) {
      list = list.filter((p) => filters.selectedCategories.includes(p.category));
    }

    if (query) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.tags.some((t) => t.includes(query))
      );
    }

    list = list.filter((p) => p.tiers[0].price <= filters.maxPrice);
    list = list.filter((p) => p.rating >= filters.minRating);

    const sorted = [...list];
    switch (sort) {
      case "price-asc":
        sorted.sort((a, b) => a.tiers[0].price - b.tiers[0].price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.tiers[0].price - a.tiers[0].price);
        break;
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        sorted.sort((a, b) => Number(b.isNew) - Number(a.isNew));
        break;
      case "bestselling":
        sorted.sort((a, b) => Number(b.isBestseller) - Number(a.isBestseller));
        break;
      default:
        break;
    }

    return sorted;
  }, [fixedCategory, filters, query, sort]);

  const visible = filtered.slice(0, visibleCount);
  const category = fixedCategory ? getCategory(fixedCategory) : undefined;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="font-display text-3xl sm:text-4xl">
          {query
            ? `Results for "${query}"`
            : category
            ? category.name
            : "All Products"}
        </h1>
        <p className="mt-1 text-ink/60">
          {category?.tagline ?? "Browse the full House of Fashion catalog — filter, compare, and stock up."}{" "}
          <span className="font-semibold text-ink">{filtered.length} products</span>
        </p>
      </div>

      <div className="flex items-center justify-between gap-3 mb-5 lg:hidden">
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg border-2 border-ink/15 px-4 py-2 text-sm font-semibold"
        >
          <SlidersHorizontal size={16} /> Filters
        </button>
        <SortSelect sort={sort} setSort={setSort} />
      </div>

      <div className="flex gap-8">
        <div className="hidden lg:block">
          <FiltersSidebar
            filters={filters}
            onChange={(f) => {
              setFilters(f);
              setVisibleCount(PAGE_SIZE);
            }}
            hideCategoryFilter={!!fixedCategory}
            priceCeiling={PRICE_CEILING}
          />
        </div>

        <div className="flex-1">
          <div className="hidden lg:flex justify-end mb-4">
            <SortSelect sort={sort} setSort={setSort} />
          </div>

          {visible.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed border-ink/15 py-20 text-center">
              <p className="text-4xl mb-3">🔍</p>
              <p className="font-display text-xl">No products match those filters</p>
              <p className="text-ink/65 text-sm mt-1">Try loosening the price or rating filter.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                {visible.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
              {visibleCount < filtered.length && (
                <div className="mt-10 flex justify-center">
                  <button
                    onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
                    className="rounded-lg bg-ink px-8 py-3 font-semibold text-cream hover:bg-ink/80 transition-colors"
                  >
                    Load More ({filtered.length - visibleCount} left)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-xs overflow-y-auto bg-cream p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl">Filters</h2>
              <button onClick={() => setMobileFiltersOpen(false)} className="rounded-full p-2 hover:bg-ink/5">
                <X size={20} />
              </button>
            </div>
            <FiltersSidebar
              filters={filters}
              onChange={(f) => {
                setFilters(f);
                setVisibleCount(PAGE_SIZE);
              }}
              hideCategoryFilter={!!fixedCategory}
              priceCeiling={PRICE_CEILING}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function SortSelect({ sort, setSort }: { sort: SortKey; setSort: (s: SortKey) => void }) {
  return (
    <select
      value={sort}
      onChange={(e) => setSort(e.target.value as SortKey)}
      className="rounded-lg border-2 border-ink/15 bg-white px-4 py-2 text-sm font-medium outline-none"
    >
      <option value="relevance">Sort: Relevance</option>
      <option value="bestselling">Bestselling</option>
      <option value="newest">Newest</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
      <option value="rating">Highest Rated</option>
    </select>
  );
}

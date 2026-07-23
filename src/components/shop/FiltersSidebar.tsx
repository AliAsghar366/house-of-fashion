"use client";

import { categories } from "@/data/categories";
import { formatPKR } from "@/lib/currency";

export type ShopFilters = {
  selectedCategories: string[];
  maxPrice: number;
  minRating: number;
};

export function FiltersSidebar({
  filters,
  onChange,
  hideCategoryFilter = false,
  priceCeiling,
}: {
  filters: ShopFilters;
  onChange: (filters: ShopFilters) => void;
  hideCategoryFilter?: boolean;
  priceCeiling: number;
}) {
  function toggleCategory(slug: string) {
    const selected = filters.selectedCategories.includes(slug)
      ? filters.selectedCategories.filter((s) => s !== slug)
      : [...filters.selectedCategories, slug];
    onChange({ ...filters, selectedCategories: selected });
  }

  return (
    <aside className="w-full lg:w-64 shrink-0 space-y-6">
      {!hideCategoryFilter && (
        <div className="rounded-lg border-2 border-ink/10 bg-white p-4">
          <h3 className="font-display text-base mb-3">Niches</h3>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {categories.map((cat) => (
              <label key={cat.slug} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.selectedCategories.includes(cat.slug)}
                  onChange={() => toggleCategory(cat.slug)}
                  className="h-4 w-4 rounded accent-primary"
                />
                <span>{cat.emoji} {cat.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-lg border-2 border-ink/10 bg-white p-4">
        <h3 className="font-display text-base mb-3">Max Price</h3>
        <input
          type="range"
          min={0}
          max={priceCeiling}
          step={100}
          value={filters.maxPrice}
          onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
          className="w-full accent-primary"
        />
        <p className="mt-1 text-sm text-ink/60">Up to {formatPKR(filters.maxPrice)}</p>
      </div>

      <div className="rounded-lg border-2 border-ink/10 bg-white p-4">
        <h3 className="font-display text-base mb-3">Minimum Rating</h3>
        <div className="flex gap-2">
          {[0, 3, 4, 4.5].map((r) => (
            <button
              key={r}
              onClick={() => onChange({ ...filters, minRating: r })}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                filters.minRating === r
                  ? "bg-primary text-ink"
                  : "bg-lavender text-ink/60 hover:bg-primary/10"
              }`}
            >
              {r === 0 ? "Any" : `${r}★+`}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

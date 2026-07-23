"use client";

import { useState } from "react";
import { Check, Truck } from "lucide-react";
import type { Product } from "@/data/products";
import { StarRating } from "./StarRating";
import { generateReviews } from "@/lib/reviews";

const TABS = ["Description", "Specifications", `Reviews`, "Shipping"] as const;

export function ProductTabs({ product }: { product: Product }) {
  const [active, setActive] = useState<(typeof TABS)[number]>("Description");
  const reviews = generateReviews(product);

  return (
    <div className="mt-14">
      <div className="flex gap-1 border-b-2 border-ink/10 overflow-x-auto scrollbar-none">
        {TABS.map((tab) => {
          const label = tab === "Reviews" ? `Reviews (${product.reviewCount})` : tab;
          return (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={`shrink-0 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition-colors -mb-0.5 ${
                active === tab
                  ? "border-primary text-ink"
                  : "border-transparent text-ink/65 hover:text-ink"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="py-8">
        {active === "Description" && (
          <div className="max-w-2xl space-y-4">
            <p className="text-ink/70 leading-relaxed">{product.description}</p>
            <ul className="space-y-2">
              {product.bullets.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm text-ink/70">
                  <Check size={16} className="mt-0.5 shrink-0 text-mint" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        )}

        {active === "Specifications" && (
          <div className="max-w-2xl overflow-hidden rounded-lg border-2 border-ink/10">
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-ink/10">
                  <td className="bg-lavender/50 px-4 py-3 font-semibold w-1/3">Category</td>
                  <td className="px-4 py-3 capitalize">{product.category.replace("-", " ")}</td>
                </tr>
                {product.variants.map((v) => (
                  <tr key={v.label} className="border-b border-ink/10 last:border-b-0">
                    <td className="bg-lavender/50 px-4 py-3 font-semibold">{v.label}</td>
                    <td className="px-4 py-3">{v.options.join(", ")}</td>
                  </tr>
                ))}
                <tr className="border-b border-ink/10">
                  <td className="bg-lavender/50 px-4 py-3 font-semibold">MOQ</td>
                  <td className="px-4 py-3">{product.moq} pieces</td>
                </tr>
                <tr>
                  <td className="bg-lavender/50 px-4 py-3 font-semibold">Stock Available</td>
                  <td className="px-4 py-3">{product.stock} units</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {active === `Reviews (${product.reviewCount})` && (
          <div className="max-w-2xl space-y-5">
            <div className="flex items-center gap-4 rounded-lg bg-lavender/50 p-4">
              <span className="font-display text-4xl text-ink">{product.rating.toFixed(1)}</span>
              <div>
                <StarRating rating={product.rating} size={16} />
                <p className="text-xs text-ink/65 mt-1">Based on {product.reviewCount} reviews</p>
              </div>
            </div>
            {reviews.map((r, i) => (
              <div key={i} className="border-b border-ink/10 pb-5 last:border-b-0">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-sm">{r.name}</p>
                  <span className="text-xs text-ink/55">{r.daysAgo} days ago</span>
                </div>
                <StarRating rating={r.rating} size={12} />
                <p className="mt-2 text-sm text-ink/70">{r.comment}</p>
              </div>
            ))}
          </div>
        )}

        {active === "Shipping" && (
          <div className="max-w-2xl space-y-3 text-sm text-ink/70">
            <div className="flex items-start gap-2">
              <Truck size={18} className="mt-0.5 shrink-0 text-ink" />
              <p>Ships from Karachi within 1-2 business days. Nationwide delivery in 3-6 business days depending on your city.</p>
            </div>
            <p>Cash on delivery available across Pakistan. Prepaid orders get priority dispatch.</p>
            <p>7-day return window for unused items in original packaging.</p>
          </div>
        )}
      </div>
    </div>
  );
}

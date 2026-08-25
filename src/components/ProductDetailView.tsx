"use client";

import { useEffect, useMemo, useState } from "react";
import { Heart, Scale, ShoppingBag, Zap, Check, AlertCircle } from "lucide-react";
import type { Product } from "@/data/products";
import { ProductGallery } from "./ProductGallery";
import { ProductTiers } from "./ProductTiers";
import { QuantitySelector } from "./QuantitySelector";
import { StarRating } from "./StarRating";
import { formatPKR } from "@/lib/currency";
import { tieredUnitPrice } from "@/lib/pricing";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCompare } from "@/context/CompareContext";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";
import { useRouter } from "next/navigation";

export function ProductDetailView({ product }: { product: Product }) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(
    Object.fromEntries(product.variants.map((v) => [v.label, v.options[0]]))
  );
  const [qty, setQty] = useState(product.moq);
  const [justAdded, setJustAdded] = useState(false);

  const { addToCart, openCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { isComparing, toggleCompare, isFull } = useCompare();
  const { addRecentlyViewed } = useRecentlyViewed();
  const router = useRouter();

  useEffect(() => {
    addRecentlyViewed(product.slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.slug]);

  const unitPrice = useMemo(() => tieredUnitPrice(product.tiers, qty), [product.tiers, qty]);
  const total = unitPrice * qty;
  const variantKey = Object.values(selectedOptions).join("|") || "default";
  const variantLabel = Object.values(selectedOptions).join(" / ") || "Standard";
  const wishlisted = isWishlisted(product.slug);
  const comparing = isComparing(product.slug);

  function handleAddToCart() {
    addToCart(product.slug, variantKey, variantLabel, qty);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  }

  function handleBuyNow() {
    addToCart(product.slug, variantKey, variantLabel, qty);
    router.push("/cart");
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <ProductGallery images={product.images} name={product.name} />

      <div>
        <p className="text-xs uppercase tracking-wide font-semibold text-secondary">
          {product.niche.replace("-", " ")}
        </p>
        <h1 className="font-display text-3xl sm:text-4xl mt-1">{product.name}</h1>

        <div className="mt-2 flex items-center gap-3">
          <StarRating rating={product.rating} reviewCount={product.reviewCount} />
          {product.isBestseller && (
            <span className="rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-bold text-ink">
              BESTSELLER
            </span>
          )}
          {product.isNew && (
            <span className="rounded-full bg-mint px-2.5 py-0.5 text-[10px] font-bold text-ink">
              NEW
            </span>
          )}
        </div>

        <div className="mt-5 flex items-baseline gap-2">
          <span className="font-display text-4xl text-ink">{formatPKR(unitPrice)}</span>
          <span className="text-sm text-ink/65">/ unit · {qty} pcs = {formatPKR(total)}</span>
        </div>
        <p className="text-xs text-ink/65 mt-1">
          {product.stock === 0 ? (
            <span className="text-red-500 font-semibold">Sold Out — currently unavailable</span>
          ) : (
            <>{product.stock} in stock · MOQ {product.moq} pieces</>
          )}
        </p>

        <div className="mt-5">
          <p className="text-sm font-semibold mb-2">Bulk pricing</p>
          <ProductTiers tiers={product.tiers} activeQty={qty} />
        </div>

        <div className="mt-6 space-y-4">
          {product.variants.map((variant) => (
            <div key={variant.label}>
              <p className="text-sm font-semibold mb-2">{variant.label}</p>
              <div className="flex flex-wrap gap-2">
                {variant.options.map((option) => {
                  const isSelected = selectedOptions[variant.label] === option;
                  return (
                    <button
                      key={option}
                      onClick={() =>
                        setSelectedOptions((prev) => ({ ...prev, [variant.label]: option }))
                      }
                      className={`rounded-lg border-2 px-4 py-1.5 text-sm font-medium transition-colors ${
                        isSelected
                          ? "border-primary bg-primary text-ink"
                          : "border-ink/15 hover:border-primary/50"
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <p className="text-sm font-semibold">Quantity</p>
          <QuantitySelector qty={qty} onChange={setQty} min={1} />
          <span className="text-xs text-ink/65">
            {qty < product.moq ? `Below MOQ (${product.moq}) — single unit pricing applies` : "Bulk pricing applied"}
          </span>
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          {product.stock === 0 ? (
            <div className="flex flex-1 min-w-[160px] items-center justify-center gap-2 rounded-lg bg-red-100 border-2 border-red-200 px-6 py-3.5 font-semibold text-red-600">
              <AlertCircle size={18} /> Sold Out
            </div>
          ) : (
            <>
              <button
                onClick={handleAddToCart}
                className="flex flex-1 min-w-[160px] items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 font-semibold text-ink fuzzy-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
              >
                {justAdded ? <Check size={18} /> : <ShoppingBag size={18} />}
                {justAdded ? "Added!" : "Add to Cart"}
              </button>
              <button
                onClick={handleBuyNow}
                className="flex flex-1 min-w-[160px] items-center justify-center gap-2 rounded-lg bg-ink px-6 py-3.5 font-semibold text-cream hover:bg-ink/80 transition-colors"
              >
                <Zap size={18} /> Buy Now
              </button>
            </>
          )}
          <button
            onClick={() => toggleWishlist(product.slug)}
            className={`flex items-center gap-2 rounded-lg border-2 px-5 py-3.5 font-semibold text-sm transition-colors ${
              wishlisted
                ? "border-primary bg-primary text-ink"
                : "border-ink/15 text-ink/70 hover:border-primary hover:text-ink"
            }`}
            aria-label="Toggle wishlist"
          >
            <Heart size={18} className={wishlisted ? "fill-current" : ""} />
            {wishlisted ? "Wishlisted" : "Add to Wishlist"}
          </button>
          <button
            onClick={() => {
              if (!comparing && isFull) return;
              toggleCompare(product.slug);
            }}
            className={`rounded-lg border-2 p-3.5 transition-colors ${
              comparing ? "border-secondary bg-secondary text-white" : "border-ink/15 hover:border-secondary/50"
            }`}
            aria-label="Toggle compare"
          >
            <Scale size={20} />
          </button>
        </div>

        <button
          onClick={openCart}
          className="mt-3 text-xs text-ink/55 hover:text-ink transition-colors underline"
        >
          View cart drawer
        </button>
      </div>
    </div>
  );
}

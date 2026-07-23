"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Heart, ShoppingBag, Menu, X, Scale } from "lucide-react";
import { Logo } from "./Logo";
import { categories } from "@/data/categories";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCompare } from "@/context/CompareContext";
import { useRouter } from "next/navigation";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems, openCart } = useCart();
  const { slugs: wishlistSlugs } = useWishlist();
  const { slugs: compareSlugs } = useCompare();

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setMobileOpen(false);
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-bar border-b-4 border-bar">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-18 items-center justify-between gap-4 py-3">
          <div className="rounded-lg bg-primary px-3 py-1.5">
            <Logo />
          </div>

          <form
            onSubmit={submitSearch}
            className="hidden md:flex flex-1 max-w-md items-center gap-2 rounded-lg border-2 border-primary bg-white px-4 py-2 focus-within:border-accent transition-colors"
          >
            <Search size={18} className="text-ink/70 shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder="Search perfumes, cushions, bags..."
              className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink/55"
            />
          </form>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setSearchOpen((s) => !s)}
              className="md:hidden rounded-lg bg-primary p-2 text-ink hover:bg-primary-dark transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            <Link
              href="/compare"
              className="relative hidden sm:inline-flex rounded-lg bg-primary p-2 text-ink hover:bg-primary-dark transition-colors"
              aria-label="Compare"
            >
              <Scale size={20} />
              {compareSlugs.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-ink text-[10px] font-bold text-primary">
                  {compareSlugs.length}
                </span>
              )}
            </Link>

            <Link
              href="/wishlist"
              className="relative rounded-lg bg-primary p-2 text-ink hover:bg-primary-dark transition-colors"
              aria-label="Wishlist"
            >
              <Heart size={20} />
              {wishlistSlugs.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-ink text-[10px] font-bold text-primary">
                  {wishlistSlugs.length}
                </span>
              )}
            </Link>

            <button
              onClick={openCart}
              className="relative rounded-lg bg-primary p-2 text-ink hover:bg-primary-dark transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-ink text-[10px] font-bold text-primary"
                >
                  {totalItems}
                </motion.span>
              )}
            </button>

            <button
              onClick={() => setMobileOpen((s) => !s)}
              className="lg:hidden rounded-lg bg-primary p-2 text-ink hover:bg-primary-dark transition-colors"
              aria-label="Menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {searchOpen && (
            <motion.form
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              onSubmit={submitSearch}
              className="md:hidden overflow-hidden"
            >
              <div className="flex items-center gap-2 rounded-lg border-2 border-primary bg-white px-4 py-2 mb-3">
                <Search size={18} className="text-ink/70 shrink-0" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                  type="text"
                  placeholder="Search products..."
                  className="w-full bg-transparent text-sm text-ink outline-none"
                />
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        <nav className="flex items-center gap-1.5 pb-3 overflow-x-auto scrollbar-none">
          <Link
            href="/shop"
            className={`shrink-0 rounded-lg px-4 py-1.5 text-sm font-bold transition-colors ${
              pathname === "/shop"
                ? "bg-cream text-ink"
                : "bg-primary text-ink hover:bg-primary-dark"
            }`}
          >
            All Products
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/shop/${cat.slug}`}
              className={`shrink-0 rounded-lg px-4 py-1.5 text-sm font-bold transition-colors whitespace-nowrap ${
                pathname === `/shop/${cat.slug}`
                  ? "bg-cream text-ink"
                  : "bg-primary text-ink hover:bg-primary-dark"
              }`}
            >
              {cat.emoji} {cat.name}
            </Link>
          ))}
        </nav>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden border-t-4 border-primary bg-bar"
          >
            <div className="flex flex-col p-4 gap-2 max-h-[70vh] overflow-y-auto">
              <Link
                href="/shop"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg bg-primary px-4 py-2.5 font-bold text-ink hover:bg-primary-dark transition-colors"
              >
                All Products
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/shop/${cat.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg bg-primary px-4 py-2.5 font-bold text-ink hover:bg-primary-dark transition-colors"
                >
                  {cat.emoji} {cat.name}
                </Link>
              ))}
              <Link
                href="/compare"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg bg-primary px-4 py-2.5 font-bold text-ink hover:bg-primary-dark transition-colors sm:hidden"
              >
                ⚖️ Compare ({compareSlugs.length})
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

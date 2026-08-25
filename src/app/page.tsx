import Link from "next/link";
import { Hero } from "@/components/Hero";
import { NicheGrid } from "@/components/NicheGrid";
import { TrustBadges } from "@/components/TrustBadges";
import { ProductGrid } from "@/components/ProductGrid";
import { Newsletter } from "@/components/Newsletter";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { products, sortInStockFirst } from "@/data/products";

function QuickLinks() {
  const links = [
    { href: "/auth/signup", label: "Sign Up", emoji: "👤" },
    { href: "/auth/signin", label: "Sign In", emoji: "🔐" },
    { href: "/account", label: "My Account", emoji: "📋" },
    { href: "/track", label: "Track Order", emoji: "📦" },
    { href: "/support", label: "Support", emoji: "💬" },
  ];
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 -mt-4 mb-6">
      <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="inline-flex items-center gap-1.5 rounded-full bg-white border-2 border-ink/10 px-4 py-2 text-xs sm:text-sm font-semibold text-ink/80 hover:border-secondary hover:text-secondary hover:shadow-md transition-all"
          >
            <span>{link.emoji}</span> {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const bestsellers = sortInStockFirst(products.filter((p) => p.isBestseller)).slice(0, 8);
  const newArrivals = sortInStockFirst(products.filter((p) => p.isNew)).slice(0, 8);

  return (
    <>
      <Hero />
      <QuickLinks />
      <TrustBadges />
      <NicheGrid />
      <ProductGrid
        products={bestsellers}
        title="Bestsellers"
        subtitle="What everyone's adding to cart right now"
        viewAllHref="/shop?sort=bestselling"
      />
      <ProductGrid
        products={newArrivals}
        title="Fresh Drops"
        subtitle="Just landed — get in before restock"
        viewAllHref="/shop?sort=newest"
      />
      <Newsletter />
      <WhatsAppButton />
    </>
  );
}

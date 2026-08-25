import { Hero } from "@/components/Hero";
import { NicheGrid } from "@/components/NicheGrid";
import { TrustBadges } from "@/components/TrustBadges";
import { ProductGrid } from "@/components/ProductGrid";
import { Newsletter } from "@/components/Newsletter";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { products, sortInStockFirst } from "@/data/products";
import type { Product } from "@/data/products";

// Real products — IDs that start with 'real-' are client's actual inventory
const isRealProduct = (p: Product) => p.id.startsWith("real-");
const realPerfumes = sortInStockFirst(products.filter((p) => isRealProduct(p) && p.category === "perfumes")).slice(0, 11);
const realBedsheets = sortInStockFirst(products.filter((p) => isRealProduct(p) && p.category === "bedsheets")).slice(0, 9);
const featuredProducts = [...realPerfumes, ...realBedsheets];

export default function Home() {
  const bestsellers = sortInStockFirst(products.filter((p) => p.isBestseller && !isRealProduct(p))).slice(0, 8);
  const newArrivals = sortInStockFirst(products.filter((p) => p.isNew && !isRealProduct(p))).slice(0, 8);

  return (
    <>
      <Hero />
      <TrustBadges />

      {/* Featured Real Products — at the very top */}
      <ProductGrid
        products={featuredProducts}
        title="⭐ Featured Products"
        subtitle="Our handpicked collection — real inventory, real prices"
        viewAllHref="/shop?sort=newest"
      />

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

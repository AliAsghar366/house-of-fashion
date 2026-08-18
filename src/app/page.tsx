import { Hero } from "@/components/Hero";
import { NicheGrid } from "@/components/NicheGrid";
import { TrustBadges } from "@/components/TrustBadges";
import { ProductGrid } from "@/components/ProductGrid";
import { Newsletter } from "@/components/Newsletter";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { products } from "@/data/products";

export default function Home() {
  const bestsellers = products.filter((p) => p.isBestseller).slice(0, 8);
  const newArrivals = products.filter((p) => p.isNew).slice(0, 8);

  return (
    <>
      <Hero />
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

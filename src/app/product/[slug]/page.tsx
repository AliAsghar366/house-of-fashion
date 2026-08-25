import { notFound } from "next/navigation";
import { products, getProduct, getRelatedProducts } from "@/data/products";
import { getCategory } from "@/data/categories";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductDetailView } from "@/components/ProductDetailView";
import { ProductTabs } from "@/components/ProductTabs";
import { ReviewSection } from "@/components/ReviewSection";
import { ProductGrid } from "@/components/ProductGrid";
import { RecentlyViewedStrip } from "@/components/RecentlyViewedStrip";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  return {
    title: product ? `${product.name} — House of Fashion` : "Product — House of Fashion",
    description: product?.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const related = getRelatedProducts(product, 4);
  const category = getCategory(product.category);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <Breadcrumbs
        items={[
          { label: category?.name ?? product.category, href: `/shop/${product.category}` },
          { label: product.name },
        ]}
      />
      <ProductDetailView product={product} />
      <ProductTabs product={product} />
      <ReviewSection productSlug={product.slug} />

      {related.length > 0 && (
        <ProductGrid products={related} title="You May Also Like" subtitle="More from this niche" />
      )}

      <RecentlyViewedStrip excludeSlug={product.slug} />
    </div>
  );
}

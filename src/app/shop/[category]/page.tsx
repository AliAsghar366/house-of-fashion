import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ShopExplorer } from "@/components/shop/ShopExplorer";
import { categories, getCategory } from "@/data/categories";

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = getCategory(category);
  return { title: cat ? `${cat.name} — House of Fashion` : "Shop — House of Fashion" };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) notFound();

  return (
    <Suspense fallback={<div className="py-24 text-center text-ink/55">Loading...</div>}>
      <ShopExplorer fixedCategory={category} />
    </Suspense>
  );
}

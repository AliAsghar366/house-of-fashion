import { Suspense } from "react";
import { ShopExplorer } from "@/components/shop/ShopExplorer";

export const metadata = { title: "Shop All — House of Fashion" };

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-ink/55">Loading...</div>}>
      <ShopExplorer />
    </Suspense>
  );
}

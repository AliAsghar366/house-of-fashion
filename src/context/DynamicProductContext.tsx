"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { products as seedProducts, type Product } from "@/data/products";
import { categories as seedCategories, type Category } from "@/data/categories";

export type DynamicProduct = Product;
export type DynamicCategory = Category;

type ProductContextValue = {
  products: DynamicProduct[];
  categories: DynamicCategory[];
  addProduct: (product: DynamicProduct) => void;
  updateProduct: (id: string, updates: Partial<DynamicProduct>) => void;
  deleteProduct: (id: string) => void;
  addCategory: (category: DynamicCategory) => void;
  updateCategory: (slug: string, updates: Partial<DynamicCategory>) => void;
  deleteCategory: (slug: string) => void;
  getProduct: (slug: string) => DynamicProduct | undefined;
  getProductsByCategory: (categorySlug: string) => DynamicProduct[];
};

const ProductContext = createContext<ProductContextValue | null>(null);
const PRODUCTS_KEY = "hof_dynamic_products_v1";
const CATEGORIES_KEY = "hof_dynamic_categories_v1";

export function DynamicProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<DynamicProduct[]>(seedProducts);
  const [categories, setCategories] = useState<DynamicCategory[]>(seedCategories);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const rawProducts = localStorage.getItem(PRODUCTS_KEY);
      const rawCategories = localStorage.getItem(CATEGORIES_KEY);
      if (rawProducts) {
        const parsed = JSON.parse(rawProducts);
        if (parsed.length > 0) setProducts(parsed);
      }
      if (rawCategories) {
        const parsed = JSON.parse(rawCategories);
        if (parsed.length > 0) setCategories(parsed);
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    } catch {
      // storage full
    }
  }, [products, categories, hydrated]);

  function addProduct(product: DynamicProduct) {
    setProducts((prev) => [...prev, product]);
  }

  function updateProduct(id: string, updates: Partial<DynamicProduct>) {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  }

  function deleteProduct(id: string) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  function addCategory(category: DynamicCategory) {
    setCategories((prev) => [...prev, category]);
  }

  function updateCategory(slug: string, updates: Partial<DynamicCategory>) {
    setCategories((prev) =>
      prev.map((c) => (c.slug === slug ? { ...c, ...updates } : c))
    );
  }

  function deleteCategory(slug: string) {
    setCategories((prev) => prev.filter((c) => c.slug !== slug));
    setProducts((prev) => prev.filter((p) => p.category !== slug));
  }

  function getProduct(slug: string) {
    return products.find((p) => p.slug === slug);
  }

  function getProductsByCategory(categorySlug: string) {
    return products.filter((p) => p.category === categorySlug);
  }

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        getProduct,
        getProductsByCategory,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useDynamicProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useDynamicProducts must be used within DynamicProductProvider");
  return ctx;
}

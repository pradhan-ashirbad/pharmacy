import type { Product, StoreKind } from "@/types";
import { medicineProducts } from "./products-medicines";
import { wellnessProducts } from "./products-wellness";
import { deviceProducts } from "./products-devices";

export const allProducts: Product[] = [
  ...medicineProducts,
  ...wellnessProducts,
  ...deviceProducts,
];

const bySlug = new Map(allProducts.map((p) => [p.slug, p]));
const byId = new Map(allProducts.map((p) => [p.id, p]));

export function getProductBySlug(slug: string): Product | undefined {
  return bySlug.get(slug);
}

export function getProductById(id: string): Product | undefined {
  return byId.get(id);
}

export function getProductsByStore(store: StoreKind): Product[] {
  return allProducts.filter((p) => p.store === store);
}

export function getFeaturedProducts(limit = 8): Product[] {
  return [...allProducts]
    .sort(
      (a, b) =>
        Number(b.tags.includes("bestseller")) - Number(a.tags.includes("bestseller")) ||
        b.reviewCount - a.reviewCount
    )
    .slice(0, limit);
}

export function getTrendingProducts(limit = 8): Product[] {
  return allProducts.filter((p) => p.tags.includes("trending")).slice(0, limit);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const sameSub = allProducts.filter(
    (p) => p.id !== product.id && p.subcategory === product.subcategory
  );
  const sameCat = allProducts.filter(
    (p) =>
      p.id !== product.id &&
      p.category === product.category &&
      p.subcategory !== product.subcategory
  );
  return [...sameSub, ...sameCat].slice(0, limit);
}

export function getFrequentlyBoughtTogether(product: Product): Product[] {
  const slugs = product.frequentlyBoughtWith ?? [];
  const linked = slugs
    .map((slug) => bySlug.get(slug))
    .filter((p): p is Product => Boolean(p));
  if (linked.length > 0) return linked.slice(0, 2);
  return getRelatedProducts(product, 2);
}

export function getProductsByHealthConcern(concern: string): Product[] {
  return allProducts.filter((p) => p.healthConcerns?.includes(concern));
}

export function searchProducts(query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/);
  return allProducts
    .map((p) => {
      const haystack = [
        p.name,
        p.brand,
        p.subcategory,
        p.category,
        ...(p.ingredients ?? []),
        ...p.tags,
      ]
        .join(" ")
        .toLowerCase();
      const matches = terms.filter((t) => haystack.includes(t)).length;
      const nameBoost = p.name.toLowerCase().includes(q) ? 2 : 0;
      return { p, score: matches + nameBoost };
    })
    .filter(({ score, p }) => score >= Math.min(1, terms.length) && score > 0 && p)
    .sort((a, b) => b.score - a.score || b.p.reviewCount - a.p.reviewCount)
    .map(({ p }) => p);
}

export const allBrandNames = Array.from(
  new Set(allProducts.map((p) => p.brand))
).sort();

export function brandsForStore(store: StoreKind): string[] {
  return Array.from(
    new Set(allProducts.filter((p) => p.store === store).map((p) => p.brand))
  ).sort();
}

export function subcategoriesForStore(store: StoreKind): string[] {
  return Array.from(
    new Set(allProducts.filter((p) => p.store === store).map((p) => p.subcategory))
  ).sort();
}

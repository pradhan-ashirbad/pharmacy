import { ProductGrid } from "@/components/product/product-grid";
import { SectionHeader } from "@/components/shared/section-header";
import { getFeaturedProducts } from "@/data/products";

export function FeaturedProducts() {
  const products = getFeaturedProducts(8);
  return (
    <section className="container py-12 sm:py-16">
      <SectionHeader
        title="Featured Products"
        subtitle="Bestsellers our customers trust every day"
        href="/medicines"
      />
      <ProductGrid products={products} />
    </section>
  );
}

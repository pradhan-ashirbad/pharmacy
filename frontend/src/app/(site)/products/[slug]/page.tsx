import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { FrequentlyBoughtTogether } from "@/components/product/frequently-bought-together";
import { ProductBuyBox } from "@/components/product/product-buy-box";
import { ProductDetailsTabs } from "@/components/product/product-details-tabs";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductReviews } from "@/components/product/product-reviews";
import { RecentlyViewed } from "@/components/product/recently-viewed";
import { TrackRecentlyViewed } from "@/components/product/track-recently-viewed";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { SectionHeader } from "@/components/shared/section-header";
import { categories } from "@/data/categories";
import {
  allProducts,
  getFrequentlyBoughtTogether,
  getProductBySlug,
  getRelatedProducts,
} from "@/data/products";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return allProducts.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const product = getProductBySlug(params.slug);
  if (!product) return {};
  return {
    title: `${product.name} — ${product.brand} | Buy Online`,
    description: `${product.description.slice(0, 150)}… Order ${product.name} online at ₹${product.price} with fast delivery across India.`,
    openGraph: {
      title: `${product.name} — ${product.brand}`,
      description: product.description.slice(0, 160),
    },
  };
}

const storeHrefs = {
  medicines: { label: "Medicines", href: "/medicines" },
  wellness: { label: "Wellness", href: "/wellness" },
  devices: { label: "Health Devices", href: "/health-devices" },
} as const;

export default function ProductDetailPage({ params }: Props) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  const related = getRelatedProducts(product, 4);
  const companions = getFrequentlyBoughtTogether(product);
  const category = categories.find((c) => c.slug === product.category);
  const store = storeHrefs[product.store];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    brand: { "@type": "Brand", name: product.brand },
    description: product.description,
    sku: product.id,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.price,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
  };

  return (
    <div className="container py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TrackRecentlyViewed product={product} />

      <Breadcrumbs
        items={[
          store,
          ...(category
            ? [{ label: category.name, href: category.href }]
            : []),
          { label: product.name },
        ]}
      />

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery product={product} />
        <ProductBuyBox product={product} />
      </div>

      <div className="mt-12">
        <ProductDetailsTabs product={product} />
      </div>

      <div className="mt-14">
        <FrequentlyBoughtTogether product={product} companions={companions} />
      </div>

      <div className="mt-14">
        <ProductReviews product={product} />
      </div>

      {related.length > 0 && (
        <div className="mt-14">
          <SectionHeader
            title="Similar Products"
            subtitle={`More from ${product.subcategory}`}
            href={store.href}
          />
          <ProductGrid products={related} />
        </div>
      )}

      <RecentlyViewed excludeId={product.id} />
    </div>
  );
}

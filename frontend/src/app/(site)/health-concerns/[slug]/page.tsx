import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductGrid } from "@/components/product/product-grid";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { healthConcerns } from "@/data/categories";
import { getProductsByHealthConcern } from "@/data/products";
import { iconMap, tintStyles } from "@/lib/visuals";
import { cn } from "@/lib/utils";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return healthConcerns.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const concern = healthConcerns.find((c) => c.slug === params.slug);
  if (!concern) return {};
  return {
    title: `${concern.name} — Curated Health Products`,
    description: `${concern.description}. Shop doctor-recommended products for ${concern.name.toLowerCase()} on MediKart.`,
  };
}

export default function HealthConcernPage({ params }: Props) {
  const concern = healthConcerns.find((c) => c.slug === params.slug);
  if (!concern) notFound();

  const products = getProductsByHealthConcern(concern.slug);
  const Icon = iconMap[concern.icon];
  const tint = tintStyles[concern.tint];

  return (
    <div className="container py-8">
      <Breadcrumbs items={[{ label: "Health Concerns" }, { label: concern.name }]} />
      <div className="flex items-center gap-4">
        <span
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-2xl",
            tint.chip
          )}
        >
          <Icon className="h-7 w-7" strokeWidth={1.6} />
        </span>
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            {concern.name}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            {concern.description}
          </p>
        </div>
      </div>
      <div className="mt-8">
        <ProductGrid products={products} />
      </div>
    </div>
  );
}

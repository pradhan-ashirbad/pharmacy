import type { Metadata } from "next";
import { Suspense } from "react";
import { Sparkles } from "lucide-react";

import { StoreBrowser } from "@/components/store/store-browser";
import { StoreHero } from "@/components/store/store-hero";
import { ProductGridSkeleton } from "@/components/product/product-grid";

export const metadata: Metadata = {
  title: "Wellness Store — Vitamins, Supplements & Personal Care",
  description:
    "Shop vitamins, supplements, protein powders, skin care, ayurvedic products and personal hygiene essentials from India's most trusted wellness brands.",
};

export default function WellnessPage() {
  return (
    <>
      <StoreHero
        icon={Sparkles}
        title="Wellness Store"
        description="Vitamins, proteins, ayurveda, skin care and daily essentials — curated from brands India trusts."
        highlights={[
          "Vitamins & Supplements",
          "Protein Powders",
          "Skin & Hair Care",
          "Ayurvedic Products",
          "Baby Care",
        ]}
      />
      <div className="container py-8">
        <Suspense fallback={<ProductGridSkeleton />}>
          <StoreBrowser store="wellness" />
        </Suspense>
      </div>
    </>
  );
}

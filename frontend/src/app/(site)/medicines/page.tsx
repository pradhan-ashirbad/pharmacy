import type { Metadata } from "next";
import { Suspense } from "react";
import { Pill } from "lucide-react";

import { StoreBrowser } from "@/components/store/store-browser";
import { StoreHero } from "@/components/store/store-hero";
import { ProductGridSkeleton } from "@/components/product/product-grid";

export const metadata: Metadata = {
  title: "Buy Medicines Online",
  description:
    "Order prescription and OTC medicines online at the best prices in India. Genuine products, licensed pharmacy, free delivery above ₹499.",
};

export default function MedicinesPage() {
  return (
    <>
      <StoreHero
        icon={Pill}
        title="Medicine Store"
        description="Prescription and everyday medicines from licensed distributors — verified by pharmacists before dispatch."
        highlights={[
          "100% genuine medicines",
          "Up to 20% off MRP",
          "Rx upload at checkout",
          "Express delivery available",
        ]}
      />
      <div className="container py-8">
        <Suspense fallback={<ProductGridSkeleton />}>
          <StoreBrowser store="medicines" showRxFilter />
        </Suspense>
      </div>
    </>
  );
}

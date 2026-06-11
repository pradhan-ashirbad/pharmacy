import type { Metadata } from "next";
import { Suspense } from "react";

import { SearchResults } from "./search-results";
import { ProductGridSkeleton } from "@/components/product/product-grid";

export const metadata: Metadata = {
  title: "Search Results",
  description: "Search medicines, wellness products and health devices on MediKart.",
};

export default function SearchPage() {
  return (
    <div className="container py-8">
      <Suspense fallback={<ProductGridSkeleton />}>
        <SearchResults />
      </Suspense>
    </div>
  );
}

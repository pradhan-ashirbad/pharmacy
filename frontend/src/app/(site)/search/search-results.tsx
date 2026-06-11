"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SearchX } from "lucide-react";

import { ProductGrid } from "@/components/product/product-grid";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { searchProducts } from "@/data/products";

export function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const results = searchProducts(query);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
        {query ? (
          <>
            Results for <span className="text-gradient">“{query}”</span>
          </>
        ) : (
          "Search"
        )}
      </h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        {results.length} {results.length === 1 ? "product" : "products"} found
      </p>

      <div className="mt-8">
        {results.length > 0 ? (
          <ProductGrid products={results} />
        ) : (
          <EmptyState
            icon={SearchX}
            title={query ? `Nothing found for “${query}”` : "Start searching"}
            description="Check the spelling, try a generic name (e.g. paracetamol), or browse our stores instead."
            action={
              <div className="flex flex-wrap justify-center gap-3">
                <Button asChild>
                  <Link href="/medicines">Browse Medicines</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/wellness">Wellness Store</Link>
                </Button>
              </div>
            }
          />
        )}
      </div>
    </div>
  );
}

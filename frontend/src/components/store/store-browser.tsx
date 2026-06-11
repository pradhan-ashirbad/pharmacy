"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { PackageSearch, SlidersHorizontal } from "lucide-react";

import { ProductGrid } from "@/components/product/product-grid";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { StoreFilters, type StoreFilterState } from "./store-filters";
import { brandsForStore, getProductsByStore } from "@/data/products";
import { categories as allCategories } from "@/data/categories";
import type { Product, StoreKind } from "@/types";

type SortKey = "popularity" | "price-asc" | "price-desc" | "rating" | "discount";

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "popularity", label: "Popularity" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Customer Rating" },
  { value: "discount", label: "Discount" },
];

function sortProducts(products: Product[], sort: SortKey): Product[] {
  const list = [...products];
  switch (sort) {
    case "price-asc":
      return list.sort((a, b) => a.price - b.price);
    case "price-desc":
      return list.sort((a, b) => b.price - a.price);
    case "rating":
      return list.sort((a, b) => b.rating - a.rating);
    case "discount":
      return list.sort(
        (a, b) => (b.mrp - b.price) / b.mrp - (a.mrp - a.price) / a.mrp
      );
    default:
      return list.sort((a, b) => b.reviewCount - a.reviewCount);
  }
}

interface StoreBrowserProps {
  store: StoreKind;
  showRxFilter?: boolean;
}

export function StoreBrowser({ store, showRxFilter }: StoreBrowserProps) {
  const searchParams = useSearchParams();
  const products = React.useMemo(() => getProductsByStore(store), [store]);
  const maxPrice = React.useMemo(
    () => Math.ceil(Math.max(...products.map((p) => p.mrp)) / 100) * 100,
    [products]
  );

  const categoryOptions = React.useMemo(() => {
    const slugs = new Set(products.map((p) => p.category));
    return allCategories
      .filter((c) => slugs.has(c.slug))
      .map((c) => ({ value: c.slug, label: c.name }));
  }, [products]);

  const brandOptions = React.useMemo(() => brandsForStore(store), [store]);

  const defaultFilters = React.useCallback(
    (): StoreFilterState => ({
      categories: searchParams.get("category")
        ? [searchParams.get("category") as string]
        : [],
      brands: [],
      priceRange: [0, maxPrice],
      inStockOnly: false,
      rxOnly: "all",
    }),
    [searchParams, maxPrice]
  );

  const [filters, setFilters] = React.useState<StoreFilterState>(defaultFilters);
  const [sort, setSort] = React.useState<SortKey>("popularity");
  const [query, setQuery] = React.useState("");

  // Re-apply the category from the URL when it changes (e.g. homepage links).
  React.useEffect(() => {
    setFilters(defaultFilters());
  }, [defaultFilters]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = products.filter((p) => {
      if (filters.categories.length && !filters.categories.includes(p.category))
        return false;
      if (filters.brands.length && !filters.brands.includes(p.brand))
        return false;
      if (p.price < filters.priceRange[0] || p.price > filters.priceRange[1])
        return false;
      if (filters.inStockOnly && !p.inStock) return false;
      if (filters.rxOnly === "rx" && !p.prescriptionRequired) return false;
      if (filters.rxOnly === "otc" && p.prescriptionRequired) return false;
      if (
        q &&
        ![p.name, p.brand, p.subcategory]
          .join(" ")
          .toLowerCase()
          .includes(q)
      )
        return false;
      return true;
    });
    return sortProducts(list, sort);
  }, [products, filters, sort, query]);

  const activeFilterCount =
    filters.categories.length +
    filters.brands.length +
    (filters.inStockOnly ? 1 : 0) +
    (filters.rxOnly !== "all" ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice ? 1 : 0);

  const reset = () => {
    setFilters({
      categories: [],
      brands: [],
      priceRange: [0, maxPrice],
      inStockOnly: false,
      rxOnly: "all",
    });
    setQuery("");
  };

  const filterPanel = (
    <StoreFilters
      filters={filters}
      onChange={setFilters}
      categoryOptions={categoryOptions}
      brandOptions={brandOptions}
      maxPrice={maxPrice}
      showRxFilter={showRxFilter}
      onReset={reset}
    />
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-40 rounded-2xl border bg-card p-5 shadow-soft">
          {filterPanel}
        </div>
      </aside>

      <div>
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search in ${store === "devices" ? "health devices" : store}…`}
            aria-label="Search within this store"
            className="h-10 w-full max-w-xs rounded-lg border border-input bg-background px-3.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
          />

          <div className="ml-auto flex items-center gap-2">
            {/* Mobile filters */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <Badge className="ml-1 h-5 min-w-5 justify-center rounded-full px-1.5 text-[10px]">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto">
                <SheetTitle className="sr-only">Product filters</SheetTitle>
                <div className="mt-4">{filterPanel}</div>
              </SheetContent>
            </Sheet>

            <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
              <SelectTrigger className="w-[180px]" aria-label="Sort products">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <p className="mb-4 text-sm text-muted-foreground" aria-live="polite">
          Showing <span className="font-semibold text-foreground">{filtered.length}</span>{" "}
          of {products.length} products
        </p>

        {filtered.length > 0 ? (
          <ProductGrid products={filtered} />
        ) : (
          <EmptyState
            icon={PackageSearch}
            title="No products match your filters"
            description="Try removing a filter or two, or search with a different term."
            action={
              <Button variant="outline" onClick={reset}>
                Clear all filters
              </Button>
            }
          />
        )}
      </div>
    </div>
  );
}

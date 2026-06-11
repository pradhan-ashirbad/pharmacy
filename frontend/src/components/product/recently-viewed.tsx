"use client";

import { History } from "lucide-react";

import { ProductCard } from "@/components/product/product-card";
import { SectionHeader } from "@/components/shared/section-header";
import { useMounted } from "@/hooks/use-mounted";
import { useRecentlyViewedStore } from "@/store/recently-viewed";

export function RecentlyViewed({ excludeId }: { excludeId?: string }) {
  const mounted = useMounted();
  const items = useRecentlyViewedStore((s) => s.items);

  const visible = items.filter((p) => p.id !== excludeId).slice(0, 4);
  if (!mounted || visible.length === 0) return null;

  return (
    <section className="container py-12 sm:py-16">
      <SectionHeader
        title="Recently Viewed"
        subtitle="Pick up where you left off"
      />
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        {visible.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <span className="sr-only">
        <History className="h-4 w-4" />
      </span>
    </section>
  );
}

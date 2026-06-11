"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

import { ProductCard } from "@/components/product/product-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMounted } from "@/hooks/use-mounted";
import { useWishlistStore } from "@/store/wishlist";

export function WishlistView() {
  const mounted = useMounted();
  const items = useWishlistStore((s) => s.items);

  if (!mounted) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-72 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title="Your wishlist is empty"
        description="Tap the heart icon on any product to save it here for later."
        action={
          <Button asChild>
            <Link href="/wellness">Explore Products</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div>
      <p className="mb-4 text-sm text-muted-foreground">
        {items.length} saved {items.length === 1 ? "product" : "products"}
      </p>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

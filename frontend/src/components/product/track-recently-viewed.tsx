"use client";

import { useEffect } from "react";

import { useRecentlyViewedStore } from "@/store/recently-viewed";
import type { Product } from "@/types";

/** Records the product into the recently-viewed list on mount. */
export function TrackRecentlyViewed({ product }: { product: Product }) {
  const add = useRecentlyViewedStore((s) => s.add);
  useEffect(() => {
    add(product);
  }, [product, add]);
  return null;
}

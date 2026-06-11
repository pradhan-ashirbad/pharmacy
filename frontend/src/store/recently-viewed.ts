"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types";

const MAX_RECENT = 10;

interface RecentlyViewedState {
  items: Product[];
  add: (product: Product) => void;
  clear: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      items: [],
      add: (product) =>
        set((s) => ({
          items: [
            product,
            ...s.items.filter((p) => p.id !== product.id),
          ].slice(0, MAX_RECENT),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: "medikart-recently-viewed" }
  )
);

"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types";

interface WishlistState {
  items: Product[];
  toggle: (product: Product) => boolean; // returns true if added
  remove: (productId: string) => void;
  has: (productId: string) => boolean;
  clear: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (product) => {
        const exists = get().items.some((p) => p.id === product.id);
        if (exists) {
          set((s) => ({ items: s.items.filter((p) => p.id !== product.id) }));
          return false;
        }
        set((s) => ({ items: [product, ...s.items] }));
        return true;
      },
      remove: (productId) =>
        set((s) => ({ items: s.items.filter((p) => p.id !== productId) })),
      has: (productId) => get().items.some((p) => p.id === productId),
      clear: () => set({ items: [] }),
    }),
    { name: "medikart-wishlist" }
  )
);

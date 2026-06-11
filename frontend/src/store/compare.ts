"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types";

export const MAX_COMPARE_ITEMS = 4;

interface CompareState {
  items: Product[];
  toggle: (product: Product) => "added" | "removed" | "full";
  remove: (productId: string) => void;
  has: (productId: string) => boolean;
  clear: () => void;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (product) => {
        const exists = get().items.some((p) => p.id === product.id);
        if (exists) {
          set((s) => ({ items: s.items.filter((p) => p.id !== product.id) }));
          return "removed";
        }
        if (get().items.length >= MAX_COMPARE_ITEMS) return "full";
        set((s) => ({ items: [...s.items, product] }));
        return "added";
      },
      remove: (productId) =>
        set((s) => ({ items: s.items.filter((p) => p.id !== productId) })),
      has: (productId) => get().items.some((p) => p.id === productId),
      clear: () => set({ items: [] }),
    }),
    { name: "medikart-compare" }
  )
);

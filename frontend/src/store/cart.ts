"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Coupon, Product } from "@/types";

interface CartState {
  items: CartItem[];
  coupon: Coupon | null;
  deliveryMethod: "standard" | "express";
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (coupon: Coupon) => void;
  removeCoupon: () => void;
  setDeliveryMethod: (method: "standard" | "express") => void;
  itemCount: () => number;
  quantityOf: (productId: string) => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      deliveryMethod: "standard",

      addItem: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find(
            (i) => i.product.id === product.id
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product.id === product.id
                  ? { ...i, quantity: Math.min(i.quantity + quantity, 10) }
                  : i
              ),
            };
          }
          return { items: [...state.items, { product, quantity }] };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.product.id !== productId),
        })),

      updateQuantity: (productId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((i) => i.product.id !== productId),
            };
          }
          return {
            items: state.items.map((i) =>
              i.product.id === productId
                ? { ...i, quantity: Math.min(quantity, 10) }
                : i
            ),
          };
        }),

      clearCart: () => set({ items: [], coupon: null, deliveryMethod: "standard" }),
      applyCoupon: (coupon) => set({ coupon }),
      removeCoupon: () => set({ coupon: null }),
      setDeliveryMethod: (method) => set({ deliveryMethod: method }),

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      quantityOf: (productId) =>
        get().items.find((i) => i.product.id === productId)?.quantity ?? 0,
    }),
    { name: "medikart-cart" }
  )
);

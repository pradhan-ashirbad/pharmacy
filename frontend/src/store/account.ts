"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Address,
  AppNotification,
  Order,
  OrderStatus,
  Prescription,
} from "@/types";
import {
  seedAddresses,
  seedNotifications,
  seedOrders,
  seedPrescriptions,
} from "@/data/seed";

interface AccountState {
  orders: Order[];
  addresses: Address[];
  prescriptions: Prescription[];
  notifications: AppNotification[];

  addOrder: (order: Order) => void;
  cancelOrder: (orderId: string) => void;

  addAddress: (address: Address) => void;
  updateAddress: (id: string, patch: Partial<Address>) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;

  addPrescription: (rx: Prescription) => void;
  removePrescription: (id: string) => void;

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (n: AppNotification) => void;
  unreadCount: () => number;
}

export const useAccountStore = create<AccountState>()(
  persist(
    (set, get) => ({
      orders: seedOrders,
      addresses: seedAddresses,
      prescriptions: seedPrescriptions,
      notifications: seedNotifications,

      addOrder: (order) => set((s) => ({ orders: [order, ...s.orders] })),

      cancelOrder: (orderId) =>
        set((s) => ({
          orders: s.orders.map((o) =>
            o.id === orderId && !["delivered", "cancelled"].includes(o.status)
              ? { ...o, status: "cancelled" as OrderStatus }
              : o
          ),
        })),

      addAddress: (address) =>
        set((s) => ({
          addresses: address.isDefault
            ? [address, ...s.addresses.map((a) => ({ ...a, isDefault: false }))]
            : [...s.addresses, address],
        })),

      updateAddress: (id, patch) =>
        set((s) => ({
          addresses: s.addresses.map((a) => (a.id === id ? { ...a, ...patch } : a)),
        })),

      removeAddress: (id) =>
        set((s) => ({ addresses: s.addresses.filter((a) => a.id !== id) })),

      setDefaultAddress: (id) =>
        set((s) => ({
          addresses: s.addresses.map((a) => ({ ...a, isDefault: a.id === id })),
        })),

      addPrescription: (rx) =>
        set((s) => ({ prescriptions: [rx, ...s.prescriptions] })),

      removePrescription: (id) =>
        set((s) => ({
          prescriptions: s.prescriptions.filter((p) => p.id !== id),
        })),

      markNotificationRead: (id) =>
        set((s) => ({
          notifications: s.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),

      markAllNotificationsRead: () =>
        set((s) => ({
          notifications: s.notifications.map((n) => ({ ...n, read: true })),
        })),

      addNotification: (n) =>
        set((s) => ({ notifications: [n, ...s.notifications] })),

      unreadCount: () => get().notifications.filter((n) => !n.read).length,
    }),
    { name: "medikart-account" }
  )
);

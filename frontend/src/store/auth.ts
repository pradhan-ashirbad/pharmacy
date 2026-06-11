"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateProfile: (patch: Partial<User>) => void;
}

export const demoUser: User = {
  id: "usr-demo",
  name: "Ashirbad Pradhan",
  email: "ashirbad@example.com",
  phone: "98765 43210",
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      login: (user) => set({ user, isLoggedIn: true }),
      logout: () => set({ user: null, isLoggedIn: false }),
      updateProfile: (patch) =>
        set((s) => ({ user: s.user ? { ...s.user, ...patch } : s.user })),
    }),
    { name: "medikart-auth" }
  )
);

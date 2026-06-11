"use client";

import { useEffect, useState } from "react";

/**
 * Returns true only after the component has mounted on the client.
 * Used to safely render values from persisted (localStorage) stores
 * without causing SSR hydration mismatches.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

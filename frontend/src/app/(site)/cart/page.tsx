import type { Metadata } from "next";

import { CartView } from "./cart-view";

export const metadata: Metadata = {
  title: "Shopping Cart",
  description: "Review your MediKart cart, apply coupons and proceed to checkout.",
};

export default function CartPage() {
  return <CartView />;
}

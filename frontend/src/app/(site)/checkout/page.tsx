import type { Metadata } from "next";

import { CheckoutFlow } from "./checkout-flow";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your MediKart order — address, delivery, payment and review.",
  robots: { index: false },
};

export default function CheckoutPage() {
  return <CheckoutFlow />;
}

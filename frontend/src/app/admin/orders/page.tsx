import type { Metadata } from "next";

import { OrdersManager } from "./orders-manager";

export const metadata: Metadata = {
  title: "Order Management",
};

export default function AdminOrdersPage() {
  return <OrdersManager />;
}

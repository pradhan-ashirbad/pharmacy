import type { Metadata } from "next";

import { OrderDetail } from "./order-detail";

export const metadata: Metadata = {
  title: "Order Details",
};

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  return <OrderDetail orderId={params.id} />;
}

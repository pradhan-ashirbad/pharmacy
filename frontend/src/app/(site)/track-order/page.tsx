import type { Metadata } from "next";

import { TrackOrderView } from "./track-order-view";

export const metadata: Metadata = {
  title: "Track Order",
  description: "Track your MediKart order in real time with your order ID.",
};

export default function TrackOrderPage() {
  return <TrackOrderView />;
}

import type { Metadata } from "next";
import { Suspense } from "react";

import { SuccessView } from "./success-view";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Order Placed",
  robots: { index: false },
};

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="container py-16">
          <Skeleton className="mx-auto h-64 w-full max-w-lg rounded-2xl" />
        </div>
      }
    >
      <SuccessView />
    </Suspense>
  );
}

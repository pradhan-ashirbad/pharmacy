"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, Package, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useMounted } from "@/hooks/use-mounted";
import { formatDate } from "@/lib/utils";
import { useAccountStore } from "@/store/account";

export function SuccessView() {
  const mounted = useMounted();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const order = useAccountStore((s) =>
    mounted ? s.orders.find((o) => o.id === orderId) : undefined
  );

  return (
    <div className="container flex flex-col items-center py-16 text-center">
      <motion.div
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="flex h-24 w-24 items-center justify-center rounded-full bg-success/10"
      >
        <CheckCircle2 className="h-12 w-12 text-success" strokeWidth={1.5} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="mt-6 font-display text-3xl font-bold">
          Order placed successfully!
        </h1>
        <p className="mt-2 max-w-md text-muted-foreground">
          Thank you for shopping with MediKart. We&apos;ve sent the order
          confirmation to your registered contact.
        </p>

        {orderId && (
          <div className="mx-auto mt-8 w-full max-w-md rounded-2xl border bg-card p-6 text-left shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Order ID</span>
              <span className="font-mono text-sm font-bold">{orderId}</span>
            </div>
            {order && (
              <>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Items</span>
                  <span className="text-sm font-medium">
                    {order.items.reduce((s, i) => s + i.quantity, 0)} items
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Expected delivery
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-success">
                    <Truck className="h-4 w-4" />
                    {formatDate(order.expectedDelivery)}
                  </span>
                </div>
              </>
            )}
          </div>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link href={orderId ? `/account/orders/${orderId}` : "/account/orders"}>
              <Package className="h-4 w-4" />
              Track Order
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/">Continue Shopping</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

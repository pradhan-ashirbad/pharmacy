"use client";

import Link from "next/link";
import { ChevronRight, PackageOpen } from "lucide-react";

import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { ProductVisual } from "@/components/shared/product-visual";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMounted } from "@/hooks/use-mounted";
import { formatDate, formatINR } from "@/lib/utils";
import { useAccountStore } from "@/store/account";

export function OrdersList() {
  const mounted = useMounted();
  const orders = useAccountStore((s) => s.orders);

  if (!mounted) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={PackageOpen}
        title="No orders yet"
        description="When you place orders, they'll show up here with live tracking."
        action={
          <Button asChild>
            <Link href="/medicines">Start Shopping</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Link
          key={order.id}
          href={`/account/orders/${order.id}`}
          className="group block rounded-2xl border bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card"
        >
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <p className="font-mono text-sm font-bold">{order.id}</p>
              <p className="text-xs text-muted-foreground">
                Placed on {formatDate(order.placedOn)}
              </p>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <OrderStatusBadge status={order.status} />
              <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <div className="flex -space-x-3">
              {order.items.slice(0, 4).map((item) => (
                <ProductVisual
                  key={item.productId}
                  image={item.image}
                  className="h-12 w-12 rounded-xl border-2 border-card"
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              {order.items.reduce((s, i) => s + i.quantity, 0)} items
            </p>
            <p className="ml-auto text-sm font-bold">
              {formatINR(order.summary.total)}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

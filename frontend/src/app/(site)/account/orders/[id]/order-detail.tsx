"use client";

import Link from "next/link";
import { ChevronLeft, MapPin, PackageX, ReceiptText } from "lucide-react";
import { toast } from "sonner";

import { PriceSummaryCard } from "@/components/cart/price-summary-card";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { OrderTimeline } from "@/components/orders/order-timeline";
import { EmptyState } from "@/components/shared/empty-state";
import { ProductVisual } from "@/components/shared/product-visual";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useMounted } from "@/hooks/use-mounted";
import { paymentMethodLabels } from "@/lib/orders";
import { formatDate, formatINR } from "@/lib/utils";
import { useAccountStore } from "@/store/account";

export function OrderDetail({ orderId }: { orderId: string }) {
  const mounted = useMounted();
  const order = useAccountStore((s) => s.orders.find((o) => o.id === orderId));
  const cancelOrder = useAccountStore((s) => s.cancelOrder);

  if (!mounted) {
    return <Skeleton className="h-96 rounded-2xl" />;
  }

  if (!order) {
    return (
      <EmptyState
        icon={PackageX}
        title="Order not found"
        description={`We couldn't find an order with ID ${orderId}.`}
        action={
          <Button asChild variant="outline">
            <Link href="/account/orders">Back to Orders</Link>
          </Button>
        }
      />
    );
  }

  const cancellable = !["delivered", "cancelled", "out-for-delivery"].includes(
    order.status
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          <ChevronLeft className="h-4 w-4" />
          All orders
        </Link>
        <div className="ml-auto">
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-5 shadow-soft sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-mono text-lg font-bold">{order.id}</h2>
            <p className="text-sm text-muted-foreground">
              Placed on {formatDate(order.placedOn)} ·{" "}
              {paymentMethodLabels[order.paymentMethod]} ·{" "}
              {order.deliveryMethod === "express" ? "Express" : "Standard"} delivery
            </p>
          </div>
          {order.status !== "delivered" && order.status !== "cancelled" && (
            <p className="text-sm">
              Expected by{" "}
              <span className="font-semibold text-success">
                {formatDate(order.expectedDelivery)}
              </span>
            </p>
          )}
        </div>

        <Separator className="my-5" />
        <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Tracking
        </h3>
        <OrderTimeline order={order} />

        {cancellable && (
          <>
            <Separator className="my-5" />
            <Button
              variant="outline"
              className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => {
                cancelOrder(order.id);
                toast("Order cancelled", {
                  description: "Any payment made will be refunded in 3–5 days.",
                });
              }}
            >
              Cancel Order
            </Button>
          </>
        )}
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_360px]">
        <div className="rounded-2xl border bg-card shadow-soft">
          <h3 className="flex items-center gap-2 border-b p-5 text-sm font-semibold">
            <ReceiptText className="h-4 w-4 text-primary" />
            Items in this order
          </h3>
          <ul className="divide-y">
            {order.items.map((item) => (
              <li key={item.productId} className="flex items-center gap-4 p-4">
                <Link href={`/products/${item.slug}`} className="shrink-0">
                  <ProductVisual image={item.image} className="h-14 w-14 rounded-xl" />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/products/${item.slug}`}
                    className="line-clamp-1 text-sm font-medium hover:text-primary"
                  >
                    {item.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {item.brand} · {item.packSize} · Qty {item.quantity}
                  </p>
                </div>
                <span className="text-sm font-semibold">
                  {formatINR(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-5">
          <PriceSummaryCard summary={order.summary} />
          <div className="rounded-2xl border bg-card p-5 shadow-soft">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <MapPin className="h-4 w-4 text-primary" />
              Delivery Address
            </h3>
            <p className="mt-3 text-sm font-medium">{order.address.fullName}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {order.address.line1}
              {order.address.line2 ? `, ${order.address.line2}` : ""},{" "}
              {order.address.city}, {order.address.state} — {order.address.pincode}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Phone: {order.address.phone}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

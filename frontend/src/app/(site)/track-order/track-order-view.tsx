"use client";

import * as React from "react";
import Link from "next/link";
import { PackageSearch, Search } from "lucide-react";

import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { OrderTimeline } from "@/components/orders/order-timeline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMounted } from "@/hooks/use-mounted";
import { formatDate } from "@/lib/utils";
import { useAccountStore } from "@/store/account";
import type { Order } from "@/types";

export function TrackOrderView() {
  const mounted = useMounted();
  const orders = useAccountStore((s) => s.orders);
  const [query, setQuery] = React.useState("");
  const [result, setResult] = React.useState<Order | null | undefined>(undefined);

  const track = (e: React.FormEvent) => {
    e.preventDefault();
    const found = orders.find(
      (o) => o.id.toLowerCase() === query.trim().toLowerCase()
    );
    setResult(found ?? null);
  };

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Track Your <span className="text-gradient">Order</span>
        </h1>
        <p className="mt-3 text-muted-foreground">
          Enter your order ID (e.g. MKDEMO1SHIP) to see live tracking. You can
          also find all orders in{" "}
          <Link href="/account/orders" className="font-medium text-primary hover:underline">
            My Orders
          </Link>
          .
        </p>

        <form onSubmit={track} className="mx-auto mt-7 flex max-w-md gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value.toUpperCase())}
              placeholder="Enter order ID"
              aria-label="Order ID"
              className="pl-9 font-mono uppercase"
            />
          </div>
          <Button type="submit" disabled={!query.trim() || !mounted}>
            Track
          </Button>
        </form>
      </div>

      {result === null && (
        <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-dashed p-10 text-center">
          <PackageSearch className="mx-auto h-10 w-10 text-muted-foreground" strokeWidth={1.4} />
          <h2 className="mt-4 font-semibold">Order not found</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            We couldn&apos;t find an order with ID{" "}
            <span className="font-mono font-semibold">{query}</span> on this
            device. Check the ID, or view your order history after logging in.
          </p>
        </div>
      )}

      {result && (
        <div className="mx-auto mt-10 max-w-2xl rounded-2xl border bg-card p-6 shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-mono text-lg font-bold">{result.id}</p>
              <p className="text-sm text-muted-foreground">
                Placed on {formatDate(result.placedOn)} ·{" "}
                {result.items.reduce((s, i) => s + i.quantity, 0)} items
              </p>
            </div>
            <OrderStatusBadge status={result.status} />
          </div>
          <div className="mt-6">
            <OrderTimeline order={result} />
          </div>
          <Button asChild variant="outline" className="mt-6">
            <Link href={`/account/orders/${result.id}`}>View Full Details</Link>
          </Button>
        </div>
      )}
    </div>
  );
}

"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { toast } from "sonner";

import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { adminOrders, type AdminOrderRow } from "@/data/admin";
import { ORDER_STATUS_FLOW, paymentMethodLabels } from "@/lib/orders";
import { formatDateTime, formatINR } from "@/lib/utils";
import type { OrderStatus } from "@/types";

const statusFilters: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all", label: "All statuses" },
  ...ORDER_STATUS_FLOW.map((s) => ({ value: s.status, label: s.label })),
  { value: "cancelled", label: "Cancelled" },
];

export function OrdersManager() {
  // Local working copy — in production this talks to /api/admin/orders.
  const [orders, setOrders] = React.useState<AdminOrderRow[]>(adminOrders);
  const [query, setQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<OrderStatus | "all">("all");

  const filtered = orders.filter((o) => {
    if (statusFilter !== "all" && o.status !== statusFilter) return false;
    const q = query.toLowerCase();
    return [o.id, o.customer, o.city].join(" ").toLowerCase().includes(q);
  });

  const updateStatus = (id: string, status: OrderStatus) => {
    setOrders((list) => list.map((o) => (o.id === id ? { ...o, status } : o)));
    toast.success(`Order ${id} updated`, {
      description: `Status set to ${statusFilters.find((s) => s.value === status)?.label}.`,
    });
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-2xl font-bold tracking-tight">Orders</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {orders.length} orders · update status as they move through fulfilment
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by ID, customer or city…"
            aria-label="Search orders"
            className="pl-9"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as OrderStatus | "all")}
        >
          <SelectTrigger className="w-44" aria-label="Filter by status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statusFilters.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto rounded-2xl border bg-card shadow-soft">
        <table className="w-full min-w-[820px] text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-3.5 font-semibold">Order</th>
              <th className="px-5 py-3.5 font-semibold">Customer</th>
              <th className="px-5 py-3.5 font-semibold">Items</th>
              <th className="px-5 py-3.5 font-semibold">Total</th>
              <th className="px-5 py-3.5 font-semibold">Payment</th>
              <th className="px-5 py-3.5 font-semibold">Status</th>
              <th className="px-5 py-3.5 font-semibold">Update</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((order) => (
              <tr key={order.id} className="transition-colors hover:bg-muted/40">
                <td className="px-5 py-3.5">
                  <p className="font-mono text-xs font-bold">{order.id}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateTime(order.date)}
                  </p>
                </td>
                <td className="px-5 py-3.5">
                  <p className="font-medium">{order.customer}</p>
                  <p className="text-xs text-muted-foreground">{order.city}</p>
                </td>
                <td className="px-5 py-3.5 text-muted-foreground">{order.items}</td>
                <td className="px-5 py-3.5 font-semibold">{formatINR(order.total)}</td>
                <td className="px-5 py-3.5 text-muted-foreground">
                  {paymentMethodLabels[order.payment]}
                </td>
                <td className="px-5 py-3.5">
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className="px-5 py-3.5">
                  <Select
                    value={order.status}
                    onValueChange={(v) => updateStatus(order.id, v as OrderStatus)}
                    disabled={order.status === "cancelled"}
                  >
                    <SelectTrigger
                      className="h-9 w-40"
                      aria-label={`Update status for ${order.id}`}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ORDER_STATUS_FLOW.map((s) => (
                        <SelectItem key={s.status} value={s.status}>
                          {s.label}
                        </SelectItem>
                      ))}
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-muted-foreground">
                  No orders match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

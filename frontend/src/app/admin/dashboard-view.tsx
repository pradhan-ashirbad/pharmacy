"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  IndianRupee,
  Package,
  ShoppingBag,
  Users,
} from "lucide-react";

import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { adminOrders, adminStats, monthlyRevenue } from "@/data/admin";
import { paymentMethodLabels } from "@/lib/orders";
import { cn, formatDateTime, formatINR } from "@/lib/utils";

const statCards = [
  {
    label: "Total Revenue",
    value: formatINR(adminStats.revenue),
    change: adminStats.revenueChange,
    icon: IndianRupee,
    tint: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
  },
  {
    label: "Orders",
    value: adminStats.orders.toLocaleString("en-IN"),
    change: adminStats.ordersChange,
    icon: ShoppingBag,
    tint: "bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-400",
  },
  {
    label: "Customers",
    value: adminStats.customers.toLocaleString("en-IN"),
    change: adminStats.customersChange,
    icon: Users,
    tint: "bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400",
  },
  {
    label: "Products",
    value: adminStats.products.toLocaleString("en-IN"),
    change: adminStats.productsChange,
    icon: Package,
    tint: "bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
  },
];

export function DashboardView() {
  const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.revenue));
  const recentOrders = adminOrders.slice(0, 6);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold tracking-tight">
          Dashboard
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Overview of store performance — June 2026
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-2xl border bg-card p-5 shadow-soft"
          >
            <div className="flex items-center justify-between">
              <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl", stat.tint)}>
                <stat.icon className="h-5 w-5" />
              </span>
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold",
                  stat.change >= 0
                    ? "bg-success/10 text-success"
                    : "bg-destructive/10 text-destructive"
                )}
              >
                {stat.change >= 0 ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}
                {Math.abs(stat.change)}%
              </span>
            </div>
            <p className="mt-4 font-display text-2xl font-bold">{stat.value}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        {/* Revenue chart */}
        <div className="rounded-2xl border bg-card p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Revenue Trend</h3>
            <span className="text-xs text-muted-foreground">Last 6 months</span>
          </div>
          <div className="mt-6 flex h-56 items-end gap-3 sm:gap-5">
            {monthlyRevenue.map((m, i) => (
              <div key={m.month} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground">
                  ₹{(m.revenue / 100000).toFixed(1)}L
                </span>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(m.revenue / maxRevenue) * 100}%` }}
                  transition={{ delay: 0.15 + i * 0.07, duration: 0.5, ease: "easeOut" }}
                  className={cn(
                    "w-full max-w-14 rounded-t-xl",
                    i === monthlyRevenue.length - 1
                      ? "gradient-primary"
                      : "bg-primary/20 dark:bg-primary/30"
                  )}
                  style={{ minHeight: 8 }}
                />
                <span className="text-xs font-medium">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent orders */}
        <div className="rounded-2xl border bg-card shadow-soft">
          <div className="flex items-center justify-between border-b p-5">
            <h3 className="font-semibold">Recent Orders</h3>
            <Link
              href="/admin/orders"
              className="text-sm font-medium text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          <ul className="divide-y">
            {recentOrders.map((order) => (
              <li key={order.id} className="flex items-center gap-3 px-5 py-3.5">
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-xs font-bold">{order.id}</p>
                  <p className="truncate text-sm">{order.customer}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateTime(order.date)} · {paymentMethodLabels[order.payment]}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{formatINR(order.total)}</p>
                  <div className="mt-1">
                    <OrderStatusBadge status={order.status} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

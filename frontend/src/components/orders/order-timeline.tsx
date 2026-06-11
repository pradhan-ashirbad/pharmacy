"use client";

import { motion } from "framer-motion";
import {
  Check,
  CheckCircle2,
  Home,
  Package,
  PackageCheck,
  Truck,
  XCircle,
} from "lucide-react";

import { cn, formatDateTime } from "@/lib/utils";
import type { Order } from "@/types";

const stepIcons = {
  placed: Package,
  confirmed: CheckCircle2,
  packed: PackageCheck,
  shipped: Truck,
  "out-for-delivery": Truck,
  delivered: Home,
} as const;

export function OrderTimeline({ order }: { order: Order }) {
  if (order.status === "cancelled") {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
        <XCircle className="h-5 w-5 text-destructive" />
        <p className="text-sm font-medium">
          This order was cancelled. Refund (if paid) is processed in 3–5
          business days.
        </p>
      </div>
    );
  }

  const reachedIndex = order.timeline.reduce(
    (last, event, i) => (event.timestamp ? i : last),
    0
  );

  return (
    <ol className="relative space-y-0">
      {order.timeline.map((event, i) => {
        const Icon = stepIcons[event.status as keyof typeof stepIcons] ?? Check;
        const done = i <= reachedIndex;
        const current = i === reachedIndex;
        const isLast = i === order.timeline.length - 1;
        return (
          <li key={event.status} className="relative flex gap-4 pb-8 last:pb-0">
            {/* connector */}
            {!isLast && (
              <span
                className={cn(
                  "absolute left-[19px] top-10 h-[calc(100%-2.5rem)] w-0.5 rounded-full",
                  i < reachedIndex ? "bg-success" : "bg-border"
                )}
                aria-hidden="true"
              />
            )}
            <motion.span
              initial={false}
              animate={current ? { scale: [1, 1.12, 1] } : {}}
              transition={{ repeat: current && !isLast ? Infinity : 0, duration: 2 }}
              className={cn(
                "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2",
                done
                  ? "border-success bg-success text-success-foreground"
                  : "border-border bg-muted text-muted-foreground"
              )}
            >
              <Icon className="h-4.5 w-4.5 h-[18px] w-[18px]" />
            </motion.span>
            <div className="pt-1">
              <p
                className={cn(
                  "text-sm font-semibold",
                  !done && "text-muted-foreground"
                )}
              >
                {event.label}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {event.timestamp
                  ? formatDateTime(event.timestamp)
                  : event.description}
              </p>
              {event.timestamp && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {event.description}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

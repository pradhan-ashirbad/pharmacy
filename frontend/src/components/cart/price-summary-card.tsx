"use client";

import { Info } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { formatINR } from "@/lib/utils";
import type { PriceSummary } from "@/types";

interface PriceSummaryCardProps {
  summary: PriceSummary;
  couponCode?: string | null;
  children?: React.ReactNode;
}

export function PriceSummaryCard({
  summary,
  couponCode,
  children,
}: PriceSummaryCardProps) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-soft">
      <h2 className="text-base font-semibold">Price Details</h2>
      <div className="mt-4 space-y-2.5 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Item total (MRP)</span>
          <span>{formatINR(summary.itemTotal)}</span>
        </div>
        <div className="flex justify-between text-success">
          <span>Discount on MRP</span>
          <span>− {formatINR(summary.discount)}</span>
        </div>
        {summary.couponDiscount > 0 && (
          <div className="flex justify-between text-success">
            <span>Coupon {couponCode ? `(${couponCode})` : ""}</span>
            <span>− {formatINR(summary.couponDiscount)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-muted-foreground">Delivery charges</span>
          {summary.deliveryFee === 0 ? (
            <span className="font-medium text-success">FREE</span>
          ) : (
            <span>{formatINR(summary.deliveryFee)}</span>
          )}
        </div>
        <div className="flex justify-between">
          <span className="inline-flex items-center gap-1 text-muted-foreground">
            GST (12%)
            <Info className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          <span>{formatINR(summary.gst)}</span>
        </div>
        <Separator className="my-3" />
        <div className="flex justify-between text-base font-bold">
          <span>Total payable</span>
          <span>{formatINR(summary.total)}</span>
        </div>
        {summary.discount + summary.couponDiscount > 0 && (
          <p className="rounded-lg bg-success/10 px-3 py-2 text-xs font-medium text-success">
            🎉 You save {formatINR(summary.discount + summary.couponDiscount)} on
            this order
          </p>
        )}
      </div>
      {children}
    </div>
  );
}

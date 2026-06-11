"use client";

import * as React from "react";
import { BadgePercent, Check, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { coupons, findCoupon } from "@/data/offers";
import { useCartStore } from "@/store/cart";

export function CouponField({ priceTotal }: { priceTotal: number }) {
  const coupon = useCartStore((s) => s.coupon);
  const applyCoupon = useCartStore((s) => s.applyCoupon);
  const removeCoupon = useCartStore((s) => s.removeCoupon);
  const [code, setCode] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const apply = (rawCode: string) => {
    const found = findCoupon(rawCode);
    if (!found) {
      setError("This coupon code is invalid or expired.");
      return;
    }
    if (priceTotal < found.minOrderValue) {
      setError(
        `Add items worth ₹${found.minOrderValue - priceTotal} more to use ${found.code}.`
      );
      return;
    }
    setError(null);
    applyCoupon(found);
    setCode("");
    toast.success(`Coupon ${found.code} applied`, {
      description: found.description,
    });
  };

  if (coupon) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-success/40 bg-success/10 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <Check className="h-4 w-4 text-success" />
          <div>
            <p className="font-mono text-sm font-bold text-success">{coupon.code}</p>
            <p className="text-xs text-muted-foreground">{coupon.description}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => removeCoupon()}
          aria-label="Remove coupon"
          className="text-muted-foreground transition-colors hover:text-destructive"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (code.trim()) apply(code);
        }}
        className="flex gap-2"
      >
        <div className="relative flex-1">
          <BadgePercent className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setError(null);
            }}
            placeholder="Enter coupon code"
            aria-label="Coupon code"
            className="pl-9 font-mono uppercase"
          />
        </div>
        <Button type="submit" variant="outline" disabled={!code.trim()}>
          Apply
        </Button>
      </form>
      {error && <p className="mt-2 text-xs font-medium text-destructive">{error}</p>}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {coupons.map((c) => (
          <button
            key={c.code}
            type="button"
            onClick={() => apply(c.code)}
            className="rounded-full border border-dashed px-2.5 py-1 font-mono text-xs font-semibold text-primary transition-colors hover:border-primary hover:bg-accent"
          >
            {c.code}
          </button>
        ))}
      </div>
    </div>
  );
}

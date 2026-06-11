import type { CartItem, Coupon, PriceSummary } from "@/types";

export const FREE_DELIVERY_THRESHOLD = 499;
export const STANDARD_DELIVERY_FEE = 49;
export const EXPRESS_DELIVERY_SURCHARGE = 99;
export const GST_RATE = 0.12;

/**
 * Computes the cart price summary. Mirrors backend/src/lib/pricing.js so the
 * client can show totals instantly; the API remains the source of truth once
 * a real database is connected.
 */
export function computeSummary(
  items: CartItem[],
  coupon: Coupon | null,
  deliveryMethod: "standard" | "express" = "standard"
): PriceSummary {
  const itemTotal = items.reduce((sum, i) => sum + i.product.mrp * i.quantity, 0);
  const priceTotal = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );
  const discount = itemTotal - priceTotal;

  let couponDiscount = 0;
  let freeShippingCoupon = false;
  if (coupon && priceTotal >= coupon.minOrderValue) {
    if (coupon.type === "percent") {
      couponDiscount = Math.round((priceTotal * coupon.value) / 100);
      if (coupon.maxDiscount) {
        couponDiscount = Math.min(couponDiscount, coupon.maxDiscount);
      }
    } else if (coupon.type === "flat") {
      couponDiscount = Math.min(coupon.value, priceTotal);
    } else if (coupon.type === "shipping") {
      freeShippingCoupon = true;
    }
  }

  const netSubtotal = priceTotal - couponDiscount;

  let deliveryFee =
    netSubtotal >= FREE_DELIVERY_THRESHOLD || freeShippingCoupon
      ? 0
      : STANDARD_DELIVERY_FEE;
  if (deliveryMethod === "express") {
    deliveryFee += EXPRESS_DELIVERY_SURCHARGE;
  }
  if (items.length === 0) deliveryFee = 0;

  const gst = Math.round(netSubtotal * GST_RATE);
  const total = netSubtotal + deliveryFee + gst;

  return {
    itemTotal,
    discount,
    couponDiscount,
    deliveryFee,
    gst,
    total,
  };
}

export function couponEligibilityMessage(
  coupon: Coupon,
  priceTotal: number
): string | null {
  if (priceTotal < coupon.minOrderValue) {
    return `Add items worth ₹${coupon.minOrderValue - priceTotal} more to use ${coupon.code}`;
  }
  return null;
}

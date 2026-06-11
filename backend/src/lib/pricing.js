// Pricing rules shared by the cart-summary and order endpoints. All rupee
// values are integers (Math.round) to match the frontend's PriceSummary type.
import { all } from "./store.js";

export const FREE_DELIVERY_THRESHOLD = 499;
export const STANDARD_DELIVERY_FEE = 49;
export const EXPRESS_DELIVERY_SURCHARGE = 99;
export const GST_RATE = 0.12;

/** Case-insensitive coupon lookup. */
export function findCoupon(code) {
  const needle = String(code ?? "").trim().toLowerCase();
  return all("coupons").find((c) => c.code.toLowerCase() === needle);
}

/**
 * Validates a coupon code against a (selling-price) subtotal.
 * Returns { ok: true, coupon } or { ok: false, message }.
 */
export function validateCoupon(code, subtotal) {
  const coupon = findCoupon(code);
  if (!coupon) {
    return { ok: false, message: `Coupon "${code}" is not a valid code.` };
  }
  if (Number(subtotal) < coupon.minOrderValue) {
    return {
      ok: false,
      message: `${coupon.code} requires a minimum order value of ₹${coupon.minOrderValue}.`,
    };
  }
  return { ok: true, coupon };
}

/**
 * Computes the PriceSummary for a set of line items.
 *
 * @param {Array<{ price: number, mrp: number, quantity: number }>} items
 * @param {object|null} coupon   a coupon document (already validated) or null
 * @param {"standard"|"express"} deliveryMethod
 *
 * Rules:
 * - itemTotal      = Σ mrp × qty
 * - discount       = Σ (mrp − price) × qty
 * - couponDiscount = percent of price total (capped at maxDiscount) | flat ₹ |
 *                    0 for "shipping" coupons (they zero the base delivery fee)
 * - deliveryFee    = 0 when net subtotal ≥ ₹499, else ₹49; express adds ₹99
 *                    (a free-shipping coupon waives only the base fee,
 *                    never the express surcharge)
 * - gst            = 12% of (price total − couponDiscount)
 * - total          = net subtotal + deliveryFee + gst
 */
export function computeSummary(items, coupon = null, deliveryMethod = "standard") {
  const itemTotal = Math.round(items.reduce((sum, i) => sum + i.mrp * i.quantity, 0));
  const priceTotal = Math.round(items.reduce((sum, i) => sum + i.price * i.quantity, 0));
  const discount = itemTotal - priceTotal;

  let couponDiscount = 0;
  if (coupon?.type === "percent") {
    couponDiscount = Math.round((priceTotal * coupon.value) / 100);
    if (coupon.maxDiscount != null) couponDiscount = Math.min(couponDiscount, coupon.maxDiscount);
  } else if (coupon?.type === "flat") {
    couponDiscount = Math.min(Math.round(coupon.value), priceTotal);
  }

  const netSubtotal = priceTotal - couponDiscount;

  let baseFee = netSubtotal >= FREE_DELIVERY_THRESHOLD ? 0 : STANDARD_DELIVERY_FEE;
  if (coupon?.type === "shipping") baseFee = 0;
  const deliveryFee = baseFee + (deliveryMethod === "express" ? EXPRESS_DELIVERY_SURCHARGE : 0);

  const gst = Math.round(netSubtotal * GST_RATE);
  const total = netSubtotal + deliveryFee + gst;

  return { itemTotal, discount, couponDiscount, deliveryFee, gst, total };
}

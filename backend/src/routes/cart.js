import { Router } from "express";
import * as store from "../lib/store.js";
import { computeSummary, validateCoupon } from "../lib/pricing.js";
import { HttpError } from "../lib/utils.js";

const router = Router();

/**
 * POST /api/cart/summary
 * { items: [{ productId, quantity }], couponCode?, deliveryMethod? }
 * Resolves products, applies the coupon and returns { items, summary, coupon }.
 */
router.post("/summary", (req, res) => {
  const { items, couponCode, deliveryMethod = "standard" } = req.body ?? {};
  if (!Array.isArray(items) || items.length === 0) {
    throw new HttpError(400, "items must be a non-empty array of { productId, quantity }");
  }

  const resolved = items.map(({ productId, quantity }) => {
    const product = store.getById("products", productId);
    if (!product) throw new HttpError(400, `Unknown product id "${productId}"`);
    return { product, quantity: Math.max(1, Math.round(Number(quantity) || 1)) };
  });

  const lineItems = resolved.map(({ product, quantity }) => ({
    price: product.price,
    mrp: product.mrp,
    quantity,
  }));
  const priceSubtotal = lineItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  let coupon = null;
  if (couponCode) {
    const result = validateCoupon(couponCode, priceSubtotal);
    if (!result.ok) throw new HttpError(400, result.message);
    coupon = result.coupon;
  }

  res.json({
    items: resolved,
    summary: computeSummary(lineItems, coupon, deliveryMethod),
    coupon,
  });
});

export default router;

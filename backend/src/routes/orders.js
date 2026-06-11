import { Router } from "express";
import * as store from "../lib/store.js";
import { computeSummary, validateCoupon } from "../lib/pricing.js";
import { HttpError, orderId, shortId } from "../lib/utils.js";

const router = Router();

export const ORDER_FLOW = ["placed", "confirmed", "packed", "shipped", "out-for-delivery", "delivered"];
export const ORDER_STATUSES = [...ORDER_FLOW, "cancelled"];

const PAYMENT_METHODS = ["upi", "credit-card", "debit-card", "net-banking", "wallet", "cod"];

const TIMELINE_META = {
  placed: { label: "Order Placed", description: "We have received your order." },
  confirmed: { label: "Confirmed", description: "Order verified by our pharmacist." },
  packed: { label: "Packed", description: "Items packed in tamper-proof packaging." },
  shipped: { label: "Shipped", description: "Handed over to our delivery partner." },
  "out-for-delivery": {
    label: "Out for Delivery",
    description: "Your order will be out for delivery soon.",
  },
  delivered: { label: "Delivered", description: "Your order will be delivered soon." },
};

/**
 * Fills timeline timestamps for every step up to `status` (and clears the
 * ones after it). "cancelled" leaves the timeline as-is.
 */
export function advanceTimeline(order, status) {
  order.status = status;
  if (status === "cancelled") return order;
  const now = new Date().toISOString();
  const reachedIndex = ORDER_FLOW.indexOf(status);
  order.timeline.forEach((event, index) => {
    if (index <= reachedIndex) event.timestamp = event.timestamp ?? now;
    else event.timestamp = null;
  });
  return order;
}

// GET /api/orders
router.get("/", (req, res) => {
  res.json(store.all("orders"));
});

// GET /api/orders/:id
router.get("/:id", (req, res) => {
  const order = store.getById("orders", req.params.id);
  if (!order) throw new HttpError(404, `Order "${req.params.id}" not found`);
  res.json(order);
});

// POST /api/orders { items, address, paymentMethod, deliveryMethod?, couponCode? }
router.post("/", (req, res) => {
  const { items, address, paymentMethod, deliveryMethod = "standard", couponCode } = req.body ?? {};

  if (!Array.isArray(items) || items.length === 0) {
    throw new HttpError(400, "items must be a non-empty array of { productId, quantity }");
  }
  if (!address || typeof address !== "object") {
    throw new HttpError(400, "address is required");
  }
  if (!PAYMENT_METHODS.includes(paymentMethod)) {
    throw new HttpError(400, `paymentMethod must be one of: ${PAYMENT_METHODS.join(", ")}`);
  }
  if (!["standard", "express"].includes(deliveryMethod)) {
    throw new HttpError(400, 'deliveryMethod must be "standard" or "express"');
  }

  const orderItems = items.map(({ productId, quantity }) => {
    const product = store.getById("products", productId);
    if (!product) throw new HttpError(400, `Unknown product id "${productId}"`);
    return {
      productId: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      packSize: product.packSize,
      price: product.price,
      mrp: product.mrp,
      quantity: Math.max(1, Math.round(Number(quantity) || 1)),
      image: product.image,
    };
  });

  const priceSubtotal = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  let coupon = null;
  if (couponCode) {
    const result = validateCoupon(couponCode, priceSubtotal);
    if (!result.ok) throw new HttpError(400, result.message);
    coupon = result.coupon;
  }

  const now = new Date();
  const deliveryDays = deliveryMethod === "express" ? 1 : 3;
  const expectedDelivery = new Date(now.getTime() + deliveryDays * 24 * 60 * 60 * 1000);

  const order = {
    id: orderId(),
    placedOn: now.toISOString(),
    status: "placed",
    items: orderItems,
    address: { id: address.id ?? `addr-${shortId()}`, ...address },
    paymentMethod,
    deliveryMethod,
    summary: computeSummary(orderItems, coupon, deliveryMethod),
    timeline: ORDER_FLOW.map((status) => ({
      status,
      label: TIMELINE_META[status].label,
      timestamp: status === "placed" ? now.toISOString() : null,
      description:
        status === "delivered"
          ? `Expected by ${expectedDelivery.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}.`
          : TIMELINE_META[status].description,
    })),
    expectedDelivery: expectedDelivery.toISOString(),
  };

  store.insert("orders", order, { prepend: true });
  res.status(201).json(order);
});

// PATCH /api/orders/:id/status { status }
router.patch("/:id/status", (req, res) => {
  const { status } = req.body ?? {};
  if (!ORDER_STATUSES.includes(status)) {
    throw new HttpError(400, `status must be one of: ${ORDER_STATUSES.join(", ")}`);
  }
  const order = store.getById("orders", req.params.id);
  if (!order) throw new HttpError(404, `Order "${req.params.id}" not found`);
  res.json(advanceTimeline(order, status));
});

export default router;

import type {
  Address,
  CartItem,
  Order,
  OrderStatus,
  OrderTimelineEvent,
  PaymentMethod,
  PriceSummary,
} from "@/types";
import { generateOrderId } from "@/lib/utils";

export const ORDER_STATUS_FLOW: { status: OrderStatus; label: string }[] = [
  { status: "placed", label: "Order Placed" },
  { status: "confirmed", label: "Confirmed" },
  { status: "packed", label: "Packed" },
  { status: "shipped", label: "Shipped" },
  { status: "out-for-delivery", label: "Out for Delivery" },
  { status: "delivered", label: "Delivered" },
];

export const paymentMethodLabels: Record<PaymentMethod, string> = {
  upi: "UPI",
  "credit-card": "Credit Card",
  "debit-card": "Debit Card",
  "net-banking": "Net Banking",
  wallet: "Wallet",
  cod: "Cash on Delivery",
};

const timelineDescriptions: Record<OrderStatus, string> = {
  placed: "We have received your order.",
  confirmed: "Order will be verified by our pharmacist.",
  packed: "Items will be packed in tamper-proof packaging.",
  shipped: "Your order will be handed to our delivery partner.",
  "out-for-delivery": "Your order will be out for delivery.",
  delivered: "Your order will be delivered to your address.",
  cancelled: "Order cancelled.",
};

export function buildOrder(params: {
  items: CartItem[];
  address: Address;
  paymentMethod: PaymentMethod;
  deliveryMethod: "standard" | "express";
  summary: PriceSummary;
}): Order {
  const now = new Date();
  const deliveryDays = params.deliveryMethod === "express" ? 1 : 3;
  const expected = new Date(now.getTime() + deliveryDays * 24 * 60 * 60 * 1000);

  const timeline: OrderTimelineEvent[] = ORDER_STATUS_FLOW.map((step, i) => ({
    status: step.status,
    label: step.label,
    timestamp: i === 0 ? now.toISOString() : null,
    description: timelineDescriptions[step.status],
  }));

  return {
    id: generateOrderId(),
    placedOn: now.toISOString(),
    status: "placed",
    items: params.items.map(({ product, quantity }) => ({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      packSize: product.packSize,
      price: product.price,
      mrp: product.mrp,
      quantity,
      image: product.image,
    })),
    address: params.address,
    paymentMethod: params.paymentMethod,
    deliveryMethod: params.deliveryMethod,
    summary: params.summary,
    timeline,
    expectedDelivery: expected.toISOString(),
  };
}

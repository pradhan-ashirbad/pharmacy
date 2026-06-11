import type { Offer, Coupon } from "@/types";

export const offers: Offer[] = [
  {
    id: "off-001",
    title: "Flat 20% off on your first order",
    subtitle: "New to MediKart? Start your health journey with a welcome gift.",
    code: "WELCOME20",
    discountLabel: "20% OFF",
    tint: "blue",
    terms: "Valid on first order above ₹499. Maximum discount ₹200.",
    expiresOn: "2026-12-31",
  },
  {
    id: "off-002",
    title: "Flat ₹100 off on medicines",
    subtitle: "Stock up your monthly medicines and save instantly.",
    code: "FLAT100",
    discountLabel: "₹100 OFF",
    tint: "green",
    terms: "Valid on orders above ₹999. Once per user per month.",
    expiresOn: "2026-09-30",
  },
  {
    id: "off-003",
    title: "Wellness combo — extra 10% off",
    subtitle: "Vitamins, proteins & ayurvedic picks at combo prices.",
    code: "HEALTH10",
    discountLabel: "10% OFF",
    tint: "violet",
    terms: "Valid on wellness category orders above ₹799. Max discount ₹300.",
    expiresOn: "2026-08-31",
  },
  {
    id: "off-004",
    title: "Free delivery on devices",
    subtitle: "BP monitors, glucometers & more, shipped free to your door.",
    code: "FREESHIP",
    discountLabel: "FREE DELIVERY",
    tint: "amber",
    terms: "Valid on health device orders above ₹499.",
    expiresOn: "2026-12-31",
  },
];

export const coupons: Coupon[] = [
  {
    code: "WELCOME20",
    description: "20% off on your first order (max ₹200)",
    type: "percent",
    value: 20,
    minOrderValue: 499,
    maxDiscount: 200,
  },
  {
    code: "FLAT100",
    description: "Flat ₹100 off on orders above ₹999",
    type: "flat",
    value: 100,
    minOrderValue: 999,
  },
  {
    code: "HEALTH10",
    description: "10% off on wellness orders above ₹799 (max ₹300)",
    type: "percent",
    value: 10,
    minOrderValue: 799,
    maxDiscount: 300,
  },
  {
    code: "FREESHIP",
    description: "Free delivery on orders above ₹499",
    type: "shipping",
    value: 0,
    minOrderValue: 499,
  },
];

export function findCoupon(code: string): Coupon | undefined {
  return coupons.find((c) => c.code.toLowerCase() === code.trim().toLowerCase());
}

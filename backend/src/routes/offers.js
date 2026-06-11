import { Router } from "express";
import * as store from "../lib/store.js";
import { validateCoupon } from "../lib/pricing.js";

// Mounted at /api — promotional offers and coupon validation.
const router = Router();

router.get("/offers", (req, res) => {
  res.json(store.all("offers"));
});

// POST /api/coupons/validate { code, subtotal }
router.post("/coupons/validate", (req, res) => {
  const { code, subtotal } = req.body ?? {};
  if (!code) {
    return res.status(400).json({ valid: false, message: "Coupon code is required." });
  }
  const result = validateCoupon(code, Number(subtotal) || 0);
  if (!result.ok) {
    return res.status(400).json({ valid: false, message: result.message });
  }
  res.json({ valid: true, coupon: result.coupon });
});

export default router;

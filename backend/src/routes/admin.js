import { Router } from "express";
import * as store from "../lib/store.js";
import { HttpError, shortId, slugify } from "../lib/utils.js";
import { ORDER_STATUSES } from "./orders.js";

// Admin panel endpoints. A real backend would protect these with auth
// middleware — this mock keeps them open for demo purposes.
const router = Router();

const ADMIN_RX_STATUSES = ["approved", "rejected", "under-review"];
const STORE_KINDS = ["medicines", "wellness", "devices"];
const DEFAULT_ICON_BY_STORE = { medicines: "pill", wellness: "supplement", devices: "stethoscope" };

// GET /api/admin/stats
router.get("/stats", (req, res) => {
  res.json({ ...store.all("adminStats"), monthlyRevenue: store.all("monthlyRevenue") });
});

// GET /api/admin/orders
router.get("/orders", (req, res) => {
  res.json(store.all("adminOrders"));
});

// PATCH /api/admin/orders/:id/status { status }
router.patch("/orders/:id/status", (req, res) => {
  const { status } = req.body ?? {};
  if (!ORDER_STATUSES.includes(status)) {
    throw new HttpError(400, `status must be one of: ${ORDER_STATUSES.join(", ")}`);
  }
  const order = store.update("adminOrders", req.params.id, { status });
  if (!order) throw new HttpError(404, `Order "${req.params.id}" not found`);
  res.json(order);
});

// GET /api/admin/prescriptions
router.get("/prescriptions", (req, res) => {
  res.json(store.all("adminPrescriptions"));
});

// PATCH /api/admin/prescriptions/:id/status { status }
router.patch("/prescriptions/:id/status", (req, res) => {
  const { status } = req.body ?? {};
  if (!ADMIN_RX_STATUSES.includes(status)) {
    throw new HttpError(400, `status must be one of: ${ADMIN_RX_STATUSES.join(", ")}`);
  }
  const prescription = store.update("adminPrescriptions", req.params.id, { status });
  if (!prescription) throw new HttpError(404, `Prescription "${req.params.id}" not found`);
  res.json(prescription);
});

// GET /api/admin/customers
router.get("/customers", (req, res) => {
  res.json(store.all("adminCustomers"));
});

function uniqueSlug(base, ignoreId = null) {
  let slug = base;
  let counter = 2;
  while (store.all("products").some((p) => p.slug === slug && p.id !== ignoreId)) {
    slug = `${base}-${counter}`;
    counter += 1;
  }
  return slug;
}

// POST /api/admin/products — create a product with sensible defaults.
router.post("/products", (req, res) => {
  const body = req.body ?? {};
  const { name, brand, price, mrp, category, store: storeKind } = body;

  const missing = ["name", "brand", "price", "mrp", "category", "store"].filter(
    (field) => body[field] === undefined || body[field] === ""
  );
  if (missing.length > 0) {
    throw new HttpError(400, `Missing required fields: ${missing.join(", ")}`);
  }
  if (!STORE_KINDS.includes(storeKind)) {
    throw new HttpError(400, `store must be one of: ${STORE_KINDS.join(", ")}`);
  }
  if (!Number.isFinite(Number(price)) || !Number.isFinite(Number(mrp)) || Number(price) <= 0 || Number(mrp) <= 0) {
    throw new HttpError(400, "price and mrp must be positive numbers");
  }

  const product = {
    id: `prd-${shortId()}`,
    slug: uniqueSlug(slugify(name)),
    name,
    brand,
    category,
    subcategory: body.subcategory ?? "General",
    store: storeKind,
    price: Math.round(Number(price)),
    mrp: Math.round(Number(mrp)),
    rating: body.rating ?? 0,
    reviewCount: body.reviewCount ?? 0,
    prescriptionRequired: Boolean(body.prescriptionRequired),
    inStock: body.inStock ?? true,
    stockCount: body.stockCount ?? 100,
    packSize: body.packSize ?? "1 unit",
    description: body.description ?? `${name} by ${brand}.`,
    highlights: body.highlights ?? [],
    manufacturer: body.manufacturer ?? brand,
    countryOfOrigin: body.countryOfOrigin ?? "India",
    tags: body.tags ?? ["new"],
    image: body.image ?? { icon: DEFAULT_ICON_BY_STORE[storeKind], tint: "blue" },
  };

  store.insert("products", product);
  res.status(201).json(product);
});

// PUT /api/admin/products/:id — partial update; id is immutable.
router.put("/products/:id", (req, res) => {
  const existing = store.getById("products", req.params.id);
  if (!existing) throw new HttpError(404, `Product "${req.params.id}" not found`);

  const { id, ...patch } = req.body ?? {};
  if (patch.name && !patch.slug) {
    patch.slug = uniqueSlug(slugify(patch.name), existing.id);
  }
  res.json(store.update("products", req.params.id, patch));
});

// DELETE /api/admin/products/:id
router.delete("/products/:id", (req, res) => {
  const removed = store.remove("products", req.params.id);
  if (!removed) throw new HttpError(404, `Product "${req.params.id}" not found`);
  res.json({ deleted: true, id: req.params.id });
});

export default router;

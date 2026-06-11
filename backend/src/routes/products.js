import { Router } from "express";
import * as store from "../lib/store.js";
import { HttpError, slugify } from "../lib/utils.js";

const router = Router();

const SORTERS = {
  popularity: (a, b) => b.reviewCount - a.reviewCount,
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  rating: (a, b) => b.rating - a.rating,
  discount: (a, b) => (b.mrp - b.price) / b.mrp - (a.mrp - a.price) / a.mrp,
};

// GET /api/products — filterable, sortable, paginated catalogue.
router.get("/", (req, res) => {
  const {
    store: storeKind,
    category,
    subcategory,
    brand,
    q,
    minPrice,
    maxPrice,
    prescriptionRequired,
    tag,
    sort = "popularity",
  } = req.query;

  let items = [...store.all("products")];

  if (storeKind) items = items.filter((p) => p.store === storeKind);
  if (category) items = items.filter((p) => p.category === category);
  if (subcategory) {
    const wanted = String(subcategory).toLowerCase();
    items = items.filter((p) => p.subcategory.toLowerCase() === wanted);
  }
  if (brand) {
    const wanted = String(brand)
      .split(",")
      .map((b) => b.trim().toLowerCase())
      .filter(Boolean);
    items = items.filter(
      (p) => wanted.includes(p.brand.toLowerCase()) || wanted.includes(slugify(p.brand))
    );
  }
  if (q) {
    const needle = String(q).trim().toLowerCase();
    items = items.filter((p) =>
      [p.name, p.brand, p.subcategory, ...(p.ingredients ?? [])]
        .join(" ")
        .toLowerCase()
        .includes(needle)
    );
  }
  if (minPrice !== undefined) items = items.filter((p) => p.price >= Number(minPrice));
  if (maxPrice !== undefined) items = items.filter((p) => p.price <= Number(maxPrice));
  if (prescriptionRequired !== undefined) {
    const wanted = String(prescriptionRequired) === "true";
    items = items.filter((p) => p.prescriptionRequired === wanted);
  }
  if (tag) items = items.filter((p) => p.tags.includes(String(tag)));

  items.sort(SORTERS[sort] ?? SORTERS.popularity);

  const limit = Math.max(1, Number.parseInt(req.query.limit, 10) || 12);
  const totalPages = Math.max(1, Math.ceil(items.length / limit));
  const page = Math.min(Math.max(1, Number.parseInt(req.query.page, 10) || 1), totalPages);
  const start = (page - 1) * limit;

  res.json({
    data: items.slice(start, start + limit),
    meta: { total: items.length, page, limit, totalPages },
  });
});

// GET /api/products/featured — bestsellers first, then most reviewed.
router.get("/featured", (req, res) => {
  const limit = Math.max(1, Number.parseInt(req.query.limit, 10) || 8);
  const featured = [...store.all("products")].sort(
    (a, b) =>
      Number(b.tags.includes("bestseller")) - Number(a.tags.includes("bestseller")) ||
      b.reviewCount - a.reviewCount
  );
  res.json(featured.slice(0, limit));
});

// GET /api/products/trending
router.get("/trending", (req, res) => {
  const limit = Math.max(1, Number.parseInt(req.query.limit, 10) || 8);
  const trending = store.all("products").filter((p) => p.tags.includes("trending"));
  res.json(trending.slice(0, limit));
});

// GET /api/products/:slug
router.get("/:slug", (req, res) => {
  const product = store.findBy("products", "slug", req.params.slug);
  if (!product) throw new HttpError(404, `Product "${req.params.slug}" not found`);
  res.json(product);
});

// GET /api/products/:slug/related — same subcategory first, then same category.
router.get("/:slug/related", (req, res) => {
  const product = store.findBy("products", "slug", req.params.slug);
  if (!product) throw new HttpError(404, `Product "${req.params.slug}" not found`);

  const limit = Math.max(1, Number.parseInt(req.query.limit, 10) || 4);
  const products = store.all("products");
  const sameSubcategory = products.filter(
    (p) => p.id !== product.id && p.subcategory === product.subcategory
  );
  const sameCategory = products.filter(
    (p) =>
      p.id !== product.id &&
      p.category === product.category &&
      p.subcategory !== product.subcategory
  );
  res.json([...sameSubcategory, ...sameCategory].slice(0, limit));
});

export default router;

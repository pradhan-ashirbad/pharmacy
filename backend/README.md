# MediKart Mock API

Production-quality **mock** REST backend for the MediKart pharmacy e-commerce
frontend. Express 4 + ESM, no real database, no real auth — all data is loaded
from JSON seed files into memory at boot.

## Run

Dependencies are hoisted to the repo root (npm workspaces), so from the repo
root:

```bash
npm run dev -w backend     # nodemon, restarts on change
npm run start -w backend   # plain node
```

The server listens on `PORT` (default **5000**). Health check:
`GET http://localhost:5000/api/health`.

## Swapping in a real database

`src/lib/store.js` is the single seam between the routes and the data. It
loads the JSON fixtures in `src/data/` into in-memory collections and exposes
`all / findBy / getById / insert / update / remove`. To move to
MongoDB/PostgreSQL, reimplement those helpers with real queries (same
signatures) — no route code needs to change. Mutations are in-memory only;
restarting the server resets to the seed data.

## Endpoints

All routes are prefixed with `/api`. Errors use a consistent shape:
`{ "error": { "message": string, "status": number } }`.

### Health

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/health` | `{ status: "ok", service: "medikart-api", time }` |

### Products

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/products` | Catalogue with filters, sort & pagination → `{ data, meta: { total, page, limit, totalPages } }` |
| GET | `/api/products/featured?limit=` | Bestseller-tagged first, then by review count |
| GET | `/api/products/trending` | Products tagged `trending` |
| GET | `/api/products/:slug` | Single product (404 if missing) |
| GET | `/api/products/:slug/related` | Same subcategory first, then same category (limit 4) |

Query params for `GET /api/products`:
`store` (medicines\|wellness\|devices), `category`, `subcategory`,
`brand` (comma-separated names or slugs), `q` (searches name/brand/subcategory/ingredients),
`minPrice`, `maxPrice`, `prescriptionRequired` (true\|false), `tag`,
`sort` (`popularity` default \| `price-asc` \| `price-desc` \| `rating` \| `discount`),
`page` (1-based), `limit` (default 12).

### Taxonomy & content

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/categories` | 10 product categories |
| GET | `/api/health-concerns` | 8 health concerns |
| GET | `/api/brands` | 12 brands |
| GET | `/api/offers` | 4 promotional offers |

### Coupons

| Method | Path | Description |
| --- | --- | --- |
| POST | `/api/coupons/validate` | Body `{ code, subtotal }` → `200 { valid: true, coupon }` or `400 { valid: false, message }` |

Seeded codes: `WELCOME20` (20%, max ₹200, min ₹499), `FLAT100` (₹100, min ₹999),
`HEALTH10` (10%, max ₹300, min ₹799), `FREESHIP` (free delivery, min ₹499).

### Auth (mock — returns fake `mock-jwt-<uuid>` tokens)

| Method | Path | Description |
| --- | --- | --- |
| POST | `/api/auth/register` | `{ name, email, phone, password }` → `201 { user, token }` |
| POST | `/api/auth/login` | `{ email, password }` → `200 { user, token }`; password `"wrong"` → 401 (demo error state) |
| POST | `/api/auth/google` | → `200 { user, token }` (demo Google user) |
| POST | `/api/auth/forgot-password` | `{ email }` → `200 { message, otpHint: "Use 123456" }` |
| POST | `/api/auth/verify-otp` | `{ otp }` → `200 { verified: true, token }` when otp is `123456`, else 400 |

### Cart

| Method | Path | Description |
| --- | --- | --- |
| POST | `/api/cart/summary` | `{ items: [{ productId, quantity }], couponCode?, deliveryMethod? }` → `{ items, summary, coupon }` |

Pricing rules (`src/lib/pricing.js`, integer rupees): `itemTotal` = Σ mrp×qty;
`discount` = Σ (mrp−price)×qty; coupon = percent (capped) / flat / free-shipping;
delivery ₹0 when net subtotal ≥ ₹499 else ₹49, express +₹99 (FREESHIP waives
only the base fee); GST 12% of net subtotal.

### Orders (seeded with 2 demo orders)

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/orders` | All orders |
| GET | `/api/orders/:id` | Single order (404 if missing) |
| POST | `/api/orders` | `{ items, address, paymentMethod, deliveryMethod?, couponCode? }` → `201` full Order with id `MK<10 alnum>`, 6-step timeline, expected delivery +3d (standard) / +1d (express) |
| PATCH | `/api/orders/:id/status` | `{ status }` — one of the 6 flow statuses or `cancelled`; fills timeline timestamps up to that status |

### Prescriptions (seeded with 2 demo prescriptions)

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/prescriptions` | All prescriptions |
| POST | `/api/prescriptions` | Multipart single file field `file` (jpg/jpeg/png/webp/pdf, max 5 MB, stored in `backend/uploads/`) **or** JSON fallback `{ fileName, fileType }` → `201` |
| PATCH | `/api/prescriptions/:id/status` | `{ status, note? }` — uploaded \| under-review \| approved \| rejected |

### Admin

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/admin/stats` | KPI stats + `monthlyRevenue` array |
| GET | `/api/admin/orders` | Admin order rows |
| PATCH | `/api/admin/orders/:id/status` | `{ status }` |
| GET | `/api/admin/prescriptions` | Admin prescription queue |
| PATCH | `/api/admin/prescriptions/:id/status` | `{ status }` — approved \| rejected \| under-review |
| GET | `/api/admin/customers` | Customer list |
| POST | `/api/admin/products` | Create product (requires name/brand/price/mrp/category/store; id `prd-<short uuid>`, slug from name, sensible defaults) |
| PUT | `/api/admin/products/:id` | Partial update (id immutable; slug regenerated when name changes) |
| DELETE | `/api/admin/products/:id` | `{ deleted: true, id }` |

## Seed data

`src/data/*.json` mirrors the frontend's canonical mock data
(`frontend/src/data/*.ts`): **68 products** (26 medicines + 26 wellness + 16
devices), 10 categories, 8 health concerns, 12 brands, 4 offers, 4 coupons,
Admin fixtures and seeded orders/prescriptions.

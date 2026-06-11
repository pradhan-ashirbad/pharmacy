# MediKart — Modern Pharmacy E‑Commerce Platform 🇮🇳

A premium, production‑ready pharmacy marketplace for the Indian market — think Apollo Pharmacy / Tata 1mg / Netmeds, but with a cleaner, calmer, more modern UX. Built as a monorepo with a **Next.js 14 + TypeScript** frontend and a **Node.js + Express** mock API.

All prices are in **INR (₹)**. The data layer is fully mocked (typed TS data on the client, mirrored JSON on the server) and is structured so it can later be swapped for MongoDB/PostgreSQL with no UI changes.

---

## ✨ Features

**Storefront**
- Premium homepage — hero with live search, categories, featured products, health concerns, offers, brand marquee, recently viewed, health blog
- Three dedicated stores — **Medicines**, **Wellness**, **Health Devices/Gadgets** — each with search, category/brand/price filters, prescription filter and sorting (popularity, price, rating, discount)
- Rich product detail page — image gallery with hover‑zoom, dosage/ingredients/specs/side‑effects tabs, reviews with rating distribution, frequently‑bought‑together bundle, similar products, Buy Now / Add to Cart
- Cart with quantity controls, coupon engine, GST + delivery breakdown and free‑delivery progress
- 4‑step checkout — Address → Delivery → Payment (UPI, Credit/Debit Card, Net Banking, Wallet, COD) → Review — with animated order confirmation
- Auth — Login, Register, Forgot Password, OTP verification, mock Google login (demo OTP: `123456`)
- User dashboard — Profile, Orders, live order tracking timeline, Wishlist, Saved Addresses, Prescriptions, Notifications
- Prescription upload (image/PDF, drag & drop) with status pipeline: Uploaded → Under Review → Approved → Rejected
- Order tracking timeline: Placed → Confirmed → Packed → Shipped → Out for Delivery → Delivered
- Wishlist, product comparison (up to 4), recently viewed

**Admin panel** (`/admin`)
- Dashboard with revenue/orders/customers/products stats and a 6‑month revenue chart
- Product management (add / edit / delete), order management (update status), prescription approval/rejection, customer management

**Cross‑cutting**
- Fully responsive (mobile / tablet / desktop)
- Dark mode, skeleton loaders, toast notifications, empty/loading/error states
- SEO: per‑page metadata, Open Graph, JSON‑LD product schema, `sitemap.xml`, `robots.txt`
- Smooth Framer Motion animations, Shadcn‑style UI built on Radix primitives

---

## 🧱 Tech Stack

| Layer     | Tech |
|-----------|------|
| Frontend  | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Framer Motion, Shadcn‑style UI (Radix), Zustand, Sonner, lucide‑react |
| Backend   | Node.js, Express.js (ESM), Multer, Morgan, CORS |
| Data      | Mock TS data (client) + mirrored JSON (server). No DB — `backend/src/lib/store.js` is the single seam to plug in MongoDB/PostgreSQL later |

---

## 📁 Folder Structure

```
pharmacy/
├── package.json            # npm workspaces root (runs web + api together)
├── frontend/               # Next.js app
│   └── src/
│       ├── app/            # App Router pages
│       │   ├── (site)/     # storefront (navbar + footer layout)
│       │   └── admin/      # admin panel (its own shell)
│       ├── components/     # ui/ (Shadcn), shared/, layout/, product/, cart/, home/, orders/, auth/, prescriptions/, store/, theme/
│       ├── data/           # typed mock catalogue & content
│       ├── store/          # Zustand stores (cart, wishlist, compare, auth, account, recently‑viewed)
│       ├── lib/            # utils, pricing, orders, visuals
│       ├── hooks/
│       └── types/
└── backend/                # Express mock API
    └── src/
        ├── server.js, app.js
        ├── data/           # JSON mirrors of the frontend data
        ├── lib/            # store.js (DB seam), pricing.js, utils.js
        └── routes/         # products, categories, offers, blog, auth, cart, orders, prescriptions, admin
```

---

## 🚀 Getting Started

**Requirements:** Node.js ≥ 18.17

```bash
# from the repo root — installs frontend + backend (npm workspaces)
npm install

# run frontend (http://localhost:3000) and backend (http://localhost:5000) together
npm run dev
```

Run them individually if you prefer:

```bash
npm run dev:web   # Next.js on :3000
npm run dev:api   # Express on :5000
```

Build the frontend for production:

```bash
npm run build && npm start
```

The Next.js app proxies `/api/*` to the Express backend via a rewrite (configurable with `NEXT_PUBLIC_API_URL`). The UI runs fully on its typed mock data, so it works even without the backend running — the API is there for when you wire in a real database.

### Environment variables

Copy the examples and adjust as needed:

```bash
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
```

| Variable | Where | Default | Purpose |
|----------|-------|---------|---------|
| `NEXT_PUBLIC_API_URL` | frontend | `http://localhost:5000` | Backend base URL for the `/api` proxy |
| `NEXT_PUBLIC_SITE_URL` | frontend | `https://medikart.example.com` | Canonical site URL for SEO/sitemap |
| `PORT` | backend | `5000` | Express port |

---

## 🔌 Mock API (selected endpoints)

```
GET  /api/health
GET  /api/products            # ?store=&category=&brand=&q=&minPrice=&maxPrice=&sort=&page=&limit=
GET  /api/products/:slug
GET  /api/products/:slug/related
GET  /api/categories | /api/health-concerns | /api/brands | /api/offers
GET  /api/blog | /api/blog/:slug
POST /api/coupons/validate
POST /api/cart/summary
GET/POST /api/orders | PATCH /api/orders/:id/status
GET/POST /api/prescriptions | PATCH /api/prescriptions/:id/status
POST /api/auth/login | register | google | forgot-password | verify-otp
GET  /api/admin/stats | orders | prescriptions | customers
POST/PUT/DELETE /api/admin/products
```

See `backend/README.md` for the full endpoint table.

---

## 💡 Demo Notes

- **Demo OTP** for registration / password reset: `123456`
- Checkout is simulated — no real payment is processed
- Auth, cart, wishlist, compare, addresses, orders, prescriptions and notifications persist in `localStorage`, so the experience feels real across reloads
- Product imagery uses deterministic gradient + icon placeholders (`ProductVisual`); swap for `next/image` once real CDN photos exist

---

## 🗺️ Swapping in a Real Database

The frontend reads from `frontend/src/data/*` and the backend from `backend/src/data/*.json` through `backend/src/lib/store.js`. Replace that one module with a real data source (MongoDB/PostgreSQL) — the route handlers, types and UI stay the same.

---

_Built with care for a healthier India._ 🌿

// ---------------------------------------------------------------------------
// In-memory "database" layer.
//
// This module is the SINGLE SEAM to swap out when moving to a real database
// (MongoDB / PostgreSQL): the JSON files under src/data act as seed fixtures,
// and every route reads/writes exclusively through the helpers exported here.
// Replace the implementations below with real queries (keeping the same
// signatures) and nothing else in the codebase needs to change.
//
// Note: mutations live only in process memory — restarting the server resets
// everything back to the seed JSON, which is exactly what we want for a mock.
// ---------------------------------------------------------------------------
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dataDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "data");

function load(file) {
  return JSON.parse(readFileSync(path.join(dataDir, file), "utf8"));
}

const collections = {
  products: load("products.json"),
  categories: load("categories.json"),
  healthConcerns: load("health-concerns.json"),
  brands: load("brands.json"),
  offers: load("offers.json"),
  coupons: load("coupons.json"),
  blog: load("blog.json"),
  adminStats: load("admin-stats.json"), // plain object, not an array
  adminOrders: load("admin-orders.json"),
  adminPrescriptions: load("admin-prescriptions.json"),
  adminCustomers: load("admin-customers.json"),
  monthlyRevenue: load("monthly-revenue.json"),
  orders: load("seed-orders.json"),
  prescriptions: load("seed-prescriptions.json"),
};

/** Returns the whole collection (live reference — treat as read-only). */
export function all(name) {
  return collections[name];
}

/** First document whose `key` equals `value`, or undefined. */
export function findBy(name, key, value) {
  return collections[name].find((doc) => doc[key] === value);
}

/** Document by `id` field, or undefined. */
export function getById(name, id) {
  return findBy(name, "id", id);
}

/** Inserts a document; `prepend` puts newest-first (orders, prescriptions). */
export function insert(name, doc, { prepend = false } = {}) {
  if (prepend) collections[name].unshift(doc);
  else collections[name].push(doc);
  return doc;
}

/** Shallow-merges `patch` into the document with the given id. */
export function update(name, id, patch) {
  const doc = getById(name, id);
  if (!doc) return null;
  Object.assign(doc, patch);
  return doc;
}

/** Removes a document by id. Returns true when something was deleted. */
export function remove(name, id) {
  const index = collections[name].findIndex((doc) => doc.id === id);
  if (index === -1) return false;
  collections[name].splice(index, 1);
  return true;
}

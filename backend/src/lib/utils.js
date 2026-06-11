import { v4 as uuidv4 } from "uuid";

/** Wraps an async route handler so rejections reach the central error handler. */
export function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

/** Error with an HTTP status, rendered by the central error handler. */
export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}

/** Short 8-char unique id fragment, e.g. "9f1c2ab3". */
export function shortId() {
  return uuidv4().split("-")[0];
}

/** Fake JWT-looking token for the mock auth endpoints. */
export function mockToken() {
  return `mock-jwt-${uuidv4()}`;
}

/** "Dolo 650 Tablet" -> "dolo-650-tablet" */
export function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const ORDER_ID_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/** Order id in the frontend's format: "MK" + 10 uppercase alphanumerics. */
export function orderId() {
  let suffix = "";
  for (let i = 0; i < 10; i += 1) {
    suffix += ORDER_ID_ALPHABET[Math.floor(Math.random() * ORDER_ID_ALPHABET.length)];
  }
  return `MK${suffix}`;
}

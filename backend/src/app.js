import express from "express";
import cors from "cors";
import morgan from "morgan";

import productsRouter from "./routes/products.js";
import categoriesRouter from "./routes/categories.js";
import offersRouter from "./routes/offers.js";
import blogRouter from "./routes/blog.js";
import authRouter from "./routes/auth.js";
import cartRouter from "./routes/cart.js";
import ordersRouter from "./routes/orders.js";
import prescriptionsRouter from "./routes/prescriptions.js";
import adminRouter from "./routes/admin.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Health check.
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "medikart-api", time: new Date().toISOString() });
});

app.use("/api/products", productsRouter);
app.use("/api", categoriesRouter); // /api/categories, /api/health-concerns, /api/brands
app.use("/api", offersRouter); // /api/offers, /api/coupons/validate
app.use("/api/blog", blogRouter);
app.use("/api/auth", authRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/prescriptions", prescriptionsRouter);
app.use("/api/admin", adminRouter);

// 404 — consistent JSON error shape.
app.use((req, res) => {
  res.status(404).json({
    error: { message: `Route ${req.method} ${req.originalUrl} not found`, status: 404 },
  });
});

// Central error handler — every error funnels into { error: { message, status } }.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  let status = err.status ?? err.statusCode ?? 500;
  let message = err.message || "Internal server error";

  // Multer errors (file too large, unexpected field, ...) are client errors.
  if (err.name === "MulterError") {
    status = 400;
    if (err.code === "LIMIT_FILE_SIZE") message = "File too large — maximum allowed size is 5 MB";
  }

  if (status >= 500) console.error(err);
  res.status(status).json({ error: { message, status } });
});

export default app;

import { Router } from "express";
import * as store from "../lib/store.js";

// Mounted at /api — serves the small read-only taxonomy collections.
const router = Router();

router.get("/categories", (req, res) => {
  res.json(store.all("categories"));
});

router.get("/health-concerns", (req, res) => {
  res.json(store.all("healthConcerns"));
});

router.get("/brands", (req, res) => {
  res.json(store.all("brands"));
});

export default router;

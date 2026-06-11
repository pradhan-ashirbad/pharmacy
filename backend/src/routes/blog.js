import { Router } from "express";
import * as store from "../lib/store.js";
import { HttpError } from "../lib/utils.js";

const router = Router();

router.get("/", (req, res) => {
  res.json(store.all("blog"));
});

router.get("/:slug", (req, res) => {
  const post = store.findBy("blog", "slug", req.params.slug);
  if (!post) throw new HttpError(404, `Blog post "${req.params.slug}" not found`);
  res.json(post);
});

export default router;

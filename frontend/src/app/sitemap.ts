import type { MetadataRoute } from "next";
import { allProducts } from "@/data/products";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://medikart.example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/medicines",
    "/wellness",
    "/health-devices",
    "/offers",
    "/cart",
    "/upload-prescription",
    "/track-order",
    "/login",
    "/register",
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const productRoutes: MetadataRoute.Sitemap = allProducts.map((p) => ({
    url: `${siteUrl}/products/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}

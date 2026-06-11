import type { MetadataRoute } from "next";
import { allProducts } from "@/data/products";
import { blogPosts } from "@/data/blog";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://medikart.example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/medicines",
    "/wellness",
    "/health-devices",
    "/offers",
    "/blog",
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

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((p) => ({
    url: `${siteUrl}/blog/${p.slug}`,
    lastModified: new Date(p.publishedOn),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes, ...blogRoutes];
}

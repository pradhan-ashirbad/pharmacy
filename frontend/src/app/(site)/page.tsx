import type { Metadata } from "next";

import { BlogSection } from "@/components/home/blog-section";
import { BrandsSection } from "@/components/home/brands-section";
import { CategoriesSection } from "@/components/home/categories-section";
import { FeaturedProducts } from "@/components/home/featured-products";
import { HealthConcernsSection } from "@/components/home/health-concerns-section";
import { Hero } from "@/components/home/hero";
import { OffersSection } from "@/components/home/offers-section";
import { RecentlyViewed } from "@/components/product/recently-viewed";

export const metadata: Metadata = {
  title: "MediKart — India's Modern Online Pharmacy",
  description:
    "Order genuine medicines, wellness products and health devices online with free delivery above ₹499. Upload prescriptions and consult licensed pharmacists 24×7.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoriesSection />
      <FeaturedProducts />
      <HealthConcernsSection />
      <OffersSection />
      <BrandsSection />
      <RecentlyViewed />
      <BlogSection />
    </>
  );
}

import type { Metadata } from "next";

import { ProductsManager } from "./products-manager";

export const metadata: Metadata = {
  title: "Product Management",
};

export default function AdminProductsPage() {
  return <ProductsManager />;
}

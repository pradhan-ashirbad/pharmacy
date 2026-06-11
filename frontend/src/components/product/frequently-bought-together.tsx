"use client";

import Link from "next/link";
import { Plus, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

import { ProductVisual } from "@/components/shared/product-visual";
import { Button } from "@/components/ui/button";
import { formatINR } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import type { Product } from "@/types";

interface FrequentlyBoughtTogetherProps {
  product: Product;
  companions: Product[];
}

export function FrequentlyBoughtTogether({
  product,
  companions,
}: FrequentlyBoughtTogetherProps) {
  const addItem = useCartStore((s) => s.addItem);
  if (companions.length === 0) return null;

  const bundle = [product, ...companions];
  const bundleTotal = bundle.reduce((sum, p) => sum + p.price, 0);
  const bundleMrp = bundle.reduce((sum, p) => sum + p.mrp, 0);

  const addBundle = () => {
    bundle.forEach((p) => addItem(p));
    toast.success("Bundle added to cart", {
      description: `${bundle.length} products · ${formatINR(bundleTotal)}`,
    });
  };

  return (
    <section aria-labelledby="fbt-heading">
      <h2 id="fbt-heading" className="font-display text-xl font-bold sm:text-2xl">
        Frequently Bought Together
      </h2>
      <div className="mt-5 rounded-2xl border bg-card p-5 shadow-soft sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {bundle.map((p, i) => (
              <div key={p.id} className="flex items-center gap-2 sm:gap-3">
                {i > 0 && <Plus className="h-4 w-4 shrink-0 text-muted-foreground" />}
                <Link
                  href={`/products/${p.slug}`}
                  className="group w-28 text-center sm:w-32"
                >
                  <ProductVisual
                    image={p.image}
                    className="mx-auto h-20 w-20 rounded-xl transition-transform group-hover:scale-105 sm:h-24 sm:w-24"
                  />
                  <p className="mt-2 line-clamp-2 text-xs font-medium leading-snug group-hover:text-primary">
                    {p.name}
                  </p>
                  <p className="mt-0.5 text-xs font-semibold">{formatINR(p.price)}</p>
                </Link>
              </div>
            ))}
          </div>

          <div className="lg:ml-auto lg:text-right">
            <p className="text-sm text-muted-foreground">Bundle price</p>
            <p className="text-2xl font-bold">
              {formatINR(bundleTotal)}{" "}
              <span className="text-sm font-normal text-muted-foreground line-through">
                {formatINR(bundleMrp)}
              </span>
            </p>
            <p className="text-xs font-medium text-success">
              You save {formatINR(bundleMrp - bundleTotal)}
            </p>
            <Button onClick={addBundle} className="mt-3 w-full lg:w-auto">
              <ShoppingCart className="h-4 w-4" />
              Add all {bundle.length} to cart
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

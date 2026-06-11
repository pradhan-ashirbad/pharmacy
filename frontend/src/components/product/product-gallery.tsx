"use client";

import * as React from "react";

import { ProductVisual } from "@/components/shared/product-visual";
import { Badge } from "@/components/ui/badge";
import { cn, discountPercent } from "@/lib/utils";
import type { Product } from "@/types";

/**
 * Product gallery with hover-zoom. Mock products render deterministic
 * artwork; the thumbnail strip demonstrates the multi-image layout that
 * real CDN photos will use.
 */
export function ProductGallery({ product }: { product: Product }) {
  const [active, setActive] = React.useState(0);
  const [zoom, setZoom] = React.useState(false);
  const [origin, setOrigin] = React.useState("50% 50%");
  const discount = discountPercent(product.mrp, product.price);

  // Render the artwork at three "angles" by varying the icon scale.
  const variants = [
    { iconClassName: "h-1/3 w-1/3" },
    { iconClassName: "h-1/4 w-1/4 rotate-12" },
    { iconClassName: "h-2/5 w-2/5 -rotate-6" },
  ];

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin(`${x}% ${y}%`);
  };

  return (
    <div>
      <div
        className="relative cursor-zoom-in overflow-hidden rounded-3xl border shadow-soft"
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
        onMouseMove={handleMove}
      >
        <div
          className="transition-transform duration-200"
          style={{
            transform: zoom ? "scale(1.8)" : "scale(1)",
            transformOrigin: origin,
          }}
        >
          <ProductVisual
            image={product.image}
            className="aspect-square w-full"
            iconClassName={variants[active].iconClassName}
          />
        </div>
        <div className="absolute left-4 top-4 flex flex-col gap-1.5">
          {discount > 0 && <Badge variant="success">{discount}% OFF</Badge>}
          {product.prescriptionRequired && (
            <Badge variant="soft">Prescription required</Badge>
          )}
        </div>
      </div>

      <div className="mt-3 flex gap-3">
        {variants.map((v, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`View image ${i + 1}`}
            className={cn(
              "overflow-hidden rounded-xl border-2 transition-colors",
              active === i ? "border-primary" : "border-transparent hover:border-border"
            )}
          >
            <ProductVisual
              image={product.image}
              className="h-16 w-16 sm:h-20 sm:w-20"
              iconClassName={v.iconClassName}
            />
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Hover over the image to zoom
      </p>
    </div>
  );
}

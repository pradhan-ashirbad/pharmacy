"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { iconMap, tintStyles } from "@/lib/visuals";
import type { ProductImage } from "@/types";

interface ProductVisualProps {
  image: ProductImage;
  /** Product name — when provided, the tile depicts this product (brand + name). */
  name?: string;
  /** Brand label shown above the name on the branded tile. */
  brand?: string;
  /** Optional pack size shown beneath the name. */
  packSize?: string;
  className?: string;
  iconClassName?: string;
  alt?: string;
}

/**
 * Product artwork. In priority order it renders:
 *   1. A real photo when `image.imageUrl` is set (drop a CDN URL in to use).
 *   2. A branded label tile (icon + brand + product name) when `name` is given —
 *      this always matches the product, so it's used on large surfaces.
 *   3. A compact icon-only gradient for small thumbnails.
 */
export function ProductVisual({
  image,
  name,
  brand,
  packSize,
  className,
  iconClassName,
  alt,
}: ProductVisualProps) {
  const [imgError, setImgError] = useState(false);
  const Icon = iconMap[image.icon];
  const tint = tintStyles[image.tint];

  // 1. Real photo when available.
  if (image.imageUrl && !imgError) {
    return (
      <div className={cn("relative overflow-hidden bg-white", className)}>
        <Image
          src={image.imageUrl}
          alt={alt ?? name ?? "Product image"}
          fill
          className="object-contain p-3"
          onError={() => setImgError(true)}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          unoptimized
        />
      </div>
    );
  }

  // 2. Branded label tile — depicts this exact product.
  if (name) {
    return (
      <div
        className={cn(
          "relative flex flex-col items-center justify-center gap-1.5 overflow-hidden p-4 text-center",
          tint.surface,
          className
        )}
      >
        <div className="pointer-events-none absolute -left-6 -top-6 h-24 w-24 rounded-full bg-white/40 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-8 -right-8 h-28 w-28 rounded-full bg-white/50 blur-2xl" />
        <span
          className={cn(
            "relative flex h-14 w-14 items-center justify-center rounded-2xl bg-white/70 shadow-soft",
            tint.text
          )}
        >
          <Icon strokeWidth={1.5} className="h-7 w-7" />
        </span>
        {brand && (
          <span
            className={cn(
              "relative mt-1 text-[10px] font-bold uppercase tracking-wider",
              tint.text
            )}
          >
            {brand}
          </span>
        )}
        <span className="relative line-clamp-3 px-1 text-sm font-bold leading-snug text-foreground/85">
          {name}
        </span>
        {packSize && (
          <span className="relative text-[10px] font-medium text-foreground/50">
            {packSize}
          </span>
        )}
      </div>
    );
  }

  // 3. Compact icon-only gradient for thumbnails.
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden",
        tint.surface,
        className
      )}
      aria-hidden="true"
    >
      <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-white/40 blur-2xl" />
      <div className="absolute -bottom-8 -right-8 h-28 w-28 rounded-full bg-white/50 blur-2xl" />
      <Icon
        strokeWidth={1.4}
        className={cn("relative h-1/3 w-1/3", tint.text, iconClassName)}
      />
    </div>
  );
}

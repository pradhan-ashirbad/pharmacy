"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { iconMap, tintStyles } from "@/lib/visuals";
import type { ProductImage } from "@/types";

interface ProductVisualProps {
  image: ProductImage;
  className?: string;
  iconClassName?: string;
  alt?: string;
}

export function ProductVisual({
  image,
  className,
  iconClassName,
  alt = "Product image",
}: ProductVisualProps) {
  const [imgError, setImgError] = useState(false);
  const Icon = iconMap[image.icon];
  const tint = tintStyles[image.tint];

  if (image.imageUrl && !imgError) {
    return (
      <div className={cn("relative overflow-hidden bg-white", className)}>
        <Image
          src={image.imageUrl}
          alt={alt}
          fill
          className="object-contain p-3"
          onError={() => setImgError(true)}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          unoptimized
        />
      </div>
    );
  }

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

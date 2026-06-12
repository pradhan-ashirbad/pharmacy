"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GitCompareArrows, Heart, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/shared/price";
import { ProductVisual } from "@/components/shared/product-visual";
import { QuantityStepper } from "@/components/shared/quantity-stepper";
import { RatingStars } from "@/components/shared/rating-stars";
import { useMounted } from "@/hooks/use-mounted";
import { cn, discountPercent } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { useCompareStore } from "@/store/compare";
import { useWishlistStore } from "@/store/wishlist";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const mounted = useMounted();
  const addItem = useCartStore((s) => s.addItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const quantity = useCartStore((s) =>
    mounted
      ? s.items.find((i) => i.product.id === product.id)?.quantity ?? 0
      : 0
  );
  const inWishlist = useWishlistStore((s) =>
    mounted ? s.items.some((p) => p.id === product.id) : false
  );
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const inCompare = useCompareStore((s) =>
    mounted ? s.items.some((p) => p.id === product.id) : false
  );
  const toggleCompare = useCompareStore((s) => s.toggle);

  const discount = discountPercent(product.mrp, product.price);

  const handleAddToCart = () => {
    addItem(product);
    toast.success("Added to cart", {
      description: `${product.name} · ${product.packSize}`,
    });
  };

  const handleWishlist = () => {
    const added = toggleWishlist(product);
    toast(added ? "Saved to wishlist" : "Removed from wishlist", {
      description: product.name,
    });
  };

  const handleCompare = () => {
    const result = toggleCompare(product);
    if (result === "full") {
      toast.error("Compare list is full", {
        description: "You can compare up to 4 products at a time.",
      });
    } else {
      toast(result === "added" ? "Added to compare" : "Removed from compare", {
        description: product.name,
      });
    }
  };

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border bg-card shadow-soft transition-shadow hover:shadow-card",
        className
      )}
    >
      <Link
        href={`/products/${product.slug}`}
        className="relative block"
        aria-label={product.name}
      >
        <ProductVisual
          image={product.image}
          name={product.name}
          brand={product.brand}
          className="aspect-square w-full transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <Badge variant="success" className="shadow-sm">
              {discount}% OFF
            </Badge>
          )}
          {product.prescriptionRequired && (
            <Badge variant="soft" className="shadow-sm">
              Rx
            </Badge>
          )}
          {product.tags.includes("bestseller") && (
            <Badge variant="warning" className="shadow-sm">
              Bestseller
            </Badge>
          )}
        </div>
      </Link>

      <div className="absolute right-3 top-3 flex flex-col gap-1.5 opacity-100 transition-opacity lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100">
        <button
          type="button"
          onClick={handleWishlist}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full bg-background/90 shadow-sm backdrop-blur transition-colors hover:text-rose-500",
            inWishlist ? "text-rose-500" : "text-muted-foreground"
          )}
        >
          <Heart className={cn("h-4 w-4", inWishlist && "fill-current")} />
        </button>
        <button
          type="button"
          onClick={handleCompare}
          aria-label={inCompare ? "Remove from compare" : "Add to compare"}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full bg-background/90 shadow-sm backdrop-blur transition-colors hover:text-primary",
            inCompare ? "text-primary" : "text-muted-foreground"
          )}
        >
          <GitCompareArrows className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {product.brand}
        </p>
        <Link
          href={`/products/${product.slug}`}
          className="line-clamp-2 text-sm font-semibold leading-snug transition-colors hover:text-primary"
        >
          {product.name}
        </Link>
        <p className="text-xs text-muted-foreground">{product.packSize}</p>
        <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <Price price={product.price} mrp={product.mrp} showDiscount={false} />
          {quantity > 0 ? (
            <QuantityStepper
              size="sm"
              quantity={quantity}
              min={0}
              onChange={(q) => updateQuantity(product.id, q)}
            />
          ) : (
            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={!product.inStock}
              aria-label={`Add ${product.name} to cart`}
            >
              <ShoppingCart className="h-4 w-4" />
              Add
            </Button>
          )}
        </div>
        {!product.inStock && (
          <p className="text-xs font-medium text-destructive">Out of stock</p>
        )}
      </div>
    </motion.article>
  );
}

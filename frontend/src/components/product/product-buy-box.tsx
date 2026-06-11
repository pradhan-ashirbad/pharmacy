"use client";

import { useRouter } from "next/navigation";
import {
  FileText,
  GitCompareArrows,
  Heart,
  ShieldCheck,
  ShoppingCart,
  Timer,
  Truck,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import { Price } from "@/components/shared/price";
import { QuantityStepper } from "@/components/shared/quantity-stepper";
import { RatingStars } from "@/components/shared/rating-stars";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { useCompareStore } from "@/store/compare";
import { useWishlistStore } from "@/store/wishlist";
import type { Product } from "@/types";

export function ProductBuyBox({ product }: { product: Product }) {
  const router = useRouter();
  const mounted = useMounted();
  const addItem = useCartStore((s) => s.addItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const quantity = useCartStore((s) =>
    mounted ? s.items.find((i) => i.product.id === product.id)?.quantity ?? 0 : 0
  );
  const inWishlist = useWishlistStore((s) =>
    mounted ? s.items.some((p) => p.id === product.id) : false
  );
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const toggleCompare = useCompareStore((s) => s.toggle);

  const handleAdd = () => {
    addItem(product);
    toast.success("Added to cart", { description: product.name });
  };

  const handleBuyNow = () => {
    if (quantity === 0) addItem(product);
    router.push("/checkout");
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-primary">
            {product.brand}
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
            {product.name}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{product.packSize}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => {
              const added = toggleWishlist(product);
              toast(added ? "Saved to wishlist" : "Removed from wishlist");
            }}
            aria-label="Toggle wishlist"
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full border transition-colors hover:border-rose-300 hover:text-rose-500",
              inWishlist ? "border-rose-300 text-rose-500" : "text-muted-foreground"
            )}
          >
            <Heart className={cn("h-5 w-5", inWishlist && "fill-current")} />
          </button>
          <button
            type="button"
            onClick={() => {
              const result = toggleCompare(product);
              if (result === "full")
                toast.error("Compare list is full (max 4 products)");
              else
                toast(result === "added" ? "Added to compare" : "Removed from compare");
            }}
            aria-label="Add to compare"
            className="flex h-10 w-10 items-center justify-center rounded-full border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <GitCompareArrows className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="mt-3">
        <RatingStars rating={product.rating} reviewCount={product.reviewCount} size="md" />
      </div>

      <Separator className="my-5" />

      <Price price={product.price} mrp={product.mrp} size="lg" />
      <p className="mt-1 text-xs text-muted-foreground">
        Inclusive of all taxes · MRP shown for {product.packSize.toLowerCase()}
      </p>

      {product.prescriptionRequired && (
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-warning/40 bg-warning/10 p-3.5">
          <FileText className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
          <p className="text-sm">
            <span className="font-semibold">Prescription required.</span>{" "}
            You can upload a valid prescription during checkout or from your
            account — our pharmacists verify it before dispatch.
          </p>
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {quantity > 0 ? (
          <QuantityStepper
            quantity={quantity}
            min={0}
            onChange={(q) => updateQuantity(product.id, q)}
          />
        ) : (
          <Button
            size="lg"
            onClick={handleAdd}
            disabled={!product.inStock}
            className="min-w-44"
          >
            <ShoppingCart className="h-5 w-5" />
            Add to Cart
          </Button>
        )}
        <Button
          size="lg"
          variant="gradient"
          onClick={handleBuyNow}
          disabled={!product.inStock}
          className="min-w-36"
        >
          <Zap className="h-5 w-5" />
          Buy Now
        </Button>
      </div>

      {product.inStock ? (
        product.stockCount < 60 && (
          <p className="mt-3 text-sm font-medium text-warning">
            Only {product.stockCount} left in stock — order soon
          </p>
        )
      ) : (
        <p className="mt-3 text-sm font-semibold text-destructive">
          Currently out of stock
        </p>
      )}

      <div className="mt-6 grid grid-cols-3 gap-3 text-center">
        {[
          { icon: ShieldCheck, label: "100% Genuine" },
          { icon: Truck, label: "Free delivery ₹499+" },
          { icon: Timer, label: "Easy 7-day returns" },
        ].map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="rounded-xl border bg-muted/40 px-2 py-3 text-xs font-medium text-muted-foreground"
          >
            <Icon className="mx-auto mb-1.5 h-5 w-5 text-secondary" />
            {label}
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-1.5 text-sm text-muted-foreground">
        <p>
          <span className="font-medium text-foreground">Manufacturer:</span>{" "}
          {product.manufacturer}
        </p>
        <p>
          <span className="font-medium text-foreground">Country of origin:</span>{" "}
          {product.countryOfOrigin}
        </p>
        {product.warranty && (
          <p>
            <span className="font-medium text-foreground">Warranty:</span>{" "}
            {product.warranty}
          </p>
        )}
        <div className="flex flex-wrap gap-1.5 pt-1.5">
          <Badge variant="muted">{product.subcategory}</Badge>
          {product.tags.map((tag) => (
            <Badge key={tag} variant="soft" className="capitalize">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

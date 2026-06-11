"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, FileText, ShoppingCart, Trash2, Truck } from "lucide-react";
import { toast } from "sonner";

import { CouponField } from "@/components/cart/coupon-field";
import { PriceSummaryCard } from "@/components/cart/price-summary-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Price } from "@/components/shared/price";
import { ProductVisual } from "@/components/shared/product-visual";
import { QuantityStepper } from "@/components/shared/quantity-stepper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useMounted } from "@/hooks/use-mounted";
import { computeSummary, FREE_DELIVERY_THRESHOLD } from "@/lib/pricing";
import { formatINR } from "@/lib/utils";
import { useCartStore } from "@/store/cart";

export function CartView() {
  const mounted = useMounted();
  const items = useCartStore((s) => s.items);
  const coupon = useCartStore((s) => s.coupon);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  if (!mounted) {
    return (
      <div className="container py-8">
        <Skeleton className="h-9 w-56" />
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container py-12">
        <EmptyState
          icon={ShoppingCart}
          title="Your cart is empty"
          description="Looks like you haven't added anything yet. Browse our stores and find what your health needs."
          action={
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild>
                <Link href="/medicines">Browse Medicines</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/wellness">Wellness Store</Link>
              </Button>
            </div>
          }
        />
      </div>
    );
  }

  const summary = computeSummary(items, coupon);
  const priceTotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const remainingForFree = FREE_DELIVERY_THRESHOLD - (priceTotal - summary.couponDiscount);
  const hasRxItems = items.some((i) => i.product.prescriptionRequired);

  return (
    <div className="container py-8">
      <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
        Shopping Cart{" "}
        <span className="text-base font-normal text-muted-foreground">
          ({items.length} {items.length === 1 ? "item" : "items"})
        </span>
      </h1>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_380px]">
        <div>
          {/* Free delivery progress */}
          {remainingForFree > 0 ? (
            <div className="mb-5 rounded-xl border bg-card p-4 shadow-soft">
              <p className="flex items-center gap-2 text-sm">
                <Truck className="h-4 w-4 text-primary" />
                Add <span className="font-semibold">{formatINR(remainingForFree)}</span>{" "}
                more for <span className="font-semibold text-success">FREE delivery</span>
              </p>
              <Progress
                value={((priceTotal - summary.couponDiscount) / FREE_DELIVERY_THRESHOLD) * 100}
                className="mt-2.5"
              />
            </div>
          ) : (
            <div className="mb-5 flex items-center gap-2 rounded-xl border border-success/40 bg-success/10 p-4 text-sm font-medium text-success">
              <Truck className="h-4 w-4" />
              Yay! Your order qualifies for FREE delivery
            </div>
          )}

          {hasRxItems && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-warning/40 bg-warning/10 p-4">
              <FileText className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
              <p className="text-sm">
                Your cart contains prescription medicines. Please{" "}
                <Link href="/upload-prescription" className="font-semibold underline">
                  upload a valid prescription
                </Link>{" "}
                — our pharmacist will verify it before dispatch.
              </p>
            </div>
          )}

          <ul className="space-y-4">
            <AnimatePresence initial={false}>
              {items.map(({ product, quantity }) => (
                <motion.li
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -40, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex gap-4 rounded-2xl border bg-card p-4 shadow-soft"
                >
                  <Link href={`/products/${product.slug}`} className="shrink-0">
                    <ProductVisual
                      image={product.image}
                      className="h-24 w-24 rounded-xl sm:h-28 sm:w-28"
                    />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          {product.brand}
                        </p>
                        <Link
                          href={`/products/${product.slug}`}
                          className="line-clamp-2 text-sm font-semibold hover:text-primary"
                        >
                          {product.name}
                        </Link>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {product.packSize}
                        </p>
                        {product.prescriptionRequired && (
                          <Badge variant="soft" className="mt-1.5">
                            Rx required
                          </Badge>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          removeItem(product.id);
                          toast("Removed from cart", { description: product.name });
                        }}
                        aria-label={`Remove ${product.name} from cart`}
                        className="shrink-0 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
                      <QuantityStepper
                        size="sm"
                        quantity={quantity}
                        min={0}
                        onChange={(q) => updateQuantity(product.id, q)}
                      />
                      <Price
                        price={product.price * quantity}
                        mrp={product.mrp * quantity}
                      />
                    </div>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>

        <div className="space-y-5 lg:sticky lg:top-40">
          <div className="rounded-2xl border bg-card p-5 shadow-soft">
            <h2 className="mb-3 text-base font-semibold">Apply Coupon</h2>
            <CouponField priceTotal={priceTotal} />
          </div>

          <PriceSummaryCard summary={summary} couponCode={coupon?.code}>
            <Button asChild size="lg" variant="gradient" className="mt-5 w-full">
              <Link href="/checkout">
                Proceed to Checkout
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Safe & secure payments · 100% genuine products
            </p>
          </PriceSummaryCard>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { GitCompareArrows, ShoppingCart, X } from "lucide-react";
import { toast } from "sonner";

import { EmptyState } from "@/components/shared/empty-state";
import { Price } from "@/components/shared/price";
import { ProductVisual } from "@/components/shared/product-visual";
import { RatingStars } from "@/components/shared/rating-stars";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMounted } from "@/hooks/use-mounted";
import { discountPercent } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { useCompareStore } from "@/store/compare";

export function CompareView() {
  const mounted = useMounted();
  const items = useCompareStore((s) => s.items);
  const remove = useCompareStore((s) => s.remove);
  const clear = useCompareStore((s) => s.clear);
  const addItem = useCartStore((s) => s.addItem);

  if (!mounted) {
    return (
      <div className="container py-8">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="mt-8 h-96 rounded-2xl" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container py-12">
        <EmptyState
          icon={GitCompareArrows}
          title="Nothing to compare yet"
          description="Add up to 4 products using the compare icon on any product card to see them side by side."
          action={
            <Button asChild>
              <Link href="/health-devices">Browse Health Devices</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const rows: {
    label: string;
    render: (p: (typeof items)[number]) => React.ReactNode;
  }[] = [
    {
      label: "Price",
      render: (p) => <Price price={p.price} mrp={p.mrp} size="sm" />,
    },
    {
      label: "Discount",
      render: (p) => (
        <span className="font-medium text-success">
          {discountPercent(p.mrp, p.price)}% off
        </span>
      ),
    },
    {
      label: "Rating",
      render: (p) => <RatingStars rating={p.rating} reviewCount={p.reviewCount} />,
    },
    { label: "Brand", render: (p) => p.brand },
    { label: "Category", render: (p) => p.subcategory },
    { label: "Pack size", render: (p) => p.packSize },
    {
      label: "Prescription",
      render: (p) =>
        p.prescriptionRequired ? (
          <Badge variant="soft">Rx required</Badge>
        ) : (
          <span className="text-muted-foreground">Not needed</span>
        ),
    },
    {
      label: "Availability",
      render: (p) =>
        p.inStock ? (
          <span className="font-medium text-success">In stock</span>
        ) : (
          <span className="font-medium text-destructive">Out of stock</span>
        ),
    },
    {
      label: "Warranty",
      render: (p) => p.warranty ?? <span className="text-muted-foreground">—</span>,
    },
    { label: "Manufacturer", render: (p) => p.manufacturer },
  ];

  return (
    <div className="container py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
          Compare Products{" "}
          <span className="text-base font-normal text-muted-foreground">
            ({items.length}/4)
          </span>
        </h1>
        <Button variant="ghost" onClick={clear}>
          Clear all
        </Button>
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border bg-card shadow-soft">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="w-36 border-b p-4 text-left align-bottom text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Product
              </th>
              {items.map((p) => (
                <th key={p.id} className="border-b border-l p-4 text-left align-top">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => remove(p.id)}
                      aria-label={`Remove ${p.name} from comparison`}
                      className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                    <Link href={`/products/${p.slug}`} className="group block">
                      <ProductVisual
                        image={p.image}
                        className="h-24 w-24 rounded-xl transition-transform group-hover:scale-105"
                      />
                      <p className="mt-2.5 line-clamp-2 max-w-40 font-semibold leading-snug group-hover:text-primary">
                        {p.name}
                      </p>
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.label} className={i % 2 === 0 ? "bg-muted/30" : ""}>
                <td className="p-4 align-top text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {row.label}
                </td>
                {items.map((p) => (
                  <td key={p.id} className="border-l p-4 align-top">
                    {row.render(p)}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td className="p-4" />
              {items.map((p) => (
                <td key={p.id} className="border-l p-4">
                  <Button
                    size="sm"
                    disabled={!p.inStock}
                    onClick={() => {
                      addItem(p);
                      toast.success("Added to cart", { description: p.name });
                    }}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </Button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

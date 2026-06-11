import { cn, discountPercent, formatINR } from "@/lib/utils";

interface PriceProps {
  price: number;
  mrp: number;
  size?: "sm" | "md" | "lg";
  showDiscount?: boolean;
  className?: string;
}

export function Price({
  price,
  mrp,
  size = "md",
  showDiscount = true,
  className,
}: PriceProps) {
  const discount = discountPercent(mrp, price);
  const priceClass =
    size === "lg"
      ? "text-3xl font-bold"
      : size === "md"
        ? "text-lg font-bold"
        : "text-base font-semibold";
  return (
    <div className={cn("flex flex-wrap items-baseline gap-x-2 gap-y-0.5", className)}>
      <span className={priceClass}>{formatINR(price)}</span>
      {mrp > price && (
        <span
          className={cn(
            "text-muted-foreground line-through",
            size === "lg" ? "text-base" : "text-sm"
          )}
        >
          {formatINR(mrp)}
        </span>
      )}
      {showDiscount && discount > 0 && (
        <span
          className={cn(
            "font-semibold text-success",
            size === "lg" ? "text-base" : "text-xs"
          )}
        >
          {discount}% off
        </span>
      )}
    </div>
  );
}

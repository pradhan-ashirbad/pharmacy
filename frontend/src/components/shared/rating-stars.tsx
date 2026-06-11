import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md";
  className?: string;
}

export function RatingStars({
  rating,
  reviewCount,
  size = "sm",
  className,
}: RatingStarsProps) {
  const starSize = size === "sm" ? "h-3.5 w-3.5" : "h-4.5 w-4.5 h-[18px] w-[18px]";
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <span className="inline-flex items-center gap-0.5 rounded-md bg-success/10 px-1.5 py-0.5 text-xs font-semibold text-success">
        {rating.toFixed(1)}
        <Star className={cn("fill-current", size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5")} />
      </span>
      <span className="sr-only">{rating.toFixed(1)} out of 5 stars</span>
      {typeof reviewCount === "number" && (
        <span
          className={cn(
            "text-muted-foreground",
            size === "sm" ? "text-xs" : "text-sm"
          )}
        >
          ({reviewCount.toLocaleString("en-IN")})
        </span>
      )}
      <span className={cn("hidden", starSize)} />
    </div>
  );
}

export function StarRow({
  rating,
  className,
}: {
  rating: number;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-0.5", className)} aria-label={`${rating} stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-4 w-4",
            i < Math.round(rating)
              ? "fill-warning text-warning"
              : "fill-muted text-muted"
          )}
        />
      ))}
    </div>
  );
}

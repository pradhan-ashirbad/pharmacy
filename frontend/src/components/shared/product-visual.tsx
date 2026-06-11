import { cn } from "@/lib/utils";
import { iconMap, tintStyles } from "@/lib/visuals";
import type { ProductImage } from "@/types";

interface ProductVisualProps {
  image: ProductImage;
  className?: string;
  iconClassName?: string;
}

/**
 * Renders the product's placeholder artwork — a soft gradient tile with a
 * category icon. Replace with next/image once real product photos exist.
 */
export function ProductVisual({
  image,
  className,
  iconClassName,
}: ProductVisualProps) {
  const Icon = iconMap[image.icon];
  const tint = tintStyles[image.tint];
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden",
        tint.surface,
        className
      )}
      aria-hidden="true"
    >
      {/* decorative blurred orbs */}
      <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-white/40 blur-2xl dark:bg-white/5" />
      <div className="absolute -bottom-8 -right-8 h-28 w-28 rounded-full bg-white/50 blur-2xl dark:bg-white/5" />
      <Icon
        strokeWidth={1.4}
        className={cn("relative h-1/3 w-1/3", tint.text, iconClassName)}
      />
    </div>
  );
}

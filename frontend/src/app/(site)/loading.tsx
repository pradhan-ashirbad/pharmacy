import { Skeleton } from "@/components/ui/skeleton";
import { ProductGridSkeleton } from "@/components/product/product-grid";

export default function Loading() {
  return (
    <div className="container py-8">
      <Skeleton className="h-64 w-full rounded-3xl sm:h-80" />
      <div className="mt-10 space-y-4">
        <Skeleton className="h-8 w-64" />
        <ProductGridSkeleton count={8} />
      </div>
    </div>
  );
}

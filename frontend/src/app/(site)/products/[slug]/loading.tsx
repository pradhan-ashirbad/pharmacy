import { Skeleton } from "@/components/ui/skeleton";

export default function ProductLoading() {
  return (
    <div className="container py-8">
      <Skeleton className="mb-6 h-4 w-72" />
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <Skeleton className="aspect-square w-full rounded-3xl" />
          <div className="mt-3 flex gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-20 rounded-xl" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-3/4" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <div className="flex gap-3">
            <Skeleton className="h-12 w-44 rounded-xl" />
            <Skeleton className="h-12 w-36 rounded-xl" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

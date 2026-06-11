import Link from "next/link";
import { SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center py-24 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-accent">
        <SearchX className="h-10 w-10 text-primary" strokeWidth={1.5} />
      </div>
      <h1 className="mt-6 font-display text-3xl font-bold">Page not found</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or may have been
        moved. Let&apos;s get you back to better health.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href="/">Back to Home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/medicines">Browse Medicines</Link>
        </Button>
      </div>
    </div>
  );
}

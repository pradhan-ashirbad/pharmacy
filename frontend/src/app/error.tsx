"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container flex flex-col items-center justify-center py-24 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-destructive/10">
        <AlertTriangle className="h-10 w-10 text-destructive" strokeWidth={1.5} />
      </div>
      <h1 className="mt-6 font-display text-3xl font-bold">
        Something went wrong
      </h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        We hit an unexpected error while loading this page. Please try again —
        if it persists, our team has been notified.
      </p>
      {error.digest && (
        <p className="mt-2 text-xs text-muted-foreground">
          Error reference: {error.digest}
        </p>
      )}
      <Button onClick={reset} className="mt-8">
        <RotateCcw className="h-4 w-4" />
        Try again
      </Button>
    </div>
  );
}

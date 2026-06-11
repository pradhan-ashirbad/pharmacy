"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuantityStepperProps {
  quantity: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  className?: string;
}

export function QuantityStepper({
  quantity,
  onChange,
  min = 1,
  max = 10,
  size = "md",
  className,
}: QuantityStepperProps) {
  const btn =
    size === "sm"
      ? "h-7 w-7"
      : "h-9 w-9";
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-lg border bg-background",
        className
      )}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={quantity <= min}
        onClick={() => onChange(quantity - 1)}
        className={cn(
          btn,
          "flex items-center justify-center rounded-l-lg text-foreground transition-colors hover:bg-accent disabled:opacity-40"
        )}
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span
        className={cn(
          "min-w-8 text-center text-sm font-semibold tabular-nums",
          size === "md" && "min-w-10"
        )}
        aria-live="polite"
      >
        {quantity}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={quantity >= max}
        onClick={() => onChange(quantity + 1)}
        className={cn(
          btn,
          "flex items-center justify-center rounded-r-lg text-foreground transition-colors hover:bg-accent disabled:opacity-40"
        )}
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

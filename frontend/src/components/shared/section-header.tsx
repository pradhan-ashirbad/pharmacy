import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  href?: string;
  linkLabel?: string;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  href,
  linkLabel = "View all",
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("mb-6 flex items-end justify-between gap-4 sm:mb-8", className)}>
      <div>
        <h2 className="font-display text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1.5 max-w-xl text-sm text-muted-foreground sm:text-base">
            {subtitle}
          </p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="group inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          {linkLabel}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}

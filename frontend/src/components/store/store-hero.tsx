import type { LucideIcon } from "lucide-react";

interface StoreHeroProps {
  icon: LucideIcon;
  title: string;
  description: string;
  highlights: string[];
}

export function StoreHero({ icon: Icon, title, description, highlights }: StoreHeroProps) {
  return (
    <div className="gradient-hero border-b">
      <div className="container flex flex-col gap-4 py-10 sm:flex-row sm:items-center sm:gap-6">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-background shadow-soft">
          <Icon className="h-7 w-7 text-primary" strokeWidth={1.6} />
        </span>
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            {title}
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground sm:text-base">
            {description}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {highlights.map((h) => (
              <span
                key={h}
                className="rounded-full border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur"
              >
                {h}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import { SectionHeader } from "@/components/shared/section-header";
import { brands } from "@/data/categories";

export function BrandsSection() {
  // Duplicate the list so the marquee loops seamlessly.
  const marqueeBrands = [...brands, ...brands];
  return (
    <section className="container py-12 sm:py-16">
      <SectionHeader
        title="Popular Brands"
        subtitle="India's most trusted healthcare names, all under one roof"
      />
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent" />
        <div className="flex w-max animate-marquee gap-4 hover:[animation-play-state:paused]">
          {marqueeBrands.map((brand, i) => (
            <div
              key={`${brand.slug}-${i}`}
              className="flex w-44 shrink-0 flex-col items-center justify-center rounded-2xl border bg-card px-6 py-5 text-center shadow-soft"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent font-display text-lg font-bold text-primary">
                {brand.name[0]}
              </span>
              <p className="mt-2.5 text-sm font-semibold">{brand.name}</p>
              <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                {brand.tagline}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

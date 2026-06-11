"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

import { ProductVisual } from "@/components/shared/product-visual";
import { searchProducts } from "@/data/products";
import { cn, formatINR } from "@/lib/utils";
import type { Product } from "@/types";

export function SearchBar({ className }: { className?: string }) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [results, setResults] = React.useState<Product[]>([]);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  React.useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    const t = setTimeout(() => {
      setResults(searchProducts(query).slice(0, 6));
    }, 150);
    return () => clearTimeout(t);
  }, [query]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <form onSubmit={submit} role="search">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder="Search medicines, wellness products, health devices…"
            aria-label="Search products"
            className="h-11 w-full rounded-xl border border-input bg-muted/50 pl-10 pr-10 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => {
                setQuery("");
                setResults([]);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>

      {open && results.length > 0 && (
        <div className="absolute top-full z-50 mt-2 w-full overflow-hidden rounded-xl border bg-popover shadow-lifted animate-in fade-in-0 zoom-in-95">
          <ul>
            {results.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/products/${p.slug}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-accent"
                >
                  <ProductVisual
                    image={p.image}
                    className="h-10 w-10 shrink-0 rounded-lg"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{p.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {p.brand} · {p.subcategory}
                    </p>
                  </div>
                  <span className="text-sm font-semibold">
                    {formatINR(p.price)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              router.push(`/search?q=${encodeURIComponent(query.trim())}`);
            }}
            className="block w-full border-t px-3 py-2.5 text-center text-sm font-medium text-primary transition-colors hover:bg-accent"
          >
            See all results for “{query.trim()}”
          </button>
        </div>
      )}
    </div>
  );
}

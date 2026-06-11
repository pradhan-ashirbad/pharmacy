"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { GitCompareArrows, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProductVisual } from "@/components/shared/product-visual";
import { useMounted } from "@/hooks/use-mounted";
import { useCompareStore } from "@/store/compare";

/**
 * Floating bar that appears when products are queued for comparison.
 */
export function CompareBar() {
  const mounted = useMounted();
  const pathname = usePathname();
  const items = useCompareStore((s) => s.items);
  const remove = useCompareStore((s) => s.remove);
  const clear = useCompareStore((s) => s.clear);

  const visible = mounted && items.length > 0 && pathname !== "/compare";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 96, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 96, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
          className="fixed inset-x-0 bottom-4 z-40 px-4"
        >
          <div className="container flex max-w-3xl items-center gap-3 rounded-2xl border bg-background/95 p-3 shadow-lifted backdrop-blur">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
              {items.map((p) => (
                <div key={p.id} className="relative shrink-0">
                  <ProductVisual image={p.image} className="h-12 w-12 rounded-lg" />
                  <button
                    type="button"
                    onClick={() => remove(p.id)}
                    aria-label={`Remove ${p.name} from compare`}
                    className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-background shadow"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="ml-auto flex shrink-0 items-center gap-2">
              <Button variant="ghost" size="sm" onClick={clear}>
                Clear
              </Button>
              <Button asChild size="sm" disabled={items.length < 2}>
                <Link href="/compare">
                  <GitCompareArrows className="h-4 w-4" />
                  Compare ({items.length})
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

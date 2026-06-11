"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BadgePercent, Copy } from "lucide-react";
import { toast } from "sonner";

import { SectionHeader } from "@/components/shared/section-header";
import { offers } from "@/data/offers";
import { tintStyles } from "@/lib/visuals";
import { cn } from "@/lib/utils";

export function OffersSection() {
  const copyCode = (code: string) => {
    navigator.clipboard?.writeText(code).then(
      () => toast.success(`Coupon ${code} copied`, { description: "Apply it at checkout." }),
      () => toast.error("Couldn't copy the code")
    );
  };

  return (
    <section className="bg-muted/40 py-12 sm:py-16">
      <div className="container">
        <SectionHeader
          title="Offers for You"
          subtitle="Flat discounts, combos and first-order rewards"
          href="/offers"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {offers.map((offer, i) => {
            const tint = tintStyles[offer.tint];
            return (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="flex h-full flex-col rounded-2xl border bg-card p-5 shadow-soft transition-shadow hover:shadow-card"
              >
                <span
                  className={cn(
                    "inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold",
                    tint.chip
                  )}
                >
                  <BadgePercent className="h-3.5 w-3.5" />
                  {offer.discountLabel}
                </span>
                <h3 className="mt-3 text-sm font-semibold leading-snug">
                  {offer.title}
                </h3>
                <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">
                  {offer.subtitle}
                </p>
                <div className="mt-auto pt-4">
                  <button
                    type="button"
                    onClick={() => copyCode(offer.code)}
                    className="group flex w-full items-center justify-between rounded-lg border border-dashed border-primary/50 bg-accent/50 px-3 py-2 transition-colors hover:bg-accent"
                    aria-label={`Copy coupon code ${offer.code}`}
                  >
                    <span className="font-mono text-sm font-bold tracking-wider text-primary">
                      {offer.code}
                    </span>
                    <Copy className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          View terms and more deals on the{" "}
          <Link href="/offers" className="font-medium text-primary hover:underline">
            offers page
          </Link>
          .
        </p>
      </div>
    </section>
  );
}

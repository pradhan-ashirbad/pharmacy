"use client";

import { motion } from "framer-motion";
import { CalendarClock, Copy } from "lucide-react";
import { toast } from "sonner";

import { tintStyles } from "@/lib/visuals";
import { cn, formatDate } from "@/lib/utils";
import type { Offer } from "@/types";

export function OfferCard({ offer }: { offer: Offer }) {
  const tint = tintStyles[offer.tint];

  const copy = () => {
    navigator.clipboard?.writeText(offer.code).then(
      () => toast.success(`Coupon ${offer.code} copied`),
      () => toast.error("Couldn't copy the code")
    );
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4 }}
      className="overflow-hidden rounded-2xl border bg-card shadow-soft transition-shadow hover:shadow-card"
    >
      <div className={cn("flex items-center justify-between px-6 py-4", tint.surface)}>
        <span className={cn("font-display text-2xl font-extrabold", tint.text)}>
          {offer.discountLabel}
        </span>
        <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", tint.chip)}>
          Limited time
        </span>
      </div>
      <div className="p-6">
        <h2 className="font-semibold leading-snug">{offer.title}</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">{offer.subtitle}</p>

        <button
          type="button"
          onClick={copy}
          className="group mt-5 flex w-full items-center justify-between rounded-xl border border-dashed border-primary/50 bg-accent/50 px-4 py-3 transition-colors hover:bg-accent"
          aria-label={`Copy coupon code ${offer.code}`}
        >
          <span className="font-mono text-base font-bold tracking-widest text-primary">
            {offer.code}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground group-hover:text-primary">
            <Copy className="h-3.5 w-3.5" />
            Tap to copy
          </span>
        </button>

        <div className="mt-4 flex items-start justify-between gap-4 text-xs text-muted-foreground">
          <p>{offer.terms}</p>
          <p className="inline-flex shrink-0 items-center gap-1">
            <CalendarClock className="h-3.5 w-3.5" />
            Till {formatDate(offer.expiresOn)}
          </p>
        </div>
      </div>
    </motion.article>
  );
}

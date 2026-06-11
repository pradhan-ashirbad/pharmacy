import type { Metadata } from "next";
import { BadgePercent } from "lucide-react";

import { OfferCard } from "./offer-card";
import { offers } from "@/data/offers";

export const metadata: Metadata = {
  title: "Offers & Coupons",
  description:
    "Latest MediKart offers — flat discounts, combo deals and first-order rewards on medicines, wellness and health devices.",
};

export default function OffersPage() {
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm font-medium shadow-soft">
          <BadgePercent className="h-4 w-4 text-secondary" />
          {offers.length} active offers
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Offers & <span className="text-gradient">Coupons</span>
        </h1>
        <p className="mt-3 text-muted-foreground">
          Save more on every order — copy a code and apply it in your cart.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-4xl gap-5 sm:grid-cols-2">
        {offers.map((offer) => (
          <OfferCard key={offer.id} offer={offer} />
        ))}
      </div>
    </div>
  );
}

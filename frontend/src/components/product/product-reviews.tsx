import { BadgeCheck, ThumbsUp } from "lucide-react";

import { StarRow } from "@/components/shared/rating-stars";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { getReviewsForProduct } from "@/data/reviews";
import { formatDate, stableHash } from "@/lib/utils";
import type { Product } from "@/types";

export function ProductReviews({ product }: { product: Product }) {
  const reviews = getReviewsForProduct(product.id, product.rating);
  const seed = stableHash(product.id);

  // Deterministic star distribution that roughly matches the average rating.
  const distribution = [5, 4, 3, 2, 1].map((stars) => {
    const base =
      stars === 5 ? 62 : stars === 4 ? 24 : stars === 3 ? 9 : stars === 2 ? 3 : 2;
    return { stars, percent: Math.min(95, base + ((seed >> stars) % 7)) };
  });
  const total = distribution.reduce((s, d) => s + d.percent, 0);

  return (
    <section aria-labelledby="reviews-heading">
      <h2 id="reviews-heading" className="font-display text-xl font-bold sm:text-2xl">
        Customer Reviews
      </h2>
      <div className="mt-5 grid gap-6 lg:grid-cols-[300px_1fr]">
        <div className="h-fit rounded-2xl border bg-card p-6 shadow-soft">
          <div className="flex items-end gap-3">
            <span className="font-display text-5xl font-bold">
              {product.rating.toFixed(1)}
            </span>
            <div className="pb-1.5">
              <StarRow rating={product.rating} />
              <p className="mt-1 text-xs text-muted-foreground">
                {product.reviewCount.toLocaleString("en-IN")} ratings
              </p>
            </div>
          </div>
          <div className="mt-5 space-y-2.5">
            {distribution.map(({ stars, percent }) => (
              <div key={stars} className="flex items-center gap-3">
                <span className="w-8 text-xs font-medium">{stars} ★</span>
                <Progress value={(percent / total) * 100 * 2.2} className="h-1.5" />
                <span className="w-9 text-right text-xs text-muted-foreground">
                  {Math.round((percent / total) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {reviews.map((review) => (
            <article
              key={review.id}
              className="rounded-2xl border bg-card p-5 shadow-soft"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="text-xs">
                    {review.author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="flex items-center gap-1.5 text-sm font-semibold">
                    {review.author}
                    {review.verified && (
                      <span className="inline-flex items-center gap-0.5 text-xs font-medium text-success">
                        <BadgeCheck className="h-3.5 w-3.5" />
                        Verified buyer
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(review.date)}
                  </p>
                </div>
                <StarRow rating={review.rating} className="ml-auto" />
              </div>
              <h3 className="mt-3 text-sm font-semibold">{review.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {review.comment}
              </p>
              <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <ThumbsUp className="h-3.5 w-3.5" />
                {review.helpful} people found this helpful
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

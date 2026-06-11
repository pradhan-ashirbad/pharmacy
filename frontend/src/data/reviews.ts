import type { Review } from "@/types";
import { stableHash } from "@/lib/utils";

const reviewers = [
  "Amit Verma",
  "Sneha Reddy",
  "Rahul Khanna",
  "Priyanka Joshi",
  "Vikram Singh",
  "Ananya Iyer",
  "Suresh Kumar",
  "Neha Gupta",
  "Arjun Nair",
  "Pooja Patel",
  "Mohit Sharma",
  "Divya Krishnan",
];

const templates = [
  {
    title: "Genuine product, fast delivery",
    comment:
      "Ordered in the evening and received it the next day. Packaging was sealed and the expiry date is far away. Will order again.",
  },
  {
    title: "Works as expected",
    comment:
      "Has been part of our family's routine for a while now. MediKart's price was lower than my local chemist and delivery was free.",
  },
  {
    title: "Great value for money",
    comment:
      "Compared prices across apps and this was the best deal. The discount applied correctly and the product is 100% genuine.",
  },
  {
    title: "Reliable quality",
    comment:
      "Second time ordering this. Consistent quality both times, batch details and expiry clearly printed. Very satisfied.",
  },
  {
    title: "Good, but delivery took a day extra",
    comment:
      "Product is perfect and well packed. Delivery was promised in 2 days but took 3 — still reasonable for my pincode.",
  },
  {
    title: "Doctor recommended, happy with purchase",
    comment:
      "My doctor suggested this and MediKart had it in stock when two other apps didn't. Authentic product with proper billing.",
  },
];

const dates = [
  "2026-05-28",
  "2026-05-19",
  "2026-05-07",
  "2026-04-22",
  "2026-04-10",
  "2026-03-27",
];

/**
 * Deterministically generates a small set of reviews for a product so the
 * UI stays stable between renders without a database.
 */
export function getReviewsForProduct(productId: string, rating: number): Review[] {
  const seed = stableHash(productId);
  const count = 3 + (seed % 3); // 3–5 reviews
  const reviews: Review[] = [];
  for (let i = 0; i < count; i++) {
    const r = reviewers[(seed + i * 5) % reviewers.length];
    const t = templates[(seed + i * 3) % templates.length];
    const stars = Math.max(
      3,
      Math.min(5, Math.round(rating) - (i % 3 === 2 ? 1 : 0))
    );
    reviews.push({
      id: `${productId}-rev-${i}`,
      author: r,
      rating: stars,
      title: t.title,
      comment: t.comment,
      date: dates[(seed + i) % dates.length],
      verified: (seed + i) % 4 !== 3,
      helpful: ((seed + i * 7) % 40) + 2,
    });
  }
  return reviews;
}

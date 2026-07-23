import type { Product } from "@/data/products";

const REVIEWER_NAMES = [
  "Ayesha K.", "Bilal R.", "Sana M.", "Hamza T.", "Zainab A.", "Usman F.",
  "Mahnoor S.", "Ali H.", "Fatima N.", "Danish Q.", "Sarah I.", "Omar Z.",
];

const COMMENT_POOL = [
  "Exactly like the photos, honestly better in person. Packaging was so cute too.",
  "Good quality for the price. Took about 5 days to arrive in Lahore.",
  "Ordered in bulk for a gift box project, the tiered pricing made it worth it.",
  "Color was slightly different from the picture but still lovely.",
  "This is my second order — House of Fashion never disappoints.",
  "Great value, would recommend sizing up if you're between options.",
  "Fast shipping and the quality feels premium, not cheap at all.",
  "Bought this as a gift and they loved it immediately.",
];

function seeded(seed: number) {
  let t = seed;
  return function () {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export type Review = {
  name: string;
  rating: number;
  comment: string;
  daysAgo: number;
};

export function generateReviews(product: Product): Review[] {
  const rand = seeded(product.slug.length * 131 + product.reviewCount);
  const count = Math.min(5, Math.max(2, Math.floor(product.reviewCount / 30)));
  const reviews: Review[] = [];
  for (let i = 0; i < count; i++) {
    const r1 = rand();
    const r2 = rand();
    const r3 = rand();
    reviews.push({
      name: REVIEWER_NAMES[Math.floor(r1 * REVIEWER_NAMES.length)],
      rating: Math.max(3, Math.round(product.rating + (r2 - 0.5) * 1.5)),
      comment: COMMENT_POOL[Math.floor(r3 * COMMENT_POOL.length)],
      daysAgo: Math.floor(2 + r1 * 60),
    });
  }
  return reviews;
}

import { Star } from "lucide-react";

export function StarRating({
  rating,
  reviewCount,
  size = 14,
}: {
  rating: number;
  reviewCount?: number;
  size?: number;
}) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={size}
            className={
              i <= Math.round(rating)
                ? "fill-accent text-accent"
                : "fill-ink/10 text-ink/10"
            }
          />
        ))}
      </div>
      <span className="text-xs text-ink/65">
        {rating.toFixed(1)}
        {reviewCount !== undefined ? ` (${reviewCount})` : ""}
      </span>
    </div>
  );
}

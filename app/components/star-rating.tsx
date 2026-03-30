import { Star } from "lucide-react";
import { cn } from "~/lib/utils";

export function StarRating({
  rating,
  count,
  size = "sm",
  showCount = true,
}: {
  rating: number | null;
  count: number;
  size?: "sm" | "md";
  showCount?: boolean;
}) {
  if (rating === null || count === 0) {
    return (
      <span
        className={cn(
          "text-muted-foreground",
          size === "sm" ? "text-xs" : "text-sm"
        )}
      >
        No ratings yet
      </span>
    );
  }

  const starSize = size === "sm" ? "size-3.5" : "size-5";
  const textSize = size === "sm" ? "text-xs" : "text-sm";

  return (
    <div className={cn("flex items-center gap-1", textSize)}>
      <div className="flex items-center">
        {Array.from({ length: 5 }, (_, i) => {
          const starValue = i + 1;
          const filled = rating >= starValue;
          const halfFilled = !filled && rating >= starValue - 0.5;

          return (
            <Star
              key={i}
              className={cn(
                starSize,
                filled
                  ? "fill-foreground text-foreground"
                  : halfFilled
                    ? "fill-foreground/50 text-foreground"
                    : "text-muted-foreground/30"
              )}
            />
          );
        })}
      </div>
      <span className="font-medium">{rating.toFixed(1)}</span>
      {showCount && (
        <span className="text-muted-foreground">({count})</span>
      )}
    </div>
  );
}

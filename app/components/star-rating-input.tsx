import { useState } from "react";
import { useFetcher } from "react-router";
import { Star } from "lucide-react";
import { cn } from "~/lib/utils";

export function StarRatingInput({
  courseSlug,
  currentRating,
}: {
  courseSlug: string;
  currentRating: number | null;
}) {
  const fetcher = useFetcher();
  const [hovered, setHovered] = useState<number | null>(null);

  const optimisticRating = fetcher.formData
    ? Number(fetcher.formData.get("rating"))
    : null;
  const displayRating = hovered ?? optimisticRating ?? currentRating ?? 0;

  const isSubmitting = fetcher.state !== "idle";

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium">
        {currentRating ? "Your Rating" : "Rate this course"}
      </span>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, i) => {
          const starValue = i + 1;
          return (
            <fetcher.Form
              key={i}
              method="post"
              action={`/courses/${courseSlug}`}
            >
              <input type="hidden" name="intent" value="rate-course" />
              <input type="hidden" name="rating" value={starValue} />
              <button
                type="submit"
                disabled={isSubmitting}
                onMouseEnter={() => setHovered(starValue)}
                onMouseLeave={() => setHovered(null)}
                className="p-0.5 transition-transform hover:scale-110 disabled:opacity-50"
              >
                <Star
                  className={cn(
                    "size-6",
                    displayRating >= starValue
                      ? "fill-foreground text-foreground"
                      : "text-muted-foreground/30"
                  )}
                />
              </button>
            </fetcher.Form>
          );
        })}
      </div>
      {currentRating && !hovered && (
        <span className="text-xs text-muted-foreground">
          You rated this {currentRating}/5
        </span>
      )}
    </div>
  );
}

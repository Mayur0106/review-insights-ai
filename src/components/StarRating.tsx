import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}

const StarRating = ({ rating, onRatingChange, readonly = false, size = "lg" }: StarRatingProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-10 h-10",
  };

  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onRatingChange?.(star)}
          className={cn(
            "star-transition focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-sm",
            !readonly && "hover:scale-110 cursor-pointer",
            readonly && "cursor-default"
          )}
        >
          <Star
            className={cn(
              sizeClasses[size],
              "star-transition",
              star <= rating
                ? "fill-star-filled text-star-filled"
                : "fill-transparent text-star-empty"
            )}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;

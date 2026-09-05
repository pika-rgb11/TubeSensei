"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  value: number;
  size?: number;
  showValue?: boolean;
  className?: string;
  count?: number;
}

export function RatingStars({ value, size = 14, showValue = true, className, count }: RatingStarsProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < Math.floor(value);
          const half = !filled && i < value;
          return (
            <Star
              key={i}
              size={size}
              className={cn(
                filled ? "fill-yellow-400 text-yellow-400" :
                half ? "fill-yellow-400/50 text-yellow-400" :
                "fill-transparent text-muted-foreground/40"
              )}
              strokeWidth={filled || half ? 0 : 1.5}
            />
          );
        })}
      </div>
      {showValue && (
        <span className="text-xs font-medium text-foreground/90 ml-1">
          {value.toFixed(1)}
        </span>
      )}
      {count !== undefined && (
        <span className="text-xs text-muted-foreground ml-1">
          ({count.toLocaleString()})
        </span>
      )}
    </div>
  );
}

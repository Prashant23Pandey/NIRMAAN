import React from 'react';
import { Star } from 'lucide-react';

export interface RatingProps {
  value: number;
  max?: number;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  reviewsCount?: number;
  className?: string;
}

export const Rating: React.FC<RatingProps> = ({
  value,
  max = 5,
  showValue = true,
  size = 'md',
  reviewsCount,
  className = '',
}) => {
  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 18,
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base font-bold',
  };

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center gap-0.5 text-amber-400">
        {Array.from({ length: max }).map((_, i) => {
          const filled = i < Math.floor(value);
          const half = !filled && i < value;
          return (
            <Star
              key={i}
              size={iconSizes[size]}
              className={`${
                filled ? 'fill-amber-400 text-amber-400' : half ? 'text-amber-400' : 'text-stone-300'
              }`}
            />
          );
        })}
      </div>
      {showValue && (
        <span className={`font-black text-[#17211F] ${textSizes[size]}`}>
          {value.toFixed(1)}
        </span>
      )}
      {typeof reviewsCount === 'number' && (
        <span className="text-xs text-stone-400 font-medium">({reviewsCount})</span>
      )}
    </div>
  );
};

import React from 'react';
import { Loader2 } from 'lucide-react';

export interface LoadingStateProps {
  message?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading data...',
  className = '',
  size = 'md',
}) => {
  const spinnerSizes = {
    sm: 20,
    md: 28,
    lg: 40,
  };

  return (
    <div
      className={`rounded-2xl p-10 flex flex-col items-center justify-center text-center space-y-3 ${className}`}
    >
      <Loader2 className="animate-spin text-[#176B5B]" size={spinnerSizes[size]} />
      <span className="text-xs sm:text-sm font-semibold text-stone-500 tracking-tight">
        {message}
      </span>
    </div>
  );
};

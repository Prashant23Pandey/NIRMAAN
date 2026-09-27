import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface VerificationBadgeProps {
  level?: string;
  verified?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  level = 'LEVEL 2',
  verified = true,
  size = 'md',
  showText = true,
}) => {
  if (!verified) return null;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs sm:text-sm px-2.5 py-1 gap-1.5',
    lg: 'text-sm sm:text-base px-3.5 py-1.5 gap-2',
  };

  const iconSizes = {
    sm: 12,
    md: 15,
    lg: 18,
  };

  return (
    <div
      className={`inline-flex items-center font-bold rounded-full bg-primary text-white shadow-sm tracking-wide ${sizeClasses[size]}`}
    >
      <ShieldCheck size={iconSizes[size]} className="text-secondary flex-shrink-0" />
      {showText && (
        <span className="flex items-center gap-1.5">
          <span>NIRMAAN VERIFIED</span>
          {level && <span className="opacity-80 font-normal">| {level}</span>}
        </span>
      )}
    </div>
  );
};

import React from 'react';

export interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showPercentage = true,
  variant = 'primary',
  size = 'md',
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const variants = {
    primary: 'bg-[#176B5B]',
    secondary: 'bg-[#F4B942]',
    success: 'bg-[#2E8B57]',
    danger: 'bg-[#D64545]',
  };

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={`w-full space-y-1.5 ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-xs font-bold text-[#17211F]">
          {label && <span>{label}</span>}
          {showPercentage && <span className="font-mono text-stone-500">{percentage}%</span>}
        </div>
      )}
      <div className={`w-full bg-stone-200/80 rounded-full overflow-hidden ${heights[size]}`}>
        <div
          className={`${variants[variant]} ${heights[size]} rounded-full transition-all duration-300 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  onClick?: () => void;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtext,
  icon,
  trend,
  onClick,
  className = '',
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-5 border border-stone-200/90 shadow-soft ${
        onClick ? 'hover:shadow-elevated hover:border-[#176B5B]/30 cursor-pointer transition-all' : ''
      } ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">{title}</span>
        {icon && (
          <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center text-[#176B5B]">
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <div className="text-2xl font-black text-[#17211F] tracking-tight">{value}</div>
        {trend && (
          <span
            className={`inline-flex items-center gap-0.5 text-xs font-bold px-1.5 py-0.5 rounded ${
              trend.isPositive !== false
                ? 'bg-emerald-50 text-[#2E8B57]'
                : 'bg-red-50 text-[#D64545]'
            }`}
          >
            {trend.isPositive !== false ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {trend.value}
          </span>
        )}
      </div>

      {subtext && <div className="text-xs text-stone-500 mt-1 font-medium">{subtext}</div>}
    </div>
  );
};

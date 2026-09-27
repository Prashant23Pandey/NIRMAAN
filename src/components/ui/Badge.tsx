import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  icon,
  className = '',
}) => {
  const baseStyles = 'inline-flex items-center font-bold tracking-tight rounded-md whitespace-nowrap';

  const variants = {
    default: 'bg-stone-100 text-stone-700 border border-stone-200',
    primary: 'bg-[#176B5B]/10 text-[#176B5B] border border-[#176B5B]/20',
    secondary: 'bg-[#F4B942]/20 text-[#8C620D] border border-[#F4B942]/40',
    success: 'bg-[#2E8B57]/10 text-[#2E8B57] border border-[#2E8B57]/20',
    warning: 'bg-amber-100 text-amber-800 border border-amber-200',
    danger: 'bg-[#D64545]/10 text-[#D64545] border border-[#D64545]/20',
    outline: 'bg-transparent text-stone-600 border border-stone-300',
  };

  const sizes = {
    sm: 'text-[10px] px-1.5 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};

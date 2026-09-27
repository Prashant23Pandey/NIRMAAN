import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'flat' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  ...props
}) => {
  const variants = {
    default: 'bg-white border border-stone-200/90 shadow-soft',
    elevated: 'bg-white border border-stone-200/80 shadow-elevated',
    flat: 'bg-[#FAF8F2] border border-stone-200',
    interactive:
      'bg-white border border-stone-200/90 shadow-soft hover:shadow-elevated hover:border-[#176B5B]/40 transition-all duration-200 cursor-pointer',
  };

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={`rounded-2xl ${variants[variant]} ${paddings[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

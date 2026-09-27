import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      icon,
      iconPosition = 'left',
      fullWidth = true,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className={`${fullWidth ? 'w-full' : ''} space-y-1.5`}>
        {label && (
          <label htmlFor={inputId} className="block text-xs font-bold text-[#17211F] tracking-tight">
            {label}
            {props.required && <span className="text-[#D64545] ml-0.5">*</span>}
          </label>
        )}
        <div className="relative rounded-xl shadow-xs">
          {icon && iconPosition === 'left' && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              {icon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`block w-full rounded-xl text-sm transition-all duration-150 ${
              icon && iconPosition === 'left' ? 'pl-10' : 'pl-3.5'
            } ${icon && iconPosition === 'right' ? 'pr-10' : 'pr-3.5'} py-2.5 ${
              error
                ? 'border-[#D64545] focus:ring-[#D64545] focus:border-[#D64545] bg-red-50/20'
                : 'border-stone-300 focus:ring-[#176B5B] focus:border-[#176B5B] bg-white'
            } border text-[#17211F] placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-stone-100 disabled:cursor-not-allowed ${className}`}
            {...props}
          />
          {icon && iconPosition === 'right' && (
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-stone-400">
              {icon}
            </div>
          )}
        </div>
        {error ? (
          <p className="text-[11px] font-semibold text-[#D64545] mt-1">{error}</p>
        ) : helperText ? (
          <p className="text-[11px] text-stone-500 mt-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

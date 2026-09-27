import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  fullWidth?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, fullWidth = true, className = '', id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className={`${fullWidth ? 'w-full' : ''} space-y-1.5`}>
        {label && (
          <label htmlFor={selectId} className="block text-xs font-bold text-[#17211F] tracking-tight">
            {label}
            {props.required && <span className="text-[#D64545] ml-0.5">*</span>}
          </label>
        )}
        <div className="relative rounded-xl shadow-xs">
          <select
            id={selectId}
            ref={ref}
            className={`block w-full appearance-none rounded-xl text-sm transition-all duration-150 pl-3.5 pr-10 py-2.5 ${
              error
                ? 'border-[#D64545] focus:ring-[#D64545] focus:border-[#D64545] bg-red-50/20'
                : 'border-stone-300 focus:ring-[#176B5B] focus:border-[#176B5B] bg-white'
            } border text-[#17211F] focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-stone-100 disabled:cursor-not-allowed ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-stone-400">
            <ChevronDown size={16} />
          </div>
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

Select.displayName = 'Select';

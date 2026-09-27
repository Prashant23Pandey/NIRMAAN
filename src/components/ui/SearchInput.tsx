import React from 'react';
import { Search, X } from 'lucide-react';

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
  fullWidth?: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onClear,
  fullWidth = true,
  className = '',
  placeholder = 'Search...',
  ...props
}) => {
  return (
    <div className={`relative ${fullWidth ? 'w-full' : ''}`}>
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
        <Search size={16} />
      </div>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`block w-full rounded-xl text-sm transition-all duration-150 pl-10 pr-9 py-2.5 bg-white border border-stone-300 text-[#17211F] placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#176B5B] focus:border-[#176B5B] ${className}`}
        {...props}
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 cursor-pointer"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};

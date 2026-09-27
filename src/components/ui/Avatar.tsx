import React from 'react';
import { User } from 'lucide-react';

export interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  verified?: boolean;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  name,
  size = 'md',
  verified = false,
  className = '',
}) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-xl',
  };

  const getInitials = (n?: string) => {
    if (!n) return '';
    const parts = n.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return n.slice(0, 2).toUpperCase();
  };

  return (
    <div className={`relative inline-block shrink-0 ${className}`}>
      <div
        className={`${sizes[size]} rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 flex items-center justify-center font-extrabold text-[#176B5B] shadow-2xs`}
      >
        {src ? (
          <img src={src} alt={alt} className="w-full h-full object-cover" />
        ) : name ? (
          <span>{getInitials(name)}</span>
        ) : (
          <User className="text-stone-400" size={size === 'sm' ? 14 : size === 'xl' ? 32 : 18} />
        )}
      </div>
      {verified && (
        <span
          className="absolute -bottom-1 -right-1 bg-[#2E8B57] text-white rounded-full p-0.5 border-2 border-white shadow-xs"
          title="Verified Work Passport"
        >
          <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
            <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
          </svg>
        </span>
      )}
    </div>
  );
};

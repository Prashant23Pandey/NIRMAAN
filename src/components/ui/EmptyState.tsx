import React from 'react';
import { FolderOpen } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionText,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`rounded-2xl border border-dashed border-stone-300 p-8 sm:p-12 text-center flex flex-col items-center justify-center bg-white/50 ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400 mb-4 shadow-2xs">
        {icon || <FolderOpen size={28} />}
      </div>
      <h3 className="text-base font-bold text-[#17211F] mb-1">{title}</h3>
      {description && (
        <p className="text-xs sm:text-sm text-stone-500 max-w-sm mb-6 font-medium">
          {description}
        </p>
      )}
      {actionText && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'We encountered an error loading this information. Please check your connection and try again.',
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`rounded-2xl border border-red-200 bg-red-50/30 p-8 text-center flex flex-col items-center justify-center ${className}`}
    >
      <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center text-[#D64545] mb-3">
        <AlertCircle size={24} />
      </div>
      <h3 className="text-base font-bold text-[#17211F] mb-1">{title}</h3>
      <p className="text-xs sm:text-sm text-stone-600 max-w-sm mb-5 font-medium">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" icon={<RefreshCw size={14} />} onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
};

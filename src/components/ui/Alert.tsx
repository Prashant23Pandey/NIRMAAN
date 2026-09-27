import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export interface AlertProps {
  title?: string;
  children: React.ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'error';
  onClose?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  title,
  children,
  variant = 'info',
  onClose,
  className = '',
}) => {
  const configs = {
    info: {
      bg: 'bg-blue-50/80 border-blue-200 text-blue-900',
      icon: <Info className="text-blue-600 shrink-0" size={18} />,
    },
    success: {
      bg: 'bg-emerald-50/80 border-emerald-200 text-emerald-900',
      icon: <CheckCircle2 className="text-[#2E8B57] shrink-0" size={18} />,
    },
    warning: {
      bg: 'bg-amber-50/80 border-amber-200 text-amber-900',
      icon: <AlertTriangle className="text-amber-600 shrink-0" size={18} />,
    },
    error: {
      bg: 'bg-red-50/80 border-red-200 text-red-900',
      icon: <AlertCircle className="text-[#D64545] shrink-0" size={18} />,
    },
  };

  const { bg, icon } = configs[variant];

  return (
    <div
      className={`rounded-2xl p-4 border flex items-start justify-between gap-3 text-sm leading-relaxed ${bg} ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{icon}</div>
        <div>
          {title && <h5 className="font-bold text-sm mb-0.5 tracking-tight">{title}</h5>}
          <div className="text-xs sm:text-sm font-medium">{children}</div>
        </div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-stone-400 hover:text-stone-700 p-0.5 rounded cursor-pointer"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

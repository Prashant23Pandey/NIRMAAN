import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Toast: React.FC = () => {
  const { toast, hideToast } = useApp();

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        hideToast();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast.show, hideToast]);

  if (!toast.show) return null;

  const icons = {
    success: <CheckCircle2 className="text-white flex-shrink-0" size={20} />,
    warning: <AlertCircle className="text-white flex-shrink-0" size={20} />,
    info: <Info className="text-white flex-shrink-0" size={20} />,
    error: <AlertCircle className="text-white flex-shrink-0" size={20} />,
  };

  const bgStyles = {
    success: 'bg-primary text-white border-primary-600',
    warning: 'bg-amber-600 text-white border-amber-700',
    info: 'bg-charcoal text-white border-charcoal-muted',
    error: 'bg-red-600 text-white border-red-700',
  };

  return (
    <div className="fixed top-5 right-5 z-50 max-w-sm w-full animate-bounce-short">
      <div
        className={`flex items-start gap-3 p-4 rounded-2xl shadow-elevated border ${bgStyles[toast.type]}`}
      >
        {icons[toast.type]}
        <div className="flex-1 text-sm font-medium leading-snug">
          {toast.message}
        </div>
        <button
          onClick={hideToast}
          className="text-white/80 hover:text-white p-1 rounded-lg touch-target flex items-center justify-center -mr-1 -mt-1"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

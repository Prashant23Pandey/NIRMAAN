import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export interface ToastProps {
  show: boolean;
  message: string;
  type?: 'success' | 'info' | 'warning' | 'error';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  show,
  message,
  type = 'success',
  onClose,
}) => {
  if (!show) return null;

  const configs = {
    success: {
      bg: 'bg-[#17211F] text-white border-emerald-500/50',
      icon: <CheckCircle2 className="text-[#2E8B57]" size={16} />,
    },
    info: {
      bg: 'bg-[#17211F] text-white border-blue-500/50',
      icon: <Info className="text-blue-400" size={16} />,
    },
    warning: {
      bg: 'bg-[#17211F] text-white border-amber-500/50',
      icon: <AlertTriangle className="text-amber-400" size={16} />,
    },
    error: {
      bg: 'bg-[#17211F] text-white border-red-500/50',
      icon: <AlertCircle className="text-[#D64545]" size={16} />,
    },
  };

  const { bg, icon } = configs[type];

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-elevated border ${bg} text-xs font-bold`}
      >
        {icon}
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-stone-400 hover:text-white p-0.5 cursor-pointer"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

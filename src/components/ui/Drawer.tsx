import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  position?: 'left' | 'right' | 'bottom';
  size?: 'sm' | 'md' | 'lg';
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  position = 'right',
  size = 'md',
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const widthSizes = {
    sm: 'max-w-xs',
    md: 'max-w-md',
    lg: 'max-w-xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-[#17211F]/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      <div
        className={`fixed inset-y-0 ${
          position === 'left' ? 'left-0' : 'right-0'
        } max-w-full flex pl-10`}
      >
        <div
          className={`w-screen ${widthSizes[size]} bg-white shadow-elevated border-l border-stone-200 flex flex-col`}
        >
          <div className="p-5 border-b border-stone-100 flex items-center justify-between">
            {title ? (
              <h3 className="text-base font-bold text-[#17211F]">{title}</h3>
            ) : (
              <div />
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 hover:text-[#17211F] transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-5">{children}</div>
        </div>
      </div>
    </div>
  );
};

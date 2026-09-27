import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  className = '',
  showHome = true,
}) => {
  return (
    <nav className={`flex items-center text-xs text-stone-500 font-medium ${className}`}>
      <ol className="flex items-center space-x-1.5 overflow-x-auto">
        {showHome && (
          <li className="flex items-center">
            <Link to="/" className="text-stone-400 hover:text-[#176B5B] transition-colors">
              <Home size={14} />
            </Link>
            <ChevronRight size={12} className="mx-1.5 text-stone-300 shrink-0" />
          </li>
        )}
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center whitespace-nowrap">
              {item.to && !isLast ? (
                <Link
                  to={item.to}
                  className="hover:text-[#176B5B] transition-colors font-medium text-stone-500"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="font-bold text-[#17211F]">{item.label}</span>
              )}
              {!isLast && <ChevronRight size={12} className="mx-1.5 text-stone-300 shrink-0" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

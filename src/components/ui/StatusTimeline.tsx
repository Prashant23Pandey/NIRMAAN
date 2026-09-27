import React from 'react';
import { CheckCircle2, Clock, Circle } from 'lucide-react';

export interface TimelineStep {
  title: string;
  description?: string;
  timestamp?: string;
  status: 'completed' | 'current' | 'upcoming';
}

export interface StatusTimelineProps {
  steps: TimelineStep[];
  className?: string;
}

export const StatusTimeline: React.FC<StatusTimelineProps> = ({ steps, className = '' }) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        return (
          <div key={index} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="shrink-0">
                {step.status === 'completed' ? (
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-[#2E8B57] flex items-center justify-center">
                    <CheckCircle2 size={16} />
                  </div>
                ) : step.status === 'current' ? (
                  <div className="w-7 h-7 rounded-full bg-[#176B5B] text-white flex items-center justify-center shadow-xs">
                    <Clock size={15} />
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-full bg-stone-100 text-stone-300 flex items-center justify-center">
                    <Circle size={14} />
                  </div>
                )}
              </div>
              {!isLast && (
                <div
                  className={`w-0.5 grow mt-2 min-h-8 ${
                    step.status === 'completed' ? 'bg-[#2E8B57]/40' : 'bg-stone-200'
                  }`}
                />
              )}
            </div>

            <div className="pt-0.5 pb-2">
              <div className="flex items-center gap-2">
                <h4
                  className={`text-sm font-bold ${
                    step.status === 'upcoming' ? 'text-stone-400' : 'text-[#17211F]'
                  }`}
                >
                  {step.title}
                </h4>
                {step.timestamp && (
                  <span className="text-[11px] text-stone-400 font-mono">{step.timestamp}</span>
                )}
              </div>
              {step.description && (
                <p className="text-xs text-stone-500 mt-0.5 font-medium leading-relaxed">
                  {step.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

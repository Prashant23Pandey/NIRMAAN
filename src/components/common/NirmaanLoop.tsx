import React from 'react';
import { Hammer, Camera, Star, ShieldCheck, TrendingUp, Briefcase, Award, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NirmaanLoop: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { t } = useApp();

  const loopSteps = [
    {
      id: 1,
      title: t.loop1,
      subtitle: 'Execution on site',
      icon: Hammer,
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      badge: 'Step 1',
    },
    {
      id: 2,
      title: t.loop2,
      subtitle: 'Timestamped photos',
      icon: Camera,
      bg: 'bg-teal-50 text-teal-800 border-teal-200',
      badge: 'Step 2',
    },
    {
      id: 3,
      title: t.loop3,
      subtitle: 'Verified client ratings',
      icon: Star,
      bg: 'bg-amber-50 text-amber-900 border-amber-200',
      badge: 'Step 3',
    },
    {
      id: 4,
      title: t.loop4,
      subtitle: 'Tamper-proof identity',
      icon: ShieldCheck,
      bg: 'bg-primary-50 text-primary-900 border-primary-200',
      badge: 'Step 4',
    },
    {
      id: 5,
      title: t.loop5,
      subtitle: 'Higher wages & tiers',
      icon: TrendingUp,
      bg: 'bg-blue-50 text-blue-900 border-blue-200',
      badge: 'Step 5',
    },
    {
      id: 6,
      title: t.loop6,
      subtitle: 'Direct contractor pull',
      icon: Briefcase,
      bg: 'bg-orange-50 text-orange-900 border-orange-200',
      badge: 'Step 6',
    },
    {
      id: 7,
      title: t.loop7,
      subtitle: 'Generational dignity',
      icon: Award,
      bg: 'bg-yellow-50 text-yellow-950 border-secondary',
      badge: 'Endless Loop',
    },
  ];

  if (compact) {
    return (
      <div className="bg-white rounded-card p-5 border border-stone-200 shadow-soft">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <Award size={18} />
            </span>
            <h4 className="font-bold text-charcoal text-sm">{t.theLoopTitle}</h4>
          </div>
          <span className="text-xs bg-secondary/20 text-secondary-dark px-2.5 py-0.5 rounded-full font-semibold">
            Dignity Engine
          </span>
        </div>
        <p className="text-xs text-charcoal-muted mb-4">
          Every verified day on site permanently strengthens the worker's passport and unlocks higher paying projects.
        </p>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs font-semibold">
          {loopSteps.map((step, idx) => (
            <React.Fragment key={step.id}>
              <div className={`px-2.5 py-1.5 rounded-xl border flex items-center gap-1.5 whitespace-nowrap ${step.bg}`}>
                <step.icon size={13} />
                <span>{step.title}</span>
              </div>
              {idx < loopSteps.length - 1 && (
                <ArrowRight size={12} className="text-stone-400 flex-shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-card p-6 md:p-8 border border-stone-200/90 shadow-elevated relative overflow-hidden">
      {/* Decorative background watermark */}
      <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-2">
            <span>⚙️ THE NIRMAAN DIGNITY FLYWHEEL</span>
          </div>
          <h3 className="text-xl md:text-2xl font-black text-charcoal tracking-tight">
            {t.theLoopTitle}
          </h3>
          <p className="text-charcoal-muted text-sm max-w-xl mt-1">
            Transforming informal daily-wage labor into verified professional credentials that compound value over time.
          </p>
        </div>
        <div className="bg-[#FAF8F2] border border-stone-200 px-4 py-2.5 rounded-xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary text-primary font-black flex items-center justify-center text-lg">
            ∞
          </div>
          <div>
            <div className="text-xs text-charcoal-muted font-medium">Self-Reinforcing</div>
            <div className="text-sm font-bold text-primary">Zero Intermediary Exploitation</div>
          </div>
        </div>
      </div>

      {/* Grid of Steps */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 relative z-10">
        {loopSteps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={step.id}
              className={`p-3.5 rounded-2xl border flex flex-col justify-between transition-all hover:scale-[1.02] shadow-sm ${step.bg}`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider opacity-75">
                    {step.badge}
                  </span>
                  <span className="w-5 h-5 rounded-full bg-white/70 flex items-center justify-center text-[10px] font-bold">
                    {idx + 1}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center mb-2">
                  <Icon size={16} />
                </div>
                <div className="font-extrabold text-sm tracking-tight">{step.title}</div>
              </div>
              <div className="text-[11px] opacity-80 mt-2 font-medium leading-tight">
                {step.subtitle}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs text-charcoal-muted">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span>Every approved milestone automatically syncs with the worker's permanent Nirmaan Passport</span>
        </div>
        <span className="font-semibold text-primary">Your Work. Your Reputation. Your Future.</span>
      </div>
    </div>
  );
};

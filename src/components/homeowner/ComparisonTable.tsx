import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Star, MapPin, Calendar, Clock, Award, ShieldCheck, Sparkles } from 'lucide-react';
import { Worker } from '../../types';
import { useApp } from '../../context/AppContext';

interface ComparisonTableProps {
  worker1?: Worker;
  worker2?: Worker;
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({ worker1, worker2 }) => {
  const { workers, hireWorker, showToast } = useApp();
  const navigate = useNavigate();

  const firstWorker = worker1 || workers[0];
  const secondWorker = worker2 || workers[1];

  if (!firstWorker || !secondWorker) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-stone-200/90 shadow-elevated text-center">
        <span className="text-xs font-black tracking-widest text-primary uppercase">
          OBJECTIVE COMPARISON MATRIX
        </span>
        <h3 className="text-lg font-black text-charcoal mt-2">Compare Matched Craftsmen</h3>
        <p className="text-sm text-charcoal-muted mt-2">
          At least 2 registered workers are required for side-by-side objective comparison. When multiple workers register or apply to your job, compare them here.
        </p>
      </div>
    );
  }

  const handleSelect = (worker: Worker) => {
    hireWorker(worker.id);
    showToast(`Selected ${worker.name} successfully!`, 'success');
  };

  const comparisonRows = [
    {
      metric: 'Skill Match',
      icon: Award,
      val1: `${firstWorker.trade || 'Worker'}`,
      val2: `${secondWorker.trade || 'Worker'}`,
      sub1: firstWorker.skills?.join(', ') || 'General Skills',
      sub2: secondWorker.skills?.join(', ') || 'General Skills',
    },
    {
      metric: 'Distance from Site',
      icon: MapPin,
      val1: `${firstWorker.distanceKm || 0} km`,
      val2: `${secondWorker.distanceKm || 0} km`,
      sub1: firstWorker.city || 'Local Area',
      sub2: secondWorker.city || 'Local Area',
    },
    {
      metric: 'Verified Rating',
      icon: Star,
      val1: firstWorker.totalReviews > 0 ? `⭐ ${firstWorker.rating} / 5.0` : 'No ratings yet',
      val2: secondWorker.totalReviews > 0 ? `⭐ ${secondWorker.rating} / 5.0` : 'No ratings yet',
      sub1: `${firstWorker.totalReviews || 0} verified reviews`,
      sub2: `${secondWorker.totalReviews || 0} verified reviews`,
    },
    {
      metric: 'Work Experience',
      icon: Clock,
      val1: `${firstWorker.yearsExperience || 0} Years`,
      val2: `${secondWorker.yearsExperience || 0} Years`,
      sub1: `${firstWorker.completedJobs || 0} completed jobs`,
      sub2: `${secondWorker.completedJobs || 0} completed jobs`,
    },
    {
      metric: 'Availability',
      icon: Calendar,
      val1: firstWorker.available ? 'Available' : 'Occupied',
      val2: secondWorker.available ? 'Available' : 'Occupied',
      sub1: 'Direct hire ready',
      sub2: 'Direct hire ready',
    },
    {
      metric: 'Daily Wage Rate',
      icon: Sparkles,
      val1: `₹${firstWorker.expectedDailyWage || 0} / day`,
      val2: `₹${secondWorker.expectedDailyWage || 0} / day`,
      sub1: 'Standard daily wage',
      sub2: 'Standard daily wage',
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200/90 shadow-elevated">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-stone-200">
        <div>
          <span className="text-xs font-black tracking-widest text-primary uppercase">
            OBJECTIVE COMPARISON MATRIX
          </span>
          <h2 className="text-2xl font-black text-charcoal tracking-tight mt-0.5">
            Compare Matched Craftsmen
          </h2>
          <p className="text-xs text-charcoal-muted mt-1">
            Evaluating verified performance metrics side-by-side to find the ideal fit for your project.
          </p>
        </div>

        <div className="text-xs px-3 py-1.5 rounded-full bg-sand-100 text-charcoal font-semibold border border-stone-200 self-start sm:self-auto">
          ⚖️ Impartial Data • No Sponsored Ranks
        </div>
      </div>

      {/* Header Cards with Photos & Select Button */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-6 border-b border-stone-200">
        {/* First Worker Card */}
        <div className="p-4 rounded-2xl bg-sand-50 border-2 border-primary/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={firstWorker.photo}
              alt={firstWorker.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-primary/20 shadow-xs"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-extrabold text-charcoal">{firstWorker.name}</h3>
              </div>
              <p className="text-xs font-bold text-primary">{firstWorker.trade} • {firstWorker.level || 'Worker'}</p>
              <span className="text-xs text-charcoal-muted">₹{firstWorker.expectedDailyWage}/day</span>
            </div>
          </div>
          <button
            onClick={() => handleSelect(firstWorker)}
            className="py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-600 text-white text-xs font-bold touch-target shadow-soft transition-colors"
          >
            SELECT
          </button>
        </div>

        {/* Second Worker Card */}
        <div className="p-4 rounded-2xl bg-sand-50 border-2 border-secondary/50 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={secondWorker.photo}
              alt={secondWorker.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-secondary/30 shadow-xs"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-extrabold text-charcoal">{secondWorker.name}</h3>
              </div>
              <p className="text-xs font-bold text-primary">{secondWorker.trade} • {secondWorker.level || 'Worker'}</p>
              <span className="text-xs text-charcoal-muted">₹{secondWorker.expectedDailyWage}/day</span>
            </div>
          </div>
          <button
            onClick={() => handleSelect(secondWorker)}
            className="py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-600 text-white text-xs font-bold touch-target shadow-soft transition-colors"
          >
            SELECT
          </button>
        </div>
      </div>

      {/* Comparison Rows */}
      <div className="divide-y divide-stone-100">
        {comparisonRows.map((row, idx) => {
          const Icon = row.icon;
          return (
            <div key={idx} className="py-4 grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
              <div className="md:col-span-1 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                  <Icon size={14} />
                </div>
                <span className="text-xs font-extrabold uppercase text-charcoal-muted tracking-wider">
                  {row.metric}
                </span>
              </div>

              <div className="md:col-span-2 p-3 rounded-xl bg-[#FAF8F2] border border-stone-200/60">
                <div className="text-xs font-bold text-charcoal">{row.val1}</div>
                <div className="text-[11px] text-stone-500 mt-0.5">{row.sub1}</div>
              </div>

              <div className="md:col-span-2 p-3 rounded-xl bg-[#FAF8F2] border border-stone-200/60">
                <div className="text-xs font-bold text-charcoal">{row.val2}</div>
                <div className="text-[11px] text-stone-500 mt-0.5">{row.sub2}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-stone-100 text-center text-xs text-charcoal-muted">
        Both craftsmen possess authenticated Nirmaan digital passports with verified on-site project ratings.
      </div>
    </div>
  );
};

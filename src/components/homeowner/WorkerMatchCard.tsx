import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Star,
  MapPin,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Briefcase,
  Sparkles,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { Worker } from '../../types';
import { VerificationBadge } from '../common/VerificationBadge';
import { useApp } from '../../context/AppContext';

interface WorkerMatchCardProps {
  worker: Worker;
  onHire?: () => void;
}

export const WorkerMatchCard: React.FC<WorkerMatchCardProps> = ({ worker, onHire }) => {
  const [showWhyMatched, setShowWhyMatched] = useState(false);
  const navigate = useNavigate();
  const { hireWorker, project } = useApp();

  const isAlreadyHired = project.workers.some((w) => w.id === worker.id);

  const handleHire = (e: React.MouseEvent) => {
    e.stopPropagation();
    hireWorker(worker.id);
    if (onHire) onHire();
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-soft hover:shadow-elevated transition-all flex flex-col justify-between">
      <div>
        {/* Top: Match Badge & Verification */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/20 text-primary font-black text-xs">
            <Sparkles size={13} className="text-secondary-dark" />
            <span>{worker.matchScore || 90}% Match</span>
          </div>

          <VerificationBadge level={worker.level} verified={worker.verified} size="sm" />
        </div>

        {/* Worker Info Row */}
        <div className="flex items-start gap-4 mb-4">
          <img
            src={worker.photo}
            alt={worker.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-primary/20 shadow-xs"
          />
          <div>
            <h3
              onClick={() => navigate(`/homeowner/workers/${worker.id}`)}
              className="text-lg font-extrabold text-charcoal hover:text-primary transition-colors cursor-pointer"
            >
              {worker.name}
            </h3>
            <p className="text-xs font-bold text-primary mb-1">
              {worker.trade} • {worker.yearsExperience} yrs exp
            </p>
            <div className="flex items-center gap-2 text-xs text-charcoal-muted">
              <span className="flex items-center gap-1 font-bold text-charcoal">
                <Star size={13} className="text-amber-500 fill-amber-500" />
                <span>{worker.rating}</span>
              </span>
              <span className="text-stone-300">•</span>
              <span>{worker.completedJobs} jobs</span>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 py-3 border-y border-stone-100 mb-3">
          <div className="p-2.5 rounded-xl bg-sand-50 border border-stone-200/70">
            <span className="text-[10px] uppercase font-bold text-charcoal-muted block">Distance</span>
            <div className="flex items-center gap-1 text-sm font-black text-charcoal mt-0.5">
              <MapPin size={13} className="text-primary" />
              <span>{worker.distanceKm !== undefined ? worker.distanceKm : 3.2} km away</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-sand-50 border border-stone-200/70">
            <span className="text-[10px] uppercase font-bold text-charcoal-muted block">Daily Wage</span>
            <div className="text-sm font-black text-primary mt-0.5">
              ₹{worker.expectedDailyWage}
              <span className="text-[10px] text-stone-500 font-normal">/day</span>
            </div>
          </div>
        </div>

        {/* Expandable "Why Matched?" Accordion */}
        <div className="mb-4">
          <button
            onClick={() => setShowWhyMatched(!showWhyMatched)}
            className="w-full flex items-center justify-between text-xs font-bold text-primary p-2 rounded-xl hover:bg-primary-50/50 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles size={13} className="text-secondary-dark" />
              <span>Why matched with your project?</span>
            </span>
            {showWhyMatched ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {showWhyMatched && (
            <div className="mt-2 p-3 rounded-2xl bg-[#FAF8F2] border border-stone-200 text-xs space-y-1.5 animate-fade-in">
              {(worker.matchReasons || [
                'Skill match: Verified Masonry & Tile Specialist',
                'Available immediately for your project timeline',
                'Nearby: 3.2 km distance from site',
                'Similar bathroom renovation experience',
              ]).map((reason, i) => (
                <div key={i} className="flex items-start gap-1.5 text-charcoal">
                  <CheckCircle2 size={13} className="text-success flex-shrink-0 mt-0.5" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Buttons: [ VIEW PROFILE ] [ HIRE ] */}
      <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
        <button
          onClick={() => navigate(`/homeowner/workers/${worker.id}`)}
          className="py-3 px-3.5 rounded-xl bg-sand-100 hover:bg-sand-200 text-charcoal text-xs font-bold touch-target transition-colors"
        >
          View Profile
        </button>

        {isAlreadyHired ? (
          <button
            onClick={() => navigate(`/homeowner/project/${project?.id || 'home'}`)}
            className="flex-1 py-3 px-4 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 touch-target shadow-2xs"
          >
            <UserCheck size={15} />
            <span>✓ In Active Team</span>
          </button>
        ) : (
          <button
            onClick={handleHire}
            className="flex-1 py-3 px-4 rounded-xl bg-primary hover:bg-primary-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 touch-target shadow-soft transition-all"
          >
            <span>HIRE THIS WORKER</span>
          </button>
        )}
      </div>
    </div>
  );
};

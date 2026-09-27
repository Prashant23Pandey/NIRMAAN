import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Clock, Star, CheckCircle, ChevronRight, ArrowRight, Navigation } from 'lucide-react';
import { Job } from '../../types';
import { useApp } from '../../context/AppContext';

interface JobCardProps {
  job: Job;
  compact?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({ job, compact }) => {
  const navigate = useNavigate();
  const { applyToJob, acceptJob, t } = useApp();

  const isApplied = job.status === 'applied';
  const isAccepted = job.status === 'accepted';

  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-stone-200/90 shadow-soft hover:shadow-elevated transition-all flex flex-col justify-between">
      <div>
        {/* Top Tag & Client Rating */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary/10 text-primary">
            {job.category}
          </span>
          <div className="flex items-center gap-1 text-xs font-bold text-charcoal bg-[#FAF8F2] px-2 py-0.5 rounded-full border border-stone-200">
            <Star size={13} className="text-amber-500 fill-amber-500" />
            <span>{job.clientRating}</span>
          </div>
        </div>

        {/* Job Title & Client */}
        <h3 className="text-lg md:text-xl font-extrabold text-charcoal tracking-tight mb-1 hover:text-primary transition-colors cursor-pointer"
            onClick={() => navigate(`/worker/jobs/${job.id}`)}>
          {job.title}
        </h3>
        <p className="text-xs font-semibold text-charcoal-muted mb-4">
          Client: <span className="text-charcoal font-bold">{job.clientName}</span>
        </p>

        {/* Highlight Metrics */}
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          <div className="p-2.5 rounded-2xl bg-sand-50 border border-stone-200/70">
            <span className="text-[10px] uppercase font-bold text-charcoal-muted block">Daily Wage</span>
            <span className="text-base font-black text-primary">₹{job.dailyWage}</span>
            <span className="text-[10px] text-stone-500">/day</span>
          </div>

          <div className="p-2.5 rounded-2xl bg-sand-50 border border-stone-200/70">
            <span className="text-[10px] uppercase font-bold text-charcoal-muted block">Distance</span>
            <div className="flex items-center gap-1 text-base font-black text-charcoal">
              <MapPin size={14} className="text-primary" />
              <span>{job.distanceKm} km</span>
            </div>
          </div>
        </div>

        {/* Details: Start Date, Duration, Location */}
        <div className="space-y-1.5 text-xs text-charcoal mb-4">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-primary flex-shrink-0" />
            <span className="font-semibold">{job.startDate}</span>
            <span className="text-stone-300">•</span>
            <span>{job.durationDays} days work</span>
          </div>
          <div className="flex items-center gap-2 text-stone-600 truncate">
            <MapPin size={14} className="text-stone-400 flex-shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
        </div>

        {/* Match reasons chips */}
        {job.matchReasons && job.matchReasons.length > 0 && (
          <div className="space-y-1 mb-5 bg-[#FAF8F2] p-3 rounded-2xl border border-stone-200">
            <div className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">
              Why you match:
            </div>
            {job.matchReasons.slice(0, 2).map((reason, idx) => (
              <div key={idx} className="text-xs text-charcoal flex items-center gap-1.5 font-medium">
                <CheckCircle size={12} className="text-success flex-shrink-0" />
                <span className="truncate">{reason}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
        <button
          onClick={() => navigate(`/worker/jobs/${job.id}`)}
          className="py-3 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-charcoal text-xs font-bold touch-target transition-colors flex items-center justify-center gap-1 cursor-pointer"
        >
          <span>Details</span>
          <ChevronRight size={14} />
        </button>

        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(job.location)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="py-3 px-3 rounded-xl bg-sand-100 hover:bg-sand-200 text-primary text-xs font-bold touch-target transition-colors flex items-center justify-center gap-1 cursor-pointer"
          title="OPEN DIRECTIONS on Google Maps"
        >
          <Navigation size={13} />
          <span className="hidden sm:inline">Directions</span>
        </a>

        {isAccepted ? (
          <button
            onClick={() => navigate('/worker/work')}
            className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 touch-target shadow-sm"
          >
            <span>✓ Active in Work Tab</span>
            <ArrowRight size={14} />
          </button>
        ) : isApplied ? (
          <button
            disabled
            className="flex-1 py-3 px-4 rounded-xl bg-primary/20 text-primary text-xs font-bold cursor-default flex items-center justify-center gap-1.5"
          >
            <span>Application Sent</span>
          </button>
        ) : (
          <button
            onClick={() => applyToJob(job.id)}
            className="flex-1 py-3 px-4 rounded-xl bg-primary hover:bg-primary-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 touch-target shadow-soft transition-all"
          >
            <span>{t.applyNow}</span>
          </button>
        )}
      </div>
    </div>
  );
};

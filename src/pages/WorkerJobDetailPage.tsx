import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Star,
  CheckCircle2,
  ShieldCheck,
  Award,
  Sparkles,
  Check,
  UserCheck,
  AlertCircle,
  Share2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const WorkerJobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { jobs, acceptJob, showToast } = useApp();
  const [accepted, setAccepted] = useState(false);

  const job = jobs.find((j) => j.id === id) || jobs[0];

  const handleAccept = () => {
    acceptJob(job.id);
    setAccepted(true);
    showToast(`✓ Job accepted! Added to your Active Work dashboard.`, 'success');
  };

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-bold text-charcoal hover:text-primary transition-colors"
      >
        <ArrowLeft size={16} />
        <span>Back to Jobs</span>
      </button>

      {/* Main Job Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-elevated space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-black text-xs mb-3">
              <Sparkles size={13} />
              <span>DIRECT HOMEOWNER REQUIREMENT</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal tracking-tight">
              {job.title}
            </h1>
            <p className="text-sm font-semibold text-charcoal-muted mt-1">
              Client: <span className="text-charcoal font-bold">{job.clientName}</span> • Verified
              Homeowner
            </p>
          </div>

          <div className="bg-sand-100 rounded-2xl p-4 text-right border border-stone-200/60 min-w-[160px]">
            <span className="text-[11px] font-bold text-charcoal-muted uppercase block">
              Offered Daily Rate
            </span>
            <div className="text-2xl sm:text-3xl font-black text-primary">₹{job.dailyWage}</div>
            <span className="text-xs text-charcoal-muted font-medium">/ day net payment</span>
          </div>
        </div>

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70">
            <div className="flex items-center gap-1.5 text-xs text-charcoal-muted mb-1">
              <MapPin size={14} className="text-primary" />
              <span>Distance</span>
            </div>
            <span className="font-extrabold text-charcoal text-sm">{job.distanceKm} km away</span>
            <span className="text-[10px] text-stone-400 block truncate">{job.location}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70">
            <div className="flex items-center gap-1.5 text-xs text-charcoal-muted mb-1">
              <Calendar size={14} className="text-primary" />
              <span>Start Date</span>
            </div>
            <span className="font-extrabold text-charcoal text-sm">{job.startDate}</span>
            <span className="text-[10px] text-stone-400 block">{job.durationDays} days duration</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70">
            <div className="flex items-center gap-1.5 text-xs text-charcoal-muted mb-1">
              <Clock size={14} className="text-primary" />
              <span>Timings</span>
            </div>
            <span className="font-extrabold text-charcoal text-sm">9:00 AM – 6:00 PM</span>
            <span className="text-[10px] text-stone-400 block">1 hr lunch included</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70">
            <div className="flex items-center gap-1.5 text-xs text-charcoal-muted mb-1">
              <Star size={14} className="text-amber-500 fill-amber-500" />
              <span>Client Rating</span>
            </div>
            <span className="font-extrabold text-charcoal text-sm">★ {job.clientRating} / 5.0</span>
            <span className="text-[10px] text-emerald-700 font-bold block">100% On-time pay</span>
          </div>
        </div>

        {/* Why this job matches you Section */}
        <div className="bg-emerald-50/70 rounded-2xl p-5 border border-emerald-200 space-y-3">
          <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-sm">
            <CheckCircle2 size={18} className="text-emerald-700" />
            <span>Why this job matches you</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-emerald-950 font-medium">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-200/70 text-emerald-800 flex items-center justify-center text-[10px] font-black">
                ✓
              </span>
              <span>Masonry & Tile skill verified on Work Passport</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-200/70 text-emerald-800 flex items-center justify-center text-[10px] font-black">
                ✓
              </span>
              <span>Worker currently Available for work</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-200/70 text-emerald-800 flex items-center justify-center text-[10px] font-black">
                ✓
              </span>
              <span>Site is only {job.distanceKm} km away from Sector 62</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-200/70 text-emerald-800 flex items-center justify-center text-[10px] font-black">
                ✓
              </span>
              <span>Similar bathroom renovation projects completed</span>
            </div>
          </div>
        </div>

        {/* Description & Work Scope */}
        <div className="space-y-3 pt-2">
          <h3 className="font-extrabold text-sm text-charcoal uppercase tracking-wider">
            Scope of Construction Work
          </h3>
          <p className="text-sm text-charcoal/90 leading-relaxed">{job.description}</p>
        </div>

        {/* Required Skills Badges */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-charcoal-muted uppercase">Required Trades & Tools</h4>
          <div className="flex flex-wrap gap-2">
            {job.requiredSkills.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-xl bg-sand-200 border border-stone-200 text-xs font-bold text-charcoal"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Safety & Milestone Terms */}
        <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 text-xs text-charcoal-muted space-y-2">
          <div className="flex items-center gap-2 font-bold text-charcoal">
            <ShieldCheck size={16} className="text-primary" />
            <span>Nirmaan Smart Milestone Protection</span>
          </div>
          <p>
            Your daily wage is secured under the Nirmaan Milestone escrow arrangement. Check-in daily
            with GPS photo proof to log guaranteed wages directly to your Nirmaan Work Passport.
          </p>
        </div>

        {/* Bottom CTA Button */}
        <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center gap-3">
          {accepted || job.status === 'accepted' ? (
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-emerald-100 border border-emerald-300">
              <div className="flex items-center gap-2 text-emerald-900 font-black text-sm">
                <CheckCircle2 size={20} className="text-emerald-700" />
                <span>Job Accepted! You are assigned to this project.</span>
              </div>
              <button
                onClick={() => navigate('/worker/work')}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-xs"
              >
                Go to Active Work
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={handleAccept}
                className="w-full sm:flex-1 py-4 px-6 rounded-2xl bg-primary hover:bg-primary-600 text-white font-black text-base shadow-soft hover:shadow-elevated transition-all flex items-center justify-center gap-2 touch-target"
              >
                <Check size={20} />
                <span>ACCEPT JOB (₹{job.dailyWage}/DAY)</span>
              </button>

              <button
                onClick={() => showToast('Job link copied to clipboard!', 'info')}
                className="w-full sm:w-auto p-4 rounded-2xl bg-white border border-stone-200 hover:border-primary/40 text-charcoal font-bold flex items-center justify-center gap-2 shadow-2xs"
              >
                <Share2 size={18} />
                <span className="sm:hidden">Share</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

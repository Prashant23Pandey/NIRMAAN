import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Star,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Camera,
  ExternalLink,
  Award,
  Briefcase,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const WorkerHistoryPage: React.FC = () => {
  const { currentWorker, project } = useApp();
  const navigate = useNavigate();
  const [historyItems, setHistoryItems] = useState<any[]>([]);

  useEffect(() => {
    // If project has timeline entries verified for this worker, display them
    const projectEvidence = project.timeline
      .filter((t) => t.verified && t.photos && t.photos.length > 0)
      .map((t, idx) => ({
        id: t.id || `h-${idx}`,
        year: new Date().getFullYear().toString(),
        title: project.name || 'Verified Project',
        category: project.category || 'General Work',
        role: currentWorker.trade || 'Specialist',
        location: project.location || currentWorker.city || 'On-Site',
        rating: currentWorker.rating || 5.0,
        clientName: 'Verified Client',
        verified: true,
        comment: t.description,
        photos: t.photos,
        days: 1,
        wages: `₹${currentWorker.expectedDailyWage || 0}`,
      }));

    setHistoryItems(projectEvidence);
  }, [project, currentWorker]);

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate('/worker/passport')}
        className="inline-flex items-center gap-2 text-xs font-bold text-charcoal hover:text-primary transition-colors"
      >
        <ArrowLeft size={16} />
        <span>Back to Work Passport</span>
      </button>

      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-black text-xs mb-2">
          <Award size={13} />
          <span>VERIFIED PROJECT EVIDENCE</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal tracking-tight">
          Verified Work History
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-muted">
          {historyItems.length > 0
            ? `${historyItems.length} verified project site(s) logged on ${currentWorker.name || 'your'} immutable Nirmaan ledger.`
            : `All completed project sites and evidence are logged to your immutable Nirmaan ledger.`}
        </p>
      </div>

      {historyItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-stone-200/90 shadow-soft text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-primary flex items-center justify-center mx-auto">
            <Briefcase size={32} />
          </div>
          <div>
            <h3 className="text-lg font-black text-charcoal">No Work History Yet</h3>
            <p className="text-sm text-charcoal-muted max-w-md mx-auto mt-1">
              Your completed projects, timestamped site photos, and verified reviews will appear here as you complete work on NIRMAAN.
            </p>
          </div>
          <button
            onClick={() => navigate('/worker/jobs')}
            className="btn-primary inline-flex items-center gap-2 text-xs font-bold px-5 py-2.5"
          >
            Find Work Opportunities
          </button>
        </div>
      ) : (
        /* Timeline List */
        <div className="space-y-6 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-stone-200 before:hidden sm:before:block">
          {historyItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-soft space-y-4 sm:ml-10 relative"
            >
              {/* Timeline bullet for desktop */}
              <div className="hidden sm:flex absolute -left-12 top-8 w-5 h-5 rounded-full bg-primary text-white items-center justify-center text-[10px] font-bold shadow-xs">
                ✓
              </div>

              {/* Top row */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-stone-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      {item.year}
                    </span>
                    <h3 className="text-lg font-black text-charcoal">{item.title}</h3>
                  </div>
                  <p className="text-xs font-semibold text-charcoal-muted">{item.category}</p>
                </div>
                <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200 text-xs font-bold text-amber-800 self-start">
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                  <span>{item.rating}</span>
                </div>
              </div>

              {/* Meta details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-stone-50 p-3 rounded-2xl">
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Role</span>
                  <span className="font-bold text-charcoal">{item.role}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Location</span>
                  <span className="font-bold text-charcoal flex items-center gap-1">
                    <MapPin size={11} className="text-primary" /> {item.location}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Duration</span>
                  <span className="font-bold text-charcoal">{item.days} days</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Total Payout</span>
                  <span className="font-bold text-emerald-700">{item.wages}</span>
                </div>
              </div>

              {/* Client comment */}
              {item.comment && (
                <div className="text-xs text-charcoal bg-amber-50/50 border-l-3 border-primary p-3 rounded-r-xl italic">
                  "{item.comment}"
                  <span className="block not-italic text-[10px] font-bold text-charcoal-muted mt-1">
                    — {item.clientName}
                  </span>
                </div>
              )}

              {/* Photos */}
              {item.photos && item.photos.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-charcoal flex items-center gap-1">
                    <Camera size={12} className="text-primary" />
                    <span>Site Evidence Photos ({item.photos.length})</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {item.photos.map((photo: string, pIdx: number) => (
                      <img
                        key={pIdx}
                        src={photo}
                        alt={`Evidence ${pIdx + 1}`}
                        className="w-full h-28 object-cover rounded-xl border border-stone-200"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

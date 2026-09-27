import React, { useState } from 'react';
import {
  Camera,
  CheckCircle2,
  Calendar,
  Sparkles,
  Upload,
  ShieldCheck,
  Plus,
  X,
} from 'lucide-react';
import { TimelineItem } from '../../types';
import { useApp } from '../../context/AppContext';

export const ProofTimeline: React.FC = () => {
  const { project, addTimelineEntry, t } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  const samplePhoto = 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80';

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTimelineEntry(title, desc || 'Site progress photo verified and logged.', [samplePhoto]);
    setTitle('');
    setDesc('');
    setShowAddModal(false);
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200/90 shadow-elevated">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-1">
            <Sparkles size={13} className="text-secondary-dark" />
            <span>IMMUTABLE EVIDENCE LEDGER</span>
          </div>
          <h2 className="text-2xl font-black text-charcoal tracking-tight">
            Proof-of-Work Timeline
          </h2>
          <p className="text-xs text-charcoal-muted mt-0.5">
            Every approved milestone and timestamped photo automatically updates the worker's permanent digital passport.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="self-start sm:self-auto py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-soft transition-colors touch-target"
        >
          <Plus size={16} />
          <span>Upload Site Evidence</span>
        </button>
      </div>

      {/* Banner */}
      <div className="my-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-900 font-semibold">
        <ShieldCheck size={18} className="text-success flex-shrink-0" />
        <span>Project evidence added to Nirmaan Work Passport (Verified tamper-proof)</span>
      </div>

      {/* Vertical Timeline */}
      <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-stone-200">
        {project.timeline.map((item) => (
          <div key={item.id} className="relative group">
            {/* Timeline Marker Dot */}
            <div className="absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full bg-white border-3 border-primary flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
              <div className="w-2 h-2 rounded-full bg-secondary" />
            </div>

            {/* Timeline Content Card */}
            <div className="bg-[#FAF8F2] border border-stone-200/90 rounded-2xl p-4 sm:p-5 hover:border-primary/40 transition-all shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded bg-primary text-white">
                    {item.date}
                  </span>
                  {item.time && (
                    <span className="text-xs font-mono font-bold text-stone-500">
                      {item.time}
                    </span>
                  )}
                </div>

                {item.contributesToPassport && (
                  <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles size={11} className="text-secondary-dark" />
                    <span>Added to Passport</span>
                  </span>
                )}
              </div>

              <h4 className="text-base font-extrabold text-charcoal">{item.title}</h4>
              <p className="text-xs text-charcoal-muted mt-1 leading-relaxed">{item.description}</p>

              {/* Photos Grid if present */}
              {item.photos && item.photos.length > 0 && (
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {item.photos.map((imgUrl, pIdx) => (
                    <div key={pIdx} className="rounded-xl overflow-hidden h-28 border border-stone-200 relative group">
                      <img
                        src={imgUrl}
                        alt="Evidence"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute bottom-1 right-1 bg-charcoal/80 text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                        📸 Timestamped
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-3 pt-2 border-t border-stone-200/60 flex items-center justify-between text-[11px] text-stone-500">
                <span>Logged by: <strong className="text-charcoal">{item.contributor}</strong></span>
                <span className="text-success font-bold flex items-center gap-1">
                  <CheckCircle2 size={12} /> Verified
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Timeline Entry Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-2 touch-target"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-black text-charcoal mb-1">ADD WORK EVIDENCE</h3>
            <p className="text-xs text-charcoal-muted mb-4">
              Upload timestamped site milestone to verify progress.
            </p>

            <form onSubmit={handleAddEntry} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-charcoal block mb-1">
                  Milestone Activity Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wall Plaster & Waterproofing Curing"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-charcoal block mb-1">
                  Description & Quality Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Notes on laser level, joint width, or materials used..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center gap-3">
                <img src={samplePhoto} alt="Site" className="w-12 h-12 rounded-lg object-cover" />
                <div className="text-xs">
                  <div className="font-bold text-charcoal">Demo Site Photo Attached</div>
                  <div className="text-stone-500 text-[10px]">GPS: Sector 62, Noida</div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-primary text-white font-bold text-sm touch-target shadow-soft"
              >
                Log to Nirmaan Passport
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

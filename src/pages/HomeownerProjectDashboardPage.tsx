import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FolderKanban,
  CheckCircle2,
  Users,
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
  TrendingUp,
  CreditCard,
  Camera,
  ShieldCheck,
  AlertCircle,
  Plus,
  Phone,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HomeownerProjectDashboardPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { project, projects, attendance } = useApp();

  const activeProj = (id ? projects.find((p) => String(p.id) === String(id)) : null) || project;
  const pendingMilestones = activeProj.milestones.filter((m) => m.status === 'pending');

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto">
      {/* Project Header Banner */}
      <div className="bg-gradient-to-r from-primary to-primary-700 text-white rounded-3xl p-6 sm:p-8 shadow-elevated">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-secondary font-black text-xs">
                {(activeProj.category || 'PROJECT').toUpperCase()}
              </span>
              <span className="text-xs text-stone-200">
                Started {activeProj.startDate || 'Recently'} • {activeProj.location || 'Site Location'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{activeProj.name || 'Untitled Project'}</h1>
            <p className="text-stone-200 text-sm max-w-lg">{activeProj.description}</p>
          </div>

          {/* Quick Sub-navigation buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => navigate(`/homeowner/project/${activeProj.id}/timeline`)}
              className="px-4 py-2.5 rounded-xl bg-white text-primary font-extrabold text-xs shadow-soft hover:bg-stone-100 transition-all flex items-center gap-1.5 touch-target"
            >
              <Camera size={15} />
              <span>TIMELINE & PROOFS</span>
            </button>

            <button
              onClick={() => navigate(`/homeowner/project/${activeProj.id}/payment`)}
              className="px-4 py-2.5 rounded-xl bg-secondary text-primary font-black text-xs shadow-soft hover:bg-amber-400 transition-all flex items-center gap-1.5 touch-target"
            >
              <CreditCard size={15} />
              <span>PAYMENTS ({pendingMilestones.length} PENDING)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Progress & Budget Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Progress Card */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-soft space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-bold text-charcoal-muted uppercase">
                Overall Progress
              </span>
              <div className="text-3xl font-black text-primary mt-1">
                {activeProj.progressPercent}%
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
              On Schedule
            </span>
          </div>

          <div className="w-full h-3 rounded-full bg-stone-100 overflow-hidden border border-stone-200">
            <div
              className="h-full bg-primary rounded-full transition-all duration-700"
              style={{ width: `${activeProj.progressPercent}%` }}
            />
          </div>

          <div className="text-xs text-charcoal-muted flex items-center justify-between">
            <span>Progress Status</span>
            <span className="font-bold text-charcoal">{activeProj.progressPercent}% done</span>
          </div>
        </div>

        {/* Budget & Payments Card */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-soft space-y-3">
          <span className="text-xs font-bold text-charcoal-muted uppercase">
            Escrow Budget & Payments
          </span>
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-black text-charcoal">₹{(activeProj.spent || 0).toLocaleString()}</span>
              <span className="text-xs text-charcoal-muted"> paid</span>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-charcoal-muted">Budget: </span>
              <span className="text-sm font-bold text-charcoal">
                ₹{(activeProj.budget || 0).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
            <div
              className="h-full bg-secondary-dark rounded-full"
              style={{ width: `${activeProj.budget > 0 ? ((activeProj.spent / activeProj.budget) * 100) : 0}%` }}
            />
          </div>

          <div className="pt-1 flex items-center justify-between text-xs">
            <span className="text-emerald-700 font-bold">✓ Escrow Protected</span>
            <button
              onClick={() => navigate(`/homeowner/project/${activeProj.id}/payment`)}
              className="text-primary font-bold hover:underline"
            >
              View Milestones →
            </button>
          </div>
        </div>

        {/* Today's On-Site Status Card */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-soft space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-charcoal-muted uppercase">
              Today's Site Attendance
            </span>
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              <CheckCircle2 size={12} />
              Checked In
            </span>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-bold text-charcoal">
              {activeProj.workers.length} Craftsmen on site
            </span>
          </div>

          <p className="text-xs text-charcoal-muted">
            Location verified via GPS geo-fencing ({activeProj.location || 'Site Location'} at {attendance.checkInTime}).
          </p>

          <button
            onClick={() => navigate(`/homeowner/project/${activeProj.id}/timeline`)}
            className="w-full py-2 rounded-xl bg-sand-200 hover:bg-sand-300 text-charcoal text-xs font-bold transition-colors"
          >
            Review Today's Work Photos ({attendance.workPhotos.length})
          </button>
        </div>
      </div>

      {/* Pending Milestone Approval Alert Banner if any */}
      {pendingMilestones.length > 0 && (
        <div className="bg-secondary/15 rounded-3xl p-5 border-2 border-secondary/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-secondary/30 text-primary flex items-center justify-center shrink-0">
              <CreditCard size={22} />
            </div>
            <div>
              <h3 className="font-extrabold text-charcoal text-sm">
                Milestone Payout Pending: {pendingMilestones[0].title}
              </h3>
              <p className="text-xs text-charcoal-muted mt-0.5">
                Site progress photos submitted for review. Milestone Amount: ₹
                {pendingMilestones[0].amount.toLocaleString('en-IN')}.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate(`/homeowner/project/${activeProj.id}/payment`)}
            className="px-5 py-3 rounded-xl bg-primary hover:bg-primary-600 text-white font-extrabold text-xs shadow-soft shrink-0 transition-colors"
          >
            Review & Approve Milestone
          </button>
        </div>
      )}

      {/* Assigned Construction Team */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={20} className="text-primary" />
            <h3 className="text-lg font-extrabold text-charcoal">Assigned Construction Craftsmen</h3>
          </div>
          <button
            onClick={() => navigate('/homeowner/workers')}
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            <Plus size={13} />
            <span>Add Craftsman</span>
          </button>
        </div>

        {activeProj.workers.length === 0 ? (
          <div className="p-6 rounded-2xl bg-stone-50 border border-dashed border-stone-300 text-center space-y-1">
            <p className="text-xs font-bold text-charcoal">No craftsmen assigned to this project yet.</p>
            <p className="text-[11px] text-charcoal-muted">Search available workers or match from job applications.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {activeProj.workers.map((w) => (
              <div
                key={w.id}
                className="p-4 rounded-2xl bg-sand-50 border border-stone-200/80 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={w.photo}
                    alt={w.name}
                    className="w-12 h-12 rounded-xl object-cover border-2 border-primary/20 shadow-2xs"
                  />
                  <div>
                    <h4 className="font-extrabold text-charcoal text-sm">{w.name}</h4>
                    <span className="text-xs text-primary font-bold block">{w.trade}</span>
                    <span className="text-[11px] text-charcoal-muted">₹{w.dailyWage}/day</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    ✓ Assigned
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

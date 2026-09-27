import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Star,
  Sparkles,
  TrendingUp,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Award,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NirmaanLoop } from '../components/common/NirmaanLoop';
import { JobCard } from '../components/worker/JobCard';

export const WorkerHomePage: React.FC = () => {
  const { currentWorker, jobs, activeJob, project, t, attendance, updateCurrentWorker, showToast, refreshJobs, refreshNotifications } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    refreshJobs();
    refreshNotifications();
  }, []);

  const toggleAvailability = () => {
    const newStatus = !currentWorker.available;
    updateCurrentWorker({ available: newStatus });
    showToast(
      newStatus ? 'Status updated: Available for new jobs' : 'Status updated: Busy / On-site',
      'info'
    );
  };

  const tradeJobs = jobs.filter(
    (j) =>
      j.status === 'open' &&
      (!currentWorker.trade ||
        j.category.toLowerCase().includes(currentWorker.trade.toLowerCase()) ||
        j.requiredSkills.some((s) => s.toLowerCase().includes(currentWorker.trade.toLowerCase())) ||
        j.title.toLowerCase().includes(currentWorker.trade.toLowerCase()))
  );
  const displayNearbyJobs = tradeJobs.length > 0 ? tradeJobs.slice(0, 3) : jobs.filter((j) => j.status === 'open').slice(0, 3);
  const isHiredOnProject = project?.workers?.some((w) => w.id === currentWorker.id) || activeJob !== null;

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-primary to-primary-700 text-white rounded-3xl p-6 sm:p-8 shadow-elevated relative overflow-hidden">
        {/* Background Subtle Watermark */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-8 translate-y-8">
          <ShieldCheck size={280} />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-secondary font-black text-xs">
              <Sparkles size={13} />
              <span>NIRMAAN ARTISAN WORKFORCE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {t.goodMorning}, {currentWorker.name} 👋
            </h1>
            <p className="text-stone-200 text-sm max-w-lg">
              {currentWorker.city || 'Local Area'} • {currentWorker.trade || 'General Worker'} ({currentWorker.level || 'Registered'}) • {currentWorker.yearsExperience} yrs experience
            </p>
          </div>

          {/* Availability Toggle Pill */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-3.5 h-3.5 rounded-full ${
                  currentWorker.available ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              <div>
                <span className="text-xs font-black tracking-wider uppercase block">
                  {currentWorker.available ? t.availableForWork : t.busyWithJob}
                </span>
                <span className="text-[11px] text-stone-200">
                  {currentWorker.available ? 'Visible to clients & contractors' : 'Marked as occupied'}
                </span>
              </div>
            </div>

            <button
              onClick={toggleAvailability}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white text-primary text-xs font-black hover:bg-stone-100 transition-colors shadow-xs touch-target"
            >
              Toggle Status
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Expected Wage */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-soft">
          <span className="text-xs font-bold text-charcoal-muted uppercase tracking-wider block mb-1">
            {t.expectedDailyRate}
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-primary">
              ₹{currentWorker.expectedDailyWage || 0}
            </span>
            <span className="text-xs font-semibold text-charcoal-muted">/ day</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-700 font-bold flex items-center gap-1">
            <TrendingUp size={12} />
            <span>Benchmark Rate</span>
          </div>
        </div>

        {/* Nearby Jobs */}
        <div
          onClick={() => navigate('/worker/jobs')}
          className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-soft hover:border-primary/40 cursor-pointer transition-colors"
        >
          <span className="text-xs font-bold text-charcoal-muted uppercase tracking-wider block mb-1">
            Available Work
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-secondary-dark">
              {jobs.filter((j) => j.status === 'open').length}
            </span>
            <span className="text-xs font-semibold text-charcoal-muted">open jobs</span>
          </div>
          <div className="mt-2 text-[11px] text-primary font-bold flex items-center gap-1">
            <MapPin size={12} />
            <span>In your region</span>
          </div>
        </div>

        {/* Reputation Rating */}
        <div
          onClick={() => navigate('/worker/passport')}
          className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-soft hover:border-primary/40 cursor-pointer transition-colors"
        >
          <span className="text-xs font-bold text-charcoal-muted uppercase tracking-wider block mb-1">
            {t.reputation}
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-charcoal">
              {currentWorker.totalReviews > 0 ? `★ ${currentWorker.rating}` : '—'}
            </span>
            {currentWorker.totalReviews > 0 && (
              <span className="text-xs font-semibold text-charcoal-muted">/ 5.0</span>
            )}
          </div>
          <div className="mt-2 text-[11px] text-charcoal-muted font-bold flex items-center gap-1">
            <Sparkles size={12} className="text-secondary" />
            <span>
              {currentWorker.totalReviews > 0
                ? `${currentWorker.totalReviews} verified reviews`
                : 'No ratings yet'}
            </span>
          </div>
        </div>

        {/* Jobs Completed */}
        <div
          onClick={() => navigate('/worker/history')}
          className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-soft hover:border-primary/40 cursor-pointer transition-colors"
        >
          <span className="text-xs font-bold text-charcoal-muted uppercase tracking-wider block mb-1">
            Experience
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-charcoal">
              {currentWorker.completedJobs || 0}
            </span>
            <span className="text-xs font-semibold text-charcoal-muted">jobs done</span>
          </div>
          <div className="mt-2 text-[11px] text-charcoal-muted font-bold flex items-center gap-1">
            <Clock size={12} />
            <span>{currentWorker.yearsExperience || 0} yrs experience</span>
          </div>
        </div>
      </div>

      {/* Main Action CTAs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Find Jobs Card */}
        <div className="bg-white rounded-3xl p-6 border-2 border-primary/20 shadow-soft hover:shadow-elevated transition-all flex flex-col justify-between">
          <div className="space-y-2 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Briefcase size={20} />
            </div>
            <h3 className="text-xl font-black text-charcoal">Search Construction Jobs</h3>
            <p className="text-sm text-charcoal-muted">
              Discover verified direct homeowner & contractor jobs matched specifically to your
              {' '}{currentWorker.trade ? currentWorker.trade.toLowerCase() : 'craft'} skills.
            </p>
          </div>

          <button
            onClick={() => navigate('/worker/jobs')}
            className="w-full py-3.5 px-4 rounded-2xl bg-primary hover:bg-primary-600 text-white font-extrabold flex items-center justify-center gap-2 shadow-soft touch-target transition-all"
          >
            <span>{t.findJobs}</span>
            <ArrowRight size={18} />
          </button>
        </div>

        {/* Nirmaan Work Passport Card */}
        <div className="bg-gradient-to-br from-sand-100 to-white rounded-3xl p-6 border-2 border-secondary/50 shadow-soft hover:shadow-elevated transition-all flex flex-col justify-between">
          <div className="space-y-2 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-secondary/20 text-secondary-dark flex items-center justify-center">
              <Award size={20} />
            </div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-charcoal">Nirmaan Work Passport</h3>
              <span className="px-2 py-0.5 rounded-full bg-secondary text-primary font-black text-[10px]">
                OFFICIAL
              </span>
            </div>
            <p className="text-sm text-charcoal-muted">
              Your portable digital identity. Verified skills, verified project photo proofs, client
              reviews, and permanent reputation ledger.
            </p>
          </div>

          <button
            onClick={() => navigate('/worker/passport')}
            className="w-full py-3.5 px-4 rounded-2xl bg-secondary hover:bg-amber-400 text-primary font-black flex items-center justify-center gap-2 shadow-soft touch-target transition-all"
          >
            <span>{t.openPassport}</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Today's Active Work Card */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-widest text-primary uppercase">
                TODAY'S ACTIVE JOB
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                attendance.isCheckedIn
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-stone-100 text-stone-600'
              }`}>
                {attendance.isCheckedIn ? 'ON SITE' : 'NOT CHECKED IN'}
              </span>
            </div>
            <h3 className="text-lg font-black text-charcoal mt-1">
              {isHiredOnProject ? (activeJob?.title || project.name || 'Active Project') : 'No Active Job Assignment'}
            </h3>
            <p className="text-xs text-charcoal-muted">
              {isHiredOnProject
                ? `${activeJob?.location || project.location || currentWorker.city || 'On-site'} • Active Milestones`
                : 'Browse and apply for matching jobs to start earning.'}
            </p>
          </div>

          <button
            onClick={() => navigate('/worker/work')}
            className="px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-600 transition-colors flex items-center gap-1.5 touch-target"
          >
            <Clock size={14} />
            <span>Manage Attendance & Photos</span>
          </button>
        </div>

        <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/60">
            <span className="text-charcoal-muted block">Check-in Status</span>
            <span className="font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
              <CheckCircle2 size={13} />
              {attendance.isCheckedIn ? `Checked in at ${attendance.checkInTime}` : 'Not checked in'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/60">
            <span className="text-charcoal-muted block">Today's Progress</span>
            <span className="font-bold text-charcoal block mt-0.5">
              {attendance.progressPercent}% logged
            </span>
          </div>

          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/60">
            <span className="text-charcoal-muted block">Work Proof Uploads</span>
            <span className="font-bold text-primary block mt-0.5">
              {attendance.workPhotos.length} site photos attached
            </span>
          </div>
        </div>
      </div>

      {/* The Central Concept: The Nirmaan Dignity Loop */}
      <NirmaanLoop />

      {/* Nearby Jobs Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-charcoal">Recommended Jobs For You</h2>
            <p className="text-xs text-charcoal-muted">
              Directly matched to your Trade ({currentWorker.trade || 'All Trades'})
            </p>
          </div>
          <button
            onClick={() => navigate('/worker/jobs')}
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            <span>View All ({jobs.length})</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {displayNearbyJobs.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-stone-200/80 shadow-soft text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-primary flex items-center justify-center mx-auto">
              <Briefcase size={24} />
            </div>
            <h3 className="text-base font-black text-charcoal">No jobs yet</h3>
            <p className="text-xs text-charcoal-muted max-w-sm mx-auto">
              When homeowners post work matching your profession, you'll see it here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {displayNearbyJobs.map((job) => (
              <JobCard key={job.id} job={job} compact />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

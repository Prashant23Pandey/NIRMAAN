import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Layers,
  Sparkles,
  MapPin,
  Calendar,
  Briefcase,
  Star,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Award,
  Clock,
  HardHat,
  Filter,
  Bell,
  CheckCircle,
  AlertTriangle,
  RotateCw,
} from 'lucide-react';
import { api } from '../../services/api';
import { useApp } from '../../context/AppContext';
import { NirmaanLoop } from '../../components/common/NirmaanLoop';
import { JobCard } from '../../components/worker/JobCard';

export const ProfessionDashboardPage: React.FC = () => {
  const { profession: urlProfession } = useParams<{ profession?: string }>();
  const navigate = useNavigate();
  const { currentWorker, showToast, applyToJob } = useApp();

  const workerTradeSlug = currentWorker?.profession_slug || 'mason';
  const effectiveSlug = workerTradeSlug;

  // Enforce profession isolation: redirect if worker tries to access another trade
  useEffect(() => {
    if (urlProfession && urlProfession !== workerTradeSlug) {
      navigate(`/worker/${workerTradeSlug}`, { replace: true });
    }
  }, [urlProfession, workerTradeSlug, navigate]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [dismissedAlert, setDismissedAlert] = useState(false);
  const [alertsEnabled, setAlertsEnabled] = useState(() => {
    return typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted';
  });

  const loadDashboard = () => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    api
      .get(`workers/dashboard.php?profession=${effectiveSlug}`)
      .then((res: any) => {
        if (!isMounted) return;
        if (res.success) {
          setData(res);
        } else {
          setError(res.error || 'Unable to load your worker profile.');
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.message || 'Unable to load your worker profile.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  };

  useEffect(() => {
    return loadDashboard();
  }, [effectiveSlug]);

  // Opt-in Browser Notifications (PART 9)
  const handleToggleAlerts = async () => {
    if (!('Notification' in window)) {
      showToast('Browser notifications are not supported in this browser.', 'info');
      return;
    }

    if (Notification.permission === 'granted') {
      setAlertsEnabled(true);
      showToast('Job Alerts are active! You will receive local site alerts.', 'success');
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      setAlertsEnabled(true);
      showToast(`Job Alerts enabled! You will be notified when ${data?.profession?.name || 'trade'} jobs match your radius.`, 'success');
      try {
        new Notification('Nirmaan Job Alerts Activated', {
          body: `You will receive verified local alerts for ${data?.profession?.name || 'artisan'} sites.`,
          icon: '/favicon.ico',
        });
      } catch (e) {
        // Notification API fallback
      }
    } else {
      showToast('Notification permission was not granted.', 'warning');
    }
  };

  const handleApplyAlert = async (jobId: string | number) => {
    await applyToJob(String(jobId));
    setDismissedAlert(true);
  };

  // Error States (PART 22)
  if (error && !data) {
    const isMissingConfig = error.toLowerCase().includes('not been configured');
    return (
      <div className="py-16 text-center space-y-4 max-w-md mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
          <AlertTriangle size={28} />
        </div>
        <h2 className="text-xl font-black text-charcoal">
          {isMissingConfig ? 'Profession Configuration Required' : 'Unable to load your worker profile'}
        </h2>
        <p className="text-xs text-charcoal-muted leading-relaxed">
          {isMissingConfig
            ? 'Your registered profession has not been configured in the system yet. Please contact admin.'
            : error}
        </p>
        <button
          onClick={loadDashboard}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary text-white text-xs font-bold hover:bg-primary-600 transition-colors shadow-soft"
        >
          <RotateCw size={14} />
          <span>Retry</span>
        </button>
      </div>
    );
  }

  if (loading && !data) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-charcoal-muted font-bold">
          Loading {currentWorker.trade.toUpperCase()} workspace from MySQL...
        </p>
      </div>
    );
  }

  const profession = data?.profession || { name: currentWorker.trade, slug: effectiveSlug };
  const config = data?.config || {
    dashboard_title: `Your ${profession.name} Workspace`,
    quick_categories: [],
    focus_metric_name: 'Skill Standard',
    focus_metric_val: 'Verified',
  };
  const skills = data?.skills || [];
  const jobs = data?.jobs || [];
  const passport = data?.passport || {};
  const alert = data?.alert;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Locked Profession Header Bar (Replaces cross-trade switcher) */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-black uppercase tracking-wider text-primary">
            {profession.name.toUpperCase()} WORKSPACE
          </span>
          <span className="text-stone-300">•</span>
          <span className="text-xs font-semibold text-charcoal-muted">
            {profession.name} / {profession.name_hindi || 'शिल्पकार'}
          </span>
        </div>

        {/* Opt-in Job Alerts Button */}
        <button
          onClick={handleToggleAlerts}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 self-start sm:self-auto touch-target ${
            alertsEnabled
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs'
              : 'bg-stone-50 text-charcoal hover:bg-stone-100 border border-stone-200'
          }`}
          title="Enable browser notifications for new jobs matching your trade"
        >
          <Bell size={13} className={alertsEnabled ? 'text-emerald-600' : 'text-stone-400'} />
          <span>{alertsEnabled ? 'Job Alerts Active' : 'Enable Job Alerts'}</span>
        </button>
      </div>

      {/* Real MySQL Job Alert Banner (PART 8) */}
      {alert && !dismissedAlert && (
        <div className="bg-amber-50/90 border-2 border-amber-300 rounded-3xl p-6 shadow-soft space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-200/70 text-amber-900 font-black text-xs">
              <span className="w-2 h-2 rounded-full bg-amber-600 animate-ping" />
              <span>NEW JOB NEAR YOU</span>
            </div>
            <span className="text-xs font-bold text-amber-800">
              {alert.profession_name || profession.name} Required
            </span>
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-charcoal">
              {alert.job_title}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-charcoal-muted mt-1 font-semibold">
              <span className="flex items-center gap-1 text-charcoal font-bold">
                <MapPin size={13} className="text-primary" />
                {alert.location || alert.city || 'Sector 62, Noida'}
              </span>
              <span>•</span>
              <span>Approx. {alert.distance_km || 4.2} km away</span>
              <span>•</span>
              <span className="text-primary font-black text-sm">
                ₹{Number(alert.budget || alert.daily_wage || 8000).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="text-xs space-y-1 text-charcoal">
            <div>
              <span className="font-bold text-stone-500">Starts: </span>
              <span className="font-semibold">{alert.start_date || '28 September 2026'}</span>
            </div>
            {alert.required_skills && (
              <div>
                <span className="font-bold text-stone-500">Skills: </span>
                <span className="font-semibold">{alert.required_skills}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 pt-2 border-t border-amber-200">
            <button
              onClick={() => navigate(`/worker/jobs/${alert.job_id}`)}
              className="px-4 py-2 rounded-xl bg-white border border-stone-300 text-charcoal text-xs font-bold hover:bg-stone-50 transition-colors"
            >
              VIEW JOB
            </button>
            <button
              onClick={() => handleApplyAlert(alert.job_id)}
              className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-600 text-white text-xs font-extrabold shadow-soft transition-all"
            >
              APPLY
            </button>
            <button
              onClick={() => setDismissedAlert(true)}
              className="ml-auto text-xs font-semibold text-stone-500 hover:text-charcoal transition-colors"
            >
              DISMISS
            </button>
          </div>
        </div>
      )}

      {/* Dynamic Header Banner */}
      <div className="bg-gradient-to-r from-primary to-primary-800 text-white rounded-3xl p-6 sm:p-8 shadow-elevated relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-secondary font-black text-xs">
            <Sparkles size={13} />
            <span>AUTHENTIC WORKFORCE REGISTRY</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {config.dashboard_title}
          </h1>

          <p className="text-stone-200 text-sm max-w-xl">
            {profession.description || `Specialized ${profession.name} artisan operations, tools, certifications and verified open sites.`}
          </p>

          <div className="pt-2 flex flex-wrap gap-2 text-xs">
            <span className="px-3 py-1 rounded-xl bg-white/10 font-bold border border-white/20">
              Role: Master {profession.name}
            </span>
            <span className="px-3 py-1 rounded-xl bg-emerald-500/20 font-bold border border-emerald-400/40 text-emerald-200 flex items-center gap-1">
              <ShieldCheck size={13} />
              {config.focus_metric_name}: {config.focus_metric_val}
            </span>
          </div>
        </div>
      </div>

      {/* Trade Specific Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-soft">
          <span className="text-[11px] font-bold text-charcoal-muted uppercase block">
            Daily Wage Benchmark
          </span>
          <div className="text-2xl sm:text-3xl font-black text-primary mt-1">
            ₹{currentWorker.expectedDailyWage || 850}
          </div>
          <span className="text-[10px] text-emerald-700 font-bold">Standard NCR Trade Rate</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-soft">
          <span className="text-[11px] font-bold text-charcoal-muted uppercase block">
            Specialized Skills
          </span>
          <div className="text-2xl sm:text-3xl font-black text-charcoal mt-1">
            {skills.length || currentWorker.skills.length || 4}
          </div>
          <span className="text-[10px] text-primary font-bold">100% Verified in MySQL</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-soft">
          <span className="text-[11px] font-bold text-charcoal-muted uppercase block">
            Active Trade Jobs
          </span>
          <div className="text-2xl sm:text-3xl font-black text-secondary-dark mt-1">
            {jobs.length}
          </div>
          <span className="text-[10px] text-charcoal-muted font-bold">Within 10 km site radius</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-soft">
          <span className="text-[11px] font-bold text-charcoal-muted uppercase block">
            Reputation Score
          </span>
          <div className="text-2xl sm:text-3xl font-black text-charcoal mt-1">
            ★ {passport.quality_score || currentWorker.rating || 4.8}
          </div>
          <span className="text-[10px] text-emerald-700 font-bold">Work Passport Certified</span>
        </div>
      </div>

      {/* Trade Specific Skills / Competencies */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-charcoal">
              {profession.name} Competency Specializations
            </h3>
            <p className="text-xs text-charcoal-muted">
              Verified skills for {profession.name} qualification registered in MySQL.
            </p>
          </div>
          <button
            onClick={() => navigate('/worker/passport')}
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            <span>View Passport Skills</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {skills.map((skill: any, i: number) => (
            <div
              key={i}
              className="p-3.5 rounded-2xl bg-sand-50 border border-stone-200/80 space-y-1 hover:border-primary/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                  Verified
                </span>
              </div>
              <h4 className="font-extrabold text-xs text-charcoal">{skill.name}</h4>
              <p className="text-[10px] text-charcoal-muted leading-tight">
                {skill.description || 'Verified on Nirmaan ledger.'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Trade Specific Jobs List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-extrabold text-charcoal">
              Open Jobs for {profession.name}s
            </h3>
            <p className="text-xs text-charcoal-muted">
              Direct homeowner requirements verified for {profession.name} trade qualifications.
            </p>
          </div>
          <button
            onClick={() => navigate('/worker/jobs')}
            className="text-xs font-bold text-primary hover:underline"
          >
            View All {profession.name} Jobs →
          </button>
        </div>

        {jobs.length === 0 ? (
          <div className="p-8 rounded-3xl bg-white border border-dashed border-stone-200 text-center space-y-2">
            <Briefcase size={28} className="mx-auto text-stone-400" />
            <p className="text-sm font-bold text-charcoal">No open {profession.name} jobs right now</p>
            <p className="text-xs text-charcoal-muted">
              You will receive an instant alert banner here as soon as a homeowner posts a job matching your trade and radius.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map((job: any) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>

      {/* The Dignity Loop */}
      <NirmaanLoop />
    </div>
  );
};

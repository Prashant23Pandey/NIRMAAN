import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  FolderKanban,
  Users,
  Briefcase,
  CalendarCheck,
  CreditCard,
  Plus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { api } from '../../services/api';
import { useApp } from '../../context/AppContext';

export const ContractorDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useApp();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('contractor/dashboard.php')
      .then((res: any) => {
        if (res.success) setData(res);
      })
      .catch((err) => {
        console.warn('Contractor API notice:', err.message);
        setData({
          contractor: { company_name: 'Registered Contractor', license_number: 'Pending Verification' },
          stats: { active_projects: 0, total_workers: 0, open_jobs: 0, attendance_today: 0, payroll_disbursed: 0 },
          projects: [],
          workers: []
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const stats = data?.stats || {
    active_projects: 0,
    total_workers: 0,
    open_jobs: 0,
    attendance_today: 0,
    payroll_disbursed: 0,
  };

  const projects = data?.projects || [];
  const workers = data?.workers || [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#176B5B] to-[#13493e] text-white rounded-3xl p-6 sm:p-8 shadow-elevated flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-secondary font-black text-xs">
            <Building2 size={13} />
            <span>CONTRACTOR OPERATIONS HUB</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {data?.contractor?.company_name || 'Contractor Operations'}
          </h1>
          <p className="text-stone-200 text-sm max-w-lg">
            Manage multi-site construction projects, assign certified artisans with Work Passports, and track daily progress.
          </p>
        </div>

        <button
          onClick={() => navigate('/contractor/jobs')}
          className="self-start md:self-auto px-5 py-3.5 rounded-2xl bg-secondary hover:bg-amber-400 text-primary font-black text-xs shadow-soft transition-all flex items-center gap-2"
        >
          <Plus size={16} />
          <span>Post New Site Job</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div
          onClick={() => navigate('/contractor/projects')}
          className="bg-white rounded-3xl p-5 border border-stone-200 shadow-soft cursor-pointer hover:border-primary/40 transition-colors"
        >
          <span className="text-[11px] font-bold text-charcoal-muted uppercase block">
            Active Sites
          </span>
          <div className="text-3xl font-black text-primary mt-1">{stats.active_projects}</div>
          <span className="text-[10px] text-emerald-700 font-bold">On Schedule</span>
        </div>

        <div
          onClick={() => navigate('/contractor/team')}
          className="bg-white rounded-3xl p-5 border border-stone-200 shadow-soft cursor-pointer hover:border-primary/40 transition-colors"
        >
          <span className="text-[11px] font-bold text-charcoal-muted uppercase block">
            Assigned Workforce
          </span>
          <div className="text-3xl font-black text-charcoal mt-1">{stats.total_workers}</div>
          <span className="text-[10px] text-primary font-bold">100% Verified Passports</span>
        </div>

        <div
          onClick={() => navigate('/contractor/attendance')}
          className="bg-white rounded-3xl p-5 border border-stone-200 shadow-soft cursor-pointer hover:border-primary/40 transition-colors"
        >
          <span className="text-[11px] font-bold text-charcoal-muted uppercase block">
            Today's Check-ins
          </span>
          <div className="text-3xl font-black text-secondary-dark mt-1">
            {stats.attendance_today}
          </div>
          <span className="text-[10px] text-emerald-700 font-bold">GPS Verified</span>
        </div>

        <div
          onClick={() => navigate('/contractor/payments')}
          className="bg-white rounded-3xl p-5 border border-stone-200 shadow-soft cursor-pointer hover:border-primary/40 transition-colors"
        >
          <span className="text-[11px] font-bold text-charcoal-muted uppercase block">
            Payroll Disbursed
          </span>
          <div className="text-3xl font-black text-charcoal mt-1">
            ₹{stats.payroll_disbursed.toLocaleString()}
          </div>
          <span className="text-[10px] text-stone-400 font-bold">Direct Escrow</span>
        </div>
      </div>

      {/* Active Construction Sites */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderKanban size={18} className="text-primary" />
            <h3 className="font-extrabold text-charcoal text-base">Active Site Contracts</h3>
          </div>
          <button
            onClick={() => navigate('/contractor/projects')}
            className="text-xs font-bold text-primary hover:underline"
          >
            Manage All Projects →
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="p-8 rounded-2xl bg-stone-50 border border-dashed border-stone-300 text-center space-y-1">
            <FolderKanban size={24} className="mx-auto text-stone-400" />
            <p className="text-sm font-bold text-charcoal">No active projects yet</p>
            <p className="text-xs text-charcoal-muted">Create projects or take on contracts to track progress and workers here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projects.map((p: any) => (
              <div
                key={p.id}
                className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-extrabold text-charcoal text-sm">{p.name}</h4>
                    <span className="text-xs text-charcoal-muted">{p.location}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    {p.progress_percent}% Done
                  </span>
                </div>

                <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${p.progress_percent}%` }}
                  />
                </div>

                <div className="flex justify-between text-xs font-semibold text-charcoal-muted">
                  <span>Budget: ₹{Number(p.budget).toLocaleString()}</span>
                  <span
                    onClick={() => navigate(`/homeowner/project/${p.id}`)}
                    className="text-primary font-bold cursor-pointer hover:underline"
                  >
                    View Details
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Deployed Workforce Roster */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-primary" />
            <h3 className="font-extrabold text-charcoal text-base">Deployed Workforce Team</h3>
          </div>
          <button
            onClick={() => navigate('/contractor/team')}
            className="text-xs font-bold text-primary hover:underline"
          >
            Manage Team Roster →
          </button>
        </div>

        {workers.length === 0 ? (
          <div className="p-8 rounded-2xl bg-stone-50 border border-dashed border-stone-300 text-center space-y-1">
            <Users size={24} className="mx-auto text-stone-400" />
            <p className="text-sm font-bold text-charcoal">No deployed workers yet</p>
            <p className="text-xs text-charcoal-muted">Deploy verified artisans to sites to track daily attendance and passports.</p>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {workers.map((w: any) => (
              <div key={w.id} className="py-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                  {w.worker_name?.charAt(0) || 'W'}
                </div>
                <div>
                  <h4 className="font-extrabold text-charcoal text-sm">{w.worker_name}</h4>
                  <span className="text-xs text-primary font-bold">
                    {w.trade_name} • {w.nirmaan_id}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-black text-charcoal">★ {w.rating}</span>
                <button
                  onClick={() => navigate('/worker/passport')}
                  className="px-3 py-1.5 rounded-xl bg-sand-200 hover:bg-sand-300 text-charcoal text-xs font-bold"
                >
                  Passport
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
  );
};

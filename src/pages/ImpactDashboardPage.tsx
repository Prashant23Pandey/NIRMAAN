import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  Users,
  Briefcase,
  IndianRupee,
  Star,
  MapPin,
  Sparkles,
  ShieldCheck,
  Award,
  ArrowRight,
  Info,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import { NirmaanLoop } from '../components/common/NirmaanLoop';

export const ImpactDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  // Metrics specified in prompt
  const statMetrics = [
    {
      title: 'Active Artisans',
      value: '1,248',
      sub: 'Verified with Work Passports',
      icon: Users,
      trend: '+24% this month',
    },
    {
      title: 'Jobs Completed',
      value: '3,840',
      sub: 'Zero wage disputes recorded',
      icon: Briefcase,
      trend: '99.2% completion rate',
    },
    {
      title: 'Recorded Wages',
      value: '₹28,45,000',
      sub: 'Paid directly into worker accounts',
      icon: IndianRupee,
      trend: 'Zero contractor leakage',
    },
    {
      title: 'Average Reputation',
      value: '4.7 / 5.0',
      sub: 'Across 14,200 milestone reviews',
      icon: Star,
      trend: 'Two-sided reciprocal ratings',
    },
    {
      title: 'Cities Live',
      value: '18',
      sub: 'Tier-1 & Tier-2 industrial clusters',
      icon: MapPin,
      trend: 'NCR, Jaipur, Pune, Lucknow',
    },
  ];

  // Chart 1: Jobs Completed Over Time
  const timelineData = [
    { month: 'Apr', jobs: 180, wages: 120 },
    { month: 'May', jobs: 290, wages: 210 },
    { month: 'Jun', jobs: 420, wages: 340 },
    { month: 'Jul', jobs: 610, wages: 490 },
    { month: 'Aug', jobs: 890, wages: 720 },
    { month: 'Sept', jobs: 1450, wages: 1180 },
  ];

  // Chart 2: Worker Skill Distribution
  const tradeDistribution = [
    { trade: 'Masons', count: 412, fill: '#176B5B' },
    { trade: 'Tile Workers', count: 284, fill: '#1F8E79' },
    { trade: 'Plumbers', count: 210, fill: '#2E8B57' },
    { trade: 'Electricians', count: 188, fill: '#F4B942' },
    { trade: 'Painters', count: 154, fill: '#E69C24' },
  ];

  // Chart 3: Project Status
  const projectStatusData = [
    { name: 'Completed & Verified', value: 74, color: '#176B5B' },
    { name: 'Active In Progress', value: 21, color: '#F4B942' },
    { name: 'Under Verification', value: 5, color: '#2E8B57' },
  ];

  return (
    <div className="space-y-8 pb-20 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-primary via-primary-700 to-primary-800 text-white rounded-3xl p-6 sm:p-8 shadow-elevated relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-secondary font-black text-xs">
            <Sparkles size={14} />
            <span>NATIONAL CIVIC-TECH HACKATHON SHOWCASE</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Nirmaan Impact & Workforce Ledger
          </h1>
          <p className="text-stone-200 text-sm max-w-2xl leading-relaxed">
            Transforming 70+ million unorganized construction workers in India into recognized,
            bankable professionals through immutable Work Passports, transparent daily wage records,
            and mutual trust.
          </p>
        </div>
      </div>

      {/* Simulated / Demo Notice */}
      <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Info size={16} className="text-amber-700 shrink-0" />
          <span>
            <strong>Demo / Simulated Data:</strong> Aggregated indicators based on simulated
            construction telemetry, test users, and pilot cohort estimates.
          </span>
        </div>
        <span className="font-mono text-[10px] text-amber-700 uppercase font-bold shrink-0">
          PROTOTYPE v2.0
        </span>
      </div>

      {/* High-Level Impact Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        {statMetrics.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-soft space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-2">
                  <Icon size={18} />
                </div>
                <span className="text-[11px] font-bold text-charcoal-muted uppercase block">
                  {stat.title}
                </span>
                <div className="text-2xl font-black text-charcoal tracking-tight mt-0.5">
                  {stat.value}
                </div>
              </div>

              <div className="pt-2 border-t border-stone-100 text-[10px] text-emerald-800 font-bold">
                {stat.trend}
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chart 1: Jobs Completed Over Time */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-charcoal text-base">Monthly Job Completion</h3>
              <p className="text-xs text-charcoal-muted">Rapid growth of verified site contracts</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              +142% QoQ
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#176B5B" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#176B5B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0efe9" />
                <XAxis dataKey="month" stroke="#888" fontSize={11} />
                <YAxis stroke="#888" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#17211F',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="jobs"
                  stroke="#176B5B"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorJobs)"
                  name="Verified Jobs"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Worker Skill Distribution */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-charcoal text-base">Worker Trade Distribution</h3>
              <p className="text-xs text-charcoal-muted">Active craftsmen by primary skill qualification</p>
            </div>
            <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
              5 Core Trades
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={tradeDistribution}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0efe9" />
                <XAxis dataKey="trade" stroke="#888" fontSize={11} />
                <YAxis stroke="#888" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#17211F',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]} name="Artisans">
                  {tradeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Chart 3: Project Status & Financial Inclusion */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Project Status Donut */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-soft space-y-3">
          <h3 className="font-extrabold text-charcoal text-base">Project Success Rate</h3>
          <p className="text-xs text-charcoal-muted">
            Milestone approval & dispute-free completion
          </p>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={projectStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#17211F',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs">
            {projectStatusData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-charcoal-muted">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-bold text-charcoal">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Social Impact / Dignity Multiplier */}
        <div className="md:col-span-2 bg-sand-100 rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-soft space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Award size={20} className="text-secondary-dark" />
              <h3 className="font-black text-charcoal text-lg">
                Financial Inclusion & Civic Formalization
              </h3>
            </div>
            <p className="text-xs text-charcoal/90 leading-relaxed">
              Before NIRMAAN, daily wage construction workers lacked proof of income, leaving them
              excluded from regular bank credit and subject to exploitative informal loan rates of
              36%+.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-white border border-stone-200/80">
              <span className="text-[10px] uppercase font-bold text-charcoal-muted block">
                Average Daily Wage Uplift
              </span>
              <span className="text-xl font-black text-primary block mt-0.5">+18.5%</span>
              <span className="text-[10px] text-stone-400">Due to verified skill certification</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-stone-200/80">
              <span className="text-[10px] uppercase font-bold text-charcoal-muted block">
                Direct Bank Transfers
              </span>
              <span className="text-xl font-black text-secondary-dark block mt-0.5">100%</span>
              <span className="text-[10px] text-stone-400">Zero middlemen cuts or bribes</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-stone-200/80">
              <span className="text-[10px] uppercase font-bold text-charcoal-muted block">
                Permanent Identity
              </span>
              <span className="text-xl font-black text-charcoal block mt-0.5">Portable</span>
              <span className="text-[10px] text-stone-400">Valid across 18 states & cities</span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs">
            <span className="font-bold text-primary">Nirmaan 2.0 • Made with Dignity for India</span>
            <button
              onClick={() => navigate('/worker/passport')}
              className="text-primary font-black hover:underline flex items-center gap-1"
            >
              <span>Explore Worker Work Passport</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* The Dignity Loop Final Summary */}
      <NirmaanLoop />
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Search,
  SlidersHorizontal,
  MapPin,
  Calendar,
  Clock,
  Star,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Filter,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { JobCard } from '../components/worker/JobCard';

export const WorkerJobsPage: React.FC = () => {
  const { jobs, currentWorker, t, refreshJobs } = useApp();
  const [maxDistance, setMaxDistance] = useState<number>(25);
  const [minWage, setMinWage] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'all' | 'open' | 'accepted' | 'applied'>('all');
  const [filterByTrade, setFilterByTrade] = useState<boolean>(true);

  useEffect(() => {
    refreshJobs();
  }, []);

  const workerTrade = currentWorker.trade || '';

  const filteredJobs = jobs.filter((job) => {
    // Tab filter
    if (activeTab === 'open' && job.status !== 'open') return false;
    if (activeTab === 'accepted' && job.status !== 'accepted') return false;
    if (activeTab === 'applied' && job.status !== 'applied') return false;

    // Profession Isolation (only if filterByTrade is on)
    const matchesTrade = !filterByTrade || !workerTrade ||
      job.category.toLowerCase().includes(workerTrade.toLowerCase()) ||
      job.requiredSkills.some((s) => s.toLowerCase().includes(workerTrade.toLowerCase())) ||
      job.title.toLowerCase().includes(workerTrade.toLowerCase());

    const matchesDistance = !job.distanceKm || job.distanceKm === 0 || job.distanceKm <= maxDistance;
    const matchesWage = job.dailyWage >= minWage;
    const matchesQuery =
      searchQuery === '' ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTrade && matchesDistance && matchesWage && matchesQuery;
  });

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal tracking-tight">
            Construction Jobs Discovery
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted">
            Directly verified jobs from verified homeowners & general contractors in Delhi NCR.
          </p>
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all shadow-xs ${
            showFilters
              ? 'bg-primary text-white border-primary'
              : 'bg-white text-charcoal border-stone-200 hover:border-primary/40'
          }`}
        >
          <SlidersHorizontal size={15} />
          <span>Filters {maxDistance < 10 || minWage > 0 ? '(Active)' : ''}</span>
        </button>
      </div>

      {/* Search & Category Pills */}
      <div className="space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by job title, location (e.g. Noida, Sector 62), or homeowner..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-stone-200 text-sm text-charcoal focus:outline-hidden focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-xs transition-all"
          />
        </div>

        {/* Trade Scope Indicator */}
        <div className="flex items-center gap-2">
          <div className="px-4 py-2 rounded-xl text-xs font-black bg-primary text-white shadow-soft flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Showing verified {workerTrade} jobs ({filteredJobs.length} available)</span>
          </div>
          <span className="text-[11px] text-stone-500 font-semibold hidden sm:inline">
            Matches your registered Nirmaan trade certification
          </span>
        </div>
      </div>

      {/* Expandable Filter Drawer */}
      {showFilters && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-soft animate-fade-in space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-charcoal flex items-center gap-2">
              <Filter size={15} className="text-primary" />
              <span>Filter Job Parameters</span>
            </h3>
            <button
              onClick={() => {
                setMaxDistance(15);
                setMinWage(0);
                setSearchQuery('');
              }}
              className="text-xs text-charcoal-muted hover:text-primary font-bold"
            >
              Reset Filters
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span>Maximum Distance</span>
                <span className="text-primary">{maxDistance} km</span>
              </div>
              <input
                type="range"
                min="1"
                max="25"
                value={maxDistance}
                onChange={(e) => setMaxDistance(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                <span>1 km</span>
                <span>25 km</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span>Minimum Daily Wage</span>
                <span className="text-primary">₹{minWage}/day</span>
              </div>
              <input
                type="range"
                min="0"
                max="2000"
                step="50"
                value={minWage}
                onChange={(e) => setMinWage(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                <span>Any wage</span>
                <span>₹2,000/day</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Jobs Count Info */}
      <div className="flex items-center justify-between text-xs text-charcoal-muted px-1">
        <span>Showing {filteredJobs.length} verified jobs</span>
        <span className="font-bold text-emerald-700">✓ 100% Verified Homeowners</span>
      </div>

      {/* Job Cards Grid */}
      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 space-y-4 shadow-soft">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-primary flex items-center justify-center mx-auto">
            <Briefcase size={32} />
          </div>
          <div>
            <h3 className="text-lg font-black text-charcoal">No jobs yet</h3>
            <p className="text-sm text-charcoal-muted max-w-md mx-auto mt-1">
              When homeowners post work matching your profession, you'll see it here.
            </p>
          </div>
          {(maxDistance < 15 || minWage > 0 || searchQuery !== '') && (
            <button
              onClick={() => {
                setMaxDistance(15);
                setMinWage(0);
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold"
            >
              Clear Search & Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

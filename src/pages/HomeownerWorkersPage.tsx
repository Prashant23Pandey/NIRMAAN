import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Users,
  Sparkles,
  ArrowRightLeft,
  SlidersHorizontal,
  CheckCircle2,
  ShieldCheck,
  Building,
  ArrowRight,
  Star,
  MapPin,
  Clock,
  UserCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { WorkerMatchCard } from '../components/homeowner/WorkerMatchCard';
import { Worker } from '../types';
import { getPhotoUrl } from '../utils/imageUrl';

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
}

const CITIES = [
  { name: 'Live GPS Location', lat: 0, lng: 0, id: 'live' },
  { name: 'New Delhi', lat: 28.6139, lng: 77.2090, id: 'delhi' },
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777, id: 'mumbai' },
  { name: 'Bangalore', lat: 12.9716, lng: 77.5946, id: 'bangalore' },
  { name: 'Noida', lat: 28.5355, lng: 77.3910, id: 'noida' },
  { name: 'Gurugram', lat: 28.4595, lng: 77.0266, id: 'gurugram' },
  { name: 'Lucknow', lat: 26.8467, lng: 80.9462, id: 'lucknow' },
];

export const HomeownerWorkersPage: React.FC = () => {
  const { workers, project, showToast } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get('job_id');

  const [applicants, setApplicants] = useState<any[]>([]);
  const [jobMatches, setJobMatches] = useState<any[]>([]);
  const [loadingJobData, setLoadingJobData] = useState(false);
  const [acceptedWorkerId, setAcceptedWorkerId] = useState<number | null>(null);
  
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedCityId, setSelectedCityId] = useState('live');

  useEffect(() => {
    if (selectedCityId === 'live') {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => {
            console.warn('Geolocation error:', error);
          }
        );
      }
    } else {
      const city = CITIES.find(c => c.id === selectedCityId);
      if (city) {
        setUserLocation({ lat: city.lat, lng: city.lng });
      }
    }
  }, [selectedCityId]);

  useEffect(() => {
    if (!jobId) return;

    setLoadingJobData(true);
    api
      .get<{ applicants?: any[]; matches?: any[] }>(`jobs/applicants.php?job_id=${jobId}`)
      .then((res) => {
        if (res?.applicants) setApplicants(res.applicants);
        if (res?.matches) setJobMatches(res.matches);
      })
      .catch((err) => {
        console.warn('Applicants load notice:', err.message);
      })
      .finally(() => setLoadingJobData(false));
  }, [jobId]);

  const handleAcceptApplicant = async (workerProfileId: number, workerName: string) => {
    try {
      const res: any = await api.post('jobs/accept.php', {
        job_id: Number(jobId),
        worker_profile_id: workerProfileId,
      });

      if (res.success) {
        setAcceptedWorkerId(workerProfileId);
        showToast(
          `✓ ${workerName} accepted! Created record in project_workers and notified worker.`,
          'success'
        );
      } else {
        showToast(res.error || 'Failed to accept worker', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Acceptance error', 'error');
    }
  };

  // Convert MySQL matches to Worker interface if present
  const displayWorkers: Worker[] = jobMatches.length > 0
    ? jobMatches.map((jm) => ({
        id: String(jm.worker_profile_id),
        name: jm.worker_full_name || jm.worker_name,
        nameHindi: jm.worker_name,
        photo: getPhotoUrl(jm.worker_photo),
        city: jm.city || 'Noida',
        trade: jm.profession_name || 'Artisan',
        level: jm.level || 'Level 1 Artisan',
        verified: true,
        nirmaanId: jm.registration_id || `NRM-${jm.worker_profile_id}`,
        rating: Number(jm.rating) || 0,
        totalReviews: Number(jm.total_reviews) || 0,
        completedJobs: Number(jm.completed_jobs) || 0,
        yearsExperience: Number(jm.experience_years) || 0,
        expectedDailyWage: Number(jm.expected_daily_wage) || 850,
        phone: jm.worker_phone || '+91 98765 43210',
        available: true,
        skills: [{ name: jm.profession_name, verified: true, level: 'Master' }],
        reputation: { quality: 0, punctuality: 0, reliability: 0, completion: 0 },
        workerClientReputation: { paymentReliability: 0, siteConditions: 0, workClarity: 0 },
        distanceKm: Number(jm.distance_km) || 3.5,
        latitude: Number(jm.latitude) || undefined,
        longitude: Number(jm.longitude) || undefined,
        matchScore: Number(jm.match_score) || 92,
        matchReasons: [
          `Verified ${jm.profession_name} from MySQL database`,
          `Within ${jm.distance_km || 4} km site radius`,
        ],
        about: 'Verified artisan registered on Nirmaan platform.',
        recentProjects: [],
      }))
    : workers;

  // Apply live location distance sorting
  const liveWorkers = React.useMemo(() => {
    if (!userLocation) return displayWorkers;

    return displayWorkers
      .map((w) => {
        if (w.latitude && w.longitude) {
          const liveDist = getDistanceFromLatLonInKm(
            userLocation.lat,
            userLocation.lng,
            w.latitude,
            w.longitude
          );
          return { ...w, distanceKm: liveDist };
        }
        return w;
      })
      .sort((a, b) => (a.distanceKm || Infinity) - (b.distanceKm || Infinity));
  }, [displayWorkers, userLocation]);

  return (
    <div className="space-y-6 pb-16 max-w-5xl mx-auto">
      {/* Top Banner with Project Context */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
              {jobId ? `Job #${jobId} Matching Scope` : 'Matched for Project'}
            </span>
            <span className="text-xs text-charcoal-muted font-bold">
              {project.name || 'All Trades'} • {project.location || 'Local Area'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal tracking-tight flex items-center gap-2 flex-wrap">
            {jobId ? `${liveWorkers.length} Matched Craftsmen` : `${liveWorkers.length} Registered Artisans`}
            
            {/* Location Selector */}
            <div className="relative inline-flex items-center ml-2 bg-stone-100 rounded-xl px-2 py-1 text-sm border border-stone-200">
              <MapPin size={14} className="text-primary mr-1 shrink-0" />
              <select
                value={selectedCityId}
                onChange={(e) => setSelectedCityId(e.target.value)}
                className="bg-transparent text-primary font-bold focus:outline-none cursor-pointer appearance-none pr-4 min-w-[120px]"
              >
                {CITIES.map(city => (
                  <option key={city.id} value={city.id}>{city.name}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-2 text-stone-500">
                ▼
              </div>
            </div>
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted mt-2">
            Ranked by trade qualification on Nirmaan Work Passport, verified credentials, and distance from your selected location.
          </p>
        </div>

        {/* Compare CTA */}
        {liveWorkers.length >= 2 && (
          <button
            onClick={() => navigate('/homeowner/compare')}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-secondary hover:bg-amber-400 text-primary font-black text-xs shadow-soft transition-all touch-target self-start sm:self-auto shrink-0 cursor-pointer"
          >
            <ArrowRightLeft size={16} />
            <span>COMPARE WORKERS</span>
          </button>
        )}
      </div>

      {/* Match Explanation Pill */}
      <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-xs text-emerald-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck size={18} className="text-emerald-700 shrink-0" />
          <span>
            All matched workers have verified trade competencies, verified phone identity,
            and maintain an active MySQL Work Passport ledger.
          </span>
        </div>
        <span className="font-bold text-emerald-800 shrink-0">100% Escrow Protected</span>
      </div>

      {/* Real Applicants Section */}
      {applicants.length > 0 && (
        <div className="space-y-4 bg-[#FAF8F2] p-6 rounded-3xl border-2 border-primary/20 shadow-soft">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <h2 className="text-lg font-black text-charcoal">
                Direct Applications Received ({applicants.length})
              </h2>
            </div>
            <span className="text-xs font-bold text-primary">Saved in MySQL job_applications</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {applicants.map((app) => {
              const isAccepted = acceptedWorkerId === app.worker_profile_id || app.application_status === 'accepted';
              return (
                <div
                  key={app.application_id}
                  className="bg-white rounded-2xl p-5 border border-stone-200 shadow-2xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={app.worker_photo}
                        alt={app.worker_name}
                        className="w-12 h-12 rounded-xl object-cover border border-primary/20"
                      />
                      <div>
                        <h4 className="font-extrabold text-sm text-charcoal">{app.worker_full_name || app.worker_name}</h4>
                        <span className="text-xs font-bold text-primary block">
                          {app.profession_name} • {app.experience_years} yrs exp
                        </span>
                        <span className="text-[10px] text-stone-500 font-mono">ID: {app.registration_id}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-black text-primary block">₹{app.expected_daily_wage}/day</span>
                      <span className="text-[10px] text-emerald-700 font-bold">★ {app.rating || 'New'}</span>
                    </div>
                  </div>

                  <p className="text-xs text-charcoal-muted bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                    "{app.notes || 'Available for immediate deployment with verified credentials.'}"
                  </p>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-[11px] text-stone-500">
                      Distance: ~{app.distance_km || 3.5} km
                    </span>

                    {isAccepted ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-900 font-bold text-xs">
                        <UserCheck size={14} />
                        <span>✓ Accepted in Team</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleAcceptApplicant(app.worker_profile_id, app.worker_full_name || app.worker_name)}
                        className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-600 text-white font-extrabold text-xs shadow-soft transition-all cursor-pointer"
                      >
                        ACCEPT & HIRE WORKER
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Matched Worker Cards Grid */}
      <div className="space-y-3">
        <h3 className="text-base font-extrabold text-charcoal">
          {jobId ? 'Available Matching Craftsmen Nearby' : 'Verified Trade Craftsmen'}
        </h3>
        {liveWorkers.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-stone-200 text-center space-y-3 shadow-soft">
            <Users size={36} className="mx-auto text-stone-400" />
            <h3 className="text-base font-black text-charcoal">No registered workers yet</h3>
            <p className="text-xs text-charcoal-muted max-w-sm mx-auto">
              When skilled workers register on NIRMAAN with verified professions and digital Work Passports, they will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {liveWorkers.map((worker) => (
              <WorkerMatchCard key={worker.id} worker={worker} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Star,
  MapPin,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  Award,
  Sparkles,
  UserCheck,
  Clock,
  Briefcase,
  Share2,
  QrCode,
  ThumbsUp,
  MessageSquare,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VerificationBadge } from '../components/common/VerificationBadge';
import { WorkerPassport } from '../components/worker/WorkerPassport';

export const HomeownerWorkerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getWorkerById, hireWorker, project, showToast } = useApp();

  const worker = id ? getWorkerById(id) : undefined;

  if (!worker) {
    return (
      <div className="space-y-6 pb-20 max-w-4xl mx-auto text-center py-16">
        <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto text-charcoal-muted">
          <Briefcase size={32} />
        </div>
        <h2 className="text-xl font-black text-charcoal">Worker Profile Not Found</h2>
        <p className="text-sm text-charcoal-muted max-w-md mx-auto">
          The requested worker profile could not be found or has not registered on the platform yet.
        </p>
        <button
          onClick={() => navigate('/homeowner/workers')}
          className="btn-primary inline-flex items-center gap-2"
        >
          <ArrowLeft size={16} /> View Available Workers
        </button>
      </div>
    );
  }

  const isAlreadyHired = project.workers.some((w) => w.id === worker.id);

  const handleHire = () => {
    hireWorker(worker.id);
    showToast(`✓ ${worker.name} successfully hired for ${project.name}!`, 'success');
    navigate(`/homeowner/project/${project.id}`);
  };

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-bold text-charcoal hover:text-primary transition-colors"
      >
        <ArrowLeft size={16} />
        <span>Back to Matches</span>
      </button>

      {/* Main Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-elevated space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-stone-200">
          <div className="flex items-start gap-5">
            <div className="relative">
              <img
                src={worker.photo}
                alt={worker.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-3 border-primary/20 shadow-md"
              />
              <div className="absolute -bottom-2 -right-2 bg-secondary text-primary font-black text-xs px-2.5 py-0.5 rounded-full border border-white shadow-xs">
                ★ {worker.rating}
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl font-black text-charcoal">{worker.name}</h1>
                <VerificationBadge level={worker.level} verified={worker.verified} size="md" />
              </div>

              <p className="text-sm font-bold text-primary">
                {worker.trade} • Level {worker.level} Artisan
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-charcoal-muted mt-2">
                <span className="flex items-center gap-1 font-semibold text-charcoal">
                  <MapPin size={13} className="text-primary" />
                  <span>{worker.city} ({worker.distanceKm || 3.2} km away)</span>
                </span>
                <span>•</span>
                <span>{worker.yearsExperience} Years Exp</span>
                <span>•</span>
                <span className="font-mono text-[11px] text-primary font-bold">
                  {worker.nirmaanId}
                </span>
              </div>
            </div>
          </div>

          {/* Rate & Availability */}
          <div className="bg-sand-100 rounded-2xl p-4 border border-stone-200/70 text-right min-w-[170px] self-start sm:self-auto">
            <span className="text-[11px] font-bold text-charcoal-muted uppercase block">
              Expected Daily Wage
            </span>
            <div className="text-2xl sm:text-3xl font-black text-primary">
              ₹{worker.expectedDailyWage}
            </div>
            <span className="text-xs text-emerald-800 font-bold block mt-0.5">
              ● Available from Tomorrow
            </span>
          </div>
        </div>

        {/* Two-Sided Reputation Section (Crucial requirement) */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-secondary-dark" />
            <h3 className="font-extrabold text-charcoal text-base">
              Two-Sided Reputation & Mutual Trust Ledger
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Side 1: Client ratings of worker */}
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3">
              <span className="text-xs font-black text-primary uppercase tracking-wider block">
                How Clients Rate {worker.name} (126 Jobs)
              </span>

              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between font-bold text-charcoal mb-1">
                    <span>Work Quality & Finish</span>
                    <span>{worker.reputation.quality} / 5.0</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(worker.reputation.quality / 5) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-charcoal mb-1">
                    <span>Punctuality & Site Discipline</span>
                    <span>{worker.reputation.punctuality} / 5.0</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(worker.reputation.punctuality / 5) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-charcoal mb-1">
                    <span>Project Completion Rate</span>
                    <span>{worker.reputation.completion} / 5.0</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(worker.reputation.completion / 5) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Side 2: Worker's experience with clients */}
            <div className="p-5 rounded-2xl bg-sand-100 border border-stone-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-charcoal uppercase tracking-wider block">
                  Worker's Experience With Clients
                </span>
                <span className="px-2 py-0.5 rounded-full bg-secondary text-primary font-black text-[10px]">
                  RECIPROCAL
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between font-bold text-charcoal mb-1">
                    <span>Payment Reliability & Timeliness</span>
                    <span>{worker.workerClientReputation.paymentReliability} / 5.0</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
                    <div
                      className="h-full bg-secondary-dark rounded-full"
                      style={{
                        width: `${(worker.workerClientReputation.paymentReliability / 5) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-charcoal mb-1">
                    <span>Site Working Conditions & Safety</span>
                    <span>{worker.workerClientReputation.siteConditions} / 5.0</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
                    <div
                      className="h-full bg-secondary-dark rounded-full"
                      style={{
                        width: `${(worker.workerClientReputation.siteConditions / 5) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-charcoal mb-1">
                    <span>Work Scope Clarity</span>
                    <span>{worker.workerClientReputation.workClarity} / 5.0</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
                    <div
                      className="h-full bg-secondary-dark rounded-full"
                      style={{
                        width: `${(worker.workerClientReputation.workClarity / 5) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Verified Skills */}
        <div className="space-y-3 pt-2">
          <h3 className="font-extrabold text-charcoal text-sm uppercase tracking-wider">
            Verified Trades & Competencies
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {worker.skills.map((s, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-charcoal block">{s.name}</span>
                  <span className="text-[10px] text-charcoal-muted">{s.level}</span>
                </div>
                <span className="flex items-center gap-1 text-[11px] text-emerald-800 font-bold">
                  <CheckCircle2 size={13} className="text-emerald-700" />
                  Verified
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Client Reviews */}
        <div className="space-y-3 pt-2">
          <h3 className="font-extrabold text-charcoal text-sm uppercase tracking-wider">
            Recent Client Testimonials
          </h3>
          <div className="space-y-3">
            {(worker.reviews || []).map((rev) => (
              <div
                key={rev.id}
                className="p-4 rounded-2xl bg-sand-50 border border-stone-200/70 space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-charcoal">{rev.clientName}</span>
                  <span className="flex items-center gap-1 font-bold text-amber-600">
                    <Star size={12} className="fill-amber-500 text-amber-500" />
                    ★ {rev.rating}
                  </span>
                </div>
                <p className="text-xs text-charcoal/90 italic">"{rev.comment}"</p>
                <div className="flex items-center gap-2 text-[10px] text-charcoal-muted pt-1">
                  <span>{rev.projectTitle}</span>
                  <span>•</span>
                  <span>{rev.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Full Official Passport View Link */}
        <div className="p-4 rounded-2xl bg-sand-100 border border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Award size={20} className="text-primary" />
            <span className="text-xs font-extrabold text-charcoal">
              View official certified Nirmaan Work Passport ledger
            </span>
          </div>
          <button
            onClick={() => navigate('/worker/passport')}
            className="text-xs font-bold text-primary hover:underline"
          >
            Open Passport
          </button>
        </div>

        {/* Hire Sticky CTA Footer */}
        <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center gap-3">
          {isAlreadyHired ? (
            <div className="w-full p-4 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-between">
              <span className="text-xs font-black text-emerald-900">
                ✓ {worker.name} is already assigned to {project.name}.
              </span>
              <button
                onClick={() => navigate(`/homeowner/project/${project.id}`)}
                className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs"
              >
                Go to Dashboard
              </button>
            </div>
          ) : (
            <button
              onClick={handleHire}
              className="w-full py-4 rounded-2xl bg-primary hover:bg-primary-600 text-white font-black text-sm shadow-soft hover:shadow-elevated transition-all flex items-center justify-center gap-2 touch-target"
            >
              <UserCheck size={18} />
              <span>HIRE THIS WORKER (₹{worker.expectedDailyWage}/DAY)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

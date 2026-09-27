import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Star,
  CheckCircle2,
  Calendar,
  Briefcase,
  Share2,
  ExternalLink,
  Award,
  QrCode,
  MapPin,
  Clock,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Camera,
  Loader2,
} from 'lucide-react';
import { Worker } from '../../types';
import { VerificationBadge } from '../common/VerificationBadge';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';

interface WorkerPassportProps {
  worker?: Worker;
  showActions?: boolean;
}

export const WorkerPassport: React.FC<WorkerPassportProps> = ({
  worker,
  showActions = true,
}) => {
  const { currentWorker, setIsQrOpen, showToast, refreshAuthUser, t } = useApp();
  const navigate = useNavigate();
  const [isUploadingPhoto, setIsUploadingPhoto] = React.useState(false);

  const data = worker || currentWorker;
  const isOwnPassport = !worker || worker.id === currentWorker.id;

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      showToast('Only JPG, PNG, and WebP images are allowed.', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('Photo must be smaller than 5 MB.', 'error');
      return;
    }

    try {
      setIsUploadingPhoto(true);
      const fd = new FormData();
      fd.append('profile_photo', file);
      const res: any = await api.post('worker/update_photo.php', fd);
      if (res.success) {
        showToast('Profile photo updated and saved to MySQL!', 'success');
        if (refreshAuthUser) {
          await refreshAuthUser();
        }
      } else {
        showToast(res.message || 'Failed to update photo', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error updating profile photo', 'error');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* THE OFFICIAL NIRMAAN WORK PASSPORT CARD */}
      <div className="passport-border bg-white rounded-3xl p-6 md:p-8 shadow-passport relative overflow-hidden">
        {/* Security & Watermark Accents */}
        <div className="absolute top-3 right-4 flex items-center gap-1.5 opacity-60">
          <span className="text-[10px] font-mono tracking-widest text-primary font-bold">
            NIRMAAN SECURE ID • {data.nirmaanId}
          </span>
        </div>

        {/* Passport Header: Photo, Name, Badge */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 pt-3 pb-6 border-b border-stone-200">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <img
                src={data.photo}
                alt={data.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-3 border-primary/20 shadow-md"
              />
              {isOwnPassport && (
                <label
                  title="Change Profile Photo"
                  className="absolute inset-0 bg-black/50 text-white rounded-2xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity backdrop-blur-2xs"
                >
                  {isUploadingPhoto ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <>
                      <Camera size={20} />
                      <span className="text-[10px] font-bold mt-1">Change</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    disabled={isUploadingPhoto}
                    onChange={handlePhotoUpload}
                  />
                </label>
              )}
              <div className="absolute -bottom-2 -right-2 bg-secondary text-primary font-black text-xs px-2 py-0.5 rounded-full border border-white shadow-xs">
                {data.totalReviews > 0 ? `★ ${data.rating}` : 'New'}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl sm:text-3xl font-black text-charcoal tracking-tight">
                  {data.name}
                </h2>
              </div>
              <div className="text-sm font-bold text-primary flex items-center gap-2 mb-2">
                <span>{data.trade ? data.trade.toUpperCase() : 'ARTISAN'} • {data.level || 'Registered'}</span>
                <span className="text-stone-300">•</span>
                <span className="text-xs text-charcoal-muted font-medium flex items-center gap-1">
                  <MapPin size={12} /> {data.city || 'Local Area'}
                </span>
              </div>
              <VerificationBadge level={data.level} verified={data.verified} size="md" />
            </div>
          </div>

          {/* Quick QR Placeholder for Instant Scanning on Site */}
          <div
            onClick={() => setIsQrOpen(true)}
            className="w-full sm:w-auto cursor-pointer p-3 rounded-2xl bg-[#FAF8F2] border border-stone-200 hover:border-primary/50 transition-all flex sm:flex-col items-center justify-between sm:justify-center gap-2 group"
          >
            <div className="w-16 h-16 bg-white rounded-xl p-1.5 border border-stone-200 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
              <QrCode size={48} className="text-primary" />
            </div>
            <div className="text-right sm:text-center">
              <span className="text-[10px] font-bold text-primary block">NIRMAAN ID</span>
              <span className="text-[9px] text-stone-500 font-mono">Scan to Verify</span>
            </div>
          </div>
        </div>

        {/* Highlight Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-5 border-b border-stone-100">
          <div className="p-3.5 rounded-2xl bg-sand-100/70 border border-stone-200/60">
            <div className="text-xs font-semibold text-charcoal-muted flex items-center gap-1">
              <Star size={13} className="text-amber-500 fill-amber-500" />
              <span>Reputation</span>
            </div>
            <div className="text-lg sm:text-xl font-black text-charcoal mt-1">
              {data.totalReviews > 0 ? `⭐ ${data.rating}` : 'No ratings yet'}
            </div>
            <div className="text-[11px] text-stone-500 font-medium">
              {data.totalReviews > 0 ? `${data.totalReviews} verified jobs` : 'Awaiting first job'}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-sand-100/70 border border-stone-200/60">
            <div className="text-xs font-semibold text-charcoal-muted flex items-center gap-1">
              <Briefcase size={13} className="text-primary" />
              <span>Jobs Done</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-charcoal mt-1">
              {data.completedJobs || 0}
            </div>
            <div className="text-[11px] text-stone-500 font-medium">All logged on ledger</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-sand-100/70 border border-stone-200/60">
            <div className="text-xs font-semibold text-charcoal-muted flex items-center gap-1">
              <Clock size={13} className="text-primary" />
              <span>Experience</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-charcoal mt-1">
              {data.yearsExperience} Yrs
            </div>
            <div className="text-[11px] text-stone-500 font-medium">Construction trade</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-sand-100/70 border border-stone-200/60">
            <div className="text-xs font-semibold text-charcoal-muted flex items-center gap-1">
              <TrendingUp size={13} className="text-success" />
              <span>Standard Wage</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-charcoal mt-1">
              ₹{data.expectedDailyWage}
              <span className="text-xs font-semibold text-stone-500">/day</span>
            </div>
            <div className="text-[11px] text-success font-bold">Standardized rate</div>
          </div>
        </div>

        {/* Section 1: Verified Skills */}
        <div className="py-5 border-b border-stone-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-extrabold text-charcoal uppercase tracking-wider flex items-center gap-2">
              <Award size={16} className="text-primary" />
              <span>{t.skillsTitle}</span>
            </h3>
            <span className="text-xs text-primary font-bold">Practical Assessment Verified</span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {data.skills.map((skill, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-primary-50/70 border border-primary/20 text-charcoal text-xs sm:text-sm font-bold shadow-2xs"
              >
                <CheckCircle2 size={16} className="text-success" />
                <span>{skill.name}</span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-white text-primary border border-primary/20">
                  {skill.verified ? 'Verified' : 'In Review'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Two-Sided Reputation Breakdown */}
        <div className="py-5 border-b border-stone-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-extrabold text-charcoal uppercase tracking-wider flex items-center gap-2">
              <Star size={16} className="text-secondary-dark fill-secondary" />
              <span>{t.reputationBreakdown}</span>
            </h3>
            <span className="text-xs text-charcoal-muted">
              {data.totalReviews > 0 ? `Based on ${data.totalReviews} verified ratings` : 'No reviews yet'}
            </span>
          </div>

          {data.totalReviews === 0 ? (
            <div className="p-8 rounded-2xl bg-[#FAF8F2] border border-dashed border-stone-300 text-center space-y-1">
              <Star size={24} className="mx-auto text-stone-400" />
              <p className="text-sm font-bold text-charcoal">No ratings yet</p>
              <p className="text-xs text-charcoal-muted max-w-sm mx-auto">
                Detailed client ratings on quality, punctuality, and reliability will be computed here after you complete your first verified project on NIRMAAN.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Client evaluation of Worker */}
              <div className="bg-[#FAF8F2] rounded-2xl p-4 border border-stone-200">
                <div className="text-xs font-black text-primary uppercase tracking-wider mb-3">
                  {t.clientRatingsTitle}
                </div>
                <div className="space-y-2.5">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-charcoal mb-1">
                      <span>{t.quality}</span>
                      <span className="font-bold">⭐ {data.reputation.quality}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${(data.reputation.quality / 5) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-charcoal mb-1">
                      <span>{t.punctuality}</span>
                      <span className="font-bold">⭐ {data.reputation.punctuality}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${(data.reputation.punctuality / 5) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-charcoal mb-1">
                      <span>{t.reliability}</span>
                      <span className="font-bold">⭐ {data.reputation.reliability}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${(data.reputation.reliability / 5) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-charcoal mb-1">
                      <span>{t.completion}</span>
                      <span className="font-bold">⭐ {data.reputation.completion}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${(data.reputation.completion / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Two-sided: Worker's Experience with Clients */}
              <div className="bg-primary-50/40 rounded-2xl p-4 border border-primary/20">
                <div className="text-xs font-black text-primary uppercase tracking-wider mb-3">
                  {t.workerExperienceWithClients}
                </div>
                <div className="space-y-2.5">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-charcoal mb-1">
                      <span>{t.paymentReliability}</span>
                      <span className="font-bold text-primary">⭐ {data.workerClientReputation.paymentReliability}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
                      <div
                        className="h-full bg-secondary-dark rounded-full transition-all duration-500"
                        style={{ width: `${(data.workerClientReputation.paymentReliability / 5) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-charcoal mb-1">
                      <span>{t.siteConditions}</span>
                      <span className="font-bold text-primary">⭐ {data.workerClientReputation.siteConditions}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
                      <div
                        className="h-full bg-secondary-dark rounded-full transition-all duration-500"
                        style={{ width: `${(data.workerClientReputation.siteConditions / 5) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-charcoal mb-1">
                      <span>{t.workClarity}</span>
                      <span className="font-bold text-primary">⭐ {data.workerClientReputation.workClarity}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-secondary-dark rounded-full transition-all duration-500"
                      style={{ width: `${(data.workerClientReputation.workClarity / 5) * 100}%` }}
                    />
                  </div>

                  <div className="pt-2 text-[11px] text-stone-600 italic">
                    Two-sided transparency protects workers from unfair delays, unsafe sites, and wage withholding.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 3: Verified Work History Snippets */}
        <div className="pt-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-extrabold text-charcoal uppercase tracking-wider flex items-center gap-2">
              <Briefcase size={16} className="text-primary" />
              <span>Verified Work History</span>
            </h3>
            <button
              onClick={() => navigate('/worker/history')}
              className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
            >
              <span>{t.viewWorkHistory}</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {!data.recentProjects || data.recentProjects.length === 0 ? (
              <div className="col-span-full p-8 rounded-2xl bg-[#FAF8F2] border border-dashed border-stone-300 text-center space-y-1">
                <Briefcase size={24} className="mx-auto text-stone-400" />
                <p className="text-sm font-bold text-charcoal">No work history yet</p>
                <p className="text-xs text-charcoal-muted">
                  Completed site milestones, client reviews, and verified photo evidence will appear here permanently.
                </p>
              </div>
            ) : (
              data.recentProjects.map((p) => (
                <div
                  key={p.id}
                  onClick={() => navigate('/worker/history')}
                  className="group cursor-pointer rounded-2xl border border-stone-200 overflow-hidden hover:border-primary/50 transition-all hover:shadow-soft bg-white"
                >
                  <div className="h-28 overflow-hidden relative">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 bg-charcoal/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      ⭐ {p.rating}
                    </div>
                    <div className="absolute bottom-2 left-2 bg-white/90 text-primary text-[10px] font-black px-1.5 py-0.5 rounded">
                      {p.year}
                    </div>
                  </div>
                  <div className="p-3">
                    <h4 className="font-extrabold text-xs text-charcoal truncate">{p.title}</h4>
                    <p className="text-[11px] text-charcoal-muted truncate mt-0.5">{p.role}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className="mt-8 pt-6 border-t border-stone-200 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/worker/history')}
              className="flex-1 py-3.5 px-5 rounded-2xl bg-sand-100 hover:bg-sand-200 border border-stone-300 text-charcoal font-bold text-sm flex items-center justify-center gap-2 touch-target transition-colors shadow-2xs"
            >
              <Briefcase size={16} />
              <span>{t.viewWorkHistory}</span>
            </button>
            <button
              onClick={() => setIsQrOpen(true)}
              className="flex-1 py-3.5 px-5 rounded-2xl bg-primary hover:bg-primary-600 text-white font-bold text-sm flex items-center justify-center gap-2 touch-target shadow-soft transition-colors"
            >
              <Share2 size={16} />
              <span>{t.sharePassport}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

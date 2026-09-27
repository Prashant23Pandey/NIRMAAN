import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  Award,
  ArrowRight,
  Share2,
  QrCode,
  Download,
  Info,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WorkerPassport } from '../components/worker/WorkerPassport';
import { NirmaanLoop } from '../components/common/NirmaanLoop';

export const WorkerPassportPage: React.FC = () => {
  const { currentWorker, setIsQrOpen, showToast, t } = useApp();
  const navigate = useNavigate();

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Passport public link copied to clipboard!', 'success');
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* Page Title & Explanation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/20 text-primary font-black text-xs mb-2">
            <Sparkles size={13} className="text-secondary-dark" />
            <span>PERMANENT DIGITAL WORK IDENTITY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal tracking-tight">
            Nirmaan Work Passport
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted">
            Tamper-proof record of verified skills, client ratings, completed sites, and work dignity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsQrOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-white border border-stone-200 hover:border-primary/40 text-charcoal text-xs font-bold shadow-2xs transition-all touch-target"
          >
            <QrCode size={16} className="text-primary" />
            <span>Show QR ID</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-primary hover:bg-primary-600 text-white text-xs font-bold shadow-soft transition-all touch-target"
          >
            <Share2 size={16} />
            <span>Share Passport</span>
          </button>
        </div>
      </div>

      {/* Main Passport Component */}
      <WorkerPassport worker={currentWorker} showActions={true} />

      {/* The Dignity Loop Connection Card */}
      <div className="bg-sand-100 rounded-3xl p-6 border border-stone-200/80 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Info size={20} />
          </div>
          <div>
            <h3 className="font-extrabold text-charcoal text-base">
              Why the Nirmaan Work Passport Matters
            </h3>
            <p className="text-xs text-charcoal-muted leading-relaxed mt-1">
              In traditional Indian construction, workers lose their reputation every time they switch
              sites or contractors. The Nirmaan Work Passport transforms daily labour into permanent,
              bankable proof of skill, unlocking higher daily wages, instant trust, and professional
              respect.
            </p>
          </div>
        </div>

        <NirmaanLoop />
      </div>
    </div>
  );
};

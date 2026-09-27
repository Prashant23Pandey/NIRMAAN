import React, { useState } from 'react';
import {
  CheckCircle2,
  Camera,
  CreditCard,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { ProjectMilestone } from '../../types';
import { useApp } from '../../context/AppContext';

interface MilestonePaymentCardProps {
  milestone?: ProjectMilestone;
  onSuccess?: () => void;
}

export const MilestonePaymentCard: React.FC<MilestonePaymentCardProps> = ({
  milestone,
  onSuccess,
}) => {
  const { project, approveMilestone, showToast } = useApp();
  const [isApproving, setIsApproving] = useState(false);

  // Default to Tile Work milestone
  const target =
    milestone ||
    project.milestones.find((m) => m.id === 'm-tile') ||
    project.milestones[0];

  const isApproved = target.status === 'approved' || target.status === 'paid';

  const handleApprove = () => {
    setIsApproving(true);
    setTimeout(() => {
      approveMilestone(target.id);
      setIsApproving(false);
      showToast('✓ Milestone approved! Payment simulated & logged to Work Passport.', 'success');
      if (onSuccess) onSuccess();
    }, 700);
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200/90 shadow-elevated">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-stone-200">
        <div>
          <span className="text-xs font-black tracking-widest text-primary uppercase">
            SIMULATED PAYMENT WORKFLOW • MILESTONE ESCROW
          </span>
          <h2 className="text-2xl font-black text-charcoal tracking-tight mt-0.5">
            {target.title}
          </h2>
          <p className="text-xs text-charcoal-muted mt-0.5">
            Craftsman: <strong className="text-charcoal">{target.workerName}</strong> • {target.trade}
          </p>
        </div>

        <div className="text-right">
          <span className="text-[10px] uppercase font-bold text-charcoal-muted block">Milestone Amount</span>
          <div className="text-2xl sm:text-3xl font-black text-primary">
            ₹{target.amount.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-0.5">
            {target.progress}% Complete
          </span>
        </div>
      </div>

      {/* Progress & Verification Seal */}
      <div className="py-6 border-b border-stone-100 space-y-4">
        <div className="flex items-center justify-between text-xs font-bold text-charcoal">
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={16} className="text-primary" />
            <span>Inspection & Quality Sign-Off</span>
          </span>
          <span className="text-emerald-700">100% Curing & Level Checked</span>
        </div>

        {target.note && (
          <div className="p-3.5 rounded-2xl bg-[#FAF8F2] border border-stone-200 text-xs text-charcoal leading-relaxed">
            <strong>Craftsman Quality Note:</strong> {target.note}
          </div>
        )}

        {/* 4 Proof Photos */}
        <div>
          <div className="flex items-center justify-between text-xs font-bold text-charcoal mb-2.5">
            <span className="flex items-center gap-1.5">
              <Camera size={14} className="text-primary" />
              <span>Cryptographic Proof of Work ({target.proofPhotos.length} Photos)</span>
            </span>
            <span className="text-[10px] text-stone-500 font-mono">Timestamp: Today 10:42 AM</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {target.proofPhotos.map((photoUrl, idx) => (
              <div key={idx} className="relative rounded-2xl overflow-hidden h-28 border border-stone-200 group">
                <img
                  src={photoUrl}
                  alt={`Proof ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-1.5 left-1.5 bg-black/60 backdrop-blur-xs text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                  Photo #{idx + 1}
                </div>
                <div className="absolute bottom-1.5 right-1.5 bg-primary/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                  ✓ Verified
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Approval or Success State */}
      <div className="pt-6">
        {isApproved ? (
          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
            <div className="w-12 h-12 rounded-full bg-success text-white flex items-center justify-center mx-auto mb-2 shadow-sm">
              <CheckCircle2 size={24} />
            </div>
            <h4 className="text-base font-black text-emerald-950">✓ MILESTONE APPROVED</h4>
            <p className="text-xs text-emerald-800 mt-1 max-w-md mx-auto">
              ₹{target.amount.toLocaleString('en-IN')} has been disbursed from escrow to {target.workerName}.
              Proof evidence has been permanently written to their Nirmaan Work Passport!
            </p>
            <div className="mt-3 text-[11px] font-semibold text-stone-500 bg-white/70 py-1 px-3 rounded-full inline-block border border-emerald-200">
              Payment flow is simulated for this hackathon prototype
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <button
              onClick={handleApprove}
              disabled={isApproving}
              className="w-full py-4 px-6 rounded-2xl bg-primary hover:bg-primary-600 active:scale-[0.99] text-white font-extrabold text-base flex items-center justify-center gap-2.5 shadow-elevated transition-all touch-target"
            >
              <CreditCard size={20} className="text-secondary" />
              <span>{isApproving ? 'VERIFYING & DISBURSING...' : 'APPROVE MILESTONE (₹6,500)'}</span>
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-charcoal-muted">
              <ShieldCheck size={14} className="text-primary" />
              <span>Simulated demo escrow payout • Instant verification on Work Passport</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

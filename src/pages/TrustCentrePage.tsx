import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  UserCheck,
  Phone,
  Award,
  Sparkles,
  Lock,
  Eye,
  HeartHandshake,
  Building,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const TrustCentrePage: React.FC = () => {
  const { setIsSosOpen, showToast } = useApp();
  const navigate = useNavigate();

  const workerVerifications = [
    {
      title: 'Worker Identity & KYC',
      status: 'Verified',
      desc: 'Government photo ID & biometric hash verification (Simulated Aadhaar API)',
      icon: UserCheck,
    },
    {
      title: 'Mobile OTP Authentication',
      status: 'Verified',
      desc: 'Active 2-factor verified phone number linked to Work Passport',
      icon: Phone,
    },
    {
      title: 'Trade & Technical Skills',
      status: 'Verified (Level 2)',
      desc: 'NSDC aligned master artisan evaluation for masonry, plumbing & electricals',
      icon: Award,
    },
    {
      title: 'Permanent Work History',
      status: 'Available',
      desc: '126 completed sites with geo-fenced attendance and timestamped photos',
      icon: FileText,
    },
    {
      title: 'Two-Sided Reputation',
      status: 'Available (4.8 / 5.0)',
      desc: 'Reciprocal rating protecting both worker dignity and client asset quality',
      icon: HeartHandshake,
    },
    {
      title: 'Digital Labour Agreement',
      status: 'Active Escrow',
      desc: 'Standardized civic-tech milestone agreement with fair daily wage guarantees',
      icon: Lock,
    },
  ];

  const clientTrustMetrics = [
    {
      metric: 'Milestone Escrow Security',
      score: '100%',
      desc: 'Wages held in trust and disbursed upon homeowner photo approval',
    },
    {
      metric: 'Site Safety Protocol',
      score: '4.8 / 5.0',
      desc: 'Mask, glove & site hydration verification for workers',
    },
    {
      metric: 'Work Scope Transparency',
      score: '4.9 / 5.0',
      desc: 'Zero hidden contractor margins; direct worker wage receipt',
    },
  ];

  return (
    <div className="space-y-8 pb-20 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-primary to-primary-800 text-white rounded-3xl p-6 sm:p-8 shadow-elevated relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-secondary font-black text-xs">
            <ShieldCheck size={14} />
            <span>INSTITUTIONAL TRUST & CIVIC GOVERNANCE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Nirmaan Trust Centre
          </h1>
          <p className="text-stone-200 text-sm max-w-xl">
            Rebuilding the informal construction ecosystem with transparency, biometric dignity,
            milestone protection, and reciprocal accountability.
          </p>
        </div>
      </div>

      {/* SOS / Emergency Trigger Card */}
      <div className="bg-red-50 rounded-3xl p-6 border-2 border-red-200 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
            <AlertTriangle size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-red-950 text-base">
                On-Site Emergency Assistance
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-red-200 text-red-800 text-[10px] font-black">
                24/7 SUPPORT
              </span>
            </div>
            <p className="text-xs text-red-800/90 mt-0.5 leading-relaxed">
              Immediate protocol trigger for accident reporting, medical helpline, site dispute
              resolution, and rapid assistance dispatch.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsSosOpen(true)}
          className="px-6 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-md transition-all touch-target shrink-0 flex items-center justify-center gap-2"
        >
          <AlertTriangle size={16} />
          <span>OPEN SOS PROTOCOL</span>
        </button>
      </div>

      {/* Worker Verification Pillars */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-extrabold text-charcoal">Worker Verification Standards</h2>
          <p className="text-xs text-charcoal-muted">
            Every artisan on Nirmaan passes strict non-negotiable credentialing before matching.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {workerVerifications.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-soft flex items-start gap-4"
              >
                <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Icon size={20} />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-extrabold text-charcoal text-sm">{item.title}</h4>
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
                      <CheckCircle2 size={11} className="text-emerald-700" />
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-charcoal-muted leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Client Trust Pillars */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-extrabold text-charcoal">Homeowner Trust & Transparency</h2>
          <p className="text-xs text-charcoal-muted">
            Protecting client investments through verified escrow and two-sided feedback.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {clientTrustMetrics.map((ct, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-soft space-y-2"
            >
              <span className="text-xs font-bold text-charcoal-muted uppercase tracking-wider block">
                {ct.metric}
              </span>
              <div className="text-2xl font-black text-primary">{ct.score}</div>
              <p className="text-xs text-charcoal/80 leading-relaxed">{ct.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Legal & Civic-Tech Compliance Disclaimer */}
      <div className="bg-sand-100 rounded-3xl p-6 border border-stone-200 text-xs text-charcoal-muted leading-relaxed space-y-2">
        <h4 className="font-extrabold text-charcoal text-sm">
          National Construction Workforce Standards Commitment
        </h4>
        <p>
          NIRMAAN operates in full compliance with the Building and Other Construction Workers (BOCW)
          welfare board guidelines, enabling workers to establish bankable digital identity and
          accident cover without intermediaries.
        </p>
      </div>
    </div>
  );
};

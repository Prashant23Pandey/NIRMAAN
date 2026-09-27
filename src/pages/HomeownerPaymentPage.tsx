import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MilestonePaymentCard } from '../components/homeowner/MilestonePaymentCard';

export const HomeownerPaymentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { project } = useApp();

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate(`/homeowner/project/${project.id}`)}
        className="inline-flex items-center gap-2 text-xs font-bold text-charcoal hover:text-primary transition-colors"
      >
        <ArrowLeft size={16} />
        <span>Back to Project Dashboard</span>
      </button>

      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/20 text-primary font-black text-xs mb-2">
          <ShieldCheck size={13} className="text-secondary-dark" />
          <span>Prototype Payment Workflow</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal tracking-tight">
          Milestone Payments (Prototype Payment Workflow)
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-muted">
          Prototype Payment Workflow: Escrow milestone release demonstration without live banking API integration.
        </p>
      </div>

      {/* Main Focus Milestone Card */}
      <MilestonePaymentCard />

      {/* All Milestones Schedule */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-soft space-y-4">
        <h3 className="font-extrabold text-charcoal text-base">Project Milestone Schedule</h3>

        <div className="divide-y divide-stone-100">
          {project.milestones.map((m) => {
            const isDone = m.status === 'approved' || m.status === 'paid';
            return (
              <div
                key={m.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      isDone
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {isDone ? '✓' : '●'}
                  </div>
                  <div>
                    <h4 className="font-bold text-charcoal text-sm">{m.title}</h4>
                    <p className="text-xs text-charcoal-muted">
                      {m.workerName} ({m.trade}) • {m.proofPhotos.length} site photos attached
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <span className="text-base font-black text-primary">
                    ₹{m.amount.toLocaleString()}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      isDone
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-50 text-amber-900 border border-amber-200'
                    }`}
                  >
                    {isDone ? 'Paid & Verified' : 'Ready to Release'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

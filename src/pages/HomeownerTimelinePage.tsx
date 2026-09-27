import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProofTimeline } from '../components/homeowner/ProofTimeline';

export const HomeownerTimelinePage: React.FC = () => {
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

      {/* Proof Timeline Component */}
      <ProofTimeline />

      {/* Bottom CTA to Payments */}
      <div className="p-5 rounded-3xl bg-sand-100 border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-extrabold text-charcoal text-sm">
            Ready to release payment for approved work?
          </h4>
          <p className="text-xs text-charcoal-muted mt-0.5">
            Tile installation milestone (₹6,500) has 4 verified photo proofs ready for approval.
          </p>
        </div>
        <button
          onClick={() => navigate(`/homeowner/project/${project.id}/payment`)}
          className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-xs shadow-soft hover:bg-primary-600 transition-colors shrink-0"
        >
          Review Milestone Payment
        </button>
      </div>
    </div>
  );
};

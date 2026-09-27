import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRightLeft, Sparkles, ShieldCheck } from 'lucide-react';
import { ComparisonTable } from '../components/homeowner/ComparisonTable';

export const HomeownerComparePage: React.FC = () => {
  const navigate = useNavigate();

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

      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/20 text-primary font-black text-xs mb-2">
          <ArrowRightLeft size={13} className="text-secondary-dark" />
          <span>SIDE-BY-SIDE EVALUATION</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal tracking-tight">
          Compare Artisans
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-muted">
          Transparent metrics across verified trade skills, site distance, daily rates, and client ratings.
        </p>
      </div>

      {/* Comparison Table Component */}
      <ComparisonTable />
    </div>
  );
};

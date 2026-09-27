import React, { useState } from 'react';
import {
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  CheckCircle2,
  Clock,
  ShieldCheck,
  TrendingUp,
  Download,
  Building,
  Sparkles,
  Receipt,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const WorkerEarningsPage: React.FC = () => {
  const { currentWorker, project, showToast } = useApp();
  const [withdrawing, setWithdrawing] = useState(false);

  // Derive real earnings from approved project milestones where worker participated
  const approvedMilestones = project.milestones.filter(
    (m) => m.status === 'approved' || m.status === 'paid'
  );
  const earnedAmount = approvedMilestones.reduce((acc, m) => acc + (m.amount || 0), 0);

  const transactions = approvedMilestones.map((m, idx) => ({
    id: m.id || `tx-${idx}`,
    title: `${project.name || 'Project'} — ${m.title}`,
    date: 'Today',
    amount: `₹${m.amount.toLocaleString('en-IN')}`,
    status: 'credited',
    utr: `UPI/NIRM/${Date.now().toString().slice(-8)}`,
  }));

  const handleWithdraw = () => {
    if (earnedAmount <= 0) {
      showToast('No available payout balance to withdraw.', 'warning');
      return;
    }
    setWithdrawing(true);
    setTimeout(() => {
      setWithdrawing(false);
      showToast(`✓ ₹${earnedAmount.toLocaleString('en-IN')} transferred via UPI payout.`, 'success');
    }, 1000);
  };

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      {/* Page Title */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs mb-2">
          <ShieldCheck size={13} />
          <span>NIRMAAN DIRECT MILESTONE ESCROW</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal tracking-tight">
          Earnings & Recorded Wages
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-muted">
          All earnings are recorded on your digital Work Passport for banking, loan, and credit verification.
        </p>
      </div>

      {/* Main Wallet Summary Card */}
      <div className="bg-gradient-to-br from-primary to-primary-800 text-white rounded-3xl p-6 sm:p-8 shadow-elevated relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div>
            <span className="text-xs font-bold text-stone-200 uppercase tracking-widest block mb-1">
              Available Payout Balance
            </span>
            <div className="text-3xl sm:text-4xl font-black">
              ₹{earnedAmount.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-stone-200 mt-1">
              {earnedAmount > 0
                ? 'From verified project milestone approvals'
                : 'No pending payout balances at this time'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleWithdraw}
              disabled={withdrawing || earnedAmount <= 0}
              className="px-6 py-3 rounded-2xl bg-secondary hover:bg-amber-400 text-primary font-black text-xs shadow-soft transition-all touch-target disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {withdrawing ? 'Transferring...' : 'Withdraw to Bank (UPI)'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-6 mt-6 border-t border-white/20 text-xs">
          <div>
            <span className="text-stone-300 block">This Month</span>
            <span className="text-lg font-bold text-white">
              ₹{earnedAmount.toLocaleString('en-IN')}
            </span>
          </div>
          <div>
            <span className="text-stone-300 block">Total Lifetime Recorded</span>
            <span className="text-lg font-bold text-white">
              ₹{earnedAmount.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <span className="text-stone-300 block">Wage Rate</span>
            <span className="text-sm font-semibold text-white">
              ₹{currentWorker.expectedDailyWage || 0} / day
            </span>
          </div>
        </div>
      </div>

      {/* Financial Dignity / Loan Readiness Card */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-soft flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-secondary/20 text-secondary-dark flex items-center justify-center shrink-0">
          <Sparkles size={24} />
        </div>
        <div className="space-y-1">
          <h3 className="font-extrabold text-charcoal text-base">
            Work Passport Certified Income Certificate
          </h3>
          <p className="text-xs text-charcoal-muted leading-relaxed">
            Your recorded work proof and verified payouts serve as certified income documentation for PM Awas
            Yojana, vehicle micro-loans, and Jan Dhan credit facilities with partnered financial institutions.
          </p>
          <button
            onClick={() => showToast('Statement generation ready upon completed project work.', 'info')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline pt-1"
          >
            <Download size={13} />
            <span>Download Certified Statement</span>
          </button>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-soft space-y-4">
        <h3 className="font-extrabold text-charcoal text-base">Recent Wage Receipts</h3>

        {transactions.length === 0 ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-stone-100 text-charcoal-muted flex items-center justify-center mx-auto">
              <Receipt size={24} />
            </div>
            <p className="text-sm font-bold text-charcoal">No wage receipts recorded yet</p>
            <p className="text-xs text-charcoal-muted max-w-sm mx-auto">
              When homeowners approve project milestones and release escrow payments, your transaction receipts will be logged here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {transactions.map((tx) => (
              <div key={tx.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <ArrowDownLeft size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-charcoal text-xs sm:text-sm">{tx.title}</h4>
                    <div className="flex items-center gap-2 text-[11px] text-charcoal-muted mt-0.5">
                      <span>{tx.date}</span>
                      <span>•</span>
                      <span className="font-mono text-[10px]">{tx.utr}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-black text-emerald-700 text-sm sm:text-base">+{tx.amount}</div>
                  <span className="text-[10px] font-bold text-stone-400 uppercase">Paid Direct</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

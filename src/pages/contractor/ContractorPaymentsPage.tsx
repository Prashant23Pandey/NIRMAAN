import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle2, ShieldCheck, ArrowDownLeft } from 'lucide-react';
import { api } from '../../services/api';

export const ContractorPaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    api
      .get('payments/list.php')
      .then((res: any) => {
        if (res.success) setPayments(res.payments || []);
      })
      .catch(() => {
        setPayments([]);
      });
  }, []);

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-charcoal tracking-tight">
          Contractor Escrow & Wage Disbursements
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-muted">
          All milestones are protected via smart escrow and released upon homeowner photo proof sign-off.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 shadow-soft overflow-hidden">
        {payments.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <CreditCard size={36} className="mx-auto text-stone-400" />
            <h3 className="text-base font-black text-charcoal">No payment transactions yet</h3>
            <p className="text-xs text-charcoal-muted max-w-sm mx-auto">
              When milestone payments are funded in escrow or released to artisans, financial receipts will be logged here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F2] border-b border-stone-200 text-charcoal uppercase text-[10px] font-extrabold tracking-wider">
                <tr>
                  <th className="p-4">Project</th>
                  <th className="p-4">Milestone</th>
                  <th className="p-4">Recipient Artisan</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">UTR Reference</th>
                  <th className="p-4">Escrow Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-50/80">
                    <td className="p-4 font-extrabold text-charcoal">{p.project_name}</td>
                    <td className="p-4 font-semibold text-charcoal">{p.milestone_title || 'Site Milestone'}</td>
                    <td className="p-4 text-primary font-bold">{p.worker_name}</td>
                    <td className="p-4 font-black text-charcoal">₹{Number(p.amount).toLocaleString('en-IN')}</td>
                    <td className="p-4 font-mono text-[10px] text-stone-500">{p.utr_number}</td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          p.status === 'released'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

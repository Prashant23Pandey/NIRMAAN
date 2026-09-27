import React, { useState, useEffect } from 'react';
import { ShieldCheck, Check, X, AlertCircle, RefreshCw, FileText, ExternalLink } from 'lucide-react';
import { api } from '../../services/api';
import { useApp } from '../../context/AppContext';

export const AdminVerificationPage: React.FC = () => {
  const { showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'all' | 'identity' | 'skills' | 'documents'>('all');
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = () => {
    setLoading(true);
    api
      .get('admin/verification.php', {
        type: activeTab === 'all' ? '' : activeTab,
      })
      .then((res: any) => {
        if (res.success) setRequests(res.verification_requests);
      })
      .catch((err) => {
        console.warn('Verification API notice:', err.message);
        setRequests([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRequests();
  }, [activeTab]);

  const handleUpdateStatus = async (
    id: number,
    status: 'approved' | 'rejected' | 'needs_correction'
  ) => {
    try {
      await api.post('admin/verification.php', {
        request_id: id,
        status,
        remarks: `Updated by Super Admin: ${status}`,
      });
      showToast(`✓ Verification status updated to ${status} in MySQL`, 'success');
      fetchRequests();
    } catch (err: any) {
      showToast(`Simulated status update: ${status}`, 'info');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-extrabold text-[11px] mb-2">
            <ShieldCheck size={13} className="text-amber-700" />
            <span>Prototype Verification</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-charcoal tracking-tight">
            Artisan Credential & Skill Verification (Prototype Verification)
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted">
            Institutional verification queue for artisan identity and technical certifications. Evaluated in sandbox prototype mode.
          </p>
        </div>

        <button
          onClick={fetchRequests}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-stone-300 text-charcoal text-xs font-bold hover:border-primary transition-colors self-start sm:self-auto"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        {(['all', 'identity', 'skills', 'documents'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              activeTab === tab
                ? 'bg-primary text-white shadow-soft'
                : 'text-charcoal hover:bg-stone-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Verification Requests Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
        {requests.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <ShieldCheck size={36} className="mx-auto text-stone-400" />
            <h3 className="text-base font-black text-charcoal">No verification requests found</h3>
            <p className="text-xs text-charcoal-muted max-w-sm mx-auto">
              When new workers register or submit verification documents, they will appear here for administrator review and approval.
            </p>
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F2] border-b border-stone-200 text-charcoal uppercase text-[10px] font-extrabold tracking-wider">
              <tr>
                <th className="p-4">Artisan</th>
                <th className="p-4">Profession</th>
                <th className="p-4">Document / Certification</th>
                <th className="p-4">Submission Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Verification Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {requests.map((r) => (
                <tr key={r.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="p-4">
                    <span className="font-extrabold text-charcoal block">{r.worker_name}</span>
                    <span className="font-mono text-[10px] text-primary">{r.nirmaan_id}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-charcoal">{r.profession_name}</span>
                    <span className="text-[10px] text-charcoal-muted block">{r.level}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 font-semibold text-charcoal">
                      <FileText size={14} className="text-primary" />
                      <span>{r.document_type}</span>
                    </div>
                    {r.remarks && (
                      <span className="text-[10px] text-stone-400 block mt-0.5">{r.remarks}</span>
                    )}
                  </td>
                  <td className="p-4 font-mono text-[11px] text-charcoal-muted">{r.created_at}</td>
                  <td className="p-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        r.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : r.status === 'pending'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-red-100 text-red-900'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleUpdateStatus(r.id, 'approved')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-700 text-white font-bold text-[10px] hover:bg-emerald-800 transition-colors flex items-center gap-1"
                      >
                        <Check size={12} />
                        <span>Approve</span>
                      </button>

                      <button
                        onClick={() => handleUpdateStatus(r.id, 'rejected')}
                        className="px-2.5 py-1 rounded-lg bg-stone-100 text-charcoal font-bold text-[10px] hover:bg-red-100 hover:text-red-800 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        </div>
      </div>
    </div>
  );
};

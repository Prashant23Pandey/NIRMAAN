import React, { useState, useEffect } from 'react';
import { ShieldCheck, Clock, FileText, UserCheck, RefreshCw, Key, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';

export const AdminLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = () => {
    setLoading(true);
    api
      .get<{ logs: any[] }>('admin/logs.php')
      .then((res) => {
        if (res.logs) setLogs(res.logs);
      })
      .catch((err) => {
        console.warn('Logs notice:', err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6 pb-16 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-900 font-extrabold text-[11px] mb-2">
            <ShieldCheck size={13} className="text-primary" />
            <span>AUDIT & GOVERNANCE LOGS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-charcoal tracking-tight">
            Administrative Audit Trail
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted">
            Immutable log of system modifications, artisan verification sign-offs, dispute arbitrations, and role changes recorded in <code>admin_logs</code>.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-stone-300 text-charcoal text-xs font-bold hover:border-primary transition-colors shadow-2xs self-start sm:self-auto touch-target"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Logs</span>
        </button>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F2] border-b border-stone-200 text-stone-700 uppercase text-[10px] font-black tracking-wider">
              <tr>
                <th className="p-4 w-12">#</th>
                <th className="p-4">Action</th>
                <th className="p-4">Administrator</th>
                <th className="p-4">Target Entity</th>
                <th className="p-4">Details</th>
                <th className="p-4">IP Address</th>
                <th className="p-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-sans">
              {logs.map((log: any, idx: number) => (
                <tr key={log.id || idx} className="hover:bg-stone-50/70 transition-colors">
                  <td className="p-4 font-mono text-stone-400 font-bold">{idx + 1}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-xl bg-primary/10 text-primary font-bold font-mono text-xs">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 font-extrabold text-charcoal">
                    {log.admin_name || 'Super Administrator'}
                  </td>
                  <td className="p-4 font-mono text-[11px] text-stone-600">
                    {log.entity_type} #{log.entity_id}
                  </td>
                  <td className="p-4 text-stone-700 max-w-sm">{log.details}</td>
                  <td className="p-4 font-mono text-stone-400">{log.ip_address || '127.0.0.1'}</td>
                  <td className="p-4 font-mono text-stone-500 whitespace-nowrap">
                    {log.created_at}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

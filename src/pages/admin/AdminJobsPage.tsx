import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin } from 'lucide-react';
import { api } from '../../services/api';

export const AdminJobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    api
      .get('jobs/list.php')
      .then((res: any) => {
        if (res.success) setJobs(res.jobs || []);
      })
      .catch(() => {
        setJobs([]);
      });
  }, []);

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-charcoal tracking-tight">
          Platform Job Postings
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-muted">
          Active, accepted, and completed construction job requisitions from clients and contractors.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 shadow-soft overflow-hidden">
        {jobs.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Briefcase size={36} className="mx-auto text-stone-400" />
            <h3 className="text-base font-black text-charcoal">No job requisitions posted yet</h3>
            <p className="text-xs text-charcoal-muted max-w-sm mx-auto">
              When clients or contractors post skilled trade jobs, they will be listed and monitored here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F2] border-b border-stone-200 text-charcoal uppercase text-[10px] font-extrabold tracking-wider">
                <tr>
                  <th className="p-4">Job ID</th>
                  <th className="p-4">Title & Trade</th>
                  <th className="p-4">Client</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Daily Wage</th>
                  <th className="p-4">Workers</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Posted Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {jobs.map((j) => (
                  <tr key={j.id} className="hover:bg-stone-50/80">
                    <td className="p-4 font-mono font-bold text-primary">#JOB-00{j.id}</td>
                    <td className="p-4">
                      <span className="font-extrabold text-charcoal block">{j.title}</span>
                      <span className="text-[10px] font-bold text-primary">{j.profession_name || j.category}</span>
                    </td>
                    <td className="p-4 font-semibold text-charcoal">{j.client_name}</td>
                    <td className="p-4 text-charcoal-muted">{j.location}</td>
                    <td className="p-4 font-black text-charcoal">₹{Number(j.daily_wage || j.budget).toLocaleString('en-IN')}/day</td>
                    <td className="p-4 text-charcoal font-bold">{j.workers_needed || 1} required</td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          j.status === 'accepted'
                            ? 'bg-blue-100 text-blue-900'
                            : j.status === 'open'
                            ? 'bg-emerald-100 text-emerald-900'
                            : 'bg-stone-200 text-stone-700'
                        }`}
                      >
                        ● {j.status}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-[11px] text-charcoal-muted">{j.created_at || 'Today'}</td>
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

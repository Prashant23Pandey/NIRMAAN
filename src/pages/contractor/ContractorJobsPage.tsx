import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, MapPin, Calendar, Clock } from 'lucide-react';
import { api } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export const ContractorJobsPage: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    api
      .get('jobs/list.php')
      .then((res: any) => {
        if (res.success) setJobs(res.jobs);
      })
      .catch(() => {
        setJobs([
          { id: 1, title: 'Master Mason for Bathroom Renovation', profession_name: 'Mason', location: 'Sector 62, Noida', daily_wage: 850, duration_days: 6, status: 'open' },
          { id: 2, title: 'Concealed Wiring & DB Setup', profession_name: 'Electrician', location: 'Sector 50, Noida', daily_wage: 900, duration_days: 5, status: 'open' },
          { id: 3, title: 'Modular Kitchen Assembly', profession_name: 'Carpenter', location: 'Sector 18, Noida', daily_wage: 950, duration_days: 4, status: 'open' },
        ]);
      });
  }, []);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-charcoal tracking-tight">
            Site Jobs & Subcontract Postings
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted">
            Broadcast openings to verified artisans with geo-fenced mobile notifications.
          </p>
        </div>

        <button
          onClick={() => navigate('/homeowner/project/new')}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-white font-extrabold text-xs shadow-soft"
        >
          <Plus size={16} />
          <span>Post New Trade Requirement</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {jobs.map((j) => (
          <div key={j.id} className="bg-white rounded-3xl p-6 border border-stone-200 shadow-soft space-y-3">
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-primary/10 text-primary">
              {j.profession_name || 'Trade Job'}
            </span>
            <h3 className="font-extrabold text-charcoal text-base">{j.title}</h3>
            <p className="text-xs text-charcoal-muted flex items-center gap-1.5">
              <MapPin size={13} className="text-primary" />
              <span>{j.location}</span>
            </p>
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
              <span className="text-sm font-black text-primary">₹{j.daily_wage}/day</span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                ● {j.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

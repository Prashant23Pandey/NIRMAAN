import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Star, ArrowRight, Plus } from 'lucide-react';
import { api } from '../../services/api';

export const ContractorTeamPage: React.FC = () => {
  const [workers, setWorkers] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get('contractor/dashboard.php')
      .then((res: any) => {
        if (res.success) setWorkers(res.workers || []);
      })
      .catch(() => {
        setWorkers([]);
      });
  }, []);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-charcoal tracking-tight">
            Workforce Roster & Team Dispatch
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted">
            Craftsmen assigned to active contractor projects with certified digital Work Passports.
          </p>
        </div>

        <button
          onClick={() => navigate('/homeowner/workers')}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-white font-extrabold text-xs shadow-soft"
        >
          <Plus size={14} />
          <span>Deploy Worker</span>
        </button>
      </div>

      {workers.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-stone-200 text-center space-y-3 shadow-soft">
          <Users size={36} className="mx-auto text-stone-400" />
          <h3 className="text-base font-black text-charcoal">No workers in team roster yet</h3>
          <p className="text-xs text-charcoal-muted max-w-sm mx-auto">
            Browse verified artisans with digital Work Passports to assemble and deploy your project team.
          </p>
          <button
            onClick={() => navigate('/homeowner/workers')}
            className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-1.5 font-bold"
          >
            Find Skilled Workers
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {workers.map((w: any) => (
            <div
              key={w.id}
              className="bg-white rounded-3xl p-6 border border-stone-200 shadow-soft space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-sand-200 text-charcoal font-black text-[10px] uppercase">
                    {w.trade_name}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-bold text-amber-600">
                    <Star size={12} className="fill-amber-500 text-amber-500" />
                    ★ {w.rating}
                  </span>
                </div>

                <h3 className="text-lg font-black text-charcoal">{w.worker_name}</h3>
                <span className="font-mono text-[10px] text-primary font-bold block mb-2">
                  {w.nirmaan_id}
                </span>

                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/60 text-xs space-y-1">
                  <span className="text-charcoal-muted block">Current Site:</span>
                  <span className="font-bold text-charcoal block truncate">{w.project_name}</span>
                  <span className="text-primary font-bold block mt-1">₹{w.daily_wage}/day</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/worker/passport')}
                className="w-full py-2.5 rounded-xl bg-sand-200 hover:bg-sand-300 text-charcoal font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>View Certified Passport</span>
                <ArrowRight size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

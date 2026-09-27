import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderKanban, MapPin, ArrowRight, Plus } from 'lucide-react';
import { api } from '../../services/api';

export const ContractorProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get('projects/list.php')
      .then((res: any) => {
        if (res.success) setProjects(res.projects || []);
      })
      .catch(() => {
        setProjects([]);
      });
  }, []);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-charcoal tracking-tight">
            Contractor Project Portfolio
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted">
            Commercial and residential construction sites under active supervision.
          </p>
        </div>

        <button
          onClick={() => navigate('/homeowner/project/new')}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-white font-extrabold text-xs shadow-soft"
        >
          <Plus size={16} />
          <span>New Project Site</span>
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-stone-200 text-center space-y-3 shadow-soft">
          <FolderKanban size={36} className="mx-auto text-stone-400" />
          <h3 className="text-base font-black text-charcoal">No projects created yet</h3>
          <p className="text-xs text-charcoal-muted max-w-sm mx-auto">
            Initialize your first construction site contract to manage milestones, artisan rosters, and progress evidence.
          </p>
          <button
            onClick={() => navigate('/homeowner/project/new')}
            className="btn-primary text-xs py-2.5 px-4 inline-flex items-center gap-1.5 font-bold"
          >
            Create Project Site
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-3xl p-6 border border-stone-200 shadow-soft space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                    {p.category}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                    ● {p.status}
                  </span>
                </div>

                <h3 className="text-xl font-black text-charcoal">{p.name}</h3>
                <p className="text-xs text-charcoal-muted flex items-center gap-1.5 mt-1">
                  <MapPin size={13} className="text-primary" />
                  <span>{p.location}</span>
                </p>

                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-charcoal">
                    <span>Progress</span>
                    <span className="text-primary">{p.progress_percent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${p.progress_percent}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold">
                <span className="text-charcoal-muted">
                  Budget: ₹{Number(p.budget).toLocaleString('en-IN')}
                </span>
                <button
                  onClick={() => navigate(`/homeowner/project/${p.id}`)}
                  className="text-primary hover:underline flex items-center gap-1"
                >
                  <span>Site Details</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

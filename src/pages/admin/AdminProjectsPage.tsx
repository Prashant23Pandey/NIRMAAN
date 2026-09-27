import React, { useState, useEffect } from 'react';
import { FolderKanban, MapPin } from 'lucide-react';
import { api } from '../../services/api';

export const AdminProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);

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
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-charcoal tracking-tight">
          Supervised Construction Projects
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-muted">
          Active sites, escrow utilization, contractor assignment, and completion progress.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 shadow-soft overflow-hidden">
        {projects.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <FolderKanban size={36} className="mx-auto text-stone-400" />
            <h3 className="text-base font-black text-charcoal">No construction projects yet</h3>
            <p className="text-xs text-charcoal-muted max-w-sm mx-auto">
              When clients or contractors initialize new construction projects on NIRMAAN, they will be supervised here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F2] border-b border-stone-200 text-charcoal uppercase text-[10px] font-extrabold tracking-wider">
                <tr>
                  <th className="p-4">Project</th>
                  <th className="p-4">Client</th>
                  <th className="p-4">Contractor</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Progress</th>
                  <th className="p-4">Budget / Spent</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {projects.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-50/80">
                    <td className="p-4 font-extrabold text-charcoal">{p.name}</td>
                    <td className="p-4 text-charcoal">{p.client_name}</td>
                    <td className="p-4 text-primary font-bold">{p.contractor_name || 'Direct Client'}</td>
                    <td className="p-4 text-charcoal-muted">{p.location}</td>
                    <td className="p-4 font-black text-primary">{p.progress_percent}%</td>
                    <td className="p-4 font-mono">
                      ₹{Number(p.spent).toLocaleString('en-IN')} / ₹{Number(p.budget).toLocaleString('en-IN')}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold">
                        ● {p.status}
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

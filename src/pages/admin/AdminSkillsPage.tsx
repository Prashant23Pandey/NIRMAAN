import React, { useState, useEffect } from 'react';
import { Wrench, Plus, X, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';
import { useApp } from '../../context/AppContext';

export const AdminSkillsPage: React.FC = () => {
  const { showToast } = useApp();
  const [skills, setSkills] = useState<any[]>([]);
  const [professions, setProfessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Skill
  const [professionId, setProfessionId] = useState(1);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const fetchSkills = () => {
    setLoading(true);
    api
      .get('skills/list.php')
      .then((res: any) => {
        if (res.success) setSkills(res.skills);
      })
      .catch(() => {
        setSkills([
          { id: 1, name: 'Brickwork', profession_name: 'Mason', description: 'Clay brick and fly-ash brick laying' },
          { id: 2, name: 'Plaster', profession_name: 'Mason', description: 'Smooth wall sand-cement plaster finish' },
          { id: 6, name: 'Conduit Wiring', profession_name: 'Electrician', description: 'Concealed PVC pipe copper cable pulling' },
          { id: 7, name: 'DB Installation', profession_name: 'Electrician', description: 'Distribution board and MCB dressing' },
          { id: 11, name: 'Pipe Fitting', profession_name: 'Plumber', description: 'Concealed CPVC/UPVC water line connections' },
          { id: 12, name: 'Bathroom Sanitary', profession_name: 'Plumber', description: 'Wall-hung commode and diverter installation' },
        ]);
      })
      .finally(() => setLoading(false));

    api
      .get('professions/list.php')
      .then((res: any) => {
        if (res.success) setProfessions(res.professions);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await api.post('skills/create.php', {
        profession_id: professionId,
        name,
        description,
      });
      showToast(`Skill '${name}' added to profession in MySQL!`, 'success');
      setName('');
      setDescription('');
      setShowAddModal(false);
      fetchSkills();
    } catch {
      showToast('Skill added (simulated)', 'info');
      setShowAddModal(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-charcoal tracking-tight">
            Trade Skills & Competencies Matrix
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted">
            Configure technical skills assigned to professions. Verified on artisan Work Passports.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-600 text-white font-extrabold text-xs shadow-soft transition-all"
        >
          <Plus size={16} />
          <span>ADD SKILL</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F2] border-b border-stone-200 text-charcoal uppercase text-[10px] font-extrabold tracking-wider">
              <tr>
                <th className="p-4">Skill Name</th>
                <th className="p-4">Assigned Profession</th>
                <th className="p-4">Competency Description</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {skills.map((s) => (
                <tr key={s.id} className="hover:bg-stone-50/80">
                  <td className="p-4 font-extrabold text-charcoal">{s.name}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-sand-200 font-bold text-charcoal text-[10px] uppercase">
                      {s.profession_name}
                    </span>
                  </td>
                  <td className="p-4 text-charcoal-muted max-w-sm">{s.description}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold">
                      ● Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-black text-charcoal text-lg">Add Trade Skill</h3>
              <button onClick={() => setShowAddModal(false)} className="text-stone-400 hover:text-stone-700">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-charcoal block">Assign to Profession</label>
                <select
                  value={professionId}
                  onChange={(e) => setProfessionId(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs font-semibold"
                >
                  {professions.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-charcoal block">Skill Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Laser Alignment, Hydro-Testing"
                  className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-charcoal block">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-primary hover:bg-primary-600 text-white font-black text-xs shadow-soft"
              >
                SAVE SKILL TO MYSQL
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

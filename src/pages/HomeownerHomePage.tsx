import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  Hammer,
  BrickWall,
  Paintbrush,
  Zap,
  Droplets,
  Plus,
  Bot,
  Sparkles,
  ShieldCheck,
  Users,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProjectCard } from '../components/homeowner/ProjectCard';

export const HomeownerHomePage: React.FC = () => {
  const { projects, workers, t, currentUser } = useApp();
  const navigate = useNavigate();

  const categories = [
    {
      id: 'new_home',
      name: 'New Home',
      icon: Home,
      desc: 'Complete construction from foundation to roof',
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    {
      id: 'renovation',
      name: 'Renovation',
      icon: Hammer,
      desc: 'Bathroom, kitchen, or complete floor remodel',
      color: 'bg-amber-50 text-amber-900 border-amber-200',
    },
    {
      id: 'repair',
      name: 'Repair',
      icon: BrickWall,
      desc: 'Crack repair, plastering & structural masonry',
      color: 'bg-orange-50 text-orange-900 border-orange-200',
    },
    {
      id: 'painting',
      name: 'Painting',
      icon: Paintbrush,
      desc: 'Interior, exterior, texture & waterproofing',
      color: 'bg-teal-50 text-teal-900 border-teal-200',
    },
    {
      id: 'electrical',
      name: 'Electrical',
      icon: Zap,
      desc: 'Conduit wiring, DB dressing & lighting fitting',
      color: 'bg-yellow-50 text-yellow-900 border-yellow-200',
    },
    {
      id: 'plumbing',
      name: 'Plumbing',
      icon: Droplets,
      desc: 'Sanitary fittings, CPVC piping & leak repairs',
      color: 'bg-blue-50 text-blue-900 border-blue-200',
    },
  ];

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/homeowner/ai-assistant?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-primary to-primary-700 text-white rounded-3xl p-6 sm:p-8 shadow-elevated relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-secondary font-black text-xs">
              <Sparkles size={13} />
              <span>NIRMAAN VERIFIED WORKFORCE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {t.goodMorning}{currentUser?.name ? `, ${currentUser.name.split(' ')[0]}` : ''} 👋
            </h1>
            <p className="text-stone-200 text-sm max-w-md">
              Hire verified artisans with digital Work Passports. Milestone-protected payments and
              transparent daily site progress.
            </p>
          </div>

          <button
            onClick={() => navigate('/homeowner/project/new')}
            className="self-start md:self-auto px-5 py-3.5 rounded-2xl bg-secondary hover:bg-amber-400 text-primary font-black text-xs shadow-soft transition-all flex items-center gap-2 touch-target"
          >
            <Plus size={18} />
            <span>{t.createProject}</span>
          </button>
        </div>
      </div>

      {/* AI Assistant Banner / Prompt */}
      <div
        onClick={() => navigate('/homeowner/ai-assistant')}
        className="bg-white rounded-3xl p-6 border-2 border-secondary/60 shadow-soft hover:shadow-elevated transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-secondary/20 text-secondary-dark flex items-center justify-center shrink-0">
            <Bot size={26} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-charcoal">
                Need help scoping your construction work?
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-secondary text-primary text-[10px] font-black">
                SMART AI
              </span>
            </div>
            <p className="text-xs text-charcoal-muted mt-0.5">
              Tell our assistant in Hindi or English (e.g. "Mujhe bathroom renovate karwana hai") to
              instantly calculate required workers & budget.
            </p>
          </div>
        </div>

        <button className="px-4 py-2.5 rounded-xl bg-primary text-white font-bold text-xs shrink-0 flex items-center gap-1.5 touch-target shadow-xs">
          <span>Try AI Assistant</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Large Categories: "What are you building?" */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-extrabold text-charcoal">{t.whatAreYouBuilding}</h2>
          <p className="text-xs text-charcoal-muted">
            Select a project category to configure requirements or match verified craftsmen.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat.name)}
                className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-soft hover:border-primary/50 hover:shadow-elevated transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 border ${cat.color} group-hover:scale-105 transition-transform`}
                  >
                    <Icon size={24} />
                  </div>
                  <h3 className="font-extrabold text-charcoal text-base group-hover:text-primary transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-charcoal-muted mt-1 leading-relaxed">{cat.desc}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-primary">
                  <span>Explore workers</span>
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* My Projects Section â€” Real MySQL data for this homeowner */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-charcoal">{t.myProjects}</h2>
            <p className="text-xs text-charcoal-muted">
              Active construction sites and milestone approvals
            </p>
          </div>
          <button
            onClick={() => navigate('/homeowner/project/new')}
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            <Plus size={13} />
            <span>New Project</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.length === 0 ? (
            <>
              {/* Empty state card */}
              <div className="bg-white rounded-3xl p-8 border border-dashed border-stone-300 text-center space-y-3 flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-primary flex items-center justify-center">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <h3 className="text-base font-black text-charcoal">No projects yet</h3>
                  <p className="text-xs text-charcoal-muted mt-1">
                    Create your first project to find skilled workers.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/homeowner/project/new')}
                  className="btn-primary text-xs py-2.5 px-4 inline-flex items-center gap-1.5 font-bold"
                >
                  Create Project
                </button>
              </div>

              {/* Find Workers card */}
              <div className="bg-sand-100 rounded-3xl p-6 border border-stone-200/90 shadow-soft flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <Users size={20} />
                  </div>
                  <h3 className="text-lg font-black text-charcoal">Need Craftsmen?</h3>
                  <p className="text-xs text-charcoal-muted leading-relaxed">
                    Browse our verified database of artisans with Work Passports, attendance track
                    records, and two-sided reputation scores.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/homeowner/workers')}
                  className="mt-6 w-full py-3 px-4 rounded-xl bg-primary hover:bg-primary-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 touch-target shadow-soft transition-colors"
                >
                  <span>{t.findMatchingWorkers}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Render all the homeowner's real projects from MySQL */}
              {projects.map((proj) => (
                <ProjectCard key={proj.id} project={proj} />
              ))}

              {/* Find Workers card always shows alongside */}
              <div className="bg-sand-100 rounded-3xl p-6 border border-stone-200/90 shadow-soft flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <Users size={20} />
                  </div>
                  <h3 className="text-lg font-black text-charcoal">Need Additional Craftsmen?</h3>
                  <p className="text-xs text-charcoal-muted leading-relaxed">
                    Browse our verified database of artisans with Work Passports, attendance track
                    records, and two-sided reputation scores.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/homeowner/workers')}
                  className="mt-6 w-full py-3 px-4 rounded-xl bg-primary hover:bg-primary-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 touch-target shadow-soft transition-colors"
                >
                  <span>{t.findMatchingWorkers}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

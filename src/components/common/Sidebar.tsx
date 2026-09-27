import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Briefcase,
  CalendarCheck,
  CreditCard,
  Sparkles,
  Users,
  FolderKanban,
  ShieldCheck,
  BarChart3,
  Bot,
  ArrowRightLeft,
  Award,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getPhotoUrl } from '../../utils/imageUrl';

export const Sidebar: React.FC = () => {
  const { role, setRole, t, currentWorker, currentUser } = useApp();

  if (role === 'guest') return null;

  const isWorker = role === 'worker';

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-stone-200/80 p-5 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
      {/* Profile snippet */}
      <div className="p-4 rounded-2xl bg-[#FAF8F2] border border-stone-200/80 mb-6">
        <div className="flex items-center gap-3">
          <img
            src={
              isWorker
                ? (currentWorker?.photo || getPhotoUrl(null))
                : getPhotoUrl(currentUser?.profile_photo || (currentUser as any)?.avatar)
            }
            alt="Profile"
            className="w-11 h-11 rounded-xl object-cover border-2 border-primary/20 shadow-xs"
          />
          <div className="min-w-0">
            <h4 className="font-extrabold text-sm text-charcoal truncate">
              {isWorker
                ? currentWorker.name || 'Artisan'
                : (() => {
                    try {
                      return JSON.parse(localStorage.getItem('nirmaan_auth_user') || '{}')?.name || 'Homeowner';
                    } catch {
                      return 'Homeowner';
                    }
                  })()}
            </h4>
            <div className="flex items-center gap-1 text-[11px] text-primary font-bold">
              <span>{isWorker ? `${currentWorker.trade || 'Artisan'} • ${currentWorker.level || 'Registered'}` : 'Homeowner • Client'}</span>
            </div>
          </div>
        </div>

        {/* Quick Role Switcher button */}
        <button
          onClick={() => setRole(isWorker ? 'homeowner' : 'worker')}
          className="mt-3 w-full py-2 px-3 rounded-xl bg-white border border-stone-200 hover:border-primary/40 text-charcoal hover:text-primary text-xs font-bold flex items-center justify-center gap-2 shadow-2xs transition-colors"
        >
          <ArrowRightLeft size={13} />
          <span>Switch to {isWorker ? 'Homeowner' : 'Worker'}</span>
        </button>
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 space-y-1.5">
        <div className="text-[10px] font-extrabold uppercase tracking-wider text-charcoal-muted px-3 py-1">
          {isWorker ? 'Worker Workspace' : 'Project Management'}
        </div>

        {isWorker ? (
          <>
            <NavLink
              to="/worker/home"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-primary text-white shadow-soft'
                    : 'text-charcoal hover:bg-stone-50'
                }`
              }
            >
              <Home size={18} />
              <span>{t.navHome}</span>
            </NavLink>

            <NavLink
              to="/worker/jobs"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-primary text-white shadow-soft'
                    : 'text-charcoal hover:bg-stone-50'
                }`
              }
            >
              <Briefcase size={18} />
              <span>{t.navJobs}</span>
            </NavLink>

            <NavLink
              to="/worker/work"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-primary text-white shadow-soft'
                    : 'text-charcoal hover:bg-stone-50'
                }`
              }
            >
              <CalendarCheck size={18} />
              <span>{t.navWork}</span>
            </NavLink>

            <NavLink
              to="/worker/earnings"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-primary text-white shadow-soft'
                    : 'text-charcoal hover:bg-stone-50'
                }`
              }
            >
              <CreditCard size={18} />
              <span>{t.navEarnings}</span>
            </NavLink>

            <NavLink
              to="/worker/passport"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-secondary text-primary font-black shadow-soft'
                    : 'bg-primary/5 text-primary hover:bg-primary/10'
                }`
              }
            >
              <Sparkles size={18} />
              <span>{t.navPassport}</span>
            </NavLink>
          </>
        ) : (
          <>
            <NavLink
              to="/homeowner/home"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-primary text-white shadow-soft'
                    : 'text-charcoal hover:bg-stone-50'
                }`
              }
            >
              <Home size={18} />
              <span>{t.navHome}</span>
            </NavLink>

            <NavLink
              to="/homeowner/ai-assistant"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-primary text-white shadow-soft'
                    : 'bg-primary/5 text-primary hover:bg-primary/10'
                }`
              }
            >
              <Bot size={18} />
              <span>{t.navAiAssistant}</span>
            </NavLink>

            <NavLink
              to="/homeowner/workers"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-primary text-white shadow-soft'
                    : 'text-charcoal hover:bg-stone-50'
                }`
              }
            >
              <Users size={18} />
              <span>{t.navWorkers}</span>
            </NavLink>

            <NavLink
              to="/homeowner/project/proj-sharma-bath"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-primary text-white shadow-soft'
                    : 'text-charcoal hover:bg-stone-50'
                }`
              }
            >
              <FolderKanban size={18} />
              <span>{t.navProjects}</span>
            </NavLink>

            <NavLink
              to="/homeowner/compare"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-primary text-white shadow-soft'
                    : 'text-charcoal hover:bg-stone-50'
                }`
              }
            >
              <Users size={18} />
              <span>{t.navCompare}</span>
            </NavLink>
          </>
        )}

        <div className="pt-4 mt-4 border-t border-stone-100">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-charcoal-muted px-3 py-1">
            Trust & Governance
          </div>

          <NavLink
            to="/trust"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-primary text-white shadow-soft'
                  : 'text-charcoal hover:bg-stone-50'
              }`
            }
          >
            <ShieldCheck size={18} />
            <span>{t.navTrust}</span>
          </NavLink>

          <NavLink
            to="/impact"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-primary text-white shadow-soft'
                  : 'text-charcoal hover:bg-stone-50'
              }`
            }
          >
            <BarChart3 size={18} />
            <span>{t.navImpact}</span>
          </NavLink>
        </div>
      </div>

      {/* Dignity Footer */}
      <div className="mt-auto pt-4 border-t border-stone-100">
        <div className="bg-primary/5 rounded-xl p-3 border border-primary/10">
          <div className="flex items-center gap-2 text-primary font-bold text-xs mb-1">
            <Award size={14} />
            <span>Work • Dignity • Identity</span>
          </div>
          <p className="text-[11px] text-charcoal-muted leading-tight">
            Building India's trusted construction workforce infrastructure.
          </p>
        </div>
      </div>
    </aside>
  );
};

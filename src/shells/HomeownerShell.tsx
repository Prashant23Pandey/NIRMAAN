import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  Plus,
  Bot,
  Users,
  FolderKanban,
  ArrowRightLeft,
  ShieldCheck,
  BarChart3,
  Bell,
  Globe,
  ArrowRight,
  LogOut,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';

export const HomeownerShell: React.FC = () => {
  const { project, projects, setRole, language, setLanguage, setIsNotificationDrawerOpen, t, currentUser } = useApp();
  const navigate = useNavigate();

  // Use first real project if project state not set yet
  const activeProject = project?.name ? project : (projects.length > 0 ? projects[0] : null);

  const navItems = [
    { to: '/homeowner/home', label: t.navHome, icon: Home },
    { to: '/homeowner/project/new', label: 'Create Project', icon: Plus },
    { to: '/homeowner/ai-assistant', label: 'AI Assistant', icon: Bot, highlight: true },
    { to: '/homeowner/workers', label: 'Find Craftsmen', icon: Users },
    { to: '/homeowner/compare', label: 'Compare', icon: ArrowRightLeft },
    { to: activeProject?.id ? `/homeowner/project/${activeProject.id}` : '/homeowner/home', label: 'Active Project', icon: FolderKanban },
    { to: '/trust', label: 'Trust Centre', icon: ShieldCheck },
    { to: '/impact', label: 'Platform Impact', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#17211F] flex flex-col font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              onClick={() => navigate('/homeowner/home')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-secondary font-black shadow-soft">
                <span className="text-xl">N</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-xl tracking-tight text-primary">NIRMAAN</span>
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 uppercase">
                    HOMEOWNER
                  </span>
                </div>
                <span className="text-[10px] font-bold text-charcoal-muted uppercase tracking-wider block -mt-0.5">
                  {currentUser?.name ? `Welcome, ${currentUser.name.split(' ')[0]}` : 'Homeowner Portal'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsNotificationDrawerOpen(true)}
              className="p-2.5 rounded-xl bg-sand-100 hover:bg-sand-200 text-charcoal relative transition-colors touch-target"
            >
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary" />
            </button>

            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs font-bold text-charcoal hover:border-primary/40 shadow-2xs"
            >
              <Globe size={14} className="text-primary" />
              <span>{language === 'en' ? 'हिन्दी' : 'EN'}</span>
            </button>

            <button
              onClick={() => {
                localStorage.removeItem('nirmaan_auth_token');
                localStorage.removeItem('nirmaan_user');
                api.setToken(null);
                setRole('guest' as any);
                navigate('/login');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 text-stone-600 hover:text-[#D64545] hover:border-red-200 bg-white text-xs font-bold shadow-2xs transition-colors cursor-pointer"
              title="Log Out of Nirmaan"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-stone-200 p-5 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          {/* Active Site Snippet */}
          {activeProject?.name ? (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/90 mb-5">
              <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider block">
                Active Project Site
              </span>
              <h4 className="font-extrabold text-sm text-charcoal mt-1 truncate">
                {activeProject.name}
              </h4>
              <div className="flex items-center justify-between text-xs text-charcoal-muted mt-2">
                <span>Progress:</span>
                <span className="font-black text-primary">{activeProject.progressPercent ?? 0}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-emerald-200 mt-1 overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(0, activeProject.progressPercent ?? 0))}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 mb-5 text-center">
              <span className="text-[10px] font-bold uppercase text-charcoal-muted tracking-wider block">
                No Active Project
              </span>
              <p className="text-xs text-charcoal-muted mt-1">Start a new project</p>
              <NavLink
                to="/homeowner/create-project"
                className="mt-2 inline-block text-xs font-bold text-primary hover:underline"
              >
                + Create Project
              </NavLink>
            </div>
          )}

          <nav className="flex-1 space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-charcoal-muted px-3 py-1 block">
              Project Management
            </span>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      isActive
                        ? item.highlight
                          ? 'bg-primary text-white shadow-soft'
                          : 'bg-primary text-white shadow-soft'
                        : 'text-charcoal hover:bg-stone-50'
                    }`
                  }
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </aside>

        {/* Content Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full pb-24 lg:pb-12">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-elevated">
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center flex-1 h-full transition-all ${
                    isActive ? 'text-primary font-black scale-105' : 'text-stone-400 hover:text-stone-700'
                  }`
                }
              >
                <Icon size={20} />
                <span className="text-[10px] mt-1 truncate max-w-[64px]">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

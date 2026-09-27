import React from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  HardHat,
  Briefcase,
  CalendarCheck,
  CreditCard,
  Sparkles,
  Award,
  Globe,
  Bell,
  ArrowRightLeft,
  ChevronRight,
  LogOut,
  Layers,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';

export const WorkerShell: React.FC = () => {
  const { currentWorker, language, setLanguage, setIsNotificationDrawerOpen, t, setRole, showToast } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const professionSlug = currentWorker?.profession_slug || 'mason';

  const navItems = [
    { to: '/worker/home', label: t.navHome, icon: HardHat },
    { to: `/worker/${professionSlug}`, label: `${currentWorker.trade} Hub`, icon: Layers, highlight: true },
    { to: '/worker/jobs', label: t.navJobs, icon: Briefcase },
    { to: '/worker/work', label: t.navWork, icon: CalendarCheck },
    { to: '/worker/earnings', label: t.navEarnings, icon: CreditCard },
    { to: '/worker/passport', label: t.navPassport, icon: Sparkles },
    { to: '/worker/history', label: 'History', icon: Award },
  ];

  const handleLogout = async () => {
    try {
      await api.post('auth/logout.php');
    } catch {
      // ignore
    }
    api.setToken(null);
    setRole('guest');
    showToast('Logged out successfully', 'info');
    navigate('/login');
  };

  const mobileNavItems = [
    { to: `/worker/${professionSlug}`, label: 'Home', icon: HardHat },
    { to: '/worker/jobs', label: 'Jobs', icon: Briefcase },
    { to: '/worker/work', label: 'Work', icon: CalendarCheck },
    { to: '/worker/passport', label: 'Passport', icon: Sparkles },
    { to: '/worker/history', label: 'Profile', icon: Award },
  ];

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#17211F] flex flex-col font-sans">
      {/* Top Worker Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/90 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              onClick={() => navigate('/worker/home')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-secondary font-black shadow-soft">
                <span className="text-xl">N</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-xl tracking-tight text-primary">NIRMAAN</span>
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 uppercase">
                    WORKER
                  </span>
                </div>
                <span className="text-[10px] font-bold text-charcoal-muted uppercase tracking-wider block -mt-0.5">
                  {currentWorker.trade} • {currentWorker.nirmaanId}
                </span>
              </div>
            </div>
          </div>

          {/* Locked Verified Trade Badge */}
          <div className="hidden md:flex items-center gap-2 bg-[#FAF8F2] px-3.5 py-1.5 rounded-2xl border border-primary/20 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              {currentWorker.trade} WORKSPACE
            </span>
            <span className="text-[10px] font-bold text-stone-400">
              | Primary Trade
            </span>
          </div>

          {/* Actions: Notifications, Lang, Role switcher */}
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
              onClick={handleLogout}
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
          {/* Worker Badge */}
          <div className="p-4 rounded-2xl bg-[#FAF8F2] border border-stone-200/90 mb-5">
            <div className="flex items-center gap-3">
              <img
                src={currentWorker.photo}
                alt={currentWorker.name}
                className="w-12 h-12 rounded-xl object-cover border-2 border-primary shadow-xs"
              />
              <div className="min-w-0">
                <h4 className="font-extrabold text-sm text-charcoal truncate">{currentWorker.name}</h4>
                <span className="text-xs font-bold text-primary block">{currentWorker.trade}</span>
                <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 mt-0.5">
                  ● Verified Artisan
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-charcoal-muted px-3 py-1 block">
              Worker Workspace
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
                          ? 'bg-secondary text-primary font-black shadow-soft'
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

          <div className="pt-4 border-t border-stone-100">
            <NavLink
              to="/trust"
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-charcoal hover:text-primary transition-colors"
            >
              <Award size={16} />
              <span>Trust Centre & SOS</span>
            </NavLink>
          </div>
        </aside>

        {/* Content Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full pb-24 lg:pb-12">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-elevated">
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
          {mobileNavItems.map((item) => {
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
                <span className="text-[10px] mt-1 truncate max-w-[64px] font-bold">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  Building2,
  FolderKanban,
  Users,
  Briefcase,
  CalendarCheck,
  CreditCard,
  Plus,
  ShieldCheck,
  Bell,
  ArrowRightLeft,
  ChevronRight,
  ClipboardList,
  LogOut,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';

export const ContractorShell: React.FC = () => {
  const { setRole, setIsNotificationDrawerOpen } = useApp();
  const navigate = useNavigate();

  const navItems = [
    { to: '/contractor/dashboard', label: 'Company Overview', icon: Building2 },
    { to: '/contractor/projects', label: 'Active Projects', icon: FolderKanban },
    { to: '/contractor/team', label: 'Workforce & Teams', icon: Users },
    { to: '/contractor/jobs', label: 'Post & Manage Jobs', icon: Briefcase },
    { to: '/contractor/attendance', label: 'Site Attendance', icon: CalendarCheck },
    { to: '/contractor/payments', label: 'Payroll & Escrow', icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#17211F] flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              onClick={() => navigate('/contractor/dashboard')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-secondary font-black shadow-soft">
                <span className="text-xl">N</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-xl tracking-tight text-primary">NIRMAAN</span>
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-blue-100 text-blue-900 uppercase">
                    CONTRACTOR
                  </span>
                </div>
                <span className="text-[10px] font-bold text-charcoal-muted uppercase tracking-wider block -mt-0.5">
                  {(() => {
                    try {
                      const u = JSON.parse(localStorage.getItem('nirmaan_auth_user') || '{}');
                      return u.name || u.company_name || 'Contractor Operations';
                    } catch {
                      return 'Contractor Operations';
                    }
                  })()}
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

      {/* Main Layout */}
      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-stone-200 p-5 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 mb-5">
            <span className="text-[10px] font-black uppercase text-blue-900 tracking-wider block">
              Contractor License
            </span>
            <h4 className="font-extrabold text-sm text-charcoal mt-1">PWD-A-2024-991</h4>
            <span className="text-[11px] text-blue-800 font-bold block mt-1">
              GST: 07AABCS1429B1Z8
            </span>
          </div>

          <nav className="flex-1 space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-charcoal-muted px-3 py-1 block">
              Contractor Operations
            </span>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      isActive ? 'bg-primary text-white shadow-soft' : 'text-charcoal hover:bg-stone-50'
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

      {/* Mobile Nav */}
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

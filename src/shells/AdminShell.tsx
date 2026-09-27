import React from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FolderKanban,
  CreditCard,
  Star,
  Scale,
  AlertTriangle,
  BarChart3,
  Settings,
  LogOut,
  Layers,
  Wrench,
  ShieldCheck,
  Bell,
  Search,
  Database,
  FileText,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AdminShell: React.FC = () => {
  const { setRole, showToast } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('nirmaan_auth_token');
    showToast('Admin logged out successfully', 'info');
    navigate('/admin/login');
  };

  interface AdminNavItem {
    to: string;
    label: string;
    icon: any;
    badge?: string;
    urgent?: boolean;
  }

  interface AdminNavSection {
    title: string;
    items: AdminNavItem[];
  }

  const navSections: AdminNavSection[] = [
    {
      title: 'Overview',
      items: [
        { to: '/admin/dashboard', label: 'Platform Dashboard', icon: LayoutDashboard },
        { to: '/admin/analytics', label: 'National Analytics', icon: BarChart3 },
      ],
    },
    {
      title: 'Workforce & Users',
      items: [
        { to: '/admin/users', label: 'All Platform Users', icon: Users },
        { to: '/admin/verification', label: 'Artisan Verification', icon: ShieldCheck, badge: 'Pending' },
      ],
    },
    {
      title: 'Taxonomy',
      items: [
        { to: '/admin/professions', label: '11 Professions', icon: Layers },
        { to: '/admin/skills', label: 'Trade Skills Matrix', icon: Wrench },
      ],
    },
    {
      title: 'Sites & Governance',
      items: [
        { to: '/admin/jobs', label: 'Job Postings', icon: Briefcase },
        { to: '/admin/projects', label: 'Active Projects', icon: FolderKanban },
        { to: '/admin/payments', label: 'Escrow & Payments', icon: CreditCard },
        { to: '/admin/reviews', label: 'Two-Sided Reviews', icon: Star },
        { to: '/admin/disputes', label: 'Dispute Arbitration', icon: Scale },
        { to: '/admin/emergency', label: 'Emergency SOS Protocol', icon: AlertTriangle, urgent: true },
      ],
    },
    {
      title: 'Database & Audit',
      items: [
        { to: '/admin/database', label: 'MySQL Database', icon: Database, badge: '24 Tables' },
        { to: '/admin/logs', label: 'Admin Audit Logs', icon: FileText },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#F0EFEB] text-[#17211F] flex flex-col font-sans">
      {/* Top Institutional Header */}
      <header className="sticky top-0 z-40 bg-[#17211F] text-white border-b border-stone-800 shadow-md">
        <div className="px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              onClick={() => navigate('/admin/dashboard')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-secondary font-black shadow-soft">
                <span className="text-xl">N</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-lg tracking-tight text-white">NIRMAAN</span>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded bg-secondary text-primary uppercase">
                    CONTROL CENTRE
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-stone-400 tracking-widest uppercase block -mt-0.5">
                  Super Administrator Access • System Online
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-800 text-xs text-stone-300 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              MySQL Live • Host: localhost
            </span>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-800/80 text-red-200 text-xs font-bold transition-colors cursor-pointer"
            >
              <LogOut size={13} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Layout with Left Sidebar */}
      <div className="flex-1 flex w-full">
        {/* Institutional Left Sidebar */}
        <aside className="w-64 bg-white border-r border-stone-300/80 p-5 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto shrink-0 hidden md:flex flex-col justify-between">
          <div className="space-y-6">
            {navSections.map((sec, i) => (
              <div key={i} className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-stone-400 tracking-wider px-3 block">
                  {sec.title}
                </span>
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-extrabold transition-all ${
                          isActive
                            ? 'bg-primary text-white shadow-soft'
                            : item.urgent
                            ? 'text-red-700 hover:bg-red-50'
                            : 'text-charcoal hover:bg-stone-100'
                        }`
                      }
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon size={16} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-black">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-stone-200 text-stone-400 text-[11px] font-mono">
            NIRMAAN v2.0 Enterprise • PHP 8 & MySQL
          </div>
        </aside>

        {/* Content Outlet */}
        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

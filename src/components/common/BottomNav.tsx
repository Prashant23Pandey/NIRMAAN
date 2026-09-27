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
  Bot,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BottomNav: React.FC = () => {
  const { role, t } = useApp();

  if (role === 'guest') return null;

  const isWorker = role === 'worker';

  // Worker Nav Items
  const workerItems = [
    { to: '/worker/home', label: t.navHome, icon: Home },
    { to: '/worker/jobs', label: t.navJobs, icon: Briefcase },
    { to: '/worker/work', label: t.navWork, icon: CalendarCheck },
    { to: '/worker/earnings', label: t.navEarnings, icon: CreditCard },
    { to: '/worker/passport', label: t.navPassport, icon: Sparkles, highlight: true },
  ];

  // Homeowner Nav Items
  const homeownerItems = [
    { to: '/homeowner/home', label: t.navHome, icon: Home },
    { to: '/homeowner/ai-assistant', label: t.navAiAssistant, icon: Bot, highlight: true },
    { to: '/homeowner/workers', label: t.navWorkers, icon: Users },
    { to: '/homeowner/project/proj-sharma-bath', label: t.navProjects, icon: FolderKanban },
    { to: '/trust', label: t.navTrust, icon: ShieldCheck },
  ];

  const items = isWorker ? workerItems : homeownerItems;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-elevated safe-area-pb">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center flex-1 h-full touch-target transition-all ${
                  isActive
                    ? item.highlight
                      ? 'text-primary font-black scale-105'
                      : 'text-primary font-black'
                    : 'text-stone-400 hover:text-stone-700'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`relative p-1 rounded-xl transition-all ${
                      isActive && item.highlight
                        ? 'bg-secondary/20 text-primary'
                        : isActive
                        ? 'bg-primary-50 text-primary'
                        : ''
                    }`}
                  >
                    <Icon size={20} className={isActive ? 'stroke-[2.5]' : 'stroke-2'} />
                    {item.highlight && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-secondary" />
                    )}
                  </div>
                  <span
                    className={`text-[10px] mt-0.5 tracking-tight truncate max-w-[64px] text-center ${
                      isActive ? 'font-bold' : 'font-medium'
                    }`}
                  >
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

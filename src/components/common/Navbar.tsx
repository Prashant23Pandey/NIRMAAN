import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ShieldAlert,
  Bell,
  Globe,
  HardHat,
  Home,
  RotateCcw,
  Sparkles,
  BarChart3,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Navbar: React.FC = () => {
  const {
    role,
    setRole,
    language,
    setLanguage,
    t,
    unreadNotificationCount,
    setIsNotificationDrawerOpen,
    setIsSosOpen,
    resetDemoData,
  } = useApp();
  const location = useLocation();

  const isWorker = role === 'worker';
  const isHomeowner = role === 'homeowner';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-secondary font-black shadow-soft group-hover:scale-105 transition-transform">
              <span className="text-xl tracking-tighter">N</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-primary">
                  NIRMAAN
                </span>
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-secondary text-primary uppercase">
                  2.0
                </span>
              </div>
              <p className="hidden md:block text-[10px] font-medium text-charcoal-muted tracking-tight -mt-0.5">
                {t.tagline}
              </p>
            </div>
          </Link>

          {/* Current Mode Badge */}
          {role !== 'guest' && (
            <div className="hidden sm:flex items-center gap-1.5 ml-2 px-2.5 py-1 rounded-full bg-sand-200 border border-stone-200 text-xs font-semibold text-charcoal">
              {isWorker ? (
                <>
                  <HardHat size={14} className="text-primary" />
                  <span>{t.workerMode}</span>
                </>
              ) : (
                <>
                  <Home size={14} className="text-primary" />
                  <span>{t.homeownerMode}</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Center / Navigation Links for quick judge access */}
        <div className="hidden lg:flex items-center gap-1 text-sm font-semibold text-charcoal">
          {isWorker && (
            <>
              <Link
                to="/worker/home"
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  location.pathname === '/worker/home' ? 'bg-primary-50 text-primary font-bold' : 'hover:bg-stone-50'
                }`}
              >
                {t.navHome}
              </Link>
              <Link
                to="/worker/jobs"
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  location.pathname.startsWith('/worker/jobs') ? 'bg-primary-50 text-primary font-bold' : 'hover:bg-stone-50'
                }`}
              >
                {t.navJobs}
              </Link>
              <Link
                to="/worker/work"
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  location.pathname === '/worker/work' ? 'bg-primary-50 text-primary font-bold' : 'hover:bg-stone-50'
                }`}
              >
                {t.navWork}
              </Link>
              <Link
                to="/worker/passport"
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                  location.pathname === '/worker/passport' ? 'bg-primary text-white font-bold' : 'text-primary hover:bg-primary-50'
                }`}
              >
                <Sparkles size={14} className={location.pathname === '/worker/passport' ? 'text-secondary' : 'text-primary'} />
                <span>{t.navPassport}</span>
              </Link>
            </>
          )}

          {isHomeowner && (
            <>
              <Link
                to="/homeowner/home"
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  location.pathname === '/homeowner/home' ? 'bg-primary-50 text-primary font-bold' : 'hover:bg-stone-50'
                }`}
              >
                {t.navHome}
              </Link>
              <Link
                to="/homeowner/ai-assistant"
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1 text-primary transition-colors ${
                  location.pathname === '/homeowner/ai-assistant' ? 'bg-primary-100 font-bold' : 'hover:bg-primary-50'
                }`}
              >
                <Sparkles size={14} className="text-secondary-dark" />
                <span>{t.navAiAssistant}</span>
              </Link>
              <Link
                to="/homeowner/workers"
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  location.pathname.startsWith('/homeowner/workers') ? 'bg-primary-50 text-primary font-bold' : 'hover:bg-stone-50'
                }`}
              >
                {t.navWorkers}
              </Link>
              <Link
                to="/homeowner/project/proj-sharma-bath"
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  location.pathname.startsWith('/homeowner/project') ? 'bg-primary-50 text-primary font-bold' : 'hover:bg-stone-50'
                }`}
              >
                {t.navProjects}
              </Link>
              <Link
                to="/homeowner/compare"
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  location.pathname === '/homeowner/compare' ? 'bg-primary-50 text-primary font-bold' : 'hover:bg-stone-50'
                }`}
              >
                {t.navCompare}
              </Link>
            </>
          )}

          <div className="w-px h-5 bg-stone-200 mx-1" />

          <Link
            to="/trust"
            className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors ${
              location.pathname === '/trust' ? 'bg-primary-50 text-primary font-bold' : 'text-charcoal-muted hover:text-charcoal hover:bg-stone-50'
            }`}
          >
            <ShieldCheck size={16} />
            <span className="text-xs">{t.navTrust}</span>
          </Link>

          <Link
            to="/impact"
            className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors ${
              location.pathname === '/impact' ? 'bg-primary-50 text-primary font-bold' : 'text-charcoal-muted hover:text-charcoal hover:bg-stone-50'
            }`}
          >
            <BarChart3 size={16} />
            <span className="text-xs">{t.navImpact}</span>
          </Link>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Language Toggle (English / हिन्दी) */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 hover:border-primary/40 bg-sand-50 hover:bg-sand-100 text-xs font-bold text-charcoal touch-target transition-colors shadow-2xs"
            title="Toggle English / हिन्दी"
          >
            <Globe size={15} className="text-primary" />
            <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>

          {/* SOS Trigger */}
          <button
            onClick={() => setIsSosOpen(true)}
            className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-danger-light border border-danger/30 text-danger hover:bg-danger hover:text-white text-xs font-black touch-target transition-all"
            title="Simulated SOS Emergency"
          >
            <ShieldAlert size={15} />
            <span>SOS</span>
          </button>

          {/* Notification Bell */}
          <button
            onClick={() => setIsNotificationDrawerOpen(true)}
            className="relative p-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-charcoal touch-target transition-colors"
            title="Notifications"
          >
            <Bell size={18} />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-danger text-white text-[10px] font-black flex items-center justify-center animate-pulse">
                {unreadNotificationCount}
              </span>
            )}
          </button>

          {/* Demo Reset */}
          <button
            onClick={resetDemoData}
            className="hidden md:flex p-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-500 hover:text-charcoal touch-target transition-colors"
            title="Reset Demo Data"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};

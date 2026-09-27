import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HardHat,
  Home,
  ShieldCheck,
  Award,
  Sparkles,
  ArrowRight,
  Globe,
  CheckCircle2,
  Users,
  Briefcase,
  Star,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NirmaanLoop } from '../components/common/NirmaanLoop';

export const SplashRolePage: React.FC = () => {
  const { setRole, language, setLanguage, t } = useApp();
  const navigate = useNavigate();

  const handleSelectRole = (selectedRole: 'worker' | 'homeowner') => {
    setRole(selectedRole);
    if (selectedRole === 'worker') {
      navigate('/login?role=worker');
    } else {
      navigate('/login?role=homeowner');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5EF] flex flex-col justify-between">
      {/* Top Banner with Language Toggle */}
      <header className="p-4 sm:p-6 max-w-7xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-secondary font-black shadow-soft">
            <span className="text-xl">N</span>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-primary leading-none">
              NIRMAAN
            </h1>
            <span className="text-[10px] font-bold text-charcoal-muted tracking-widest uppercase">
              2.0 CIVIC-TECH PLATFORM
            </span>
          </div>
        </div>

        <button
          onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-xs font-bold text-charcoal shadow-2xs hover:border-primary/40 touch-target transition-all"
        >
          <Globe size={15} className="text-primary" />
          <span>{language === 'en' ? 'हिन्दी में बदलें' : 'Switch to English'}</span>
        </button>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex-1 flex flex-col justify-center">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-4">
            <ShieldCheck size={14} className="text-primary" />
            <span>Digital Construction Identity & Verified Workforce</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-charcoal tracking-tight leading-[1.1] mb-4">
            {t.tagline}
          </h1>

          <p className="text-base sm:text-lg text-charcoal-muted max-w-2xl mx-auto leading-relaxed">
            India's trusted construction workforce platform. Empowering craftsmen with permanent, tamper-proof
            <strong className="text-primary font-bold"> Nirmaan Work Passports </strong>
            while giving homeowners guaranteed project transparency.
          </p>
        </div>

        {/* SCREEN 1 — ROLE SELECTION: Two Large Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto w-full mb-12">
          {/* Card 1: I AM A WORKER */}
          <div
            onClick={() => handleSelectRole('worker')}
            className="group cursor-pointer bg-white rounded-3xl p-7 sm:p-9 border-2 border-stone-200 hover:border-primary shadow-soft hover:shadow-elevated transition-all flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />

            <div>
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <HardHat size={32} />
              </div>

              <div className="inline-block text-[11px] font-black uppercase tracking-wider text-primary mb-1">
                FOR CRAFTSMEN & TEAMS
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-charcoal tracking-tight mb-2">
                {t.workerCardTitle}
              </h2>

              <p className="text-sm text-charcoal-muted leading-relaxed mb-6">
                {t.workerCardDesc}
              </p>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-xs text-charcoal font-semibold">
                  <CheckCircle2 size={15} className="text-success flex-shrink-0" />
                  <span>Build permanent Nirmaan Work Passport</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-charcoal font-semibold">
                  <CheckCircle2 size={15} className="text-success flex-shrink-0" />
                  <span>Fair daily wages with zero contractor cut</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-charcoal font-semibold">
                  <CheckCircle2 size={15} className="text-success flex-shrink-0" />
                  <span>Verified client reviews & prompt milestone pay</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
              <span className="text-xs font-bold text-primary">Enter as Craftsman</span>
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center group-hover:translate-x-1 transition-transform shadow-xs">
                <ArrowRight size={18} />
              </div>
            </div>
          </div>

          {/* Card 2: I NEED WORKERS */}
          <div
            onClick={() => handleSelectRole('homeowner')}
            className="group cursor-pointer bg-white rounded-3xl p-7 sm:p-9 border-2 border-stone-200 hover:border-secondary shadow-soft hover:shadow-elevated transition-all flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />

            <div>
              <div className="w-16 h-16 rounded-2xl bg-secondary/20 text-primary flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Home size={32} />
              </div>

              <div className="inline-block text-[11px] font-black uppercase tracking-wider text-secondary-dark mb-1">
                FOR HOMEOWNERS & CONTRACTORS
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-charcoal tracking-tight mb-2">
                {t.homeownerCardTitle}
              </h2>

              <p className="text-sm text-charcoal-muted leading-relaxed mb-6">
                {t.homeownerCardDesc}
              </p>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-xs text-charcoal font-semibold">
                  <CheckCircle2 size={15} className="text-success flex-shrink-0" />
                  <span>Smart AI project assistant & scope matching</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-charcoal font-semibold">
                  <CheckCircle2 size={15} className="text-success flex-shrink-0" />
                  <span>Compare verified craftsmen side-by-side</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-charcoal font-semibold">
                  <CheckCircle2 size={15} className="text-success flex-shrink-0" />
                  <span>Proof-of-work photo timeline & milestone escrow</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
              <span className="text-xs font-bold text-primary">Hire Verified Workers</span>
              <div className="w-10 h-10 rounded-full bg-secondary text-primary flex items-center justify-center group-hover:translate-x-1 transition-transform shadow-xs">
                <ArrowRight size={18} />
              </div>
            </div>
          </div>
        </div>

        {/* The Dignity Flywheel Loop Component */}
        <div className="max-w-4xl mx-auto w-full">
          <NirmaanLoop />
        </div>
      </main>

      {/* Footer Disclaimer */}
      <footer className="p-4 text-center text-xs text-charcoal-muted border-t border-stone-200/80 bg-white">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>NIRMAAN 2.0 • Civic-Tech Construction Workforce Prototype</span>
          <span className="font-semibold text-primary">
            WORK → PROOF → REPUTATION → DIGNITY
          </span>
        </div>
      </footer>
    </div>
  );
};

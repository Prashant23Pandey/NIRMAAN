import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  HardHat,
  Home,
  Building2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Award,
  Clock,
  QrCode,
  Users,
  Briefcase,
  Star,
  ChevronRight,
  Lock,
  PhoneCall,
  Scale,
  Compass,
  Layers,
  Wrench,
  Check,
  TrendingUp,
  MapPin,
  Calendar,
  CreditCard,
  FileCheck,
  ExternalLink,
  ChevronDown,
  Quote,
} from 'lucide-react';
import { Button, Card, Badge, Avatar, StatCard } from '../components/ui';

import heroMasonImg from '../assets/images/hero/master_mason_hero.jpg';
import workerMasonImg from '../assets/images/workers/master_mason.jpg';
import workerElectricianImg from '../assets/images/workers/electrician.jpg';
import workerPlumberImg from '../assets/images/workers/plumber.jpg';
import workerCarpenterImg from '../assets/images/workers/carpenter.jpg';
import tradeTileImg from '../assets/images/trades/tile_worker.jpg';
import tradeCarpenterImg from '../assets/images/trades/carpenter.jpg';
import tradeWelderImg from '../assets/images/trades/welder.jpg';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'structural' | 'finishing' | 'mep'>('all');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const trades = [
    {
      name: 'Mason',
      hindi: 'राजमिस्त्री',
      slug: 'mason',
      category: 'structural',
      image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80',
      skills: ['Brickwork', 'RCC Construction', 'Plastering', 'Foundation'],
      wage: '₹850/day',
      verifiedArtisans: '280+ Verified',
      leadTime: 'Immediate',
    },
    {
      name: 'Electrician',
      hindi: 'इलेक्ट्रीशियन',
      slug: 'electrician',
      category: 'mep',
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
      skills: ['Conduit Wiring', 'DB Dressing', 'Solar Inverter', 'CCTV'],
      wage: '₹950/day',
      verifiedArtisans: '195+ Verified',
      leadTime: 'Same Day',
    },
    {
      name: 'Plumber',
      hindi: 'प्लम्बर',
      slug: 'plumber',
      category: 'mep',
      image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
      skills: ['CPVC / UPVC', 'Drainage Lines', 'Sanitary Fittings', 'Leak Repair'],
      wage: '₹900/day',
      verifiedArtisans: '160+ Verified',
      leadTime: 'Immediate',
    },
    {
      name: 'Carpenter',
      hindi: 'बढ़ई',
      slug: 'carpenter',
      category: 'finishing',
      image: tradeCarpenterImg,
      skills: ['Modular Kitchens', 'Door Framing', 'Veneer Work', 'Wardrobes'],
      wage: '₹950/day',
      verifiedArtisans: '140+ Verified',
      leadTime: 'Tomorrow',
    },
    {
      name: 'Painter',
      hindi: 'पेंटर',
      slug: 'painter',
      category: 'finishing',
      image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=600&q=80',
      skills: ['Interior Emulsion', 'Surface Putty', 'Texture Design', 'Waterproofing'],
      wage: '₹800/day',
      verifiedArtisans: '210+ Verified',
      leadTime: 'Same Day',
    },
    {
      name: 'Tile Worker',
      hindi: 'टाइल मिस्त्री',
      slug: 'tile-worker',
      category: 'finishing',
      image: tradeTileImg,
      skills: ['Vitrified Tiles', 'Granite Counter', 'Laser Leveling', 'Dado Work'],
      wage: '₹900/day',
      verifiedArtisans: '125+ Verified',
      leadTime: 'Tomorrow',
    },
    {
      name: 'Welder',
      hindi: 'वेल्डर',
      slug: 'welder',
      category: 'structural',
      image: tradeWelderImg,
      skills: ['TIG / MIG Welding', 'MS Structural Gates', 'Safety Railings', 'Truss'],
      wage: '₹850/day',
      verifiedArtisans: '90+ Verified',
      leadTime: '2 Days',
    },
    {
      name: 'HVAC Tech',
      hindi: 'एचवीएसी',
      slug: 'hvac',
      category: 'mep',
      image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=600&q=80',
      skills: ['Copper Piping', 'VRV / VRF Units', 'Gas Charging', 'Ducting'],
      wage: '₹1,000/day',
      verifiedArtisans: '75+ Verified',
      leadTime: 'Same Day',
    },
    {
      name: 'Roofer',
      hindi: 'रूफर',
      slug: 'roofer',
      category: 'structural',
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80',
      skills: ['Profile Sheet', 'Truss Alignment', 'Waterproof Membrane', 'Flashing'],
      wage: '₹800/day',
      verifiedArtisans: '60+ Verified',
      leadTime: '2 Days',
    },
    {
      name: 'Flooring',
      hindi: 'फ्लोरिंग',
      slug: 'flooring',
      category: 'finishing',
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=600&q=80',
      skills: ['Kota Stone', 'Italian Marble', 'Diamond Polishing', 'Epoxy'],
      wage: '₹850/day',
      verifiedArtisans: '85+ Verified',
      leadTime: 'Tomorrow',
    },
    {
      name: 'Helper',
      hindi: 'हेल्पर',
      slug: 'helper',
      category: 'structural',
      image: 'https://images.unsplash.com/photo-1590402494682-cd3fb53b1f70?auto=format&fit=crop&w=600&q=80',
      skills: ['Material Staging', 'Concrete Batching', 'Debris Clearing', 'Scaffold Support'],
      wage: '₹600/day',
      verifiedArtisans: '340+ Verified',
      leadTime: 'Immediate',
    },
  ];

  const featuredWorkers = [
    {
      id: 'w-mason',
      name: 'Master Mason',
      hindi: 'राजमिस्त्री कारीगर',
      trade: 'Mason',
      tradeHindi: 'राजमिस्त्री',
      photo: workerMasonImg,
      rating: 4.8,
      reviews: 24,
      completedJobs: 24,
      experienceYears: 7,
      dailyWage: 850,
      city: 'Delhi NCR',
      skills: ['Brickwork', 'RCC Construction', 'Plastering', 'AAC Block'],
      nirmaanId: 'NRM-2026-MS-0042',
      verification: 'Aadhaar e-KYC Verified',
      quote: 'Before NIRMAAN, every project ended without proof. Now my Work Passport proves my 7 years of on-site craft.',
    },
    {
      id: 'w-electrician',
      name: 'Senior Electrician',
      hindi: 'कुशल इलेक्ट्रीशियन',
      trade: 'Electrician',
      tradeHindi: 'इलेक्ट्रीशियन',
      photo: workerElectricianImg,
      rating: 4.9,
      reviews: 19,
      completedJobs: 19,
      experienceYears: 6,
      dailyWage: 950,
      city: 'Greater Noida',
      skills: ['Conduit Piping', 'DB Dressing', 'Solar Inverter', 'Earthing'],
      nirmaanId: 'NRM-2026-EL-0089',
      verification: 'ITI + Aadhaar Verified',
      quote: 'Direct hiring without middlemen cuts because my digital reviews and certificates are 100% genuine.',
    },
    {
      id: 'w-plumber',
      name: 'Sanitary Specialist',
      hindi: 'प्लम्बर कारीगर',
      trade: 'Plumber',
      tradeHindi: 'प्लम्बर',
      photo: workerPlumberImg,
      rating: 4.9,
      reviews: 31,
      completedJobs: 31,
      experienceYears: 9,
      dailyWage: 900,
      city: 'Noida NCR',
      skills: ['CPVC Lines', 'Pressure Testing', 'Sanitary Fittings', 'Core Cutting'],
      nirmaanId: 'NRM-2026-PL-0112',
      verification: 'NSDC Certified',
      quote: 'Homeowners inspect my Work Passport on their phone and release escrow milestone payments with confidence.',
    },
    {
      id: 'w-carpenter',
      name: 'Finish Carpenter',
      hindi: 'बढ़ई विशेषज्ञ',
      trade: 'Carpenter',
      tradeHindi: 'बढ़ई',
      photo: workerCarpenterImg,
      rating: 4.8,
      reviews: 16,
      completedJobs: 16,
      experienceYears: 8,
      dailyWage: 950,
      city: 'Gurgaon',
      skills: ['Modular Kitchens', 'Door Frames', 'Veneer Finish', 'Plywood'],
      nirmaanId: 'NRM-2026-CR-0071',
      verification: 'Aadhaar e-KYC Verified',
      quote: 'Every site has verified milestone agreements and photo proof locked into the immutable platform ledger.',
    },
  ];

  const projectStories = [
    {
      id: 'proj-1',
      title: 'Master Bathroom Renovation',
      location: 'Sector 62, Noida',
      category: 'Residential Finishing',
      image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
      leadWorker: 'Lead Mason & Tile Team',
      contractor: 'Verified Contractor Partner',
      budget: '₹45,000 Escrow',
      progress: 62,
      status: 'Active Site',
      evidencePhotos: 6,
    },
    {
      id: 'proj-2',
      title: '3-Storey Villa Structural Framing',
      location: 'South Extension, Delhi',
      category: 'RCC & Masonry',
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
      leadWorker: 'Structural Masonry Team',
      contractor: 'Apex Buildtech Partner Ltd',
      budget: '₹2,80,000 Escrow',
      progress: 100,
      status: 'Completed (5.0 ★)',
      evidencePhotos: 18,
    },
    {
      id: 'proj-3',
      title: 'Commercial Office DB & Conduit Wiring',
      location: 'Knowledge Park, Greater Noida',
      category: 'Commercial Electrical',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      leadWorker: 'Senior Electrical Team',
      contractor: 'Greenfield Infrastructure',
      budget: '₹95,000 Escrow',
      progress: 84,
      status: 'Final Phase',
      evidencePhotos: 12,
    },
  ];

  const loopStages = [
    {
      step: '01',
      title: 'WORK',
      hindi: 'काम',
      desc: 'Skilled artisans connect directly with verified homeowners and licensed contractors without middleman commissions.',
      icon: HardHat,
    },
    {
      step: '02',
      title: 'PROOF',
      hindi: 'प्रमाण',
      desc: 'Daily progress photos with GPS site geotags and milestone time-stamps build undeniable proof of actual workmanship.',
      icon: FileCheck,
    },
    {
      step: '03',
      title: 'REPUTATION',
      hindi: 'प्रतिष्ठा',
      desc: 'Transparent two-sided client ratings and verified peer endorsements lock permanently into the artisan ledger.',
      icon: Star,
    },
    {
      step: '04',
      title: 'TRUST',
      hindi: 'भरोसा',
      desc: 'Clients inspect authentic digital Work Passports before hiring, eliminating guesswork and wage bargaining.',
      icon: ShieldCheck,
    },
    {
      step: '05',
      title: 'BETTER PAY',
      hindi: 'उचित मानदेय',
      desc: 'Proven craftsmen unlock top-tier daily wage benchmarks with prompt milestone releases secured in escrow.',
      icon: CreditCard,
    },
    {
      step: '06',
      title: 'FUTURE',
      hindi: 'सुरक्षित भविष्य',
      desc: 'A permanent digital work credential that belongs to the worker for life, moving from site to site across India.',
      icon: Award,
    },
  ];

  const filteredTrades =
    activeTab === 'all'
      ? trades
      : trades.filter((t) => t.category === activeTab);

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#17211F] font-sans selection:bg-[#176B5B] selection:text-white antialiased">
      {/* PUBLIC NAVIGATION */}
      <header className="sticky top-0 z-40 bg-[#F7F5EF]/95 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
          {/* Brand Logo */}
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#176B5B] flex items-center justify-center text-[#F4B942] font-black shadow-sm group-hover:scale-105 transition-transform">
              <span className="text-2xl font-black">N</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-2xl tracking-tight text-[#17211F]">NIRMAAN</span>
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-[#176B5B] text-[#F4B942] uppercase tracking-wider">
                  2.0
                </span>
              </div>
              <span className="text-[11px] font-semibold text-stone-500 hidden sm:block tracking-wide">
                Your Work. Your Reputation. Your Future.
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-bold uppercase tracking-wider text-stone-700">
            <a href="#workers" className="hover:text-[#176B5B] transition-colors">
              For Workers
            </a>
            <a href="#homeowners" className="hover:text-[#176B5B] transition-colors">
              For Homeowners
            </a>
            <a href="#contractors" className="hover:text-[#176B5B] transition-colors">
              For Contractors
            </a>
            <a href="#trades" className="hover:text-[#176B5B] transition-colors">
              11 Trades
            </a>
            <a href="#passport" className="hover:text-[#176B5B] transition-colors">
              Work Passport
            </a>
            <a href="#loop" className="hover:text-[#176B5B] transition-colors">
              The Nirmaan Loop
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#17211F] hover:bg-stone-200/70 border border-stone-300 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-5 py-2.5 rounded-xl bg-[#176B5B] hover:bg-[#125447] text-white text-xs font-black shadow-soft hover:shadow-md transition-all flex items-center gap-1.5"
            >
              <span>Get Started</span>
              <ArrowRight size={14} className="text-[#F4B942]" />
            </button>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION — EDITORIAL & HUMAN */}
      <section className="relative pt-12 pb-20 lg:pt-16 lg:pb-28 overflow-hidden border-b border-stone-200">
        {/* Subtle Architectural Blueprint Background Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#17211F 1px, transparent 1px), linear-gradient(to right, #17211F 1px, transparent 1px)`,
            backgroundSize: '32px 32px, 64px 64px',
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Oversized Editorial Copy */}
            <div className="lg:col-span-7 space-y-6">
              {/* Civic Pride Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#176B5B]/10 border border-[#176B5B]/20 text-[#176B5B] text-xs font-extrabold uppercase tracking-widest">
                <HardHat size={14} className="text-[#176B5B]" />
                <span>Dignity • Reputation • Security for India’s Workforce</span>
              </div>

              {/* Massive Editorial Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#17211F] tracking-tight leading-[1.08]">
                YOUR WORK.
                <br />
                <span className="text-[#176B5B]">YOUR REPUTATION.</span>
                <br />
                <span className="relative inline-block">
                  YOUR FUTURE.
                  <svg
                    className="absolute -bottom-2 left-0 w-full h-3 text-[#F4B942]"
                    viewBox="0 0 200 8"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 5C50 1 150 1 200 5"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>

              {/* Exact Requested Supporting Copy */}
              <p className="text-lg sm:text-xl text-stone-700 font-medium max-w-xl leading-relaxed">
                India's construction workforce deserves an identity that grows with every project.
              </p>

              <p className="text-sm text-stone-600 max-w-lg leading-relaxed">
                Nirmaan transforms on-site labour into verified digital Work Passports — replacing middleman cuts and arbitrary day rates with transparent skills, photo proof, and milestone escrow protection.
              </p>

              {/* Primary Dual CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <button
                  onClick={() => navigate('/register?role=worker')}
                  className="px-7 py-4 rounded-2xl bg-[#176B5B] hover:bg-[#125447] text-white font-black text-sm shadow-soft hover:shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <HardHat size={18} className="text-[#F4B942]" />
                  <span>Find Work</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  onClick={() => navigate('/login?role=homeowner')}
                  className="px-7 py-4 rounded-2xl bg-white hover:bg-stone-50 border-2 border-stone-300 text-[#17211F] font-black text-sm shadow-2xs hover:border-[#176B5B]/50 transition-all flex items-center justify-center gap-2"
                >
                  <Home size={18} className="text-[#176B5B]" />
                  <span>Hire Skilled Workers</span>
                </button>
              </div>

              {/* Institutional Trust Indicators */}
              <div className="pt-6 border-t border-stone-200/90 grid grid-cols-3 gap-4 text-left">
                <div>
                  <div className="text-xl font-black text-[#176B5B] font-mono">11 Trades</div>
                  <div className="text-xs text-stone-600 font-semibold mt-0.5">Bilingual Taxonomy</div>
                </div>
                <div>
                  <div className="text-xl font-black text-[#176B5B] font-mono">0% Cut</div>
                  <div className="text-xs text-stone-600 font-semibold mt-0.5">Direct Daily Wage</div>
                </div>
                <div>
                  <div className="text-xl font-black text-[#176B5B] font-mono">100% Locked</div>
                  <div className="text-xs text-stone-600 font-semibold mt-0.5">Milestone Escrow</div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual — Dignified Indian Construction Craft */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Visual Frame */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-stone-900">
                  <img
                    src={heroMasonImg}
                    alt="Indian Construction Professional at work"
                    className="w-full h-[460px] object-cover object-center filter saturate-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#17211F]/90 via-[#17211F]/30 to-transparent" />

                  {/* Caption Overlay */}
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#F4B942] block mb-1">
                      MASTER CRAFTSMAN IDENTITY
                    </span>
                    <h3 className="text-lg font-black tracking-tight leading-tight">
                      Master Mason • Certified Artisan
                    </h3>
                    <p className="text-xs text-stone-300 mt-1">
                      Verified On-Site Milestones • Construction Trade • Level 2 Certified
                    </p>
                  </div>
                </div>

                {/* Overlaid Floating Credential Badge 1 */}
                <div className="absolute -top-4 -left-4 sm:-left-6 bg-white rounded-2xl p-3.5 shadow-xl border border-stone-200 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
                    <ShieldCheck size={22} />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-stone-400 block tracking-wider">
                      Identity Proof
                    </span>
                    <span className="text-xs font-black text-emerald-900">Aadhaar e-KYC Verified</span>
                  </div>
                </div>

                {/* Overlaid Floating Credential Badge 2 */}
                <div className="absolute -bottom-5 -right-4 sm:-right-6 bg-white rounded-2xl p-4 shadow-xl border border-stone-200 max-w-[220px]">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono font-bold text-stone-500">WORK PASSPORT</span>
                    <span className="text-xs font-black text-amber-500 flex items-center gap-1">
                      <Star size={12} fill="currentColor" /> 4.8
                    </span>
                  </div>
                  <div className="text-xs font-bold text-charcoal">
                    Brickwork • RCC • AAC Blocks
                  </div>
                  <div className="text-[10px] font-mono text-[#176B5B] mt-1 font-bold">
                    Standard Wage: ₹850/day
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MEET THE PEOPLE WHO BUILD INDIA (WORKER STORIES) */}
      <section id="workers" className="py-20 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold uppercase tracking-wider mb-2">
              <Users size={13} />
              <span>Verified Artisan Directory</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#17211F] tracking-tight">
              MEET THE PEOPLE WHO BUILD INDIA
            </h2>
            <p className="text-sm sm:text-base text-stone-600 mt-2">
              Real craftsmen with verifiable track records, transparent daily rates, and permanent digital Work Passports stored in our MySQL registry.
            </p>
          </div>

          {/* Worker Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredWorkers.map((worker) => (
              <div
                key={worker.id}
                className="rounded-3xl border border-stone-200 bg-[#FAF8F2] p-5 flex flex-col justify-between hover:border-[#176B5B]/50 hover:shadow-lg transition-all group"
              >
                <div>
                  {/* Photo & Badge */}
                  <div className="relative mb-4">
                    <img
                      src={worker.photo}
                      alt={worker.name}
                      className="w-full h-48 object-cover rounded-2xl border border-stone-200"
                    />
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-black text-[#17211F] shadow-sm flex items-center gap-1">
                      <Star size={12} className="text-amber-500" fill="currentColor" />
                      <span>{worker.rating}</span>
                      <span className="text-[10px] text-stone-400">({worker.reviews})</span>
                    </div>
                    <div className="absolute bottom-3 left-3 bg-[#176B5B] text-[#F4B942] px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider">
                      {worker.verification}
                    </div>
                  </div>

                  {/* Worker Title */}
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-black text-lg text-charcoal">{worker.name}</h3>
                    <span className="text-xs font-bold text-stone-500">{worker.hindi}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-stone-600 mt-0.5">
                    <span className="font-extrabold text-[#176B5B]">{worker.trade} ({worker.tradeHindi})</span>
                    <span className="font-mono text-[11px] text-stone-500">{worker.city}</span>
                  </div>

                  {/* Key Metrics */}
                  <div className="mt-3.5 p-3 rounded-2xl bg-white border border-stone-200/80 grid grid-cols-2 gap-2 text-center text-xs">
                    <div>
                      <span className="text-[10px] text-stone-400 block font-bold uppercase">Experience</span>
                      <span className="font-black text-charcoal">{worker.experienceYears} Years</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400 block font-bold uppercase">Projects</span>
                      <span className="font-black text-charcoal">{worker.completedJobs} Done</span>
                    </div>
                  </div>

                  {/* Skill Badges */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {worker.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-stone-200/70 text-stone-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="mt-4 text-xs italic text-stone-600 line-clamp-2 leading-relaxed">
                    "{worker.quote}"
                  </p>
                </div>

                {/* Bottom CTA */}
                <div className="mt-5 pt-3.5 border-t border-stone-200 flex items-center justify-between">
                  <div className="font-mono text-xs font-bold text-charcoal">
                    ₹{worker.dailyWage}<span className="text-[10px] text-stone-500">/day</span>
                  </div>
                  <button
                    onClick={() => navigate('/login?role=homeowner')}
                    className="text-xs font-black text-[#176B5B] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Passport</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/login?role=homeowner')}
              className="px-6 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold border border-stone-300 transition-colors inline-flex items-center gap-2"
            >
              <span>Explore All 11 Trades in Nirmaan Directory</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* 5. 11 CONSTRUCTION TRADES MATRIX */}
      <section id="trades" className="py-20 bg-[#F7F5EF] border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header & Filter */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#176B5B]/10 text-[#176B5B] text-xs font-extrabold uppercase tracking-wider mb-2">
                <Layers size={13} />
                <span>Standardized Trade Taxonomy</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#17211F] tracking-tight">
                11 RECOGNIZED CONSTRUCTION TRADES
              </h2>
              <p className="text-sm text-stone-600 mt-2 max-w-2xl">
                Every trade has dedicated skill matrices, standard NCR wage benchmarks, and bilingual Devanagari terminology registered in MySQL.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white border border-stone-200 self-start md:self-auto text-xs font-bold">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activeTab === 'all'
                    ? 'bg-[#176B5B] text-white shadow-2xs'
                    : 'text-stone-600 hover:text-charcoal'
                }`}
              >
                All (11)
              </button>
              <button
                onClick={() => setActiveTab('structural')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activeTab === 'structural'
                    ? 'bg-[#176B5B] text-white shadow-2xs'
                    : 'text-stone-600 hover:text-charcoal'
                }`}
              >
                Structural
              </button>
              <button
                onClick={() => setActiveTab('finishing')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activeTab === 'finishing'
                    ? 'bg-[#176B5B] text-white shadow-2xs'
                    : 'text-stone-600 hover:text-charcoal'
                }`}
              >
                Finishing
              </button>
              <button
                onClick={() => setActiveTab('mep')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activeTab === 'mep'
                    ? 'bg-[#176B5B] text-white shadow-2xs'
                    : 'text-stone-600 hover:text-charcoal'
                }`}
              >
                MEP Services
              </button>
            </div>
          </div>

          {/* Trades Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredTrades.map((t) => (
              <div
                key={t.slug}
                onClick={() => navigate(`/worker/${t.slug}`)}
                className="bg-white rounded-3xl border border-stone-200 p-5 hover:border-[#176B5B] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="relative mb-4 h-36 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
                    <img
                      src={t.image}
                      alt={t.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-mono font-bold text-stone-700 shadow-2xs">
                      {t.leadTime}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-lg text-charcoal group-hover:text-[#176B5B] transition-colors">
                      {t.name}
                    </h3>
                    <span className="text-xs font-bold text-stone-500">{t.hindi}</span>
                  </div>

                  <div className="text-xs font-mono font-extrabold text-[#176B5B] mt-1">
                    Benchmark: {t.wage}
                  </div>

                  {/* Skills Pills */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {t.skills.map((s) => (
                      <span
                        key={s}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded bg-stone-100 text-stone-700"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 font-medium">
                  <span>{t.verifiedArtisans}</span>
                  <span className="text-[#176B5B] font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                    Hub →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. WORK PASSPORT HERO — FLAGSHIP DIFFERENTIATOR */}
      <section id="passport" className="py-24 bg-white border-b border-stone-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Story & Narrative */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F4B942]/20 text-[#176B5B] text-xs font-extrabold uppercase tracking-wider">
                <Award size={13} className="text-[#F4B942]" />
                <span>Flagship Digital Credential</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#17211F] tracking-tight leading-tight">
                YOUR WORK BECOMES YOUR IDENTITY.
              </h2>

              <p className="text-base text-stone-700 font-medium leading-relaxed">
                A permanent, portable digital record that belongs to the artisan — not the contractor, site supervisor, or middleman.
              </p>

              <p className="text-sm text-stone-600 leading-relaxed">
                When an artisan completes a foundation or plastering milestone, geofenced photos, client feedback, and escrow payouts are recorded directly to their Nirmaan Work Passport. When they walk onto the next site, their reputation precedes them.
              </p>

              {/* Step Timeline */}
              <div className="pt-2 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#176B5B] text-[#F4B942] flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-charcoal uppercase tracking-wider">
                      STARTED & KYC VERIFIED
                    </h4>
                    <p className="text-xs text-stone-500">Government identity and trade skill testing verified in sandbox mode.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#176B5B] text-[#F4B942] flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-charcoal uppercase tracking-wider">
                      FIRST JOB & PROOF OF WORK
                    </h4>
                    <p className="text-xs text-stone-500">Geotagged site photos taken during concrete pouring and brick alignment.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#176B5B] text-[#F4B942] flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-charcoal uppercase tracking-wider">
                      5-STAR REVIEW & MILESTONE RELEASE
                    </h4>
                    <p className="text-xs text-stone-500">Homeowner approves milestone, releases escrow, and rates quality of finish.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#176B5B] text-[#F4B942] flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                    4
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-charcoal uppercase tracking-wider">
                      HIGHER DAILY RATES & CAREER GROWTH
                    </h4>
                    <p className="text-xs text-stone-500">Command 25% higher wages on commercial projects with proof in hand.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => navigate('/register?role=worker')}
                  className="px-6 py-3.5 rounded-2xl bg-[#176B5B] hover:bg-[#125447] text-white font-black text-xs shadow-soft transition-all inline-flex items-center gap-2"
                >
                  <span>Create Your Free Work Passport</span>
                  <ArrowRight size={14} className="text-[#F4B942]" />
                </button>
              </div>
            </div>

            {/* Right Column: Physical-Meets-Digital Work Passport UI Card */}
            <div className="lg:col-span-6">
              <div className="relative mx-auto max-w-md bg-[#FAF8F2] border-2 border-stone-300/80 rounded-3xl p-6 sm:p-8 shadow-2xl">
                {/* Gold Passport Header Strip */}
                <div className="flex items-center justify-between pb-6 border-b border-stone-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#176B5B] text-[#F4B942] font-black text-2xl flex items-center justify-center shadow-md">
                      N
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-extrabold uppercase text-stone-400 tracking-widest block">
                        REPUBLIC OF WORK • NIRMAAN
                      </span>
                      <h3 className="text-base font-black text-charcoal tracking-tight">
                        DIGITAL WORK PASSPORT
                      </h3>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-700 shadow-2xs">
                    <QrCode size={22} />
                  </div>
                </div>

                {/* Artisan Profile Identity */}
                <div className="py-6 flex items-start gap-4">
                  <img
                    src={workerMasonImg}
                    alt="Master Craftsman"
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-[#176B5B] shadow-sm shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xl font-black text-charcoal truncate">Master Craftsman</h4>
                      <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
                    </div>
                    <span className="text-xs font-bold text-[#176B5B] block">
                      Master Mason (राजमिस्त्री) • Level 2
                    </span>
                    <span className="text-[11px] font-mono text-stone-500 block mt-0.5">
                      ID: NRM-2026-MS-0042 • Noida NCR
                    </span>

                    <div className="flex items-center gap-3 mt-2 text-xs font-bold">
                      <span className="text-amber-500 flex items-center gap-0.5">
                        <Star size={13} fill="currentColor" /> 4.8 ★
                      </span>
                      <span className="text-stone-400">•</span>
                      <span className="text-stone-700">Verified Skills</span>
                      <span className="text-stone-400">•</span>
                      <span className="text-[#176B5B] font-mono">₹850/day</span>
                    </div>
                  </div>
                </div>

                {/* Verified Skills Grid */}
                <div className="py-4 border-t border-b border-stone-200">
                  <span className="text-[10px] font-black uppercase text-stone-400 tracking-wider block mb-2.5">
                    VERIFIED TRADE COMPETENCIES
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-xl bg-white border border-stone-200 flex items-center justify-between">
                      <span className="font-bold text-stone-800">Brickwork (9" & 4")</span>
                      <Check size={12} className="text-emerald-600 font-black" />
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-stone-200 flex items-center justify-between">
                      <span className="font-bold text-stone-800">RCC Casting</span>
                      <Check size={12} className="text-emerald-600 font-black" />
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-stone-200 flex items-center justify-between">
                      <span className="font-bold text-stone-800">Smooth Plaster</span>
                      <Check size={12} className="text-emerald-600 font-black" />
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-stone-200 flex items-center justify-between">
                      <span className="font-bold text-stone-800">Foundation Beam</span>
                      <Check size={12} className="text-emerald-600 font-black" />
                    </div>
                  </div>
                </div>

                {/* On-Site Proof of Work Evidence Strip */}
                <div className="pt-4">
                  <span className="text-[10px] font-black uppercase text-stone-400 tracking-wider block mb-2">
                    LATEST SITE WORK EVIDENCE (PROOF)
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-16 rounded-xl overflow-hidden bg-stone-200 border border-stone-300 relative group">
                      <img
                        src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=300&q=80"
                        alt="Evidence 1"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 left-1 text-[8px] font-mono text-white bg-black/60 px-1 rounded">
                        10:42 AM
                      </span>
                    </div>
                    <div className="h-16 rounded-xl overflow-hidden bg-stone-200 border border-stone-300 relative group">
                      <img
                        src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=300&q=80"
                        alt="Evidence 2"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 left-1 text-[8px] font-mono text-white bg-black/60 px-1 rounded">
                        02:15 PM
                      </span>
                    </div>
                    <div className="h-16 rounded-xl overflow-hidden bg-stone-200 border border-stone-300 relative group">
                      <img
                        src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=300&q=80"
                        alt="Evidence 3"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 left-1 text-[8px] font-mono text-white bg-black/60 px-1 rounded">
                        Milestone 3
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Signature */}
                <div className="mt-5 pt-4 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-500 font-mono">
                  <span>Tamper-evident record</span>
                  <span className="text-emerald-700 font-bold">● Active on Registry</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. THE NIRMAAN LOOP (FLYWHEEL) */}
      <section id="loop" className="py-20 bg-[#F7F5EF] border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#176B5B]/10 text-[#176B5B] text-xs font-extrabold uppercase tracking-wider mb-2">
              <TrendingUp size={13} />
              <span>Virtuous Career Flywheel</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#17211F] tracking-tight">
              THE NIRMAAN LOOP
            </h2>
            <p className="text-base font-semibold text-[#176B5B] mt-2">
              "Every completed job makes the next opportunity easier."
            </p>
          </div>

          {/* 6 Stage Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loopStages.map((stage) => {
              const Icon = stage.icon;
              return (
                <div
                  key={stage.step}
                  className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs hover:shadow-md transition-shadow relative overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#176B5B]/10 text-[#176B5B] flex items-center justify-center">
                      <Icon size={22} />
                    </div>
                    <span className="text-3xl font-black font-mono text-stone-200">
                      {stage.step}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-charcoal">{stage.title}</h3>
                    <span className="text-xs font-bold text-[#176B5B]">({stage.hindi})</span>
                  </div>

                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                    {stage.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. THREE USER TYPES — BUILT FOR EVERYONE ON THE SITE */}
      <section id="homeowners" className="py-24 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-stone-400 block mb-1">
              ECOSYSTEM PARTICIPANTS
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#17211F] tracking-tight">
              BUILT FOR EVERYONE ON THE SITE
            </h2>
            <p className="text-sm text-stone-600 mt-2">
              Construction succeeds when workers, homeowners, and contractors share the same trusted source of truth.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Card 1: Workers */}
            <div className="bg-[#FAF8F2] rounded-3xl border-2 border-stone-200 p-8 flex flex-col justify-between hover:border-[#176B5B] transition-all">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#176B5B] text-[#F4B942] flex items-center justify-center mb-6 shadow-sm">
                  <HardHat size={28} />
                </div>
                <span className="text-xs font-black uppercase text-[#176B5B] tracking-wider block">
                  FOR SKILLED ARTISANS
                </span>
                <h3 className="text-2xl font-black text-charcoal mt-1 mb-3">
                  WORKERS
                </h3>
                <p className="text-sm font-semibold text-stone-700 italic mb-4">
                  "Find work. Build your reputation. Grow your career."
                </p>
                <ul className="space-y-2.5 text-xs text-stone-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-[#176B5B] shrink-0" />
                    <span>Permanent digital Work Passport with verified credentials</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-[#176B5B] shrink-0" />
                    <span>Zero commission cut taken from your daily wages</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-[#176B5B] shrink-0" />
                    <span>Milestone escrow guarantees payment on work approval</span>
                  </li>
                </ul>
              </div>

              <div className="pt-8 mt-6 border-t border-stone-200">
                <button
                  onClick={() => navigate('/register?role=worker')}
                  className="w-full py-3.5 rounded-xl bg-[#176B5B] hover:bg-[#125447] text-white font-bold text-xs shadow-soft transition-all"
                >
                  Join as an Artisan
                </button>
              </div>
            </div>

            {/* Card 2: Homeowners */}
            <div className="bg-[#FAF8F2] rounded-3xl border-2 border-stone-200 p-8 flex flex-col justify-between hover:border-emerald-600 transition-all">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-700 text-white flex items-center justify-center mb-6 shadow-sm">
                  <Home size={28} />
                </div>
                <span className="text-xs font-black uppercase text-emerald-800 tracking-wider block">
                  FOR PROPERTY OWNERS
                </span>
                <h3 className="text-2xl font-black text-charcoal mt-1 mb-3">
                  HOMEOWNERS
                </h3>
                <p className="text-sm font-semibold text-stone-700 italic mb-4">
                  "Find skilled workers you can trust."
                </p>
                <ul className="space-y-2.5 text-xs text-stone-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-700 shrink-0" />
                    <span>Side-by-side craftsman comparisons with real past work photos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-700 shrink-0" />
                    <span>AI Assistant translates ideas into trade specifications</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-700 shrink-0" />
                    <span>Release milestone payments only when you inspect the quality</span>
                  </li>
                </ul>
              </div>

              <div className="pt-8 mt-6 border-t border-stone-200">
                <button
                  onClick={() => navigate('/login?role=homeowner')}
                  className="w-full py-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-soft transition-all"
                >
                  Find Trusted Workers
                </button>
              </div>
            </div>

            {/* Card 3: Contractors */}
            <div id="contractors" className="bg-[#FAF8F2] rounded-3xl border-2 border-stone-200 p-8 flex flex-col justify-between hover:border-blue-700 transition-all">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#17211F] text-[#F4B942] flex items-center justify-center mb-6 shadow-sm">
                  <Building2 size={28} />
                </div>
                <span className="text-xs font-black uppercase text-blue-900 tracking-wider block">
                  FOR BUILDERS & PWD CONTRACTORS
                </span>
                <h3 className="text-2xl font-black text-charcoal mt-1 mb-3">
                  CONTRACTORS
                </h3>
                <p className="text-sm font-semibold text-stone-700 italic mb-4">
                  "Build and manage reliable teams."
                </p>
                <ul className="space-y-2.5 text-xs text-stone-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-blue-800 shrink-0" />
                    <span>Geofenced GPS site attendance and digital muster rolls</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-blue-800 shrink-0" />
                    <span>Rapid workforce assembly across all 11 standardized trades</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-blue-800 shrink-0" />
                    <span>PWD Class-A and GSTIN compliance reporting directly in app</span>
                  </li>
                </ul>
              </div>

              <div className="pt-8 mt-6 border-t border-stone-200">
                <button
                  onClick={() => navigate('/login?role=contractor')}
                  className="w-full py-3.5 rounded-xl bg-[#17211F] hover:bg-black text-white font-bold text-xs shadow-soft transition-all"
                >
                  Access Contractor Portal
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. CONSTRUCTION PROJECT STORIES */}
      <section className="py-20 bg-[#F7F5EF] border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#176B5B] block mb-1">
                REAL SITE EVIDENCE
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#17211F] tracking-tight">
                ACTIVE SITE PROJECT STORIES
              </h2>
            </div>
            <div className="text-xs font-mono text-stone-500">
              Persisted in MySQL: <code className="text-[#176B5B]">projects</code> table
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projectStories.map((proj) => (
              <div
                key={proj.id}
                className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 bg-stone-200">
                    <img
                      src={proj.image}
                      alt={proj.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-[#17211F]/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-white text-[11px] font-bold">
                      {proj.status}
                    </div>
                    <div className="absolute bottom-3 right-3 bg-white px-2 py-0.5 rounded text-[10px] font-mono font-bold text-stone-700 shadow-2xs">
                      {proj.evidencePhotos} Photos Verified
                    </div>
                  </div>

                  <div className="p-5">
                    <span className="text-[10px] font-black uppercase text-stone-400 tracking-wider">
                      {proj.category} • {proj.location}
                    </span>
                    <h3 className="text-lg font-black text-charcoal mt-1">
                      {proj.title}
                    </h3>

                    <div className="mt-3 space-y-1.5 text-xs text-stone-600">
                      <div className="flex items-center justify-between">
                        <span>Lead Artisan:</span>
                        <strong className="text-charcoal">{proj.leadWorker}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Contractor:</span>
                        <span className="text-stone-700">{proj.contractor}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Escrow Vault:</span>
                        <span className="font-mono font-bold text-[#176B5B]">{proj.budget}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-stone-500">Progress</span>
                        <span className="font-mono font-black text-[#176B5B]">{proj.progress}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                        <div
                          className="h-full bg-[#176B5B] rounded-full"
                          style={{ width: `${proj.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2">
                  <button
                    onClick={() => navigate('/homeowner/home')}
                    className="w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors"
                  >
                    View Project Timeline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. SOCIAL PROOF & TESTIMONIALS */}
      <section className="py-20 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <span className="text-xs font-mono font-bold uppercase text-stone-400">
              VOICES FROM THE WORKFORCE
            </span>
            <h2 className="text-3xl font-black text-charcoal mt-1">
              "MY WORK DID NOT END WHEN THE SITE ENDED."
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-[#FAF8F2] border border-stone-200 flex flex-col justify-between">
              <p className="text-xs leading-relaxed text-stone-700 italic">
                "Before NIRMAAN, my work ended when the site ended. Now every completed project becomes part of my professional identity."
              </p>
              <div className="mt-6 flex items-center justify-between pt-4 border-t border-stone-200">
                <div>
                  <h4 className="font-black text-xs text-charcoal">Verified Mason</h4>
                  <span className="text-[11px] text-[#176B5B] font-bold">Craftsman (राजमिस्त्री)</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-200 text-stone-600">
                  Verified Artisan
                </span>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#FAF8F2] border border-stone-200 flex flex-col justify-between">
              <p className="text-xs leading-relaxed text-stone-700 italic">
                "For the first time, I hired a mason based on verified past photos and skill certifications rather than random hearsay."
              </p>
              <div className="mt-6 flex items-center justify-between pt-4 border-t border-stone-200">
                <div>
                  <h4 className="font-black text-xs text-charcoal">Independent Client</h4>
                  <span className="text-[11px] text-emerald-800 font-bold">Homeowner • Noida</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-200 text-stone-600">
                  Verified Client
                </span>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#FAF8F2] border border-stone-200 flex flex-col justify-between">
              <p className="text-xs leading-relaxed text-stone-700 italic">
                "Daily attendance tracking with GPS verification solved muster roll disputes across our Noida residential sites."
              </p>
              <div className="mt-6 flex items-center justify-between pt-4 border-t border-stone-200">
                <div>
                  <h4 className="font-black text-xs text-charcoal">Infrastructure Partner</h4>
                  <span className="text-[11px] text-blue-900 font-bold">Class-A PWD Contractor</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-200 text-stone-600">
                  Verified Contractor
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. PLATFORM ARCHITECTURE & STATS (REAL VALUES ONLY) */}
      <section className="py-16 bg-[#17211F] text-white border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <div className="text-3xl sm:text-4xl font-black font-mono text-[#F4B942]">11</div>
              <div className="text-xs font-bold uppercase tracking-wider text-stone-300 mt-1">
                Trades Supported
              </div>
              <div className="text-[10px] text-stone-400 mt-0.5">Bilingual Taxonomy</div>
            </div>

            <div className="p-4">
              <div className="text-3xl sm:text-4xl font-black font-mono text-white">24</div>
              <div className="text-xs font-bold uppercase tracking-wider text-stone-300 mt-1">
                MySQL Tables
              </div>
              <div className="text-[10px] text-stone-400 mt-0.5">nirmaan_db Normalized</div>
            </div>

            <div className="p-4">
              <div className="text-3xl sm:text-4xl font-black font-mono text-[#F4B942]">4</div>
              <div className="text-xs font-bold uppercase tracking-wider text-stone-300 mt-1">
                Platform Roles
              </div>
              <div className="text-[10px] text-stone-400 mt-0.5">Worker • Homeowner • Builder • Admin</div>
            </div>

            <div className="p-4">
              <div className="text-3xl sm:text-4xl font-black font-mono text-white">0%</div>
              <div className="text-xs font-bold uppercase tracking-wider text-stone-300 mt-1">
                Artisan Commission
              </div>
              <div className="text-[10px] text-stone-400 mt-0.5">Direct Daily Wage Escrow</div>
            </div>
          </div>
        </div>
      </section>

      {/* 12. CALL TO ACTION FOOTER BANNER */}
      <section className="py-20 bg-[#176B5B] text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10 space-y-6">
          <span className="text-xs font-black uppercase tracking-widest text-[#F4B942]">
            START BUILDING YOUR DIGITAL WORK PASSPORT TODAY
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Ready to bring dignity, proof, and fair wages to Indian construction?
          </h2>
          <p className="text-sm sm:text-base text-stone-200 max-w-xl mx-auto font-medium">
            Join thousands of skilled craftsmen, verified homeowners, and licensed builders on Nirmaan 2.0.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/register?role=worker')}
              className="px-8 py-4 rounded-2xl bg-[#F4B942] hover:bg-amber-400 text-[#17211F] font-black text-sm shadow-md transition-all flex items-center gap-2"
            >
              <HardHat size={18} />
              <span>Register as Artisan</span>
              <ArrowRight size={16} />
            </button>

            <button
              onClick={() => navigate('/login?role=homeowner')}
              className="px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-sm transition-all flex items-center gap-2"
            >
              <Home size={18} />
              <span>Homeowner Sign In</span>
            </button>
          </div>
        </div>
      </section>

      {/* 13. COMPREHENSIVE CONSTRUCTION-INDUSTRY FOOTER */}
      <footer className="bg-[#17211F] text-stone-400 text-xs pt-16 pb-12 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-stone-800">
            {/* Column 1: Brand & Identity */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#176B5B] flex items-center justify-center text-[#F4B942] font-black text-xl">
                  N
                </div>
                <span className="font-black text-xl text-white tracking-tight">NIRMAAN 2.0</span>
              </div>
              <p className="text-xs text-stone-400 max-w-sm leading-relaxed">
                National digital workforce registry connecting verified Indian construction artisans with homeowners and licensed contractors through permanent Work Passports.
              </p>
              <div className="text-[11px] font-mono text-[#F4B942]">
                "Your Work. Your Reputation. Your Future."
              </div>
            </div>

            {/* Column 2: Workforce & Trades */}
            <div className="space-y-3">
              <h4 className="font-black text-white text-xs uppercase tracking-wider">
                11 Trades
              </h4>
              <ul className="space-y-1.5 text-[11px]">
                <li><a href="#trades" className="hover:text-white">Mason / राजमिस्त्री</a></li>
                <li><a href="#trades" className="hover:text-white">Electrician / इलेक्ट्रीशियन</a></li>
                <li><a href="#trades" className="hover:text-white">Plumber / प्लम्बर</a></li>
                <li><a href="#trades" className="hover:text-white">Carpenter / बढ़ई</a></li>
                <li><a href="#trades" className="hover:text-white">Painter / पेंटर</a></li>
                <li><a href="#trades" className="hover:text-white">Tile Worker / टाइल मिस्त्री</a></li>
              </ul>
            </div>

            {/* Column 3: Platform Experiences */}
            <div className="space-y-3">
              <h4 className="font-black text-white text-xs uppercase tracking-wider">
                Platform Shells
              </h4>
              <ul className="space-y-1.5 text-[11px]">
                <li><button onClick={() => navigate('/worker/mason')} className="hover:text-white text-left">Worker Dashboard</button></li>
                <li><button onClick={() => navigate('/homeowner/home')} className="hover:text-white text-left">Homeowner Hub</button></li>
                <li><button onClick={() => navigate('/contractor/dashboard')} className="hover:text-white text-left">Contractor Portal</button></li>
                <li><button onClick={() => navigate('/admin/dashboard')} className="hover:text-white text-left">Control Centre (Admin)</button></li>
                <li><button onClick={() => navigate('/trust')} className="hover:text-white text-left">Trust Centre</button></li>
                <li><button onClick={() => navigate('/impact')} className="hover:text-white text-left">National Impact</button></li>
              </ul>
            </div>

            {/* Column 4: Architecture & Security */}
            <div className="space-y-3">
              <h4 className="font-black text-white text-xs uppercase tracking-wider">
                Technology
              </h4>
              <ul className="space-y-1.5 text-[11px]">
                <li><span>PHP 8+ REST Engine</span></li>
                <li><span>MySQL Database (nirmaan_db)</span></li>
                <li><span>Bcrypt Password Security</span></li>
                <li><span>Aadhaar e-KYC (Sandbox)</span></li>
                <li><span>Direct UPI Escrow Simulation</span></li>
                <li><span>GPS Muster Attendance</span></li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500 font-mono">
            <div>
              © NIRMAAN 2.0 • Civic-Tech Construction Workforce Platform • All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <span>National Hackathon Build</span>
              <span>•</span>
              <button
                onClick={() => navigate('/admin/database')}
                className="text-stone-400 hover:text-[#F4B942]"
              >
                Database Matrix
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

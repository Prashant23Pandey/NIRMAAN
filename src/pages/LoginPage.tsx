import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  Phone,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Button, Input, Alert } from '../components/ui';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedRole = searchParams.get('role');

  const { setRole, showToast, refreshAuthUser } = useApp();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.post<any>('auth/login.php', { identifier, password });

      if (res.token) {
        api.setToken(res.token);
      }
      if (res.user) {
        localStorage.setItem('nirmaan_user', JSON.stringify(res.user));
        await refreshAuthUser();
      }

      const userRole = (res.user?.role || 'WORKER').toUpperCase();
      const professionSlug = res.user?.profession_slug || 'mason';

      if (userRole === 'SUPER_ADMIN' || userRole === 'ADMIN' || userRole === 'EMPLOYEE') {
        setRole('admin');
        showToast(`Welcome back, ${res.user?.full_name || res.user?.name || 'Administrator'}!`, 'success');
        navigate('/admin/dashboard');
      } else if (userRole === 'HOMEOWNER' || userRole === 'CLIENT') {
        setRole('homeowner');
        showToast(`Welcome back, ${res.user?.full_name || res.user?.name || 'Homeowner'}!`, 'success');
        navigate('/homeowner/home');
      } else if (userRole === 'CONTRACTOR') {
        setRole('contractor');
        showToast(`Welcome back, ${res.user?.full_name || res.user?.name || 'Contractor'}!`, 'success');
        navigate('/contractor/dashboard');
      } else {
        setRole('worker');
        showToast(`Welcome back, ${res.user?.full_name || res.user?.name || 'Artisan'}!`, 'success');
        navigate(`/worker/${professionSlug}`);
      }
    } catch (err: any) {
      console.warn('Login request notice:', err);
      setError(err.message || 'Invalid credentials. Please verify your ID, phone, or email and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5EF] flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8">
      {/* Top bar */}
      <div className="max-w-5xl mx-auto w-full mb-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group cursor-pointer">
          <div className="w-8 h-8 rounded-xl bg-[#176B5B] flex items-center justify-center text-[#F4B942] font-black text-sm group-hover:scale-105 transition-transform">
            N
          </div>
          <span className="font-black text-lg tracking-tight text-[#17211F]">NIRMAAN</span>
        </Link>
        <Link
          to="/register"
          className="text-xs font-bold text-[#176B5B] hover:underline flex items-center gap-1"
        >
          <span>Need an account? Register</span>
          <ArrowRight size={13} />
        </Link>
      </div>

      <div className="max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden shadow-elevated border border-stone-200/90 bg-white">

        {/* Left Side — Branding */}
        <div className="lg:col-span-5 bg-[#17211F] text-white p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-stone-300 text-xs font-bold border border-white/10">
              <ShieldCheck size={14} className="text-[#2E8B57]" />
              <span>National Workforce Registry</span>
            </div>

            <div>
              <h2 className="text-3xl font-black tracking-tight leading-tight">
                Your Work.
                <br />
                <span className="text-[#F4B942]">Your Reputation.</span>
                <br />
                Your Future.
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 mt-3 font-medium leading-relaxed">
                Log into India's premier skilled construction ecosystem. Manage your digital Work
                Passport, discover high-paying projects, or hire verified craftsmen.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2.5 text-xs text-stone-300 font-semibold">
                <CheckCircle2 size={16} className="text-[#2E8B57] shrink-0" />
                <span>100% Aadhaar KYC &amp; Skill Verified Artisans</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-stone-300 font-semibold">
                <CheckCircle2 size={16} className="text-[#2E8B57] shrink-0" />
                <span>Direct Site Muster Roll &amp; Daily Wage Records</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-stone-300 font-semibold">
                <CheckCircle2 size={16} className="text-[#2E8B57] shrink-0" />
                <span>Zero Middlemen &amp; Transparent Milestone Escrow</span>
              </div>
            </div>
          </div>

          {/* Testimonial */}
          <div className="pt-8 border-t border-white/10 mt-8 relative z-10">
            <p className="text-xs text-stone-300 italic leading-relaxed">
              "NIRMAAN's Work Passport gives skilled workers permanent, verifiable proof of project
              milestones, empowering craftsmen with direct fair wages."
            </p>
            <div className="flex items-center gap-3 mt-3">
              <div className="w-8 h-8 rounded-full bg-[#176B5B] flex items-center justify-center font-black text-xs text-white">
                N
              </div>
              <div>
                <div className="text-xs font-bold text-white">Verified Artisan Network</div>
                <div className="text-[10px] text-stone-400">Portable Digital Identity • Verified Ledger</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side — Login Form */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
          <div>
            <div className="mb-6">
              <h3 className="text-2xl font-black text-[#17211F] tracking-tight">Log In to Nirmaan</h3>
              <p className="text-xs sm:text-sm text-stone-500 font-medium mt-0.5">
                Enter your registered phone or email to continue
              </p>
            </div>

            {error && (
              <Alert variant="error" className="mb-5" onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                label="Registration ID, Phone Number, or Email"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter your ID, phone number, or email"
                icon={<Phone size={16} />}
                required
              />

              <div>
                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    icon={<Lock size={16} />}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-8 text-stone-400 hover:text-stone-600 p-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <div className="flex items-center justify-between mt-2 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer text-stone-600 font-medium">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded text-[#176B5B] focus:ring-[#176B5B]"
                    />
                    <span>Keep me signed in</span>
                  </label>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      showToast('Password reset link sent to your registered phone number.', 'info');
                    }}
                    className="text-[#176B5B] font-bold hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>

              <Button variant="primary" size="md" fullWidth type="submit" loading={loading}>
                Sign In to Platform
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

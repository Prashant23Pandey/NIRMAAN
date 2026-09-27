import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, Sparkles, Building2 } from 'lucide-react';
import { api } from '../../services/api';
import { useApp } from '../../context/AppContext';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setRole, showToast } = useApp();

  const [email, setEmail] = useState('admin@nirmaan.local');
  const [password, setPassword] = useState('Admin@123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res: any = await api.post('auth/login.php', {
        identifier: email,
        password: password,
      });

      if (res.token) {
        api.setToken(res.token);
      }

      setRole('SUPER_ADMIN');
      showToast('✓ Welcome Super Administrator! Accessing Nirmaan Control Centre...', 'success');
      navigate('/admin/dashboard');
    } catch (err: any) {
      // In case PHP backend isn't up, allow valid demo password fallback
      if (email === 'admin@nirmaan.local' && password === 'Admin@123') {
        setRole('SUPER_ADMIN');
        showToast('✓ Access granted to Super Admin Control Centre (Demo session)', 'success');
        navigate('/admin/dashboard');
      } else {
        setError(err.message || 'Invalid credentials. Demo: admin@nirmaan.local / Admin@123');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = () => {
    setEmail('admin@nirmaan.local');
    setPassword('Admin@123');
  };

  return (
    <div className="min-h-screen bg-[#17211F] text-white flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-[#1F2B28] rounded-3xl p-8 border border-stone-700/80 shadow-2xl space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-secondary font-black text-2xl mx-auto shadow-elevated">
            N
          </div>
          <h2 className="text-2xl font-black tracking-tight">NIRMAAN CONTROL CENTRE</h2>
          <p className="text-xs text-stone-400">
            Institutional Administration & National Construction Workforce Governance
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-primary font-black text-[11px] uppercase tracking-wider">
            Super Administrator Portal
          </div>
        </div>

        {/* Demo Credentials Quick Click */}
        <div
          onClick={handleQuickFill}
          className="p-3.5 rounded-2xl bg-stone-800/80 border border-stone-700 text-xs flex items-center justify-between cursor-pointer hover:border-secondary transition-colors"
        >
          <div className="space-y-0.5">
            <span className="font-extrabold text-secondary flex items-center gap-1">
              <Sparkles size={12} />
              <span>Demo Credentials</span>
            </span>
            <div className="text-[11px] text-stone-300 font-mono">
              admin@nirmaan.local • Admin@123
            </div>
          </div>
          <span className="text-[11px] text-stone-400 font-bold underline">Auto-fill</span>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-900/50 border border-red-700 text-red-200 text-xs">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-300 block">Admin Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" size={16} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@nirmaan.local"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-stone-900 border border-stone-700 text-sm font-semibold text-white focus:outline-hidden focus:border-secondary"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-300 block">Security Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" size={16} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-stone-900 border border-stone-700 text-sm font-semibold text-white focus:outline-hidden focus:border-secondary"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-secondary hover:bg-amber-400 text-primary font-black text-sm flex items-center justify-center gap-2 shadow-soft transition-all touch-target disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'ACCESS CONTROL CENTRE'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="pt-2 text-center">
          <button
            onClick={() => {
              setRole('worker');
              navigate('/worker/home');
            }}
            className="text-xs text-stone-400 hover:text-stone-200 underline font-semibold"
          >
            ← Return to Worker / Homeowner Portal
          </button>
        </div>
      </div>
    </div>
  );
};

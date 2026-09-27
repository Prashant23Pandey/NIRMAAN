import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  HardHat,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Upload,
  Calendar,
  IndianRupee,
  MapPin,
  Clock,
  ShieldCheck,
  Award,
  Sparkles,
  Camera,
} from 'lucide-react';
import { api } from '../../services/api';
import { useApp } from '../../context/AppContext';

export const WorkerRegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const { setRole, showToast, refreshAuthUser } = useApp();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Noida');
  const [avatar, setAvatar] = useState(
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&h=400&q=80'
  );

  // Professions & Skills
  const [professions, setProfessions] = useState<any[]>([]);
  const [selectedProfessionId, setSelectedProfessionId] = useState<number>(1);
  const [availableSkills, setAvailableSkills] = useState<any[]>([]);
  const [selectedSkillIds, setSelectedSkillIds] = useState<number[]>([]);

  // Experience, Wage, Availability, Docs
  const [yearsExperience, setYearsExperience] = useState(3);
  const [expectedDailyWage, setExpectedDailyWage] = useState(850);
  const [isAvailable, setIsAvailable] = useState(true);
  const [documentType, setDocumentType] = useState('Aadhaar Card');
  const [documentNumber, setDocumentNumber] = useState('');

  // Load Professions from MySQL
  useEffect(() => {
    api
      .get('professions/list.php')
      .then((res: any) => {
        if (res.success && res.professions) {
          setProfessions(res.professions);
          if (res.professions[0]) {
            setSelectedProfessionId(res.professions[0].id);
          }
        }
      })
      .catch((err) => console.warn('Could not load professions:', err.message));
  }, []);

  // Load Skills for selected profession
  useEffect(() => {
    if (!selectedProfessionId) return;
    api
      .get(`skills/list.php?profession_id=${selectedProfessionId}`)
      .then((res: any) => {
        if (res.success && res.skills) {
          setAvailableSkills(res.skills);
          setSelectedSkillIds(res.skills.slice(0, 3).map((s: any) => s.id));
        }
      })
      .catch((err) => console.warn('Could not load skills:', err.message));
  }, [selectedProfessionId]);

  const toggleSkill = (id: number) => {
    if (selectedSkillIds.includes(id)) {
      setSelectedSkillIds(selectedSkillIds.filter((s) => s !== id));
    } else {
      setSelectedSkillIds([...selectedSkillIds, id]);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        name,
        phone,
        email,
        city,
        avatar,
        profession_id: selectedProfessionId,
        skill_ids: selectedSkillIds,
        years_experience: yearsExperience,
        expected_daily_wage: expectedDailyWage,
        is_available: isAvailable,
        document_type: documentType,
        document_number: documentNumber,
      };

      const res: any = await api.post('auth/register_worker.php', payload);
      if (res.token) {
        api.setToken(res.token);
      }
      if (res.user) {
        localStorage.setItem('nirmaan_user', JSON.stringify(res.user));
        await refreshAuthUser();
      }

      setRole('worker');
      showToast('✓ Registration complete! Saved directly into MySQL database.', 'success');
      const targetSlug = res.user?.profession_slug || 'electrician';
      navigate(`/worker/${targetSlug}`);
    } catch (err: any) {
      showToast(err.message || 'Registration failed. Please check inputs.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const stepsTitle = [
    'Basic Information',
    'Select Profession',
    'Profession Skills',
    'Work Experience',
    'Daily Wage',
    'Availability',
    'Identity Documents',
  ];

  return (
    <div className="min-h-screen bg-[#F7F5EF] flex flex-col justify-center items-center p-4 py-12">
      <div className="max-w-xl w-full bg-white rounded-3xl p-6 sm:p-9 border border-stone-200 shadow-elevated space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <div>
            <span className="text-[10px] font-black tracking-widest text-primary uppercase">
              7-STEP WORKER ONBOARDING
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-charcoal">
              Step {step} of 7: {stepsTitle[step - 1]}
            </h2>
          </div>
          <span className="text-xs font-mono font-bold text-stone-400">
            {Math.round((step / 7) * 100)}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${(step / 7) * 100}%` }}
          />
        </div>

        {/* Step 1: Basic info */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-charcoal block">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ramesh Kumar"
                className="w-full px-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 text-sm font-semibold text-charcoal"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-charcoal block">Mobile Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 text-sm font-semibold text-charcoal"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-charcoal block">City / Cluster</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 text-sm font-semibold text-charcoal"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-charcoal block">Email Address (Optional)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 text-sm font-semibold text-charcoal"
              />
            </div>
          </div>
        )}

        {/* Step 2: Select profession */}
        {step === 2 && (
          <div className="space-y-3">
            <p className="text-xs text-charcoal-muted">
              Choose your primary construction trade qualification:
            </p>
            <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
              {professions.map((p) => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => setSelectedProfessionId(p.id)}
                  className={`p-3.5 rounded-2xl text-left border transition-all text-xs font-extrabold ${
                    selectedProfessionId === p.id
                      ? 'bg-primary text-white border-primary shadow-soft'
                      : 'bg-stone-50 text-charcoal border-stone-200 hover:border-primary/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{p.name}</span>
                    {selectedProfessionId === p.id && <CheckCircle2 size={14} />}
                  </div>
                  <span className="text-[10px] opacity-80 font-normal block mt-1 line-clamp-1">
                    {p.description}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Select profession-specific skills */}
        {step === 3 && (
          <div className="space-y-3">
            <p className="text-xs text-charcoal-muted">
              Select specific trade competencies to verify on your Work Passport:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {availableSkills.map((s) => (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => toggleSkill(s.id)}
                  className={`p-3 rounded-2xl text-left border text-xs font-bold transition-all ${
                    selectedSkillIds.includes(s.id)
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-stone-50 text-charcoal border-stone-200 hover:border-emerald-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{s.name}</span>
                    {selectedSkillIds.includes(s.id) && <CheckCircle2 size={13} />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Experience */}
        {step === 4 && (
          <div className="space-y-4 text-center py-4">
            <Award size={40} className="mx-auto text-primary" />
            <h3 className="font-extrabold text-charcoal text-lg">How many years of experience?</h3>
            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => setYearsExperience(Math.max(1, yearsExperience - 1))}
                className="w-10 h-10 rounded-xl bg-sand-200 font-black text-lg"
              >
                -
              </button>
              <span className="text-3xl font-black text-primary min-w-[80px]">
                {yearsExperience} yrs
              </span>
              <button
                type="button"
                onClick={() => setYearsExperience(yearsExperience + 1)}
                className="w-10 h-10 rounded-xl bg-sand-200 font-black text-lg"
              >
                +
              </button>
            </div>
            <p className="text-xs text-charcoal-muted">
              5+ years earns a Level 2 Master Artisan credential on Nirmaan.
            </p>
          </div>
        )}

        {/* Step 5: Daily Wage */}
        {step === 5 && (
          <div className="space-y-4 text-center py-4">
            <IndianRupee size={40} className="mx-auto text-secondary-dark" />
            <h3 className="font-extrabold text-charcoal text-lg">Expected Net Daily Wage</h3>
            <div className="text-4xl font-black text-primary">₹{expectedDailyWage}</div>
            <input
              type="range"
              min="500"
              max="2000"
              step="50"
              value={expectedDailyWage}
              onChange={(e) => setExpectedDailyWage(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-stone-400">
              <span>₹500/day</span>
              <span>₹2,000/day</span>
            </div>
          </div>
        )}

        {/* Step 6: Availability */}
        {step === 6 && (
          <div className="space-y-4 py-4">
            <div className="p-4 rounded-2xl bg-sand-50 border border-stone-200 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-charcoal">Available for Immediate Work</h4>
                <p className="text-xs text-charcoal-muted">
                  Show your profile to homeowners within 10 km
                </p>
              </div>
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                className="w-6 h-6 accent-primary rounded cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Step 7: Documents / verification */}
        {step === 7 && (
          <div className="space-y-4">
            <p className="text-xs text-charcoal-muted">
              Attach identification for government BOCW and Nirmaan Verification:
            </p>
            <div className="space-y-2">
              <label className="text-xs font-bold text-charcoal block">Document Type</label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 text-sm font-semibold text-charcoal"
              >
                <option>Aadhaar Card</option>
                <option>Voter ID</option>
                <option>NSDC Skill Certificate</option>
                <option>BOCW Worker Passbook</option>
              </select>
            </div>
            <div className="p-5 rounded-2xl border-2 border-dashed border-stone-300 text-center space-y-2 bg-stone-50">
              <Upload size={24} className="mx-auto text-primary" />
              <div className="text-xs font-bold text-charcoal">
                Simulated UIDAI Verification Ready
              </div>
              <span className="text-[11px] text-emerald-700 font-bold block">
                ✓ Verified via instant simulated Aadhaar biometric hash
              </span>
            </div>
          </div>
        )}

        {/* Footer Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-200">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-charcoal hover:bg-stone-50"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 7 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-6 py-3 rounded-2xl bg-primary hover:bg-primary-600 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-soft"
            >
              <span>Continue</span>
              <ArrowRight size={14} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="px-7 py-3.5 rounded-2xl bg-secondary hover:bg-amber-400 text-primary font-black text-xs shadow-soft disabled:opacity-50"
            >
              {loading ? 'Saving to MySQL...' : 'SUBMIT WORKER REGISTRATION'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

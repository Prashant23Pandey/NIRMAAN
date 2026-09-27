import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HardHat,
  User,
  MapPin,
  Clock,
  IndianRupee,
  Check,
  ArrowRight,
  Sparkles,
  Camera,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const WorkerProfileSetupPage: React.FC = () => {
  const { currentWorker, updateCurrentWorker, showToast } = useApp();
  const navigate = useNavigate();

  const [name, setName] = useState(currentWorker.name);
  const [city, setCity] = useState(currentWorker.city);
  const [experience, setExperience] = useState(currentWorker.yearsExperience);
  const [wage, setWage] = useState(currentWorker.expectedDailyWage);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    currentWorker.skills.map((s) => s.name)
  );

  const availableSkills = [
    'Mason',
    'Electrician',
    'Plumber',
    'Painter',
    'Carpenter',
    'Tile Worker',
    'Helper',
    'Welder',
  ];

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentWorker({
      name,
      city,
      yearsExperience: Number(experience),
      expectedDailyWage: Number(wage),
      skills: selectedSkills.map((s) => ({
        name: s,
        verified: true,
        level: 'Verified Specialist',
      })),
    });
    showToast('Profile setup saved to Nirmaan Passport!', 'success');
    navigate('/worker/home');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl p-6 sm:p-9 border border-stone-200 shadow-elevated">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-stone-100">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <HardHat size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-charcoal tracking-tight">
              Worker Profile Setup
            </h2>
            <p className="text-xs text-charcoal-muted">
              Configure your verified craftsman credentials on the Nirmaan ledger.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Photo Preview & Name */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#FAF8F2] border border-stone-200">
            <div className="relative">
              <img
                src={currentWorker.photo}
                alt="Profile"
                className="w-16 h-16 rounded-2xl object-cover border-2 border-primary"
              />
              <div className="absolute -bottom-1 -right-1 p-1 bg-primary text-white rounded-lg shadow">
                <Camera size={12} />
              </div>
            </div>
            <div className="flex-1">
              <label className="text-xs font-bold text-charcoal block mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm font-semibold focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* City */}
          <div>
            <label className="text-xs font-bold text-charcoal block mb-1">
              Operating City / Region
            </label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3.5 top-3 text-stone-400" />
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Noida / Greater Noida"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Experience & Wage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-charcoal block mb-1">
                Years of Experience
              </label>
              <div className="relative">
                <Clock size={16} className="absolute left-3.5 top-3 text-stone-400" />
                <input
                  type="number"
                  min="1"
                  max="40"
                  required
                  value={experience}
                  onChange={(e) => setExperience(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-charcoal block mb-1">
                Expected Daily Wage (₹)
              </label>
              <div className="relative">
                <IndianRupee size={16} className="absolute left-3.5 top-3 text-stone-400" />
                <input
                  type="number"
                  min="400"
                  step="50"
                  required
                  value={wage}
                  onChange={(e) => setWage(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-primary font-bold text-primary"
                />
              </div>
            </div>
          </div>

          {/* Skill Selection */}
          <div>
            <label className="text-xs font-bold text-charcoal block mb-2">
              Trade & Skills (Select all that apply)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {availableSkills.map((skill) => {
                const isSelected = selectedSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-between transition-all touch-target ${
                      isSelected
                        ? 'bg-primary text-white border-primary shadow-xs'
                        : 'bg-stone-50 border-stone-200 text-charcoal hover:border-primary/40'
                    }`}
                  >
                    <span>{skill}</span>
                    {isSelected && <Check size={14} className="text-secondary" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100">
            <button
              type="submit"
              className="w-full py-4 px-6 rounded-2xl bg-primary hover:bg-primary-600 text-white font-bold text-sm flex items-center justify-center gap-2 touch-target shadow-soft transition-all"
            >
              <span>Continue to Dashboard</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

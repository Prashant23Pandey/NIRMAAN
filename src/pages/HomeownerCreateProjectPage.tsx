import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Building,
  MapPin,
  Calendar,
  Users,
  IndianRupee,
  FileText,
  Sparkles,
  Bot,
  CheckCircle2,
  Navigation,
  Compass,
  Clock,
  Layers,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';

export const HomeownerCreateProjectPage: React.FC = () => {
  const navigate = useNavigate();
  const { createProject, showToast, refreshProjects } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Professions & Dynamic Skills
  const [professions, setProfessions] = useState<any[]>([]);
  const [selectedProfessionId, setSelectedProfessionId] = useState<number>(1);
  const [availableSkills, setAvailableSkills] = useState<any[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  // Budget & Timeline
  const [budget, setBudget] = useState('');
  const [startDate, setStartDate] = useState('');
  const [durationDays, setDurationDays] = useState(1);
  const [workersNeeded, setWorkersNeeded] = useState(1);
  const [urgency, setUrgency] = useState<'normal' | 'urgent' | 'immediate'>('normal');

  // Location & Geolocation (Opt-in)
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [radiusKm, setRadiusKm] = useState(10);
  const [gpsStatus, setGpsStatus] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 1. Load Professions from MySQL
  useEffect(() => {
    api
      .get<{ professions: any[] }>('professions/list.php')
      .then((res) => {
        if (res?.professions?.length) {
          setProfessions(res.professions);
        }
      })
      .catch(() => {
        setProfessions([
          { id: 1, name: 'Mason', slug: 'mason' },
          { id: 2, name: 'Electrician', slug: 'electrician' },
          { id: 3, name: 'Plumber', slug: 'plumber' },
          { id: 4, name: 'Carpenter', slug: 'carpenter' },
          { id: 5, name: 'Painter', slug: 'painter' },
          { id: 6, name: 'Tile Worker', slug: 'tile-worker' },
          { id: 7, name: 'Welder', slug: 'welder' },
          { id: 8, name: 'HVAC', slug: 'hvac' },
          { id: 9, name: 'Roofer', slug: 'roofer' },
          { id: 10, name: 'Flooring', slug: 'flooring' },
          { id: 11, name: 'Helper', slug: 'helper' },
        ]);
      });
  }, []);

  // 2. Load Skills dynamically when Profession changes (PART 13)
  useEffect(() => {
    if (!selectedProfessionId) return;

    api
      .get<{ skills: any[] }>(`skills/list.php?profession_id=${selectedProfessionId}`)
      .then((res) => {
        if (res?.skills?.length) {
          setAvailableSkills(res.skills);
          // Auto-select first two skills if empty
          setSelectedSkills(res.skills.slice(0, 2).map((s) => s.name));
        } else {
          setAvailableSkills([]);
        }
      })
      .catch(() => {
        // Fallback trade skills
        const defaults: Record<number, string[]> = {
          1: ['Brickwork', 'RCC', 'Plastering', 'Foundation', 'Block Work'],
          2: ['Conduit Wiring', 'DB Dressing', 'Solar Inverter', 'CCTV', 'Electrical Troubleshooting'],
          3: ['Pipe Fitting', 'Drainage', 'Sanitary Mounting', 'Leak Repair', 'CPVC Lines'],
          4: ['Modular Kitchens', 'Door Framing', 'Wood Joinery', 'Furniture Finishing'],
        };
        const list = (defaults[selectedProfessionId] || ['Trade Work', 'Precision Finishing']).map((name, i) => ({
          id: i + 1,
          name,
        }));
        setAvailableSkills(list);
        setSelectedSkills(list.slice(0, 2).map((s) => s.name));
      });
  }, [selectedProfessionId]);

  const toggleSkill = (skillName: string) => {
    if (selectedSkills.includes(skillName)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skillName));
    } else {
      setSelectedSkills([...selectedSkills, skillName]);
    }
  };

  // Opt-in Browser Geolocation (PART 10 & 11)
  const handleUseCurrentLocation = () => {
    if (!('geolocation' in navigator)) {
      showToast('Geolocation is not supported by your browser.', 'info');
      return;
    }

    setLocating(true);
    setGpsStatus('Requesting browser location permission...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setGpsStatus(
          `GPS Fixed: ${position.coords.latitude.toFixed(4)}°N, ${position.coords.longitude.toFixed(4)}°E`
        );
        setLocating(false);
        showToast('Site location captured with your explicit permission.', 'success');
      },
      (err) => {
        setLocating(false);
        setGpsStatus('Location access denied or unavailable.');
        showToast('Location permission not granted. Using manual address.', 'info');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !address) {
      showToast('Please provide a job title and site address.', 'warning');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        title,
        description,
        profession_id: selectedProfessionId,
        skills: selectedSkills,
        required_skills: selectedSkills,
        budget: Number(budget) || 8000,
        start_date: startDate,
        duration_days: durationDays,
        workers_needed: workersNeeded,
        address,
        location: address,
        city,
        pincode,
        latitude,
        longitude,
        radius_km: radiusKm,
        urgency,
      };

      const res: any = await api.post('jobs/create.php', payload);

      // Also persist to projects table so it appears in homeowner projects
      await api.post('projects/create.php', {
        name: title,
        category: selectedProfObj?.name || 'Renovation',
        location: address,
        city: city || 'Local Area',
        budget: Number(budget) || 0,
        start_date: startDate || 'Immediate',
        description: description,
      }).catch(() => {});

      if (res.success) {
        await refreshProjects();
        showToast(
          `✓ Job & Project created! Found ${res.matched_workers_count || 0} matching ${res.profession_name || 'artisan'} craftsmen in MySQL!`,
          'success'
        );
        navigate('/homeowner/home');
      } else {
        showToast(res.error || 'Failed to create job in database.', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Job creation error', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedProfObj = professions.find((p) => p.id === selectedProfessionId);

  return (
    <div className="space-y-6 pb-16 max-w-3xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate('/homeowner/home')}
        className="inline-flex items-center gap-2 text-xs font-bold text-charcoal hover:text-primary transition-colors cursor-pointer"
      >
        <ArrowLeft size={16} />
        <span>Back to Home</span>
      </button>

      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-black text-xs mb-2">
          <Building size={13} />
          <span>REAL WORKFORCE MARKETPLACE SCOPE</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal tracking-tight">
          Create Construction Job
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-muted">
          Define trade requirements, budget, and site radius. The system matches and alerts verified craftsmen in MySQL.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-soft space-y-6"
      >
        {/* Step 1: Profession Selection (PART 13) */}
        <div className="space-y-2">
          <label className="text-xs font-extrabold text-charcoal uppercase tracking-wider block">
            What Type of Worker Do You Need? (Select Exactly One Trade)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {professions.map((prof) => {
              const isSelected = selectedProfessionId === prof.id;
              return (
                <button
                  type="button"
                  key={prof.id}
                  onClick={() => setSelectedProfessionId(prof.id)}
                  className={`p-3 rounded-2xl text-xs font-bold border transition-all text-center touch-target cursor-pointer ${
                    isSelected
                      ? 'bg-primary text-white border-primary shadow-soft scale-102'
                      : 'bg-stone-50 text-charcoal border-stone-200 hover:border-primary/40'
                  }`}
                >
                  {prof.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Dynamic Skills Checkboxes (PART 13) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-extrabold text-charcoal uppercase tracking-wider block">
              Required Skills for {selectedProfObj?.name || 'Selected Trade'}
            </label>
            <span className="text-[10px] text-primary font-bold">
              Loaded dynamically from MySQL registry
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {availableSkills.map((skill) => {
              const checked = selectedSkills.includes(skill.name);
              return (
                <button
                  type="button"
                  key={skill.id}
                  onClick={() => toggleSkill(skill.name)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                    checked
                      ? 'bg-secondary text-primary border-secondary font-black shadow-2xs'
                      : 'bg-stone-50 text-charcoal border-stone-200 hover:border-primary/30'
                  }`}
                >
                  <CheckCircle2 size={13} className={checked ? 'text-primary' : 'text-stone-300'} />
                  <span>{skill.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Job Title & Description */}
        <div className="space-y-4 pt-2 border-t border-stone-100">
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-charcoal uppercase tracking-wider block">
              Job Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Bathroom Electrical Work"
              className="w-full px-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 text-sm font-semibold text-charcoal focus:outline-hidden focus:border-primary focus:bg-white shadow-2xs"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-charcoal uppercase tracking-wider block">
              Detailed Scope & Requirements
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Specify conduit sizes, DB specs, tools needed..."
              className="w-full px-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 text-sm font-medium text-charcoal focus:outline-hidden focus:border-primary focus:bg-white shadow-2xs"
            />
          </div>
        </div>

        {/* Step 4: Budget, Duration, Workers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-stone-100">
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-charcoal uppercase tracking-wider flex items-center gap-1">
              <IndianRupee size={13} className="text-primary" />
              <span>Total Labour Budget</span>
            </label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="e.g. 8000"
              className="w-full px-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 text-sm font-black text-primary focus:outline-hidden focus:border-primary focus:bg-white shadow-2xs"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-charcoal uppercase tracking-wider flex items-center gap-1">
              <Calendar size={13} className="text-primary" />
              <span>Start Date</span>
            </label>
            <input
              type="text"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="e.g. 28 September 2026"
              className="w-full px-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 text-sm font-semibold text-charcoal focus:outline-hidden focus:border-primary focus:bg-white shadow-2xs"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-charcoal uppercase tracking-wider flex items-center gap-1">
              <Clock size={13} className="text-primary" />
              <span>Duration (Days)</span>
            </label>
            <input
              type="number"
              value={durationDays}
              onChange={(e) => setDurationDays(Number(e.target.value))}
              min={1}
              max={60}
              className="w-full px-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 text-sm font-semibold text-charcoal focus:outline-hidden focus:border-primary focus:bg-white shadow-2xs"
            />
          </div>
        </div>

        {/* Step 5: Site Location & Radius (PART 10 & 11) */}
        <div className="space-y-3 pt-2 border-t border-stone-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="text-xs font-extrabold text-charcoal uppercase tracking-wider flex items-center gap-1.5">
              <MapPin size={13} className="text-primary" />
              <span>Site Address & Geo Location</span>
            </label>

            {/* Opt-in "Use my current location" button (PART 10) */}
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={locating}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-700 bg-sand-100 px-3 py-1.5 rounded-xl border border-stone-200 transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Navigation size={13} className={locating ? 'animate-spin' : ''} />
              <span>{locating ? 'Locating...' : 'Use my current location'}</span>
            </button>
          </div>

          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g. Sector 62, Noida, Uttar Pradesh"
            className="w-full px-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 text-sm font-semibold text-charcoal focus:outline-hidden focus:border-primary focus:bg-white shadow-2xs"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-stone-500">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Noida"
                className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold text-charcoal"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-stone-500">Pincode</label>
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="201301"
                className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold text-charcoal"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-stone-500">Preferred Search Radius</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="2"
                  max="30"
                  value={radiusKm}
                  onChange={(e) => setRadiusKm(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <span className="text-xs font-bold text-primary shrink-0">{radiusKm} km</span>
              </div>
            </div>
          </div>

          {gpsStatus && (
            <p className="text-[11px] text-stone-500 font-mono flex items-center gap-1">
              <span>●</span>
              <span>{gpsStatus}</span>
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 rounded-2xl bg-primary hover:bg-primary-600 text-white font-extrabold text-sm shadow-soft hover:shadow-elevated transition-all touch-target cursor-pointer flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>SAVING JOB & MATCHING WORKERS IN MYSQL...</span>
            </>
          ) : (
            <>
              <Sparkles size={16} />
              <span>PUBLISH JOB & NOTIFY MATCHED {selectedProfObj?.name?.toUpperCase() || 'TRADE'} CRAFTSMEN</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

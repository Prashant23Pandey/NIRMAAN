import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  Camera,
  CheckCircle2,
  Sliders,
  CalendarCheck,
  ShieldCheck,
  Upload,
  X,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const WorkAttendanceCard: React.FC = () => {
  const {
    attendance,
    checkIn,
    checkOut,
    updateWorkProgress,
    addWorkPhoto,
    completeDay,
    t,
  } = useApp();

  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [tempProgress, setTempProgress] = useState(attendance.progressPercent);

  const samplePhotoOptions = [
    {
      title: 'Tile alignment & laser level',
      url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Wall chemical primer coat',
      url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Anti-skid floor gradient',
      url: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=600&q=80',
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200/90 shadow-elevated">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-stone-200">
        <div>
          <span className="text-xs font-black tracking-widest text-primary uppercase">
            TODAY'S JOB
          </span>
          <h2 className="text-2xl font-black text-charcoal tracking-tight mt-0.5">
            Sharma Residence
          </h2>
          <div className="flex items-center gap-2 text-xs text-charcoal-muted mt-1 font-medium">
            <MapPin size={13} className="text-primary" />
            <span>Sector 62, Noida • Bathroom Renovation</span>
          </div>
        </div>

        {/* Check-In Status Pill */}
        <div className="flex items-center gap-3">
          {attendance.isCheckedIn ? (
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span className="w-3 h-3 rounded-full bg-success animate-ping" />
              <div>
                <div className="text-xs font-black text-emerald-900 flex items-center gap-1">
                  <span>{attendance.checkInTime || '09:02 AM'}</span>
                  <span>CHECKED IN ✓</span>
                </div>
                <div className="text-[10px] text-emerald-700 font-semibold">
                  Prototype GPS Attendance Verified
                </div>
              </div>
            </div>
          ) : attendance.dayCompleted ? (
            <div className="px-4 py-2 rounded-2xl bg-stone-100 text-stone-700 font-bold text-xs flex items-center gap-2">
              <CheckCircle2 size={16} className="text-primary" />
              <span>Day Completed</span>
            </div>
          ) : (
            <button
              onClick={checkIn}
              className="px-5 py-2.5 rounded-2xl bg-primary hover:bg-primary-600 text-white font-bold text-xs shadow-soft transition-colors touch-target"
            >
              {t.checkIn}
            </button>
          )}
        </div>
      </div>

      {/* Today's Progress Bar */}
      <div className="py-6 border-b border-stone-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-black uppercase text-charcoal tracking-wider">
            Today's Progress
          </span>
          <span className="text-lg font-black text-primary">
            {attendance.progressPercent}%
          </span>
        </div>

        {/* Custom Progress Track */}
        <div className="w-full h-4 rounded-full bg-stone-100 p-0.5 border border-stone-200 overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-700 relative overflow-hidden"
            style={{ width: `${attendance.progressPercent}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </div>
        </div>

        <div className="flex justify-between text-[11px] text-charcoal-muted mt-2">
          <span>09:00 AM Site Prep</span>
          <span>1:00 PM Tile Cut</span>
          <span className="font-bold text-primary">Target: 100% Curing</span>
        </div>
      </div>

      {/* Captured Evidence Photos */}
      <div className="py-5 border-b border-stone-100">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-black uppercase text-charcoal tracking-wider flex items-center gap-1.5">
            <Camera size={14} className="text-primary" />
            <span>Today's Evidence Photos ({attendance.workPhotos.length})</span>
          </span>
          <span className="text-[11px] text-stone-500 font-medium">Contributes to Work Passport</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {attendance.workPhotos.map((photo, idx) => (
            <div key={idx} className="relative rounded-2xl overflow-hidden h-24 border border-stone-200 group">
              <img src={photo} alt="Work evidence" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              <div className="absolute bottom-1 right-1 bg-charcoal/80 text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                Verified
              </div>
            </div>
          ))}
          <button
            onClick={() => setShowPhotoModal(true)}
            className="rounded-2xl border-2 border-dashed border-stone-300 hover:border-primary/50 bg-[#FAF8F2] flex flex-col items-center justify-center p-3 text-charcoal-muted hover:text-primary transition-colors h-24 group"
          >
            <Upload size={18} className="group-hover:-translate-y-0.5 transition-transform text-primary" />
            <span className="text-[11px] font-bold mt-1">+ Add Proof</span>
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-6 flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => setShowPhotoModal(true)}
          className="flex-1 py-3.5 px-4 rounded-2xl bg-sand-100 hover:bg-sand-200 border border-stone-300 text-charcoal font-bold text-xs sm:text-sm flex items-center justify-center gap-2 touch-target transition-colors shadow-2xs"
        >
          <Camera size={16} className="text-primary" />
          <span>{t.addWorkPhoto}</span>
        </button>

        <button
          onClick={() => setShowProgressModal(true)}
          className="flex-1 py-3.5 px-4 rounded-2xl bg-sand-100 hover:bg-sand-200 border border-stone-300 text-charcoal font-bold text-xs sm:text-sm flex items-center justify-center gap-2 touch-target transition-colors shadow-2xs"
        >
          <Sliders size={16} className="text-primary" />
          <span>{t.updateProgress}</span>
        </button>

        <button
          onClick={completeDay}
          disabled={attendance.dayCompleted}
          className={`flex-1 py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 touch-target transition-all ${
            attendance.dayCompleted
              ? 'bg-stone-200 text-stone-500 cursor-not-allowed'
              : 'bg-primary hover:bg-primary-600 text-white shadow-soft'
          }`}
        >
          <CheckCircle2 size={16} className={attendance.dayCompleted ? 'text-stone-400' : 'text-secondary'} />
          <span>{attendance.dayCompleted ? 'DAY COMPLETED ✓' : t.completeDay}</span>
        </button>
      </div>

      {/* Photo Upload Simulation Modal */}
      {showPhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 relative">
            <button
              onClick={() => setShowPhotoModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-2 touch-target"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <Camera size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black text-charcoal">ADD WORK PROOF PHOTO</h3>
                <span className="text-xs text-charcoal-muted">Simulate site camera upload</span>
              </div>
            </div>

            <p className="text-xs text-charcoal-muted mb-4">
              Select a timestamped site photo to log as cryptographic work evidence on your Nirmaan Passport.
            </p>

            <div className="space-y-2.5 mb-6">
              {samplePhotoOptions.map((opt, i) => (
                <div
                  key={i}
                  onClick={() => {
                    addWorkPhoto(opt.url);
                    setShowPhotoModal(false);
                  }}
                  className="flex items-center gap-3 p-3 rounded-2xl border border-stone-200 hover:border-primary bg-stone-50/50 hover:bg-primary-50/30 cursor-pointer transition-colors"
                >
                  <img src={opt.url} alt={opt.title} className="w-14 h-14 rounded-xl object-cover" />
                  <div className="flex-1">
                    <h5 className="text-xs font-bold text-charcoal">{opt.title}</h5>
                    <span className="text-[10px] text-stone-500 font-mono">10:42 AM • GPS Verified</span>
                  </div>
                  <span className="text-xs font-bold text-primary">Upload</span>
                </div>
              ))}
            </div>

            <div className="text-[11px] text-stone-400 text-center border-t border-stone-100 pt-3">
              DEMO SIMULATION: Real implementation uses device camera with embedded EXIF GPS tags.
            </div>
          </div>
        </div>
      )}

      {/* Update Progress Slider Modal */}
      {showProgressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 relative">
            <button
              onClick={() => setShowProgressModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-2 touch-target"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-black text-charcoal mb-2">UPDATE PROGRESS</h3>
            <p className="text-xs text-charcoal-muted mb-6">
              Adjust today's completion percentage for Bathroom Renovation.
            </p>

            <div className="text-center mb-6">
              <span className="text-4xl font-black text-primary">{tempProgress}%</span>
              <div className="mt-4 px-2">
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={tempProgress}
                  onChange={(e) => setTempProgress(Number(e.target.value))}
                  className="w-full accent-primary h-2 bg-stone-200 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            <button
              onClick={() => {
                updateWorkProgress(tempProgress);
                setShowProgressModal(false);
              }}
              className="w-full py-3.5 rounded-2xl bg-primary text-white font-bold text-sm touch-target shadow-soft"
            >
              Confirm Progress ({tempProgress}%)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

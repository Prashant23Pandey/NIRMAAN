import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarCheck,
  MapPin,
  Clock,
  Phone,
  ShieldCheck,
  CheckCircle2,
  HardHat,
  AlertTriangle,
  FileText,
  UserCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WorkAttendanceCard } from '../components/worker/WorkAttendanceCard';

export const WorkerWorkPage: React.FC = () => {
  const { project, attendance, setIsSosOpen } = useApp();
  const navigate = useNavigate();

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
            <span>ACTIVE SITE WORKSPACE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal tracking-tight">
            Today's Work & Attendance
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted">
            Daily GPS check-in, real-time progress update, and photo proof logging for your Work Passport.
          </p>
        </div>

        <button
          onClick={() => setIsSosOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-red-50 text-red-700 border border-red-200 font-bold text-xs hover:bg-red-100 transition-colors shadow-2xs"
        >
          <AlertTriangle size={15} />
          <span>Site Emergency / SOS</span>
        </button>
      </div>

      {/* Main Attendance Card */}
      <WorkAttendanceCard />

      {/* Project Site Details & Homeowner Contact Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Site Details */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-soft space-y-4">
          <div className="flex items-center gap-2 text-primary font-black text-sm">
            <MapPin size={18} />
            <span>Site Location & Supervisor</span>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <span className="text-charcoal-muted block">Project Site</span>
              <span className="font-extrabold text-charcoal text-sm">
                {project.name || 'Active Work Site'}
              </span>
              <span className="text-charcoal-muted block">{project.location || 'Local Area'}</span>
            </div>

            <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
              <div>
                <span className="text-charcoal-muted block">Client Contact</span>
                <span className="font-bold text-charcoal">Verified Project Client</span>
              </div>
              <a
                href="tel:9876543210"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 text-primary font-bold hover:bg-primary/20 transition-colors"
              >
                <Phone size={13} />
                <span>Call Client</span>
              </a>
            </div>
          </div>
        </div>

        {/* Site Safety & Instructions */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-soft space-y-4">
          <div className="flex items-center gap-2 text-charcoal font-black text-sm">
            <HardHat size={18} className="text-secondary-dark" />
            <span>Site Instructions & Safety</span>
          </div>

          <ul className="space-y-2 text-xs text-charcoal/90">
            <li className="flex items-start gap-2">
              <span className="text-emerald-700 font-bold">✓</span>
              <span>Keep dust mask and rubber gloves on during tile adhesive mixing.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-700 font-bold">✓</span>
              <span>Water connection point is active on the 2nd-floor balcony.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-700 font-bold">✓</span>
              <span>Upload at least 2 progress photos before leaving site at 6 PM.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

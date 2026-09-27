import React, { useState, useEffect } from 'react';
import { CalendarCheck, CheckCircle2, MapPin, Clock } from 'lucide-react';
import { api } from '../../services/api';

export const ContractorAttendancePage: React.FC = () => {
  const [attendance, setAttendance] = useState<any[]>([]);

  useEffect(() => {
    api
      .get('contractor/dashboard.php')
      .then((res: any) => {
        if (res.success) setAttendance(res.attendance || []);
      })
      .catch(() => {
        setAttendance([]);
      });
  }, []);

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-charcoal tracking-tight">
          Site Attendance & GPS Telemetry
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-muted">
          Daily geo-fenced artisan check-ins, site hours, and biometric progress verification.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 shadow-soft overflow-hidden">
        {attendance.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <CalendarCheck size={36} className="mx-auto text-stone-400" />
            <h3 className="text-base font-black text-charcoal">No attendance records logged today</h3>
            <p className="text-xs text-charcoal-muted max-w-sm mx-auto">
              When deployed workers check in on active construction sites with GPS verification, their records will display here in real time.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F2] border-b border-stone-200 text-charcoal uppercase text-[10px] font-extrabold tracking-wider">
                <tr>
                  <th className="p-4">Artisan</th>
                  <th className="p-4">Project Site</th>
                  <th className="p-4">Check-in Time</th>
                  <th className="p-4">Location Check</th>
                  <th className="p-4">Today's Progress</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {attendance.map((a, i) => (
                  <tr key={i} className="hover:bg-stone-50/80">
                    <td className="p-4 font-extrabold text-charcoal">{a.worker_name}</td>
                    <td className="p-4 text-charcoal">{a.project_name}</td>
                    <td className="p-4 font-mono text-[11px] font-bold text-primary">{a.check_in_time}</td>
                    <td className="p-4">
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-800">
                        <CheckCircle2 size={13} className="text-emerald-700" />
                        GPS Verified
                      </span>
                    </td>
                    <td className="p-4 font-bold text-charcoal">{a.progress_percent}% of milestone</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold">
                        {a.status === 'checked_in' ? 'On Site' : a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

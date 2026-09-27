import React, { useState } from 'react';
import { AlertTriangle, Phone, ShieldAlert, X, MapPin, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SosModal: React.FC = () => {
  const { isSosOpen, setIsSosOpen, showToast } = useApp();
  const [triggered, setTriggered] = useState(false);

  if (!isSosOpen) return null;

  const handleSimulateAlert = () => {
    setTriggered(true);
    showToast('🚨 DEMO SOS Alert dispatched to Site Supervisor & Emergency Desk (Simulated)', 'warning');
  };

  const handleClose = () => {
    setTriggered(false);
    setIsSosOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-danger relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-2 touch-target"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 text-danger mb-4">
          <div className="w-12 h-12 rounded-2xl bg-danger/10 flex items-center justify-center">
            <ShieldAlert size={28} className="animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-black text-danger">NIRMAAN SOS CENTRE</h3>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-danger/10 text-danger uppercase tracking-wider">
              Simulated Safety Mode
            </span>
          </div>
        </div>

        <div className="bg-danger-light border border-danger/20 rounded-2xl p-4 mb-5">
          <div className="flex items-start gap-2.5">
            <MapPin size={18} className="text-danger flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-danger">CURRENT CONSTRUCTION SITE:</div>
              <div className="text-sm font-semibold text-charcoal">
                Sharma Residence, Sector 62, Noida
              </div>
              <div className="text-xs text-charcoal-muted mt-0.5">
                GPS Lat: 28.6280° N, 77.3649° E (Simulated Pin)
              </div>
            </div>
          </div>
        </div>

        {!triggered ? (
          <>
            <p className="text-xs text-charcoal-muted mb-4 leading-relaxed">
              In an active emergency (injury, hazard, dispute, or site collapse), this sends your real-time GPS location and project details to the local emergency response desk and client emergency contact.
            </p>

            <div className="space-y-3 mb-6">
              <button
                onClick={handleSimulateAlert}
                className="w-full py-3.5 px-4 rounded-xl bg-danger text-white font-bold flex items-center justify-center gap-2 hover:bg-danger/90 active:scale-95 transition-transform touch-target shadow-md"
              >
                <AlertTriangle size={18} />
                <span>TRIGGER EMERGENCY SOS (DEMO)</span>
              </button>

              <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200">
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-primary" />
                  <span className="text-xs font-semibold text-charcoal">National Emergency</span>
                </div>
                <span className="text-xs font-bold text-primary font-mono">112</span>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 mb-6 text-center">
            <CheckCircle size={36} className="text-success mx-auto mb-2" />
            <h4 className="font-bold text-emerald-900 text-sm">EMERGENCY SOS TRANSMITTED (SIMULATED)</h4>
            <p className="text-xs text-emerald-800 mt-1">
              Nearest response team, site supervisor, and client have been alerted with your digital location.
            </p>
          </div>
        )}

        <div className="text-[11px] text-stone-500 text-center border-t border-stone-100 pt-3">
          <strong>Hackathon Prototype Notice:</strong> This feature is a frontend simulation. No real emergency services or local authorities are contacted.
        </div>
      </div>
    </div>
  );
};

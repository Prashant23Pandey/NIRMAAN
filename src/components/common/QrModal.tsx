import React from 'react';
import { X, QrCode, Copy, Share2, Check, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const QrModal: React.FC = () => {
  const { isQrOpen, setIsQrOpen, currentWorker, showToast } = useApp();
  const [copied, setCopied] = React.useState(false);

  if (!isQrOpen) return null;

  const handleCopyLink = () => {
    setCopied(true);
    showToast('Passport verification link copied to clipboard!', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 relative text-center">
        <button
          onClick={() => setIsQrOpen(false)}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-2 touch-target"
        >
          <X size={20} />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
          <QrCode size={24} />
        </div>

        <h3 className="text-lg font-black text-charcoal">NIRMAAN WORK IDENTITY</h3>
        <p className="text-xs text-charcoal-muted mt-1 mb-4">
          Scan to verify credentials, ratings & proof-of-work on the immutable ledger.
        </p>

        {/* QR Code Visual Placeholder */}
        <div className="bg-[#FAF8F2] border-2 border-dashed border-primary/30 rounded-2xl p-5 inline-block mx-auto mb-4 relative">
          <div className="w-48 h-48 bg-white border border-stone-200 rounded-xl p-3 flex flex-col items-center justify-center relative shadow-inner">
            {/* Visual SVG QR pattern */}
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full text-charcoal fill-current"
            >
              {/* Corner position markers */}
              <rect x="5" y="5" width="25" height="25" fill="#176B5B" rx="3" />
              <rect x="10" y="10" width="15" height="15" fill="#FFFFFF" rx="2" />
              <rect x="13" y="13" width="9" height="9" fill="#176B5B" />

              <rect x="70" y="5" width="25" height="25" fill="#176B5B" rx="3" />
              <rect x="75" y="10" width="15" height="15" fill="#FFFFFF" rx="2" />
              <rect x="78" y="13" width="9" height="9" fill="#176B5B" />

              <rect x="5" y="70" width="25" height="25" fill="#176B5B" rx="3" />
              <rect x="10" y="75" width="15" height="15" fill="#FFFFFF" rx="2" />
              <rect x="13" y="78" width="9" height="9" fill="#176B5B" />

              {/* Data blocks */}
              <rect x="36" y="8" width="8" height="8" fill="#17211F" />
              <rect x="48" y="12" width="6" height="12" fill="#17211F" />
              <rect x="12" y="36" width="12" height="6" fill="#17211F" />
              <rect x="28" y="40" width="8" height="8" fill="#F4B942" />
              <rect x="40" y="36" width="20" height="20" fill="#176B5B" rx="4" />
              <rect x="68" y="38" width="10" height="6" fill="#17211F" />
              <rect x="82" y="48" width="8" height="12" fill="#17211F" />
              <rect x="36" y="68" width="14" height="8" fill="#17211F" />
              <rect x="56" y="72" width="10" height="10" fill="#17211F" />
              <rect x="74" y="74" width="16" height="8" fill="#17211F" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-primary text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow">
                NIRMAAN
              </span>
            </div>
          </div>
          <div className="mt-2 text-center">
            <span className="text-xs font-mono font-bold text-primary">
              ID: {currentWorker.nirmaanId}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mb-5">
          <ShieldCheck size={16} className="text-primary" />
          <span className="text-xs font-semibold text-charcoal">
            {currentWorker.name} • {currentWorker.trade}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleCopyLink}
            className="flex-1 py-3 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-charcoal text-xs font-bold flex items-center justify-center gap-1.5 touch-target transition-colors"
          >
            {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
            <span>{copied ? 'Copied!' : 'Copy Link'}</span>
          </button>
          <button
            onClick={() => {
              showToast('Passport shared via WhatsApp demo link', 'info');
              setIsQrOpen(false);
            }}
            className="flex-1 py-3 px-3 rounded-xl bg-primary hover:bg-primary-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 touch-target shadow-sm transition-colors"
          >
            <Share2 size={14} />
            <span>Share</span>
          </button>
        </div>

        <div className="text-[10px] text-stone-400 mt-3">
          Simulated digital card • Not a government Aadhaar card
        </div>
      </div>
    </div>
  );
};

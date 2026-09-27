import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bot,
  User,
  Send,
  Sparkles,
  ArrowRight,
  Info,
  CheckCircle2,
  HardHat,
  RotateCcw,
  Wrench,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  options?: string[];
  recommendations?: {
    trades: string[];
    timeline: string;
    estDaily: string;
  };
  ctaFindWorkers?: boolean;
}

export const HomeownerAiAssistantPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useApp();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'user',
      text: 'Mujhe bathroom renovate karwana hai.',
    },
    {
      id: 'm2',
      sender: 'ai',
      text: 'Got it 👍\n\nBased on your requirement, you may need:\n\n🧱 Tile Worker (Anti-skid flooring & dado walls)\n🔧 Plumber (Concealed CPVC pipes & sanitaryware)\n👷 Helper (Debris clearing & cement mortar mixing)\n\nHow many bathrooms do you want to renovate?',
      options: ['1 Bathroom', '2 Bathrooms', '3+ Bathrooms'],
    },
  ]);

  const [inputVal, setInputVal] = useState('');
  const [stage, setStage] = useState<'bathroom_count' | 'matched'>('bathroom_count');

  const handleSelectOption = (opt: string) => {
    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: opt,
    };

    // Add AI answer
    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      sender: 'ai',
      text: `Excellent. For ${opt}, here is your estimated construction workforce schedule:\n\n• Duration: 6 to 8 days\n• Key Craftsmen: 1 Master Tile Artisan + 1 Plumber + 1 Helper\n• Estimated Daily Labour: ₹2,450/day total\n• Verified Work Passport coverage: 100%\n\nWould you like Nirmaan to find verified matching workers near your location?`,
      recommendations: {
        trades: ['Tile Worker (Master)', 'Plumber (Certified)', 'Construction Helper'],
        timeline: '6–8 Days',
        estDaily: '₹2,450 / day total',
      },
      ctaFindWorkers: true,
    };

    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setStage('matched');
  };

  const handleSendCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userText = inputVal.trim();
    setInputVal('');

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
    };

    setMessages((prev) => [...prev, userMsg]);

    setTimeout(() => {
      const aiReply: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: `Understood! For "${userText}", Nirmaan has verified artisans in Sector 62, Noida ready with background-checked Work Passports.\n\nRecommended Trades:\n• Lead Mason / Specialist\n• Skilled Helper\n\nWould you like to review verified profiles right now?`,
        ctaFindWorkers: true,
      };
      setMessages((prev) => [...prev, aiReply]);
      setStage('matched');
    }, 600);
  };

  const handleReset = () => {
    setMessages([
      {
        id: 'm1',
        sender: 'user',
        text: 'Mujhe bathroom renovate karwana hai.',
      },
      {
        id: 'm2',
        sender: 'ai',
        text: 'Got it 👍\n\nBased on your requirement, you may need:\n\n🧱 Tile Worker (Anti-skid flooring & dado walls)\n🔧 Plumber (Concealed CPVC pipes & sanitaryware)\n👷 Helper (Debris clearing & cement mortar mixing)\n\nHow many bathrooms do you want to renovate?',
        options: ['1 Bathroom', '2 Bathrooms', '3+ Bathrooms'],
      },
    ]);
    setStage('bathroom_count');
    showToast('Conversation reset to initial demo state', 'info');
  };

  return (
    <div className="space-y-6 pb-16 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/20 text-primary font-black text-xs mb-2">
            <Sparkles size={13} className="text-secondary-dark" />
            <span>Prototype AI Project Assistant</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal tracking-tight">
            Prototype AI Project Assistant
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted">
            Translate conversational Hindi or English requirements into accurate trade specifications.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white border border-stone-200 text-xs font-bold text-charcoal hover:border-primary/40 shadow-2xs self-start sm:self-auto touch-target"
        >
          <RotateCcw size={14} />
          <span>Reset Chat Demo</span>
        </button>
      </div>

      {/* Simulated Disclaimer Banner */}
      <div className="bg-amber-50 rounded-2xl p-3 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
        <Info size={16} className="text-amber-700 shrink-0" />
        <span>
          <strong>Prototype Simulation:</strong> Construction trade intelligence simulation for hackathon demonstration. No external LLM or billing credentials required.
        </span>
      </div>

      {/* Chat Window */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-soft space-y-6 min-h-[460px] flex flex-col justify-between">
        {/* Messages Container */}
        <div className="space-y-4 flex-1">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${
                m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 text-white font-bold text-xs shadow-xs ${
                  m.sender === 'user' ? 'bg-primary' : 'bg-secondary text-primary'
                }`}
              >
                {m.sender === 'user' ? <User size={16} /> : <Bot size={18} />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] rounded-3xl p-4 sm:p-5 text-sm space-y-3 ${
                  m.sender === 'user'
                    ? 'bg-primary text-white rounded-tr-xs shadow-soft'
                    : 'bg-stone-50 border border-stone-200 text-charcoal rounded-tl-xs shadow-xs'
                }`}
              >
                <div className="whitespace-pre-line leading-relaxed font-medium">{m.text}</div>

                {/* Recommendations Card if available */}
                {m.recommendations && (
                  <div className="mt-3 p-4 rounded-2xl bg-white border border-stone-200 text-xs text-charcoal space-y-2">
                    <div className="font-extrabold text-primary flex items-center gap-1.5">
                      <HardHat size={14} />
                      <span>Recommended Workforce Plan:</span>
                    </div>
                    <ul className="space-y-1 text-charcoal-muted">
                      {m.recommendations.trades.map((t, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <CheckCircle2 size={12} className="text-emerald-700" />
                          <span className="font-semibold text-charcoal">{t}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="pt-2 border-t border-stone-100 flex justify-between font-bold text-[11px]">
                      <span>Timeline: {m.recommendations.timeline}</span>
                      <span className="text-primary">{m.recommendations.estDaily}</span>
                    </div>
                  </div>
                )}

                {/* Interactive Options Buttons */}
                {m.options && stage === 'bathroom_count' && (
                  <div className="pt-2 flex flex-wrap gap-2">
                    {m.options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleSelectOption(opt)}
                        className="px-4 py-2 rounded-xl bg-white border border-stone-300 hover:border-primary hover:text-primary text-xs font-black transition-all shadow-2xs touch-target"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

                {/* Direct CTA to Match Results */}
                {m.ctaFindWorkers && (
                  <div className="pt-2">
                    <button
                      onClick={() => navigate('/homeowner/workers')}
                      className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-primary hover:bg-primary-600 text-white font-black text-xs flex items-center justify-center gap-2 shadow-soft hover:shadow-elevated transition-all touch-target"
                    >
                      <span>FIND MATCHING WORKERS (3 VERIFIED)</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendCustom} className="pt-4 border-t border-stone-100 flex gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type your construction requirement (e.g. Paint my 2BHK flat)..."
            className="flex-1 px-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 text-sm text-charcoal focus:outline-hidden focus:border-primary focus:bg-white transition-all shadow-2xs"
          />
          <button
            type="submit"
            className="px-5 py-3 rounded-2xl bg-primary hover:bg-primary-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-soft transition-all touch-target"
          >
            <Send size={15} />
            <span className="hidden sm:inline">Ask AI</span>
          </button>
        </form>
      </div>
    </div>
  );
};

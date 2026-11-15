import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Check, 
  Mail, 
  Lock, 
  RefreshCw,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function ConnectAccountModal({ isOpen, onClose, onConnect }) {
  const [provider, setProvider] = useState('gmail');
  const [email, setEmail] = useState('');
  const [clientName, setClientName] = useState('Alex Morgan');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1); // 1: Select provider & enter email, 2: OAuth permission grant simulation

  if (!isOpen) return null;

  const handleNext = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStep(2);
  };

  const handleAuthorize = async () => {
    setIsSubmitting(true);
    await onConnect({
      email: email.trim(),
      provider,
      clientName: clientName.trim() || 'Alex Morgan',
      role: 'Executive Client'
    });
    setIsSubmitting(false);
    setStep(1);
    setEmail('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl flex flex-col gap-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Connect Email Account</h2>
              <p className="text-xs text-slate-400">Step {step} of 2 • Secure OAuth Integration</p>
            </div>
          </div>
          <button
            onClick={() => {
              setStep(1);
              onClose();
            }}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {step === 1 ? (
          <form onSubmit={handleNext} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Select Email Provider:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setProvider('gmail')}
                  className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition ${
                    provider === 'gmail'
                      ? 'border-indigo-500 bg-indigo-500/10 text-white'
                      : 'border-slate-800 hover:border-slate-700 text-slate-300 bg-slate-950/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">Google Gmail</span>
                    {provider === 'gmail' && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                  </div>
                  <span className="text-[10px] text-slate-400">Personal & Workspace</span>
                </button>

                <button
                  type="button"
                  onClick={() => setProvider('outlook')}
                  className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition ${
                    provider === 'outlook'
                      ? 'border-teal-500 bg-teal-500/10 text-white'
                      : 'border-slate-800 hover:border-slate-700 text-slate-300 bg-slate-950/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">Microsoft Outlook</span>
                    {provider === 'outlook' && <Check className="w-3.5 h-3.5 text-teal-400" />}
                  </div>
                  <span className="text-[10px] text-slate-400">Office 365 & Exchange</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Account Email Address
              </label>
              <input
                type="email"
                placeholder="e.g. alex.morgan@clientfirm.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Client / Executive Name
              </label>
              <input
                type="text"
                placeholder="Alex Morgan"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs text-slate-300 font-medium transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!email.trim()}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-xs font-semibold text-white shadow-sm transition flex items-center gap-1.5"
              >
                <span>Continue to Authorization</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        ) : (
          /* Step 2: OAuth Consent Simulation */
          <div className="flex flex-col gap-4">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
                {provider === 'gmail' ? 'G' : 'M'}
              </div>
              <div className="truncate">
                <span className="font-bold text-xs text-white block truncate">{email}</span>
                <span className="text-[10px] text-slate-400">
                  {provider === 'gmail' ? 'Google Cloud OAuth 2.0' : 'Microsoft Identity Platform'}
                </span>
              </div>
            </div>

            <div className="text-xs text-slate-300 flex flex-col gap-2">
              <span className="font-semibold text-slate-200">
                OmniMail AI requests permission to:
              </span>
              <ul className="space-y-2 text-slate-400 text-xs">
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-teal-400 flex-shrink-0 mt-0.5" />
                  <span>Read email messages and conversation threads for AI triage.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-teal-400 flex-shrink-0 mt-0.5" />
                  <span>Prepare AI draft responses on behalf of the executive office.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-teal-400 flex-shrink-0 mt-0.5" />
                  <span>Manage inbox labels and archive status upon user action.</span>
                </li>
              </ul>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center gap-2 text-[11px] text-slate-400">
              <Lock className="w-3.5 h-3.5 text-indigo-400" />
              <span>256-bit encrypted token storage. Revocable anytime.</span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-3 py-1.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs text-slate-300 font-medium transition"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleAuthorize}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-xs font-semibold text-white shadow-sm transition flex items-center gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Synchronizing Mailbox...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Grant Access & Connect</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Check, 
  Mail, 
  Lock, 
  RefreshCw,
  ArrowRight
} from 'lucide-react';

export default function ConnectAccountModal({ isOpen, onClose, onConnect }) {
  const [provider, setProvider] = useState('gmail');
  const [email, setEmail] = useState('');
  const [clientName, setClientName] = useState('Alex Morgan');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-[#eaedf1] rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl flex flex-col gap-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#eaedf1]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#c2e7ff] text-[#001d35]">
              <Mail className="w-5 h-5 text-[#0b57d0]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1f1f1f] font-poppins">Connect Email Account</h2>
              <p className="text-xs text-[#747775] font-lato">Step {step} of 2 • Secure OAuth Flow</p>
            </div>
          </div>
          <button
            onClick={() => {
              setStep(1);
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-[#eaedf1] text-[#747775]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 1 ? (
          <form onSubmit={handleNext} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1f1f1f] mb-2 font-poppins">
                Select Email Provider:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setProvider('gmail')}
                  className={`p-3.5 rounded-2xl border text-left flex flex-col gap-1 transition ${
                    provider === 'gmail'
                      ? 'border-[#0b57d0] bg-[#eaf1fb] text-[#041e49]'
                      : 'border-[#eaedf1] hover:border-[#dadce0] text-[#444746] bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm font-poppins">Google Gmail</span>
                    {provider === 'gmail' && <Check className="w-4 h-4 text-[#0b57d0]" />}
                  </div>
                  <span className="text-xs text-[#747775] font-lato">Personal & Workspace</span>
                </button>

                <button
                  type="button"
                  onClick={() => setProvider('outlook')}
                  className={`p-3.5 rounded-2xl border text-left flex flex-col gap-1 transition ${
                    provider === 'outlook'
                      ? 'border-[#0b57d0] bg-[#eaf1fb] text-[#041e49]'
                      : 'border-[#eaedf1] hover:border-[#dadce0] text-[#444746] bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm font-poppins">Microsoft</span>
                    {provider === 'outlook' && <Check className="w-4 h-4 text-[#0b57d0]" />}
                  </div>
                  <span className="text-xs text-[#747775] font-lato">Outlook & Office 365</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1f1f1f] mb-1 font-poppins">
                Account Email Address
              </label>
              <input
                type="email"
                placeholder="e.g. alex.morgan@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-xl px-3.5 py-2 text-sm text-[#1f1f1f] placeholder-[#747775] focus:outline-none focus:border-[#0b57d0] font-poppins"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1f1f1f] mb-1 font-poppins">
                Client / Executive Name
              </label>
              <input
                type="text"
                placeholder="Alex Morgan"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-xl px-3.5 py-2 text-sm text-[#1f1f1f] placeholder-[#747775] focus:outline-none focus:border-[#0b57d0] font-poppins"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#eaedf1]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-full border border-[#dadce0] hover:bg-[#eaedf1] text-xs font-semibold font-poppins text-[#444746] transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!email.trim()}
                className="px-5 py-2 rounded-full bg-[#0b57d0] hover:bg-[#0842a0] disabled:opacity-50 text-xs font-semibold font-poppins text-white shadow-sm transition flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="p-3.5 rounded-2xl bg-[#f0f4f9] flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#c2e7ff] text-[#001d35] flex items-center justify-center font-bold text-sm font-poppins">
                {provider === 'gmail' ? 'G' : 'M'}
              </div>
              <div className="truncate">
                <span className="font-bold text-sm text-[#1f1f1f] block truncate font-poppins">{email}</span>
                <span className="text-xs text-[#747775] font-lato">
                  {provider === 'gmail' ? 'Google Cloud OAuth 2.0' : 'Microsoft Graph Identity'}
                </span>
              </div>
            </div>

            <div className="text-xs text-[#444746] flex flex-col gap-2 font-lato">
              <span className="font-semibold text-[#1f1f1f] font-poppins text-xs">
                OmniMail AI requests permission to:
              </span>
              <ul className="space-y-2 text-[#444746] text-xs">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#1e8e3e] flex-shrink-0 mt-0.5" />
                  <span>Read email conversations to analyze reply responsibility.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#1e8e3e] flex-shrink-0 mt-0.5" />
                  <span>Prepare AI draft responses on behalf of the assistant.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#1e8e3e] flex-shrink-0 mt-0.5" />
                  <span>Manage inbox labels and archive status upon action.</span>
                </li>
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-[#f8fafd] border border-[#eaedf1] flex items-center gap-2 text-xs text-[#747775] font-lato">
              <Lock className="w-3.5 h-3.5 text-[#0b57d0]" />
              <span>256-bit encrypted credentials. Revocable anytime.</span>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#eaedf1]">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-full border border-[#dadce0] hover:bg-[#eaedf1] text-xs font-semibold font-poppins text-[#444746]"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleAuthorize}
                disabled={isSubmitting}
                className="px-5 py-2 rounded-full bg-[#1e8e3e] hover:bg-[#167030] disabled:opacity-50 text-xs font-semibold font-poppins text-white shadow-sm flex items-center gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Synchronizing Mailbox...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
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

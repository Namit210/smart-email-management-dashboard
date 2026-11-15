import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Bot, 
  UserCheck, 
  CheckCheck, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  Layers,
  Inbox,
  CheckCircle2
} from 'lucide-react';

export default function OnboardingModal({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: 'Welcome to OmniMail AI',
      subtitle: 'Personal Assistant Email Management Platform',
      badge: 'Prototype Overview',
      content: (
        <div className="flex flex-col gap-3 text-xs text-slate-300 leading-relaxed">
          <p>
            Personal assistants often manage a staggering volume of emails across multiple executive accounts. High-stakes conversations, board resolutions, and meeting requests routinely risk getting lost.
          </p>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
            <span className="font-bold text-white block mb-1">The Core Challenge:</span>
            "Who is responsible for replying to this email? Does the client need to decide personally, or should the assistant handle it?"
          </div>
          <p>
            OmniMail AI solves this by continuously analyzing incoming email threads with AI to categorize responsibility into 3 clear operational buckets.
          </p>
        </div>
      )
    },
    {
      title: 'Automatic Reply Responsibility',
      subtitle: 'Zero Manual Guesswork for the Assistant',
      badge: 'Core Feature',
      content: (
        <div className="flex flex-col gap-2.5 text-xs text-slate-300">
          <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/30 flex items-start gap-2.5">
            <Bot className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-blue-300 block">Assistant to Reply</span>
              <span className="text-slate-400">Scheduling calendar invites, vendor queries, routine invoices, travel logistics.</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-2.5">
            <UserCheck className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-300 block">Client to Reply</span>
              <span className="text-slate-400">High-value contracts, strategic approvals, wire authorizations, VIP relations.</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 flex items-start gap-2.5">
            <CheckCheck className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-300 block">No Reply Needed</span>
              <span className="text-slate-400">Newsletters, receipts, automated flight confirmations, FYI updates.</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Two Connected Perspectives',
      subtitle: 'Power Dashboard + Zen Client Portal',
      badge: 'UX Architecture',
      content: (
        <div className="flex flex-col gap-3 text-xs text-slate-300 leading-relaxed">
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/30">
              <span className="font-bold text-indigo-300 block mb-1">1. Assistant Dashboard</span>
              <p className="text-[11px] text-slate-400">
                Full triage suite: multi-account filters, manual override controls, AI draft reply generators, calendar detection.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
              <span className="font-bold text-emerald-300 block mb-1">2. Client Portal</span>
              <p className="text-[11px] text-slate-400">
                Minimalistic executive view: Only shows items needing the client's personal attention with 1-click delegation!
              </p>
            </div>
          </div>
          <p className="text-[11px] text-slate-400">
            Use the toggle pill at the top of the header at any time to alternate between the Assistant and Client views.
          </p>
        </div>
      )
    },
    {
      title: 'Explore & Test Live',
      subtitle: 'Simulate Emails & Ask the AI Copilot',
      badge: 'Evaluation Ready',
      content: (
        <div className="flex flex-col gap-3 text-xs text-slate-300 leading-relaxed">
          <p>This prototype is fully loaded with realistic demonstration scenarios and interactive features:</p>
          <ul className="space-y-2 text-slate-300">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-400" />
              <span><strong>Simulate Email:</strong> Inject new custom or preset emails and watch the AI classify them.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-400" />
              <span><strong>Ask AI Copilot:</strong> Ask questions like "Show me emails that need Alex's attention".</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-400" />
              <span><strong>Delegate & Override:</strong> Manually change classifications or delegate from client view.</span>
            </li>
          </ul>
        </div>
      )
    }
  ];

  const current = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl flex flex-col justify-between min-h-[420px]">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-400 border border-teal-500/30 uppercase tracking-wider">
                {current.badge}
              </span>
              <span className="text-xs text-slate-500">Step {currentStep + 1} of {steps.length}</span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Titles */}
          <div className="mt-4">
            <h2 className="text-lg font-bold text-white tracking-tight">{current.title}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{current.subtitle}</p>
          </div>

          {/* Step Body */}
          <div className="mt-4">
            {current.content}
          </div>
        </div>

        {/* Step Navigation Dots & Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800 mt-6">
          <div className="flex items-center gap-1.5">
            {steps.map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentStep ? 'w-6 bg-teal-400' : 'bg-slate-700'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="px-3.5 py-1.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs text-slate-300 font-medium transition flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}

            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-sm transition flex items-center gap-1.5"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-xs font-semibold text-white shadow-sm transition flex items-center gap-1.5"
              >
                <span>Start Exploring</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

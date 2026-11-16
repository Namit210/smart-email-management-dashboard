import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Bot, 
  UserCheck, 
  CheckCheck, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2
} from 'lucide-react';

export default function OnboardingModal({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: 'Welcome to OmniMail AI',
      subtitle: 'Personal Assistant Email Management Platform',
      badge: 'Product Overview',
      content: (
        <div className="flex flex-col gap-3 text-sm text-[#444746] font-lato leading-relaxed">
          <p>
            Personal assistants often manage a staggering volume of emails across multiple executive accounts. High-stakes conversations, board resolutions, and meeting requests risk getting lost.
          </p>
          <div className="p-4 rounded-2xl bg-[#f0f4f9] border border-[#eaedf1] text-[#1f1f1f]">
            <span className="font-bold block mb-1 font-poppins text-xs uppercase tracking-wider text-[#0b57d0]">
              The Core Problem:
            </span>
            "Who is responsible for replying to this email? Does the client need to decide personally, or should the assistant handle it?"
          </div>
          <p>
            OmniMail AI solves this by continuously analyzing incoming email threads with AI to categorize reply responsibility into 3 clear operational buckets.
          </p>
        </div>
      )
    },
    {
      title: 'Automatic Reply Responsibility',
      subtitle: 'Zero Guesswork for the Assistant',
      badge: 'AI Engine',
      content: (
        <div className="flex flex-col gap-3 text-sm">
          <div className="p-3.5 rounded-2xl bg-[#d3e3fd]/40 border border-[#b8d4fb] flex items-start gap-3">
            <Bot className="w-5 h-5 text-[#0b57d0] flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#041e49] block font-poppins text-sm">Assistant to Reply</span>
              <span className="text-xs text-[#444746] font-lato">Scheduling calendar invites, routine vendor inquiries, travel logistics.</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#ffe7d6]/60 border border-[#ffd8bf] flex items-start gap-3">
            <UserCheck className="w-5 h-5 text-[#b06000] flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#b06000] block font-poppins text-sm">Client to Reply</span>
              <span className="text-xs text-[#444746] font-lato">High-value contracts, strategic approvals, wire authorizations, VIP relations.</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#eaedf1]/60 border border-[#dadce0] flex items-start gap-3">
            <CheckCheck className="w-5 h-5 text-[#444746] flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#1f1f1f] block font-poppins text-sm">No Reply Needed</span>
              <span className="text-xs text-[#747775] font-lato">Newsletters, receipts, automated flight confirmations, FYI updates.</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Two Connected Perspectives',
      subtitle: 'Assistant View + Client Portal',
      badge: 'Dual Interface',
      content: (
        <div className="flex flex-col gap-3 text-sm text-[#444746] font-lato leading-relaxed">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-[#eaf1fb] border border-[#d3e3fd]">
              <span className="font-bold text-[#041e49] block mb-1 font-poppins text-xs uppercase tracking-wider">
                1. Assistant View
              </span>
              <p className="text-xs text-[#444746]">
                Full triage suite, Gmail-style conversation viewing, manual overrides, AI reply drafts, meeting detector.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#c4eed0]/40 border border-[#a8dab5]">
              <span className="font-bold text-[#0f5223] block mb-1 font-poppins text-xs uppercase tracking-wider">
                2. Client Portal
              </span>
              <p className="text-xs text-[#444746]">
                Zen executive view showing only matters requiring personal attention with 1-click delegation across any client!
              </p>
            </div>
          </div>
          <p className="text-xs text-[#747775]">
            Use the top switcher pill anytime to alternate between the Assistant and Client views.
          </p>
        </div>
      )
    },
    {
      title: 'Interactive Prototype Features',
      subtitle: 'Simulate Emails & Ask the AI Copilot',
      badge: 'Ready to Test',
      content: (
        <div className="flex flex-col gap-3 text-sm text-[#444746] font-lato leading-relaxed">
          <p>Everything in this prototype is fully interactive and connected to the live backend:</p>
          <ul className="space-y-2.5 text-xs text-[#1f1f1f]">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#1e8e3e]" />
              <span><strong>Simulate Email:</strong> Inject new custom or preset emails to watch real-time AI triage for any client.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#1e8e3e]" />
              <span><strong>Ask AI Copilot:</strong> Query inboxes naturally like "Show me emails that need Sarah's attention" or "What does Marcus need to sign?".</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#1e8e3e]" />
              <span><strong>Delegate & Override:</strong> Delegate from client portal or override classifications directly.</span>
            </li>
          </ul>
        </div>
      )
    }
  ];

  const current = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-[#eaedf1] rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl flex flex-col justify-between min-h-[420px]">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#eaedf1]">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#d3e3fd] text-[#041e49] uppercase tracking-wider font-poppins">
                {current.badge}
              </span>
              <span className="text-xs text-[#747775] font-lato">Step {currentStep + 1} of {steps.length}</span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-[#eaedf1] text-[#747775]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Titles */}
          <div className="mt-4">
            <h2 className="text-lg font-bold text-[#1f1f1f] tracking-tight font-poppins">{current.title}</h2>
            <p className="text-xs text-[#747775] mt-0.5 font-lato">{current.subtitle}</p>
          </div>

          {/* Step Body */}
          <div className="mt-4">
            {current.content}
          </div>
        </div>

        {/* Step Navigation Dots & Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-[#eaedf1] mt-6">
          <div className="flex items-center gap-1.5">
            {steps.map((_, i) => (
              <span
                key={i}
                className={`h-2 rounded-full transition-all ${
                  i === currentStep ? 'w-6 bg-[#0b57d0]' : 'w-2 bg-[#dadce0]'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="px-4 py-2 rounded-full border border-[#dadce0] hover:bg-[#eaedf1] text-xs font-semibold font-poppins text-[#444746] transition flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}

            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="px-5 py-2 rounded-full bg-[#0b57d0] hover:bg-[#0842a0] text-xs font-semibold font-poppins text-white shadow-xs transition flex items-center gap-1.5"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-full bg-[#1e8e3e] hover:bg-[#167030] text-xs font-semibold font-poppins text-white shadow-xs transition flex items-center gap-1.5"
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

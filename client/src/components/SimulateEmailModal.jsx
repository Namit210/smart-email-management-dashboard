import React, { useState } from 'react';
import { 
  PlusCircle, 
  Sparkles, 
  X, 
  Send, 
  FileText, 
  Bot, 
  UserCheck, 
  CheckCheck 
} from 'lucide-react';

export default function SimulateEmailModal({ isOpen, onClose, onSimulate }) {
  const [subject, setSubject] = useState('');
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [body, setBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const presets = [
    {
      label: '⚡ Urgent Contract Sign-off (Client)',
      subject: 'Final Signature Required: $85,000 Strategic Partnership Agreement',
      senderName: 'Rachel Green',
      senderEmail: 'rachel@summitpartners.com',
      body: 'Hi Alex, our board has officially approved the partnership terms. We need your personal signature and DocuSign authorization by 5:00 PM today so we can finalize the agreement.'
    },
    {
      label: '📅 Meeting Scheduling (Assistant)',
      subject: 'Coffee catchup & partnership sync next Tuesday at 3pm',
      senderName: 'Michael Chang',
      senderEmail: 'mchang@hypergrowth.vc',
      body: 'Hi Alex, really enjoyed our quick conversation at the conference. Can your assistant coordinate a 30-minute coffee meeting next Tuesday at 3:00 PM EST? Let me know what location works best.'
    },
    {
      label: '🧾 Vendor Invoice (Assistant)',
      subject: 'Invoice #8839 due for Design Sprint Deliverables',
      senderName: 'PixelStudio Billing',
      senderEmail: 'billing@pixelstudio.design',
      body: 'Hi Alex, attached is invoice #8839 for the brand sprint completed last week. Total due: $2,800. Please forward to your assistant for processing before the net-15 due date.'
    },
    {
      label: '📰 Newsletter Update (No Reply)',
      subject: 'SaaS Weekly Digest: Scaling Executive AI Agents',
      senderName: 'SaaS Briefings',
      senderEmail: 'newsletter@saasbriefings.com',
      body: 'Here is your weekly summary of the fastest growing enterprise productivity tools and benchmark studies. To manage your email preferences or unsubscribe, click here.'
    }
  ];

  if (!isOpen) return null;

  const handleApplyPreset = (preset) => {
    setSubject(preset.subject);
    setSenderName(preset.senderName);
    setSenderEmail(preset.senderEmail);
    setBody(preset.body);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) return;

    setIsSubmitting(true);
    await onSimulate({
      subject,
      senderName: senderName.trim() || 'Simulated Sender',
      senderEmail: senderEmail.trim() || 'sender@external.com',
      body
    });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Sparkles className="w-4 h-4 text-teal-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Simulate Incoming Email</h2>
              <p className="text-xs text-slate-400">Test live AI classification & reply responsibility routing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1-Click Preset Scenarios */}
        <div>
          <span className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider block mb-2">
            1-Click Test Scenarios:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className="text-left p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-indigo-500/50 text-xs text-slate-300 transition"
              >
                <div className="font-semibold text-white">{preset.label}</div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">{preset.subject}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Input Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Sender Name</label>
              <input
                type="text"
                placeholder="e.g. Victoria Vance"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Sender Email</label>
              <input
                type="email"
                placeholder="e.g. victoria@acme.com"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Subject</label>
            <input
              type="text"
              placeholder="e.g. Urgent approval required for Q4 budget"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email Body Content</label>
            <textarea
              rows={4}
              placeholder="Paste or write email text here..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 leading-relaxed"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs text-slate-300 font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !subject.trim() || !body.trim()}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-xs font-semibold text-white shadow-sm transition flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Analyzing...' : 'Simulate & Run AI Triage'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

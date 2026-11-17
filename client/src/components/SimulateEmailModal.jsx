import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  UserCheck, 
  CheckCheck 
} from 'lucide-react';

export default function SimulateEmailModal({ isOpen, onClose, onSimulate, clientList = [] }) {
  const [subject, setSubject] = useState('');
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [body, setBody] = useState('');
  const [targetClient, setTargetClient] = useState(clientList[0]?.name || 'Alex Morgan');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const presets = [
    {
      label: '⚡ Urgent Contract Sign-off (Client to Reply)',
      subject: 'Final Signature Required: $85,000 Strategic Partnership Agreement',
      senderName: 'Rachel Green',
      senderEmail: 'rachel@summitpartners.com',
      body: 'Hi Alex, our board has officially approved the partnership terms. We need your personal signature and DocuSign authorization by 5:00 PM today so we can finalize the agreement.'
    },
    {
      label: '📅 Meeting Scheduling (Assistant to Reply)',
      subject: 'Coffee catchup & partnership sync next Tuesday at 3pm',
      senderName: 'Michael Chang',
      senderEmail: 'mchang@hypergrowth.vc',
      body: 'Hi Alex, really enjoyed our quick conversation at the conference. Can your assistant coordinate a 30-minute coffee meeting next Tuesday at 3:00 PM EST? Let me know what location works best.'
    },
    {
      label: '🧾 Vendor Invoice (Assistant to Reply)',
      subject: 'Invoice #8839 due for Design Sprint Deliverables',
      senderName: 'PixelStudio Billing',
      senderEmail: 'billing@pixelstudio.design',
      body: 'Hi Alex, attached is invoice #8839 for the brand sprint completed last week. Total due: $2,800. Please forward to your assistant for processing before the net-15 due date.'
    },
    {
      label: '📰 Newsletter Update (No Reply Needed)',
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
    const matchedClient = clientList.find(c => c.name === targetClient);
    await onSimulate({
      subject,
      senderName: senderName.trim() || 'Simulated Sender',
      senderEmail: senderEmail.trim() || 'sender@external.com',
      clientName: targetClient,
      accountEmail: matchedClient?.email || 'alex.morgan@company.com',
      body
    });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-[#eaedf1] rounded-3xl max-w-xl w-full p-4 sm:p-7 shadow-2xl flex flex-col gap-4 max-h-[90dvh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#eaedf1]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#c2e7ff] text-[#001d35]">
              <Sparkles className="w-5 h-5 text-[#0b57d0]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1f1f1f] font-poppins">Simulate Incoming Email</h2>
              <p className="text-xs text-[#747775] font-lato">Test live AI reply responsibility triage & routing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#eaedf1] text-[#747775]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1-Click Preset Scenarios */}
        <div>
          <span className="text-xs font-semibold uppercase text-[#747775] tracking-wider block mb-2 font-poppins">
            1-Click Test Scenarios:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className="text-left p-3 rounded-2xl bg-[#f8fafd] hover:bg-[#eaf1fb] border border-[#eaedf1] hover:border-[#c2e7ff] text-xs text-[#444746] transition group"
              >
                <div className="font-semibold text-[#1f1f1f] font-poppins group-hover:text-[#0b57d0]">{preset.label}</div>
                <div className="text-[11px] text-[#747775] font-lato truncate mt-0.5">{preset.subject}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Input Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-1">
          {clientList.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-[#1f1f1f] mb-1 font-poppins">Target Client / Recipient</label>
              <select
                value={targetClient}
                onChange={(e) => setTargetClient(e.target.value)}
                className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-xl px-3.5 py-2 text-sm text-[#1f1f1f] focus:outline-none focus:border-[#0b57d0] font-poppins"
              >
                {clientList.map((c) => (
                  <option key={c.name} value={c.name}>
                    👤 {c.name} ({c.role.split(',')[0]} - {c.email})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1f1f1f] mb-1 font-poppins">Sender Name</label>
              <input
                type="text"
                placeholder="e.g. Victoria Vance"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-xl px-3.5 py-2 text-sm text-[#1f1f1f] placeholder-[#747775] focus:outline-none focus:border-[#0b57d0] font-poppins"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1f1f1f] mb-1 font-poppins">Sender Email</label>
              <input
                type="email"
                placeholder="e.g. victoria@acme.com"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-xl px-3.5 py-2 text-sm text-[#1f1f1f] placeholder-[#747775] focus:outline-none focus:border-[#0b57d0] font-poppins"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1f1f1f] mb-1 font-poppins">Subject</label>
            <input
              type="text"
              placeholder="e.g. Urgent approval required for Q4 budget"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-xl px-3.5 py-2 text-sm text-[#1f1f1f] placeholder-[#747775] focus:outline-none focus:border-[#0b57d0] font-poppins"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1f1f1f] mb-1 font-poppins">Email Body Content</label>
            <textarea
              rows={4}
              placeholder="Paste or write email message here..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-xl p-3 text-sm text-[#1f1f1f] placeholder-[#747775] focus:outline-none focus:border-[#0b57d0] leading-relaxed font-poppins"
              required
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-3 border-t border-[#eaedf1]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 sm:py-2 rounded-full border border-[#dadce0] hover:bg-[#eaedf1] text-xs font-semibold font-poppins text-[#444746] transition text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !subject.trim() || !body.trim()}
              className="px-5 py-2.5 sm:py-2 rounded-full bg-[#0b57d0] hover:bg-[#0842a0] disabled:opacity-50 text-xs font-semibold font-poppins text-white shadow-sm transition flex items-center justify-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Analyzing with AI...' : 'Simulate & Run AI Triage'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

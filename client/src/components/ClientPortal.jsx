import React, { useState } from 'react';
import { 
  UserCheck, 
  CheckCircle2, 
  ArrowRight, 
  MessageSquare, 
  Clock, 
  Sparkles, 
  Send, 
  Check, 
  X, 
  FileText, 
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  AlertTriangle
} from 'lucide-react';

export default function ClientPortal({
  clientEmails,
  clientList = [],
  activeClient = 'Alex Morgan',
  onSelectClient,
  onClientAction,
  onSwitchToAssistant
}) {
  const [expandedEmailId, setExpandedEmailId] = useState(null);
  const [delegateModalEmail, setDelegateModalEmail] = useState(null);
  const [delegateNote, setDelegateNote] = useState('');
  const [activeTab, setActiveTab] = useState('pending');
  const [toastMessage, setToastMessage] = useState(null);

  const activeClientObj = clientList.find(c => c.name === activeClient) || {
    name: activeClient,
    role: 'Executive Principal'
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const pendingEmails = clientEmails.filter(e => !e.clientAttention?.handled);
  const handledEmails = clientEmails.filter(e => e.clientAttention?.handled);

  const handleMarkHandled = async (emailId, subject) => {
    await onClientAction(emailId, { action: 'mark_handled' });
    showToast(`Marked "${subject}" as handled. Assistant notified.`);
  };

  const handleQuickApprove = async (emailId, subject) => {
    await onClientAction(emailId, { action: 'decision', decision: 'approved' });
    showToast(`Approved "${subject}". Assistant informed.`);
  };

  const handleDelegateSubmit = async (e) => {
    e.preventDefault();
    if (!delegateModalEmail) return;

    await onClientAction(delegateModalEmail._id, {
      action: 'delegate_to_assistant',
      note: delegateNote.trim() || 'Please take over this conversation and follow up.'
    });

    showToast(`Delegated to assistant: "${delegateNote || 'Take over'}"`);
    setDelegateModalEmail(null);
    setDelegateNote('');
  };

  const firstName = activeClient.split(' ')[0];

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 flex flex-col gap-6 pb-28 lg:pb-6">
      {/* Client Perspective Switcher Bar (Active Executive Dropdown List) */}
      {clientList.length > 0 && (
        <div className="bg-white border border-[#eaedf1] rounded-2xl p-3 sm:px-4 sm:py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#1e8e3e] animate-pulse"></span>
              <label 
                htmlFor="executive-dropdown"
                className="text-xs font-semibold text-[#444746] font-poppins uppercase tracking-wider"
              >
                Active Executive View:
              </label>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="w-7 h-7 rounded-full bg-[#1e8e3e] text-white flex items-center justify-center font-bold text-xs font-poppins shadow-2xs flex-shrink-0">
                {activeClient.charAt(0)}
              </div>
              <div className="relative flex-1 sm:flex-initial inline-flex items-center">
                <select
                  id="executive-dropdown"
                  value={activeClient}
                  onChange={(e) => onSelectClient && onSelectClient(e.target.value)}
                  className="w-full sm:w-auto appearance-none bg-[#f0f4f9] hover:bg-[#eaf1fb] text-[#1f1f1f] text-xs sm:text-sm font-semibold font-poppins pl-3 pr-9 py-2 rounded-xl border border-[#dadce0] focus:outline-none focus:border-[#1e8e3e] focus:ring-2 focus:ring-[#1e8e3e]/20 cursor-pointer transition shadow-2xs"
                >
                  {clientList.map((c) => (
                    <option key={c.name} value={c.name} className="py-1.5 font-poppins text-sm">
                      {c.name} — {c.role.split(',')[0].trim()}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-[#747775] absolute right-2.5 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#747775] font-lato">
            <span className="hidden sm:inline">Filtered for:</span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#c4eed0] text-[#0f5223] font-semibold text-[11px] font-poppins">
              {activeClientObj.name}
            </span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#eaedf1]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1e8e3e] animate-pulse"></span>
            <span className="text-xs font-semibold tracking-wider uppercase text-[#1e8e3e] font-poppins">
              Executive Focus Mode • {activeClientObj.role}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1f1f1f] tracking-tight font-poppins">
            Good afternoon, {firstName}.
          </h1>
          <p className="text-sm text-[#444746] mt-1 font-lato">
            {pendingEmails.length === 0
              ? 'Your inbox is clear! No matters currently require your personal signature or approval.'
              : `You have ${pendingEmails.length} item${pendingEmails.length > 1 ? 's' : ''} requiring your personal attention today.`}
          </p>
        </div>

        <button
          onClick={onSwitchToAssistant}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-[#f0f4f9] text-xs font-semibold font-poppins text-[#0b57d0] border border-[#eaedf1] shadow-xs transition"
        >
          <ShieldCheck className="w-4 h-4 text-[#0b57d0]" />
          <span>Switch to Assistant View</span>
        </button>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-[#c4eed0] text-[#0f5223] text-sm font-semibold font-poppins flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#1e8e3e]" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-[#0f5223] hover:opacity-80">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#eaedf1] pb-2">
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold font-poppins transition ${
            activeTab === 'pending'
              ? 'bg-[#ffe7d6] text-[#b06000]'
              : 'text-[#444746] hover:bg-[#eaedf1]'
          }`}
        >
          <span>Requires Personal Input</span>
          <span className="px-2 py-0.5 rounded-full bg-white text-xs font-bold shadow-xs">
            {pendingEmails.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('handled')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold font-poppins transition ${
            activeTab === 'handled'
              ? 'bg-[#eaedf1] text-[#1f1f1f]'
              : 'text-[#747775] hover:bg-[#f0f4f9]'
          }`}
        >
          <span>Handled Today</span>
          <span className="px-2 py-0.5 rounded-full bg-white text-xs font-bold shadow-xs">
            {handledEmails.length}
          </span>
        </button>
      </div>

      {/* Focus Cards */}
      <div className="flex flex-col gap-4">
        {activeTab === 'pending' && pendingEmails.length === 0 && (
          <div className="p-16 text-center bg-white border border-[#eaedf1] rounded-3xl flex flex-col items-center justify-center gap-3 shadow-xs">
            <div className="p-4 bg-[#c4eed0] rounded-full">
              <CheckCircle2 className="w-10 h-10 text-[#1e8e3e]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1f1f1f] font-poppins">All Clear, {firstName}!</h3>
              <p className="text-sm text-[#747775] mt-1 font-lato max-w-sm">
                Your assistant is handling all operational and scheduling threads. Enjoy your uninterrupted focus time.
              </p>
            </div>
          </div>
        )}

        {(activeTab === 'pending' ? pendingEmails : handledEmails).map((email) => {
          const isExpanded = expandedEmailId === email._id;

          return (
            <div
              key={email._id}
              className="bg-white border border-[#eaedf1] rounded-2xl p-6 shadow-xs flex flex-col gap-3 transition hover:shadow-sm"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#f0f4f9]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#eaf1fb] text-[#0b57d0] font-bold text-sm flex items-center justify-center font-poppins">
                    {email.sender.name.charAt(0)}
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-[#1f1f1f] font-poppins">{email.sender.name}</span>
                    <span className="text-xs text-[#747775] ml-2 font-lato">&lt;{email.sender.email}&gt;</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-[#747775] font-lato">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{new Date(email.receivedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}</span>
                </div>
              </div>

              {/* Subject */}
              <h2 className="text-lg font-bold text-[#1f1f1f] font-poppins tracking-tight mt-1">
                {email.subject}
              </h2>

              {/* Why Attention Needed */}
              <div className="p-3.5 rounded-xl bg-[#fff8f2] border border-[#ffe7d6] flex items-start gap-2.5 text-sm text-[#b06000]">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold uppercase tracking-wider text-[11px] block font-poppins mb-0.5">
                    Why Your Personal Attention Is Needed
                  </span>
                  <p className="font-lato leading-relaxed">
                    {email.clientAttention?.reason || email.classificationReason || 'Requires executive authority or strategic sign-off.'}
                  </p>
                </div>
              </div>

              {/* Summary */}
              <div className="p-3.5 rounded-xl bg-[#f8fafd] border border-[#eaedf1] text-xs text-[#444746]">
                <div className="flex items-center gap-1.5 text-[#0b57d0] font-semibold mb-1 font-poppins">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="uppercase tracking-wider text-[11px]">Executive Briefing</span>
                </div>
                <p className="font-lato leading-relaxed text-sm text-[#303030]">
                  {email.aiSummary || email.snippet}
                </p>
              </div>

              {/* Actions Footer */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#f0f4f9] mt-2">
                <button
                  onClick={() => setExpandedEmailId(isExpanded ? null : email._id)}
                  className="flex items-center gap-1 text-xs text-[#747775] hover:text-[#0b57d0] font-medium font-poppins transition self-start sm:self-auto py-1"
                >
                  <FileText className="w-4 h-4" />
                  <span>{isExpanded ? 'Hide conversation thread' : 'Review full conversation'}</span>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                  {!email.clientAttention?.handled ? (
                    <>
                      <button
                        onClick={() => {
                          setDelegateModalEmail(email);
                          setDelegateNote('');
                        }}
                        className="px-4 py-2.5 sm:py-2 rounded-full border border-[#b8d4fb] bg-[#d3e3fd]/40 hover:bg-[#d3e3fd] text-xs font-semibold font-poppins text-[#041e49] transition flex items-center justify-center gap-1.5 w-full sm:w-auto min-h-[44px] sm:min-h-0"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Delegate to Assistant</span>
                      </button>

                      <button
                        onClick={() => handleQuickApprove(email._id, email.subject)}
                        className="px-4 py-2.5 sm:py-2 rounded-full bg-[#1e8e3e] hover:bg-[#167030] text-xs font-semibold font-poppins text-white shadow-xs transition flex items-center justify-center gap-1.5 w-full sm:w-auto min-h-[44px] sm:min-h-0"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Quick Approve</span>
                      </button>

                      <button
                        onClick={() => handleMarkHandled(email._id, email.subject)}
                        className="px-4 py-2.5 sm:py-2 rounded-full bg-[#f0f4f9] hover:bg-[#eaedf1] text-xs font-semibold font-poppins text-[#444746] border border-[#eaedf1] transition flex items-center justify-center gap-1.5 w-full sm:w-auto min-h-[44px] sm:min-h-0"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#1e8e3e]" />
                        <span>Mark as Handled</span>
                      </button>
                    </>
                  ) : (
                    <span className="text-xs text-[#1e8e3e] font-semibold font-poppins flex items-center justify-center gap-1.5 bg-[#c4eed0]/40 px-3 py-1.5 rounded-full">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{email.clientAttention?.clientDecision || 'Handled'}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Message History Accordion */}
              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-[#eaedf1] flex flex-col gap-3">
                  <span className="text-xs font-semibold text-[#747775] uppercase tracking-wider font-poppins">
                    Full Thread Messages
                  </span>
                  {email.messages && email.messages.map((msg, i) => (
                    <div key={i} className="p-4 rounded-xl bg-[#f8fafd] border border-[#eaedf1] text-sm">
                      <div className="flex items-center justify-between text-xs text-[#747775] mb-2 font-lato">
                        <span className="font-semibold text-[#1f1f1f] font-poppins">{msg.sender.name}</span>
                        <span>{new Date(msg.date).toLocaleString()}</span>
                      </div>
                      <div className="text-[#303030] whitespace-pre-line leading-relaxed font-poppins text-sm">
                        {msg.body}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Delegation Modal */}
      {delegateModalEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-[#eaedf1] rounded-3xl max-w-lg w-full p-6 shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#0b57d0]" />
                <h3 className="font-bold text-[#1f1f1f] text-base font-poppins">Delegate to Personal Assistant</h3>
              </div>
              <button
                onClick={() => setDelegateModalEmail(null)}
                className="p-1 rounded-full hover:bg-[#eaedf1] text-[#747775]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#5e5e5e] font-lato leading-relaxed">
              This email will be transferred to your assistant's queue. Enter any instruction or preferred response direction below.
            </p>

            <div className="p-3 bg-[#f0f4f9] rounded-xl text-xs">
              <span className="text-[#747775] block mb-0.5 font-poppins">Subject:</span>
              <span className="font-semibold text-[#1f1f1f] font-poppins">{delegateModalEmail.subject}</span>
            </div>

            <form onSubmit={handleDelegateSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1f1f1f] mb-1 font-poppins">
                  Instruction for your Assistant:
                </label>
                <textarea
                  rows={3}
                  value={delegateNote}
                  onChange={(e) => setDelegateNote(e.target.value)}
                  placeholder="e.g., 'Approve and confirm for 2:00 PM EST', or 'Decline politely and request alternative dates'"
                  className="w-full bg-white border border-[#dadce0] rounded-xl p-3 text-sm text-[#1f1f1f] focus:outline-none focus:border-[#0b57d0] font-poppins"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setDelegateModalEmail(null)}
                  className="px-4 py-2 rounded-full border border-[#dadce0] hover:bg-[#eaedf1] text-xs font-semibold font-poppins text-[#444746]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#0b57d0] hover:bg-[#0842a0] text-xs font-semibold font-poppins text-white shadow-sm flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transfer to Assistant</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

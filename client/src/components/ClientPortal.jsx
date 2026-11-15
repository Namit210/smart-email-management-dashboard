import React, { useState } from 'react';
import { 
  UserCheck, 
  CheckCircle2, 
  ArrowRight, 
  MessageSquare, 
  ExternalLink, 
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
  onClientAction,
  onSwitchToAssistant
}) {
  const [expandedEmailId, setExpandedEmailId] = useState(null);
  const [delegateModalEmail, setDelegateModalEmail] = useState(null);
  const [delegateNote, setDelegateNote] = useState('');
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'handled'
  const [toastMessage, setToastMessage] = useState(null);

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
    showToast(`Approved "${subject}". Assistant informed to proceed.`);
  };

  const handleDelegateSubmit = async (e) => {
    e.preventDefault();
    if (!delegateModalEmail) return;

    await onClientAction(delegateModalEmail._id, {
      action: 'delegate_to_assistant',
      note: delegateNote.trim() || 'Please take over this conversation and follow up.'
    });

    showToast(`Delegated to assistant with instruction: "${delegateNote || 'Take over'}"`);
    setDelegateModalEmail(null);
    setDelegateNote('');
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 flex flex-col gap-8">
      {/* Zen Header for Client */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-semibold tracking-wider uppercase text-emerald-400">
              Executive Focus Mode
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Good afternoon, Alex.
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {pendingEmails.length === 0
              ? 'Your inbox is clear! No matters currently require your personal signature or approval.'
              : `You have ${pendingEmails.length} item${pendingEmails.length > 1 ? 's' : ''} requiring your personal attention today.`}
          </p>
        </div>

        {/* View Switcher button for evaluator */}
        <div className="flex items-center gap-3">
          <button
            onClick={onSwitchToAssistant}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 shadow-sm transition"
          >
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>Switch to Assistant View</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Tabs: Pending Attention vs Handled Today */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
            activeTab === 'pending'
              ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Requires Attention</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[11px] font-bold">
            {pendingEmails.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('handled')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
            activeTab === 'handled'
              ? 'bg-slate-800 text-slate-200 border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Handled Today</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[11px]">
            {handledEmails.length}
          </span>
        </button>
      </div>

      {/* List of Client Focus Cards */}
      <div className="flex flex-col gap-5">
        {activeTab === 'pending' && pendingEmails.length === 0 && (
          <div className="p-16 text-center bg-slate-900/40 border border-slate-800 rounded-3xl flex flex-col items-center justify-center gap-3">
            <div className="p-4 bg-emerald-950/40 rounded-2xl border border-emerald-500/20">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">All Clear, Alex!</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Your assistant is handling all operational and scheduling threads. Enjoy your focused deep work time.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'handled' && handledEmails.length === 0 && (
          <div className="p-12 text-center text-slate-500 text-xs bg-slate-900/40 border border-slate-800 rounded-3xl">
            No items marked as handled yet today.
          </div>
        )}

        {(activeTab === 'pending' ? pendingEmails : handledEmails).map((email) => {
          const isExpanded = expandedEmailId === email._id;

          return (
            <div
              key={email._id}
              className={`bg-slate-900/80 border rounded-2xl p-5 sm:p-6 transition-all shadow-sm ${
                email.urgency === 'urgent'
                  ? 'border-amber-500/40 shadow-amber-500/5'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Card Header: Sender & Date */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-3">
                  {email.sender.avatar ? (
                    <img
                      src={email.sender.avatar}
                      alt={email.sender.name}
                      className="w-8 h-8 rounded-full object-cover border border-slate-700"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                      {email.sender.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <span className="text-xs font-semibold text-white">{email.sender.name}</span>
                    <span className="text-[11px] text-slate-500 ml-2">&lt;{email.sender.email}&gt;</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>{new Date(email.receivedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}</span>
                </div>
              </div>

              {/* Subject */}
              <div className="mt-4">
                <h2 className="text-base font-bold text-white tracking-tight">
                  {email.subject}
                </h2>
              </div>

              {/* CRUCIAL SECTION 4 REQUIREMENT: Why client's response is needed */}
              <div className="mt-3.5 p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-amber-300 block mb-0.5 uppercase tracking-wider text-[10px]">
                    Why Your Personal Attention Is Needed
                  </span>
                  <p className="text-slate-200 leading-relaxed font-medium">
                    {email.clientAttention?.reason || email.classificationReason || 'Requires executive authority, contract signing, or strategic approval.'}
                  </p>
                </div>
              </div>

              {/* Short AI-generated summary */}
              <div className="mt-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
                <div className="flex items-center gap-1.5 text-teal-400 font-semibold mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="uppercase tracking-wider text-[10px]">Executive Summary</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {email.aiSummary || email.snippet}
                </p>
              </div>

              {/* Action Buttons Row */}
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
                {/* Left: View full conversation trigger */}
                <button
                  onClick={() => setExpandedEmailId(isExpanded ? null : email._id)}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{isExpanded ? 'Hide conversation history' : 'Review full conversation'}</span>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {/* Right: Handled / Delegate / Quick Action Buttons */}
                <div className="flex items-center flex-wrap gap-2">
                  {!email.clientAttention?.handled ? (
                    <>
                      {/* Delegate to Assistant */}
                      <button
                        onClick={() => {
                          setDelegateModalEmail(email);
                          setDelegateNote('');
                        }}
                        className="px-3 py-1.5 rounded-xl border border-indigo-500/40 hover:bg-indigo-950/40 text-xs font-semibold text-indigo-300 transition flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Delegate to Assistant</span>
                      </button>

                      {/* Quick 1-Click Approve */}
                      <button
                        onClick={() => handleQuickApprove(email._id, email.subject)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-600 text-xs font-semibold text-white shadow-sm transition flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Quick Approve</span>
                      </button>

                      {/* Mark as Handled */}
                      <button
                        onClick={() => handleMarkHandled(email._id, email.subject)}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>Mark as Handled</span>
                      </button>
                    </>
                  ) : (
                    <span className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{email.clientAttention?.clientDecision || 'Handled'}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Expandable Conversation History */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col gap-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Full Message Thread
                  </span>
                  {email.messages && email.messages.map((msg, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 text-xs">
                      <div className="flex items-center justify-between text-slate-400 mb-1.5 text-[11px]">
                        <span className="font-semibold text-slate-300">{msg.sender.name}</span>
                        <span>{new Date(msg.date).toLocaleString()}</span>
                      </div>
                      <div className="text-slate-300 whitespace-pre-line leading-relaxed">
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

      {/* Delegate to Assistant Modal */}
      {delegateModalEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white text-base">Delegate to Assistant</h3>
              </div>
              <button
                onClick={() => setDelegateModalEmail(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              This conversation will immediately transfer to your personal assistant's queue. You can leave a quick instruction or preferred response direction below.
            </p>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-400 text-[11px] block mb-0.5">Subject:</span>
              <span className="font-medium text-slate-200">{delegateModalEmail.subject}</span>
            </div>

            <form onSubmit={handleDelegateSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Instruction for your Assistant:
                </label>
                <textarea
                  rows={3}
                  value={delegateNote}
                  onChange={(e) => setDelegateNote(e.target.value)}
                  placeholder="e.g., 'Go ahead and approve this, book for 2pm', or 'Ask them to reduce price by 10%'"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setDelegateModalEmail(null)}
                  className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs text-slate-300 font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-sm transition flex items-center gap-1.5"
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

import React, { useState } from 'react';
import { 
  UserCheck, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  MessageSquare, 
  Clock, 
  Sparkles, 
  Send, 
  Check, 
  X, 
  FileText, 
  ShieldCheck,
  ChevronDown, 
  AlertTriangle,
  Bot,
  CheckCheck,
  Mail,
  Inbox
} from 'lucide-react';

export default function ClientPortal({
  clientEmails = [],
  clientList = [],
  activeClient = '',
  onSelectClient,
  onClientAction,
  onSwitchToAssistant,
  onOpenConnectModal,
  onMarkRead
}) {
  const [selectedEmailId, setSelectedEmailId] = useState(null);
  const [delegateModalEmail, setDelegateModalEmail] = useState(null);
  const [delegateNote, setDelegateNote] = useState('');
  const [activeTab, setActiveTab] = useState('pending');
  const [allMailFilter, setAllMailFilter] = useState('all'); // 'all' | 'unhandled' | 'handled'
  const [toastMessage, setToastMessage] = useState(null);

  const handleSelectEmail = (id) => {
    setSelectedEmailId(id);
    if (onMarkRead) {
      onMarkRead(id);
    }
  };

  const activeClientObj = clientList.find(c => c.name === activeClient) || {
    name: activeClient,
    role: 'Executive Principal'
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const isEmailHandled = (e) => {
    return !!e.clientAttention?.handled || e.replyDraft?.status === 'sent' || e.classification === 'no_reply_needed';
  };

  const pendingEmails = clientEmails.filter(e => (e.classification === 'client_reply' || e.clientAttention?.required) && !e.clientAttention?.handled);
  const handledEmails = clientEmails.filter(e => e.clientAttention?.handled);
  const allEmails = clientEmails;

  const filteredAllEmails = allEmails.filter(e => {
    if (allMailFilter === 'unhandled') return !isEmailHandled(e);
    if (allMailFilter === 'handled') return isEmailHandled(e);
    return true;
  });

  const unhandledAllCount = allEmails.filter(e => !isEmailHandled(e)).length;
  const handledAllCount = allEmails.filter(e => isEmailHandled(e)).length;

  const currentList = activeTab === 'pending' 
    ? pendingEmails 
    : activeTab === 'all' 
    ? filteredAllEmails 
    : handledEmails;

  const selectedEmail = clientEmails.find(e => e._id === selectedEmailId) || null;

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

  const formatRelativeTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMins = Math.round((now - date) / (1000 * 60));
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.round(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const firstName = activeClient ? activeClient.split(' ')[0] : 'Client';

  if (clientList.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 flex flex-col gap-6 pb-28 lg:pb-6">
        <div className="p-10 sm:p-16 text-center bg-white border border-[#eaedf1] rounded-3xl flex flex-col items-center justify-center gap-4 shadow-xs">
          <div className="w-16 h-16 rounded-3xl bg-[#c4eed0]/50 text-[#1e8e3e] flex items-center justify-center shadow-xs">
            <UserCheck className="w-8 h-8 text-[#1e8e3e]" />
          </div>
          <div className="max-w-md">
            <h3 className="text-xl font-bold text-[#1f1f1f] font-poppins">No Executive Clients Connected Yet</h3>
            <p className="text-xs sm:text-sm text-[#747775] mt-2 font-lato leading-relaxed">
              The Client Portal provides a minimalistic approval interface for your principals. When you connect an executive's mailbox, threads requiring their personal decision or signature will appear here.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2.5 mt-2 w-full sm:w-auto">
            {onOpenConnectModal && (
              <button
                onClick={onOpenConnectModal}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#1e8e3e] hover:bg-[#167030] text-white text-xs font-semibold font-poppins shadow-xs transition w-full sm:w-auto min-h-[44px] sm:min-h-0"
              >
                <span>Connect Client Mailbox</span>
              </button>
            )}
            <button
              onClick={onSwitchToAssistant}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#f0f4f9] hover:bg-[#eaedf1] text-[#041e49] text-xs font-semibold font-poppins border border-[#eaedf1] transition w-full sm:w-auto min-h-[44px] sm:min-h-0"
            >
              <span>Switch to Assistant View</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-6 px-3 sm:px-6 flex flex-col gap-5 pb-28 lg:pb-6">
      {/* Top Active Executive Switcher Bar */}
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
                  onChange={(e) => {
                    setSelectedEmailId(null);
                    onSelectClient && onSelectClient(e.target.value);
                  }}
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
            <span className="hidden sm:inline">Active Client:</span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#c4eed0] text-[#0f5223] font-semibold text-[11px] font-poppins">
              {activeClientObj.name}
            </span>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#eaedf1]">
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
              : `You have ${pendingEmails.length} item${pendingEmails.length > 1 ? 's' : ''} requiring your personal attention.`}
          </p>
        </div>

        <button
          onClick={onSwitchToAssistant}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-[#f0f4f9] text-xs font-semibold font-poppins text-[#0b57d0] border border-[#eaedf1] shadow-xs transition self-start sm:self-auto"
        >
          <ShieldCheck className="w-4 h-4 text-[#0b57d0]" />
          <span>Switch to Assistant View</span>
        </button>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-[#c4eed0] text-[#0f5223] text-sm font-semibold font-poppins flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#1e8e3e]" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-[#0f5223] hover:opacity-80">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Content Area: Master List vs Focused Decision Studio */}
      {selectedEmail ? (
        /* Focused Decision Studio for Selected Email */
        <div className="bg-white border border-[#eaedf1] rounded-3xl overflow-hidden shadow-xs flex flex-col animate-fade-in">
          {/* Top Back Navigation Bar */}
          <div className="px-4 py-3 border-b border-[#eaedf1] flex items-center justify-between bg-[#f8fafd]">
            <button
              onClick={() => setSelectedEmailId(null)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-[#eaedf1] text-xs sm:text-sm font-semibold text-[#0b57d0] font-poppins transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to {activeTab === 'pending' ? 'Pending Items' : activeTab === 'all' ? 'All Conversations' : 'Handled Items'}</span>
            </button>

            <span className="text-xs text-[#747775] font-poppins">
              Thread for {selectedEmail.clientName || activeClient}
            </span>
          </div>

          <div className="p-4 sm:p-7 flex flex-col gap-4">
            {/* Subject Header */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#f0f4f9]">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  {(selectedEmail.clientAttention?.required || selectedEmail.classification === 'client_reply') ? (
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#b06000] font-poppins">
                      Executive Decision Required
                    </span>
                  ) : selectedEmail.classification === 'assistant_reply' ? (
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#0b57d0] font-poppins">
                      Managed by Personal Assistant
                    </span>
                  ) : selectedEmail.classification === 'no_reply_needed' ? (
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#747775] font-poppins">
                      Informational / No Reply Needed
                    </span>
                  ) : (
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#747775] font-poppins">
                      Mail Conversation
                    </span>
                  )}
                  {selectedEmail.urgency === 'urgent' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#fce8e6] text-[#b3261e] border border-[#f9dedc]">
                      URGENT
                    </span>
                  )}
                  {selectedEmail.extractedMeeting?.detected && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#c4eed0] text-[#0f5223] border border-[#a8dab5]">
                      Meeting Proposal
                    </span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#1f1f1f] font-poppins tracking-tight">
                  {selectedEmail.subject}
                </h2>
                <div className="flex items-center gap-2 text-xs text-[#747775] mt-1 font-lato flex-wrap">
                  <span>From: <strong className="text-[#1f1f1f]">{selectedEmail.sender.name}</strong> &lt;{selectedEmail.sender.email}&gt;</span>
                  <span>•</span>
                  <span>{new Date(selectedEmail.receivedAt).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Handled Status Confirmation Banner */}
            {selectedEmail.clientAttention?.handled && (
              <div className="p-4 rounded-2xl bg-[#c4eed0]/40 border border-[#a8dab5] text-[#0f5223] flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#1e8e3e] flex-shrink-0" />
                <div>
                  <span className="font-bold text-sm font-poppins block">
                    ✓ Decision Recorded: {selectedEmail.clientAttention?.clientDecision || 'Handled'}
                  </span>
                  <span className="text-xs font-lato opacity-90">
                    Your assistant has been notified and unblocked to execute follow-up tasks.
                  </span>
                </div>
              </div>
            )}

            {/* Why Attention Is Needed (or Assistant Responsibility Status) */}
            {(selectedEmail.clientAttention?.required || selectedEmail.classification === 'client_reply') ? (
              <div className="p-4 rounded-2xl bg-[#fff8f2] border border-[#ffe7d6] flex items-start gap-3 text-[#b06000]">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#b06000]" />
                <div>
                  <span className="font-bold uppercase tracking-wider text-xs block font-poppins mb-1">
                    Why Your Personal Attention Is Needed
                  </span>
                  <p className="font-lato leading-relaxed text-sm text-[#8c4c00]">
                    {selectedEmail.clientAttention?.reason || selectedEmail.classificationReason || 'Requires executive authority or strategic sign-off.'}
                  </p>
                </div>
              </div>
            ) : selectedEmail.classification === 'assistant_reply' ? (
              <div className="p-4 rounded-2xl bg-[#eaf1fb] border border-[#d3e3fd] flex items-start gap-3 text-[#041e49]">
                <Bot className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#0b57d0]" />
                <div>
                  <span className="font-bold uppercase tracking-wider text-xs block font-poppins mb-1">
                    Managed by Your Assistant
                  </span>
                  <p className="font-lato leading-relaxed text-sm text-[#001d35]">
                    Your assistant is overseeing this thread and executing any scheduling or follow-up communications.
                  </p>
                </div>
              </div>
            ) : null}

            {/* AI Executive Briefing */}
            <div className="p-4 rounded-2xl bg-[#f8fafd] border border-[#eaedf1]">
              <div className="flex items-center gap-1.5 text-[#0b57d0] font-semibold mb-1.5 font-poppins">
                <Sparkles className="w-4 h-4" />
                <span className="uppercase tracking-wider text-xs">AI Executive Briefing</span>
              </div>
              <p className="font-lato leading-relaxed text-sm text-[#303030]">
                {selectedEmail.aiSummary || selectedEmail.snippet}
              </p>
            </div>

            {/* Decision Action Toolbar */}
            {(selectedEmail.clientAttention?.required || selectedEmail.classification === 'client_reply') && !selectedEmail.clientAttention?.handled ? (
              <div className="p-4 rounded-2xl bg-[#f8fafd] border border-[#eaedf1] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-2xs">
                <div className="text-xs text-[#747775] font-poppins font-medium">
                  Choose an action to handle this item:
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <button
                    onClick={() => {
                      setDelegateModalEmail(selectedEmail);
                      setDelegateNote('');
                    }}
                    className="px-4 py-2.5 rounded-full border border-[#b8d4fb] bg-[#d3e3fd]/40 hover:bg-[#d3e3fd] text-xs font-semibold font-poppins text-[#041e49] transition flex items-center justify-center gap-1.5 min-h-[42px] sm:min-h-0"
                  >
                    <MessageSquare className="w-4 h-4 text-[#0b57d0]" />
                    <span>Delegate to Assistant</span>
                  </button>

                  <button
                    onClick={async () => {
                      await handleQuickApprove(selectedEmail._id, selectedEmail.subject);
                    }}
                    className="px-5 py-2.5 rounded-full bg-[#1e8e3e] hover:bg-[#167030] text-xs font-semibold font-poppins text-white shadow-xs transition flex items-center justify-center gap-1.5 min-h-[42px] sm:min-h-0"
                  >
                    <Check className="w-4 h-4" />
                    <span>Quick Approve</span>
                  </button>

                  <button
                    onClick={async () => {
                      await handleMarkHandled(selectedEmail._id, selectedEmail.subject);
                    }}
                    className="px-4 py-2.5 rounded-full bg-white hover:bg-[#eaedf1] text-xs font-semibold font-poppins text-[#444746] border border-[#eaedf1] transition flex items-center justify-center gap-1.5 min-h-[42px] sm:min-h-0"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#1e8e3e]" />
                    <span>Mark as Handled</span>
                  </button>
                </div>
              </div>
            ) : !selectedEmail.clientAttention?.handled ? (
              /* Non-escalated thread action toolbar - ability to delegate instructions to assistant */
              <div className="p-3.5 sm:p-4 rounded-2xl bg-[#f8fafd] border border-[#eaedf1] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-2xs">
                <div className="text-xs text-[#747775] font-poppins font-medium">
                  Have special instructions for your assistant regarding this conversation?
                </div>
                <button
                  onClick={() => {
                    setDelegateModalEmail(selectedEmail);
                    setDelegateNote('');
                  }}
                  className="px-4 py-2 rounded-full border border-[#b8d4fb] bg-[#d3e3fd]/40 hover:bg-[#d3e3fd] text-xs font-semibold font-poppins text-[#041e49] transition flex items-center justify-center gap-1.5 self-start sm:self-auto"
                >
                  <MessageSquare className="w-4 h-4 text-[#0b57d0]" />
                  <span>Instruct Assistant</span>
                </button>
              </div>
            ) : null}

            {/* Conversation History */}
            <div className="pt-2 flex flex-col gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#747775] font-poppins">
                Full Conversation History ({selectedEmail.messages?.length || 1} messages)
              </span>
              {selectedEmail.messages && selectedEmail.messages.map((msg, i) => (
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
          </div>
        </div>
      ) : (
        /* Master Packed Email List View (Matches Assistant View Layout) */
        <div className="flex flex-col gap-4">
          {/* Tabs Navigation */}
          <div className="flex items-center gap-2 border-b border-[#eaedf1] pb-2 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('pending')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold font-poppins transition whitespace-nowrap ${
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
              onClick={() => setActiveTab('all')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold font-poppins transition whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-[#d3e3fd] text-[#041e49]'
                  : 'text-[#444746] hover:bg-[#eaedf1]'
              }`}
            >
              <Mail className="w-3.5 h-3.5 text-[#0b57d0]" />
              <span>All Mail & Conversations</span>
              <span className="px-2 py-0.5 rounded-full bg-white text-xs font-bold shadow-xs">
                {allEmails.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('handled')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold font-poppins transition whitespace-nowrap ${
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

          {/* Empty State */}
          {activeTab === 'pending' && pendingEmails.length === 0 ? (
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
          ) : activeTab === 'all' && currentList.length === 0 ? (
            <div className="p-14 text-center bg-white border border-[#eaedf1] rounded-3xl flex flex-col items-center justify-center gap-3 shadow-xs">
              <div className="p-3.5 bg-[#f0f4f9] rounded-full">
                {allMailFilter === 'unhandled' ? (
                  <CheckCircle2 className="w-8 h-8 text-[#1e8e3e]" />
                ) : (
                  <Inbox className="w-8 h-8 text-[#747775]" />
                )}
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1f1f1f] font-poppins">
                  {allMailFilter === 'unhandled' ? 'All Caught Up!' : `No emails found for ${firstName}`}
                </h3>
                <p className="text-xs text-[#747775] mt-1 font-lato max-w-sm">
                  {allMailFilter === 'unhandled'
                    ? 'There are no unhandled emails in your mailbox right now. Every thread has been handled or resolved.'
                    : 'No conversations match the current filter.'}
                </p>
              </div>
            </div>
          ) : activeTab === 'handled' && handledEmails.length === 0 ? (
            <div className="p-12 text-center bg-white border border-[#eaedf1] rounded-3xl text-[#747775] text-sm font-poppins shadow-xs">
              No handled items recorded for today.
            </div>
          ) : (
            /* Organized Packed List Card */
            <div className="bg-white border border-[#eaedf1] rounded-2xl overflow-hidden shadow-xs divide-y divide-[#eaedf1]">
              {/* List Header Toolbar */}
              <div className="px-4 py-2.5 bg-[#f8fafd] border-b border-[#eaedf1] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-[#747775] font-poppins">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-[#1f1f1f]">
                    {activeTab === 'pending'
                      ? 'Pending Executive Decisions'
                      : activeTab === 'all'
                      ? 'All Client Inbound & Outbound Conversations'
                      : 'Decisions Handled'}
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white border border-[#eaedf1]">
                    {currentList.length} items
                  </span>

                  {/* Quick Sub-Filter in All Mail: All / Not Yet Handled / Handled */}
                  {activeTab === 'all' && (
                    <div className="flex items-center gap-1 ml-0 sm:ml-2 bg-[#eaedf1] p-0.5 rounded-full text-[11px]">
                      <button
                        onClick={() => setAllMailFilter('all')}
                        className={`px-2.5 py-0.5 rounded-full transition font-semibold ${
                          allMailFilter === 'all'
                            ? 'bg-white text-[#0b57d0] shadow-2xs'
                            : 'text-[#444746] hover:text-[#1f1f1f]'
                        }`}
                      >
                        All ({allEmails.length})
                      </button>
                      <button
                        onClick={() => setAllMailFilter('unhandled')}
                        className={`px-2.5 py-0.5 rounded-full transition font-semibold flex items-center gap-1.5 ${
                          allMailFilter === 'unhandled'
                            ? 'bg-[#ffe7d6] text-[#b06000] shadow-2xs'
                            : 'text-[#444746] hover:text-[#1f1f1f]'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c] animate-pulse"></span>
                        <span>Not Yet Handled ({unhandledAllCount})</span>
                      </button>
                      <button
                        onClick={() => setAllMailFilter('handled')}
                        className={`px-2.5 py-0.5 rounded-full transition font-semibold ${
                          allMailFilter === 'handled'
                            ? 'bg-[#c4eed0] text-[#0f5223] shadow-2xs'
                            : 'text-[#444746] hover:text-[#1f1f1f]'
                        }`}
                      >
                        Handled ({handledAllCount})
                      </button>
                    </div>
                  )}
                </div>
                <span className="hidden md:inline font-lato text-xs text-[#747775]">
                  Click any thread to review full briefing & conversation
                </span>
              </div>

              {/* Packed List Rows */}
              {currentList.map((email) => {
                const isUnread = !email.isRead;
                const requiresAttention = (email.clientAttention?.required || email.classification === 'client_reply') && !email.clientAttention?.handled;

                return (
                  <div
                    key={email._id}
                    onClick={() => handleSelectEmail(email._id)}
                    className={`group px-3 sm:px-4 py-3 cursor-pointer transition-all border-b border-[#eaedf1] flex items-start justify-between gap-3 ${
                      isUnread
                        ? 'bg-[#ffffff] font-semibold shadow-2xs'
                        : 'bg-[#f8fafd] hover:bg-white text-[#444746]'
                    }`}
                  >
                    {/* Left Sender Avatar */}
                    <div className="w-8 h-8 rounded-full bg-[#eaf1fb] text-[#0b57d0] font-bold text-xs flex items-center justify-center font-poppins flex-shrink-0 mt-0.5">
                      {email.sender?.name?.charAt(0) || 'E'}
                    </div>

                    {/* Content Column */}
                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                      {/* Line 1: Sender & Time */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          {isUnread && (
                            <span className="w-2 h-2 rounded-full bg-[#0b57d0] flex-shrink-0" title="Unread"></span>
                          )}
                          <span className={`text-sm truncate font-poppins ${isUnread ? 'text-[#1f1f1f] font-semibold' : 'text-[#444746] font-medium'}`}>
                            {email.sender.name}
                          </span>
                          <span className="text-xs text-[#747775] font-lato truncate hidden sm:inline">
                            &lt;{email.sender.email}&gt;
                          </span>
                        </div>
                        <span className="text-xs text-[#747775] font-poppins flex-shrink-0">
                          {formatRelativeTime(email.receivedAt)}
                        </span>
                      </div>

                      {/* Line 2: Stamps Row */}
                      <div className="flex items-center gap-1.5 flex-nowrap overflow-x-auto scrollbar-none py-0.5">
                        {/* Primary Handling Status Stamp */}
                        {email.clientAttention?.handled ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#c4eed0] text-[#0f5223] border border-[#a8dab5] whitespace-nowrap flex-shrink-0 font-poppins">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#1e8e3e] flex-shrink-0" />
                            <span>Handled: {email.clientAttention?.clientDecision || 'Approved'}</span>
                          </span>
                        ) : (email.clientAttention?.required || email.classification === 'client_reply') ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#fff0e6] text-[#c2410c] border border-[#fed7aa] whitespace-nowrap flex-shrink-0 font-poppins shadow-2xs">
                            <span className="w-2 h-2 rounded-full bg-[#ea580c] animate-pulse flex-shrink-0"></span>
                            <span>Not Yet Handled • Action Required</span>
                          </span>
                        ) : email.classification === 'assistant_reply' ? (
                          email.replyDraft?.status === 'sent' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#c4eed0] text-[#0f5223] border border-[#a8dab5] whitespace-nowrap flex-shrink-0 font-poppins">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#1e8e3e] flex-shrink-0" />
                              <span>Handled by Assistant</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#e0f2fe] text-[#0369a1] border border-[#bae6fd] whitespace-nowrap flex-shrink-0 font-poppins">
                              <Bot className="w-3.5 h-3.5 text-[#0284c7] flex-shrink-0" />
                              <span>Not Yet Handled • In Progress by Assistant</span>
                            </span>
                          )
                        ) : email.classification === 'no_reply_needed' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#f1f5f9] text-[#64748b] border border-[#e2e8f0] whitespace-nowrap flex-shrink-0 font-poppins">
                            <CheckCheck className="w-3 h-3 text-[#94a3b8] flex-shrink-0" />
                            <span>FYI / No Action Needed</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#fef3c7] text-[#92400e] border border-[#fde68a] whitespace-nowrap flex-shrink-0 font-poppins">
                            <Clock className="w-3 h-3 text-[#d97706] flex-shrink-0" />
                            <span>Not Yet Handled • Pending Review</span>
                          </span>
                        )}

                        {/* Specific Attention Reason (if present and not already displayed) */}
                        {email.clientAttention?.reason && !email.clientAttention?.handled && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#f0f4f9] text-[#444746] border border-[#eaedf1] whitespace-nowrap flex-shrink-0 font-poppins truncate max-w-[200px] sm:max-w-[280px]">
                            <AlertTriangle className="w-3 h-3 text-[#b06000] flex-shrink-0" />
                            <span className="truncate">{email.clientAttention.reason}</span>
                          </span>
                        )}

                        {/* Urgency Stamp */}
                        {email.urgency === 'urgent' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#fce8e6] text-[#b3261e] border border-[#f9dedc] whitespace-nowrap flex-shrink-0 font-poppins tracking-wider uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#b3261e] animate-pulse"></span>
                            <span>URGENT</span>
                          </span>
                        )}

                        {/* Meeting Proposal Stamp */}
                        {email.extractedMeeting?.detected && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#c4eed0] text-[#0f5223] border border-[#a8dab5] whitespace-nowrap flex-shrink-0 font-poppins">
                            <Clock className="w-3 h-3 text-[#1e8e3e] flex-shrink-0" />
                            <span>Meeting Proposal</span>
                          </span>
                        )}
                      </div>

                      {/* Line 3: Subject & Snippet */}
                      <div className="text-xs sm:text-sm text-[#1f1f1f] truncate mt-0.5">
                        <span className={`font-poppins mr-1.5 ${isUnread ? 'font-bold text-[#1f1f1f]' : 'font-semibold text-[#303030]'}`}>
                          {email.subject}
                        </span>
                        <span className="text-[#747775] font-lato text-xs">— {email.snippet}</span>
                      </div>
                    </div>

                    {/* Right Quick Actions */}
                    {requiresAttention ? (
                      <div className="flex items-center gap-1.5 flex-shrink-0 self-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleQuickApprove(email._id, email.subject)}
                          className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#1e8e3e] hover:bg-[#167030] text-white text-xs font-semibold font-poppins shadow-2xs transition"
                          title="Quick Approve"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleSelectEmail(email._id)}
                          className="p-1.5 rounded-full text-[#747775] hover:text-[#0b57d0] hover:bg-[#eaedf1] transition"
                          title="Review & decide"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 flex-shrink-0 self-center">
                        <button
                          onClick={() => handleSelectEmail(email._id)}
                          className="p-1.5 rounded-full text-[#747775] hover:text-[#0b57d0] hover:bg-[#eaedf1] transition"
                          title="View conversation"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Delegate Modal */}
      {delegateModalEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-[#eaedf1] rounded-3xl max-w-lg w-full p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#eaedf1]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#d3e3fd] text-[#041e49]">
                  <MessageSquare className="w-4 h-4 text-[#0b57d0]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1f1f1f] font-poppins">Delegate to Assistant</h3>
                  <p className="text-xs text-[#747775] font-lato">Send immediate instructions to your personal assistant</p>
                </div>
              </div>
              <button
                onClick={() => setDelegateModalEmail(null)}
                className="p-1 rounded-full hover:bg-[#eaedf1] text-[#747775]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDelegateSubmit} className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#1f1f1f] mb-1 font-poppins">
                  Subject: {delegateModalEmail.subject}
                </label>
                <textarea
                  rows={4}
                  placeholder="e.g., 'Approve and confirm for 2:00 PM EST', or 'Decline politely and request alternative dates'"
                  value={delegateNote}
                  onChange={(e) => setDelegateNote(e.target.value)}
                  className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-xl p-3 text-sm text-[#1f1f1f] focus:outline-none focus:border-[#0b57d0] leading-relaxed font-poppins"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#eaedf1]">
                <button
                  type="button"
                  onClick={() => setDelegateModalEmail(null)}
                  className="px-4 py-2 rounded-full border border-[#dadce0] hover:bg-[#eaedf1] text-xs font-semibold font-poppins text-[#444746]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#0b57d0] hover:bg-[#0842a0] text-xs font-semibold font-poppins text-white shadow-xs transition flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Direction to Assistant</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Bot, 
  UserCheck, 
  CheckCheck, 
  AlertCircle, 
  Sparkles, 
  Calendar, 
  Send, 
  Star, 
  Mail, 
  Archive, 
  CheckCircle2, 
  Copy,
  Clock,
  User,
  Shield,
  ChevronDown,
  Trash2
} from 'lucide-react';

export default function EmailDetail({
  email,
  onBack,
  onUpdateClassification,
  onSendReply,
  onToggleFlag,
  onClientAction,
  onDeleteEmail,
  onToggleActionItem,
  onSaveDraft
}) {
  const [selectedTone, setSelectedTone] = useState('professional');
  const [draftText, setDraftText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [replySuccess, setReplySuccess] = useState(false);
  const [actionItemStates, setActionItemStates] = useState({});

  useEffect(() => {
    if (email) {
      const matchingDraft = email.replyDraft?.drafts?.find(d => d.tone === selectedTone) || email.replyDraft?.drafts?.[0];
      setDraftText(matchingDraft?.body || email.replyDraft?.activeDraftText || '');
      setReplySuccess(false);

      const initialActions = {};
      email.actionItems?.forEach((item, idx) => {
        initialActions[idx] = item.completed;
      });
      setActionItemStates(initialActions);
    }
  }, [email, selectedTone]);

  if (!email) return null;

  const handleToneChange = (tone) => {
    setSelectedTone(tone);
    const draft = email.replyDraft?.drafts?.find(d => d.tone === tone);
    if (draft) {
      setDraftText(draft.body);
      if (onSaveDraft) {
        onSaveDraft(email._id, draft.body, tone);
      }
    }
  };

  const handleSendReply = async () => {
    setIsSending(true);
    await onSendReply(email._id, {
      body: draftText,
      subject: `Re: ${email.subject}`,
      asAssistant: true
    });
    setIsSending(false);
    setReplySuccess(true);
    setTimeout(() => setReplySuccess(false), 3000);
  };

  const toggleActionItem = (idx) => {
    const newState = !actionItemStates[idx];
    setActionItemStates(prev => ({
      ...prev,
      [idx]: newState
    }));
    if (onToggleActionItem) {
      onToggleActionItem(email._id, idx, newState);
    }
  };

  return (
    <div className="flex-1 bg-white border border-[#eaedf1] rounded-2xl overflow-hidden shadow-xs flex flex-col h-full mb-4 lg:mb-0">
      {/* Gmail-Style Top Action Bar */}
      <div className="px-3 sm:px-5 py-2.5 sm:py-3 border-b border-[#eaedf1] flex flex-wrap items-center justify-between gap-2 bg-[#f8fafd]">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Back to Inbox Button (Key Gmail Pattern) */}
          <button
            onClick={onBack}
            className="p-1.5 sm:p-2 rounded-full hover:bg-[#eaedf1] text-[#444746] hover:text-[#1f1f1f] transition flex items-center gap-1 font-poppins text-xs font-semibold"
            title="Back to inbox"
          >
            <ArrowLeft className="w-5 h-5 text-[#1f1f1f]" />
            <span className="hidden xs:inline sm:inline">Back</span>
          </button>

          <div className="h-4 w-[1px] bg-[#dadce0] mx-1"></div>

          <button
            onClick={() => onToggleFlag(email._id, 'archive')}
            className="p-1.5 sm:p-2 rounded-full hover:bg-[#eaedf1] text-[#444746] hover:text-[#1f1f1f] transition"
            title="Archive"
          >
            <Archive className="w-4 h-4" />
          </button>

          <button
            onClick={() => onToggleFlag(email._id, 'isRead')}
            className="p-1.5 sm:p-2 rounded-full hover:bg-[#eaedf1] text-[#444746] hover:text-[#1f1f1f] transition"
            title={email.isRead ? 'Mark as Unread' : 'Mark as Read'}
          >
            <Mail className="w-4 h-4" />
          </button>

          <button
            onClick={() => onToggleFlag(email._id, 'isStarred')}
            className={`p-1.5 sm:p-2 rounded-full hover:bg-[#eaedf1] transition ${
              email.isStarred ? 'text-[#e37400]' : 'text-[#444746]'
            }`}
            title="Star email"
          >
            <Star className={`w-4 h-4 ${email.isStarred ? 'fill-[#e37400]' : ''}`} />
          </button>

          <button
            onClick={() => {
              if (window.confirm(`Permanently delete "${email.subject}" from the database?`)) {
                if (onDeleteEmail) onDeleteEmail(email._id);
              }
            }}
            className="p-1.5 sm:p-2 rounded-full hover:bg-[#fce8e6] text-[#747775] hover:text-[#b3261e] transition"
            title="Delete email thread"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Classification Override Dropdown */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-[#747775] font-poppins hidden sm:inline">Triage:</span>
          <select
            value={email.classification}
            onChange={(e) => onUpdateClassification(email._id, e.target.value)}
            className="bg-[#f0f4f9] hover:bg-[#eaf1fb] text-[#1f1f1f] border border-[#eaedf1] rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs font-semibold font-poppins focus:outline-none cursor-pointer max-w-[130px] sm:max-w-none"
          >
            <option value="assistant_reply">Assistant to Reply</option>
            <option value="client_reply">Client to Reply</option>
            <option value="no_reply_needed">No Reply Needed</option>
            <option value="needs_review">Needs Review</option>
          </select>
        </div>
      </div>

      {/* Main Conversation Canvas (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-5">
        
        {/* Subject Header */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-lg sm:text-2xl font-bold text-[#1f1f1f] tracking-tight font-poppins">
              {email.subject}
            </h1>
            {email.urgency === 'urgent' && (
              <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-[#f9dedc] text-[#b3261e] border border-[#f2b8b5] whitespace-nowrap">
                URGENT
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-[#747775] font-lato">
            <span className="capitalize">{email.provider} Mailbox</span>
            <span>•</span>
            <span>{new Date(email.receivedAt).toLocaleString()}</span>
          </div>
        </div>

        {/* AI Reply Responsibility Diagnostic Card (Material 3 Style) */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-[#f0f4f9] border border-[#d3e3fd] flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-full bg-[#0b57d0] text-white">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wide text-[#041e49] font-poppins">
                {email.classification === 'assistant_reply'
                  ? `Assistant Action Required (on behalf of ${email.clientName || 'Client'})`
                  : email.classification === 'client_reply'
                  ? `Escalate to ${email.clientName || 'Client'} (Executive Signature / Sign-Off Needed)`
                  : `Informational (No Response Needed by You or ${email.clientName || 'Client'})`}
              </span>
            </div>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white text-[#0b57d0] border border-[#d3e3fd] w-fit font-poppins">
              {email.confidence}% AI Confidence Score
            </span>
          </div>

          <div className="text-xs text-[#1f1f1f] font-medium leading-relaxed font-poppins flex items-start gap-2 bg-white p-3 rounded-xl border border-[#eaedf1]">
            {email.classification === 'client_reply' ? (
              <UserCheck className="w-4 h-4 text-[#b06000] flex-shrink-0 mt-0.5" />
            ) : (
              <Bot className="w-4 h-4 text-[#0b57d0] flex-shrink-0 mt-0.5" />
            )}
            <div>
              <span className="font-semibold text-[#0b57d0] block text-[11px] mb-0.5">
                {email.classification === 'assistant_reply'
                  ? `AI Guidance for You (Assistant):`
                  : email.classification === 'client_reply'
                  ? `Client Escalation Required for ${email.clientName || 'Client'}:`
                  : `Triage Note:`}
              </span>
              <span>{email.classificationReason || 'Analyzed thread content and intent.'}</span>
              {email.manualOverride && (
                <span className="text-[#0b57d0] ml-1.5 font-normal text-[11px]">(Manually overridden)</span>
              )}
            </div>
          </div>

          {/* Executive Briefing & Action Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white border border-[#eaedf1]">
              <span className="font-semibold text-[#444746] block mb-1 text-[11px] uppercase tracking-wider font-poppins">
                Executive Briefing for Assistant
              </span>
              <p className="text-[#303030] leading-relaxed font-lato text-xs sm:text-sm">
                {email.aiSummary || email.snippet}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white border border-[#eaedf1]">
              <span className="font-semibold text-[#444746] block mb-1 text-[11px] uppercase tracking-wider font-poppins">
                Action Checklist
              </span>
              <div className="flex flex-col gap-1.5">
                {email.actionItems && email.actionItems.length > 0 ? (
                  email.actionItems.map((item, idx) => (
                    <label key={idx} className="flex items-start gap-2 cursor-pointer text-[#303030] hover:text-[#0b57d0]">
                      <input
                        type="checkbox"
                        checked={actionItemStates[idx] || false}
                        onChange={() => toggleActionItem(idx)}
                        className="mt-0.5 rounded border-[#dadce0] text-[#0b57d0] focus:ring-0 cursor-pointer"
                      />
                      <span className={`text-xs font-lato ${actionItemStates[idx] ? 'line-through text-[#747775]' : ''}`}>
                        {item.text}
                      </span>
                    </label>
                  ))
                ) : (
                  <span className="text-[#747775]">No pending action items extracted.</span>
                )}
              </div>
            </div>
          </div>

          {/* Extracted Meeting Banner */}
          {email.extractedMeeting?.detected && (
            <div className="p-3 rounded-xl bg-[#c4eed0]/40 border border-[#a8dab5] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#1e8e3e] flex-shrink-0" />
                <div>
                  <span className="font-bold text-[#0f5223] font-poppins block">
                    {email.extractedMeeting.title}
                  </span>
                  <div className="text-[#1e8e3e] font-lato text-xs">
                    Proposed: {email.extractedMeeting.date} at {email.extractedMeeting.time} ({email.extractedMeeting.location})
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleToneChange('scheduling')}
                className="px-3 py-1.5 rounded-full bg-[#1e8e3e] hover:bg-[#167030] text-white font-semibold text-xs transition font-poppins self-start sm:self-auto"
              >
                Propose Slot
              </button>
            </div>
          )}
        </div>

        {/* Message Thread History */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold text-[#747775] uppercase tracking-wider font-poppins">
            Message History ({email.messages?.length || 1})
          </span>

          {email.messages && email.messages.map((msg, idx) => {
            const isClientMsg = msg.isClient;
            const isAssistantMsg = msg.isAssistant;

            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl border transition-all ${
                  isAssistantMsg
                    ? 'bg-[#f0f4f9] border-[#d3e3fd]'
                    : isClientMsg
                    ? 'bg-[#c4eed0]/20 border-[#a8dab5]'
                    : 'bg-white border-[#eaedf1]'
                }`}
              >
                {/* Sender row */}
                <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-[#f0f4f9] text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <div className="w-7 h-7 rounded-full bg-[#eaf1fb] text-[#0b57d0] font-bold text-xs flex items-center justify-center font-poppins flex-shrink-0">
                      {msg.sender.name.charAt(0)}
                    </div>
                    <div className="truncate">
                      <span className="font-semibold text-xs sm:text-sm text-[#1f1f1f] font-poppins truncate block">{msg.sender.name}</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-[#747775] font-lato whitespace-nowrap">
                    {new Date(msg.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                </div>

                {/* Message Body */}
                <div className="text-xs sm:text-sm text-[#303030] leading-relaxed whitespace-pre-line font-poppins">
                  {msg.body}
                </div>
              </div>
            );
          })}
        </div>

        {/* AI Smart Reply Composer */}
        <div className="mt-1 bg-[#f8fafd] border border-[#eaedf1] rounded-2xl p-4 sm:p-5 flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#0b57d0]" />
              <span className="text-xs font-bold text-[#1f1f1f] uppercase tracking-wider font-poppins">
                AI Smart Reply Generator
              </span>
            </div>

            {/* Tone selector pills */}
            <div className="flex items-center gap-1 bg-[#eaedf1] p-0.5 rounded-full text-xs overflow-x-auto">
              {[
                { id: 'professional', label: 'Professional' },
                { id: 'concise', label: 'Concise' },
                { id: 'friendly', label: 'Friendly' },
                ...(email.extractedMeeting?.detected ? [{ id: 'scheduling', label: 'Calendar' }] : [])
              ].map(tone => (
                <button
                  key={tone.id}
                  onClick={() => handleToneChange(tone.id)}
                  className={`px-3 py-1 rounded-full font-semibold transition font-poppins text-xs whitespace-nowrap ${
                    selectedTone === tone.id
                      ? 'bg-white text-[#0b57d0] shadow-xs'
                      : 'text-[#444746] hover:text-[#1f1f1f]'
                  }`}
                >
                  {tone.label}
                </button>
              ))}
            </div>
          </div>

          {/* Editable Draft (persisted to database) */}
          <textarea
            rows={4}
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
            onBlur={() => onSaveDraft && onSaveDraft(email._id, draftText, selectedTone)}
            placeholder="Edit draft response before sending..."
            className="w-full bg-white border border-[#dadce0] rounded-xl p-3 text-xs sm:text-sm text-[#1f1f1f] placeholder-[#747775] focus:outline-none focus:border-[#0b57d0] transition leading-relaxed font-poppins"
          />

          {/* Composer Footer */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
            <span className="text-[11px] text-[#747775] font-lato text-center sm:text-left">
              Send on behalf of {email.clientName || 'Client'}.
            </span>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(draftText);
                  alert('Draft copied to clipboard!');
                }}
                className="px-3.5 py-2.5 sm:py-2 rounded-full border border-[#dadce0] hover:bg-[#eaedf1] text-xs font-semibold font-poppins text-[#444746] transition flex items-center justify-center gap-1.5 w-full sm:w-auto min-h-[44px] sm:min-h-0"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </button>

              <button
                onClick={handleSendReply}
                disabled={isSending || !draftText.trim()}
                className="px-5 py-2.5 sm:py-2 rounded-full bg-[#0b57d0] hover:bg-[#0842a0] disabled:opacity-50 text-white text-xs font-semibold font-poppins shadow-sm transition flex items-center justify-center gap-1.5 w-full sm:w-auto min-h-[44px] sm:min-h-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSending ? 'Sending...' : `Send as Assistant for ${(email.clientName || 'Client').split(' ')[0]}`}</span>
              </button>
            </div>
          </div>

          {replySuccess && (
            <div className="p-3 rounded-xl bg-[#c4eed0] text-[#0f5223] text-xs font-semibold font-poppins flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#1e8e3e]" />
              <span>Reply sent successfully and marked as completed!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

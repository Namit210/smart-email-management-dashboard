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
  CornerDownLeft,
  ChevronDown,
  Trash2
} from 'lucide-react';

export default function EmailDetail({
  email,
  onBack,
  onUpdateClassification,
  onSendReply,
  onToggleFlag,
  onClientAction
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
    setActionItemStates(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  return (
    <div className="flex-1 bg-white border border-[#eaedf1] rounded-2xl overflow-hidden shadow-xs flex flex-col h-full">
      {/* Gmail-Style Top Action Bar */}
      <div className="px-5 py-3 border-b border-[#eaedf1] flex items-center justify-between gap-3 bg-[#f8fafd]">
        <div className="flex items-center gap-2">
          {/* Back to Inbox Button (Key Gmail Pattern) */}
          <button
            onClick={onBack}
            className="p-2 rounded-full hover:bg-[#eaedf1] text-[#444746] hover:text-[#1f1f1f] transition flex items-center gap-1.5 font-poppins text-xs font-semibold mr-1"
            title="Back to inbox"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back to Inbox</span>
          </button>

          <div className="h-4 w-[1px] bg-[#dadce0] mx-1 hidden sm:block"></div>

          <button
            onClick={() => onToggleFlag(email._id, 'archive')}
            className="p-2 rounded-full hover:bg-[#eaedf1] text-[#444746] hover:text-[#1f1f1f] transition"
            title="Archive"
          >
            <Archive className="w-4 h-4" />
          </button>

          <button
            onClick={() => onToggleFlag(email._id, 'isRead')}
            className="p-2 rounded-full hover:bg-[#eaedf1] text-[#444746] hover:text-[#1f1f1f] transition"
            title={email.isRead ? 'Mark as Unread' : 'Mark as Read'}
          >
            <Mail className="w-4 h-4" />
          </button>

          <button
            onClick={() => onToggleFlag(email._id, 'isStarred')}
            className={`p-2 rounded-full hover:bg-[#eaedf1] transition ${
              email.isStarred ? 'text-[#e37400]' : 'text-[#444746]'
            }`}
            title="Star email"
          >
            <Star className={`w-4 h-4 ${email.isStarred ? 'fill-[#e37400]' : ''}`} />
          </button>
        </div>

        {/* Classification Override Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#747775] font-poppins hidden md:inline">Change Classification:</span>
          <select
            value={email.classification}
            onChange={(e) => onUpdateClassification(email._id, e.target.value)}
            className="bg-[#f0f4f9] hover:bg-[#eaf1fb] text-[#1f1f1f] border border-[#eaedf1] rounded-full px-3 py-1.5 text-xs font-semibold font-poppins focus:outline-none cursor-pointer"
          >
            <option value="assistant_reply">Assistant to Reply</option>
            <option value="client_reply">Client to Reply</option>
            <option value="no_reply_needed">No Reply Needed</option>
            <option value="needs_review">Needs Review</option>
          </select>
        </div>
      </div>

      {/* Main Conversation Canvas (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-7 flex flex-col gap-6">
        
        {/* Subject Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-xl sm:text-2xl font-bold text-[#1f1f1f] tracking-tight font-poppins">
              {email.subject}
            </h1>
            {email.urgency === 'urgent' && (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#f9dedc] text-[#b3261e] border border-[#f2b8b5] whitespace-nowrap">
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
        <div className="p-4 rounded-2xl bg-[#f0f4f9] border border-[#d3e3fd] flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-full bg-[#0b57d0] text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wide text-[#041e49] font-poppins">
                AI Classification: {email.classification === 'client_reply' ? 'Client to Reply' : (email.classification === 'assistant_reply' ? 'Assistant to Reply' : 'No Reply Needed')}
              </span>
            </div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white text-[#0b57d0] border border-[#d3e3fd] w-fit font-poppins">
              {email.confidence}% Confidence Score
            </span>
          </div>

          <div className="text-xs text-[#1f1f1f] font-medium leading-relaxed font-poppins flex items-start gap-2 bg-white p-3 rounded-xl border border-[#eaedf1]">
            {email.classification === 'client_reply' ? (
              <UserCheck className="w-4 h-4 text-[#b06000] flex-shrink-0 mt-0.5" />
            ) : (
              <Bot className="w-4 h-4 text-[#0b57d0] flex-shrink-0 mt-0.5" />
            )}
            <div>
              <span>{email.classificationReason || 'Analyzed thread content and intent.'}</span>
              {email.manualOverride && (
                <span className="text-[#0b57d0] ml-2 font-normal">(Manually adjusted by assistant)</span>
              )}
            </div>
          </div>

          {/* Executive Briefing & Action Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1 text-xs">
            <div className="p-3.5 rounded-xl bg-white border border-[#eaedf1]">
              <span className="font-semibold text-[#444746] block mb-1 text-[11px] uppercase tracking-wider font-poppins">
                Executive Briefing
              </span>
              <p className="text-[#303030] leading-relaxed font-lato text-sm">
                {email.aiSummary || email.snippet}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-[#eaedf1]">
              <span className="font-semibold text-[#444746] block mb-1 text-[11px] uppercase tracking-wider font-poppins">
                Extracted Action Items
              </span>
              <div className="flex flex-col gap-1.5">
                {email.actionItems && email.actionItems.length > 0 ? (
                  email.actionItems.map((item, idx) => (
                    <label key={idx} className="flex items-start gap-2 cursor-pointer text-[#303030] hover:text-[#0b57d0]">
                      <input
                        type="checkbox"
                        checked={actionItemStates[idx] || false}
                        onChange={() => toggleActionItem(idx)}
                        className="mt-1 rounded border-[#dadce0] text-[#0b57d0] focus:ring-0 cursor-pointer"
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
            <div className="p-3 rounded-xl bg-[#c4eed0]/40 border border-[#a8dab5] flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-[#1e8e3e] flex-shrink-0" />
                <div>
                  <span className="font-bold text-[#0f5223] font-poppins">
                    {email.extractedMeeting.title}
                  </span>
                  <div className="text-[#1e8e3e] font-lato text-xs">
                    Proposed: {email.extractedMeeting.date} at {email.extractedMeeting.time} ({email.extractedMeeting.location})
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleToneChange('scheduling')}
                className="px-3 py-1.5 rounded-full bg-[#1e8e3e] hover:bg-[#167030] text-white font-semibold text-xs transition font-poppins"
              >
                Propose Open Slot
              </button>
            </div>
          )}
        </div>

        {/* Message Thread History */}
        <div className="flex flex-col gap-4">
          <span className="text-xs font-semibold text-[#747775] uppercase tracking-wider font-poppins">
            Message History ({email.messages?.length || 1} messages)
          </span>

          {email.messages && email.messages.map((msg, idx) => {
            const isClientMsg = msg.isClient;
            const isAssistantMsg = msg.isAssistant;

            return (
              <div
                key={idx}
                className={`p-5 rounded-2xl border transition-all ${
                  isAssistantMsg
                    ? 'bg-[#f0f4f9] border-[#d3e3fd]'
                    : isClientMsg
                    ? 'bg-[#c4eed0]/20 border-[#a8dab5]'
                    : 'bg-white border-[#eaedf1]'
                }`}
              >
                {/* Sender row */}
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-[#f0f4f9] text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#eaf1fb] text-[#0b57d0] font-bold text-xs flex items-center justify-center font-poppins">
                      {msg.sender.name.charAt(0)}
                    </div>
                    <div>
                      <span className="font-semibold text-sm text-[#1f1f1f] font-poppins">{msg.sender.name}</span>
                      <span className="text-xs text-[#747775] ml-2 font-lato">&lt;{msg.sender.email}&gt;</span>
                    </div>
                    {isAssistantMsg && (
                      <span className="px-2 py-0.5 rounded-full bg-[#d3e3fd] text-[#041e49] text-[10px] font-semibold">
                        Assistant Reply
                      </span>
                    )}
                    {isClientMsg && (
                      <span className="px-2 py-0.5 rounded-full bg-[#ffe7d6] text-[#b06000] text-[10px] font-semibold">
                        Client Instruction
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-[#747775] font-lato">
                    {new Date(msg.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>
                </div>

                {/* Message Body */}
                <div className="text-sm text-[#303030] leading-relaxed whitespace-pre-line font-poppins">
                  {msg.body}
                </div>
              </div>
            );
          })}
        </div>

        {/* AI Smart Reply Composer */}
        <div className="mt-2 bg-[#f8fafd] border border-[#eaedf1] rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#0b57d0]" />
              <span className="text-xs font-bold text-[#1f1f1f] uppercase tracking-wider font-poppins">
                AI Smart Reply Generator
              </span>
            </div>

            {/* Tone selector pills */}
            <div className="flex items-center gap-1.5 bg-[#eaedf1] p-1 rounded-full text-xs">
              {[
                { id: 'professional', label: 'Professional' },
                { id: 'concise', label: 'Concise' },
                { id: 'friendly', label: 'Friendly' },
                ...(email.extractedMeeting?.detected ? [{ id: 'scheduling', label: 'Calendar Slots' }] : [])
              ].map(tone => (
                <button
                  key={tone.id}
                  onClick={() => handleToneChange(tone.id)}
                  className={`px-3 py-1 rounded-full font-semibold transition font-poppins text-xs ${
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

          {/* Editable Draft */}
          <textarea
            rows={5}
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
            placeholder="Edit draft response before sending..."
            className="w-full bg-white border border-[#dadce0] rounded-xl p-3.5 text-sm text-[#1f1f1f] placeholder-[#747775] focus:outline-none focus:border-[#0b57d0] transition leading-relaxed font-poppins"
          />

          {/* Composer Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-[#747775] font-lato">
              Draft prepared by AI • Assistant review & approval required before delivery.
            </span>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(draftText);
                  alert('Draft copied to clipboard!');
                }}
                className="px-3.5 py-2 rounded-full border border-[#dadce0] hover:bg-[#eaedf1] text-xs text-[#444746] font-semibold font-poppins transition flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Draft</span>
              </button>

              <button
                onClick={handleSendReply}
                disabled={isSending || !draftText.trim()}
                className="px-5 py-2 rounded-full bg-[#0b57d0] hover:bg-[#0842a0] disabled:opacity-50 text-white text-xs font-semibold font-poppins shadow-sm transition flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSending ? 'Sending...' : 'Send as Assistant'}</span>
              </button>
            </div>
          </div>

          {replySuccess && (
            <div className="p-3 rounded-xl bg-[#c4eed0] text-[#0f5223] text-xs font-semibold font-poppins flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#1e8e3e]" />
              <span>Reply sent successfully and thread marked as completed!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

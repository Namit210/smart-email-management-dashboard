import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  UserCheck, 
  CheckCheck, 
  AlertCircle, 
  Sparkles, 
  Calendar, 
  Send, 
  CornerDownRight, 
  Star, 
  Mail, 
  Archive, 
  CheckCircle2, 
  Clock, 
  FileText, 
  RotateCw, 
  User,
  Shield,
  Copy,
  ChevronDown,
  X
} from 'lucide-react';

export default function EmailDetail({
  email,
  onClose,
  onUpdateClassification,
  onSendReply,
  onToggleFlag,
  onClientAction
}) {
  const [selectedTone, setSelectedTone] = useState('professional');
  const [draftText, setDraftText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [replySuccess, setReplySuccess] = useState(false);
  const [delegateModalOpen, setDelegateModalOpen] = useState(false);
  const [delegateNote, setDelegateNote] = useState('');
  const [actionItemStates, setActionItemStates] = useState({});

  useEffect(() => {
    if (email) {
      // Find draft matching tone or use first draft
      const matchingDraft = email.replyDraft?.drafts?.find(d => d.tone === selectedTone) || email.replyDraft?.drafts?.[0];
      setDraftText(matchingDraft?.body || email.replyDraft?.activeDraftText || '');
      setReplySuccess(false);
      
      // Initialize action items state
      const initialActions = {};
      email.actionItems?.forEach((item, idx) => {
        initialActions[idx] = item.completed;
      });
      setActionItemStates(initialActions);
    }
  }, [email, selectedTone]);

  if (!email) {
    return (
      <div className="flex-1 bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-2xl flex items-center justify-center p-8 text-center text-slate-500 text-xs">
        Select a conversation from the list to inspect AI classification, conversation history, and draft responses.
      </div>
    );
  }

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

  const handleDelegateSubmit = async (e) => {
    e.preventDefault();
    await onClientAction(email._id, {
      action: 'delegate_to_assistant',
      note: delegateNote
    });
    setDelegateModalOpen(false);
    setDelegateNote('');
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-2xl overflow-hidden shadow-sm h-full">
      {/* Detail View Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-3 bg-slate-900/90">
        <div className="flex items-center gap-3 truncate">
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition lg:hidden"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="truncate">
            <h2 className="text-sm font-bold text-white truncate">{email.subject}</h2>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
              <span className="capitalize">{email.provider} Inbox</span>
              <span>•</span>
              <span>{new Date(email.receivedAt).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={() => onToggleFlag(email._id, 'isStarred')}
            className={`p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 transition ${
              email.isStarred ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Star email"
          >
            <Star className={`w-4 h-4 ${email.isStarred ? 'fill-amber-400' : ''}`} />
          </button>
          <button
            onClick={() => onToggleFlag(email._id, 'isRead')}
            className="p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
            title={email.isRead ? 'Mark as Unread' : 'Mark as Read'}
          >
            <Mail className="w-4 h-4" />
          </button>
          <button
            onClick={() => onToggleFlag(email._id, 'archive')}
            className="p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
            title="Archive conversation"
          >
            <Archive className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Area (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-5">
        
        {/* HERO FEATURE: AI Intelligence & Classification Card */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-indigo-500/30 rounded-2xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                <Sparkles className="w-4 h-4 text-teal-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    AI Reply Responsibility Analysis
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20">
                    {email.confidence}% Confidence
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Determined by AI model based on conversation intent & VIP stakeholder rules.
                </p>
              </div>
            </div>

            {/* Manual Override Dropdown */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-[11px] text-slate-400 font-medium">Override:</span>
              <select
                value={email.classification}
                onChange={(e) => onUpdateClassification(email._id, e.target.value)}
                className="bg-slate-800 text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="assistant_reply">Assistant to Reply</option>
                <option value="client_reply">Client to Reply</option>
                <option value="no_reply_needed">No Reply Needed</option>
                <option value="needs_review">Needs Review</option>
              </select>
            </div>
          </div>

          {/* Classification Rationale Banner */}
          <div className="mt-3.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-2.5 text-xs">
            {email.classification === 'client_reply' ? (
              <UserCheck className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            ) : email.classification === 'assistant_reply' ? (
              <Bot className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
            ) : (
              <CheckCheck className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <div className="font-semibold text-slate-200">
                {email.classificationReason || 'Analyzed content and routed based on authority guidelines.'}
              </div>
              {email.manualOverride && (
                <div className="text-[10px] text-indigo-400 mt-0.5">
                  (Assistant manually modified this classification)
                </div>
              )}
            </div>
          </div>

          {/* AI Executive Summary & Key Points */}
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60">
              <span className="font-semibold text-slate-300 block mb-1 text-[11px] uppercase tracking-wider">
                Executive Briefing
              </span>
              <p className="text-slate-400 leading-relaxed">
                {email.aiSummary || 'Summary generated by inbox model.'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60">
              <span className="font-semibold text-slate-300 block mb-1 text-[11px] uppercase tracking-wider">
                Action Items
              </span>
              <div className="flex flex-col gap-1.5">
                {email.actionItems && email.actionItems.length > 0 ? (
                  email.actionItems.map((item, idx) => (
                    <label key={idx} className="flex items-start gap-2 cursor-pointer text-slate-400 hover:text-slate-200">
                      <input
                        type="checkbox"
                        checked={actionItemStates[idx] || false}
                        onChange={() => toggleActionItem(idx)}
                        className="mt-0.5 rounded border-slate-700 text-indigo-600 focus:ring-0 cursor-pointer"
                      />
                      <span className={`text-xs ${actionItemStates[idx] ? 'line-through text-slate-500' : ''}`}>
                        {item.text}
                      </span>
                    </label>
                  ))
                ) : (
                  <span className="text-slate-500">No active action items extracted.</span>
                )}
              </div>
            </div>
          </div>

          {/* Extracted Meeting / Appointment Notice */}
          {email.extractedMeeting?.detected && (
            <div className="mt-3 p-3 rounded-xl bg-teal-950/30 border border-teal-500/30 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <div>
                  <span className="font-bold text-teal-200">
                    {email.extractedMeeting.title}
                  </span>
                  <div className="text-[11px] text-teal-300/80">
                    Proposed: {email.extractedMeeting.date} at {email.extractedMeeting.time} ({email.extractedMeeting.location})
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleToneChange('scheduling')}
                className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-medium text-[11px] transition"
              >
                Draft Slot Reply
              </button>
            </div>
          )}
        </div>

        {/* Conversation Thread History */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold px-1">
            <span>Conversation Thread ({email.messages?.length || 1} messages)</span>
            <span className="text-[11px] text-slate-500">Chronological Order</span>
          </div>

          {email.messages && email.messages.map((msg, index) => {
            const isClientMsg = msg.isClient;
            const isAssistantMsg = msg.isAssistant;

            return (
              <div
                key={index}
                className={`p-4 rounded-2xl border transition-all ${
                  isAssistantMsg
                    ? 'bg-blue-950/20 border-blue-500/30 ml-4 sm:ml-8'
                    : isClientMsg
                    ? 'bg-emerald-950/20 border-emerald-500/30 ml-4 sm:ml-8'
                    : 'bg-slate-900/80 border-slate-800 mr-4 sm:mr-8'
                }`}
              >
                {/* Sender bar */}
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800/60 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-[10px] text-slate-300">
                      {msg.sender.name.charAt(0)}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-200">{msg.sender.name}</span>
                      <span className="text-[11px] text-slate-500 ml-1.5">&lt;{msg.sender.email}&gt;</span>
                    </div>
                    {isAssistantMsg && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-medium">
                        Assistant Reply
                      </span>
                    )}
                    {isClientMsg && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-medium">
                        Client Instruction
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {new Date(msg.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Message Body */}
                <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line font-sans">
                  {msg.body}
                </div>
              </div>
            );
          })}
        </div>

        {/* AI Smart Reply Composer */}
        <div className="mt-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-teal-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                AI Smart Reply Generator
              </span>
            </div>

            {/* Tone selector tabs */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px]">
              {[
                { id: 'professional', label: 'Professional' },
                { id: 'concise', label: 'Concise' },
                { id: 'friendly', label: 'Friendly' },
                ...(email.extractedMeeting?.detected ? [{ id: 'scheduling', label: 'Calendar' }] : [])
              ].map(tone => (
                <button
                  key={tone.id}
                  onClick={() => handleToneChange(tone.id)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition ${
                    selectedTone === tone.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tone.label}
                </button>
              ))}
            </div>
          </div>

          {/* Editable Draft Text Area */}
          <textarea
            rows={5}
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
            placeholder="AI draft reply will appear here. Edit as needed before sending..."
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition leading-relaxed font-sans"
          />

          {/* Composer Footer Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-1">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-teal-400"></span>
              <span>Draft ready for review by assistant</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(draftText);
                  alert('Draft copied to clipboard!');
                }}
                className="px-3 py-1.5 rounded-xl border border-slate-700/80 hover:bg-slate-800 text-xs text-slate-300 font-medium transition flex items-center gap-1.5"
                title="Copy response"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </button>

              <button
                onClick={handleSendReply}
                disabled={isSending || !draftText.trim()}
                className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSending ? 'Sending...' : 'Send as Assistant'}</span>
              </button>
            </div>
          </div>

          {replySuccess && (
            <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Reply sent and conversation marked as handled!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

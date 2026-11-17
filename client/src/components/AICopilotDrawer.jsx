import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  X, 
  ArrowRight, 
  Lightbulb,
  RotateCcw
} from 'lucide-react';
import { askCopilot } from '../services/api';

export default function AICopilotDrawer({ 
  isOpen, 
  onClose, 
  onSelectEmail, 
  assistantUser, 
  clientList = [], 
  emailsCount = 0 
}) {
  const assistantFirstName = useMemo(() => {
    return assistantUser?.name ? assistantUser.name.split(' ')[0] : 'Assistant';
  }, [assistantUser]);

  const clientNames = useMemo(() => {
    return clientList.map(c => c.name).filter(Boolean);
  }, [clientList]);

  const storageKey = useMemo(() => {
    const uid = assistantUser?._id || assistantUser?.id || assistantUser?.email || 'default';
    return `omnimail_copilot_chat_${uid}`;
  }, [assistantUser]);

  const getInitialGreeting = () => {
    if (clientNames.length > 0) {
      const clientsStr = clientNames.slice(0, 3).join(', ') + (clientNames.length > 3 ? `, and ${clientNames.length - 3} more` : '');
      return `Hello ${assistantFirstName}! I am your AI Executive Inbox Copilot. I analyze connected inboxes across your clients (${clientsStr}) in real-time, determine reply responsibilities, extract meetings, and keep your executives focused on high-leverage decisions.\n\nHow can I help you manage the inboxes right now?`;
    }
    return `Hello ${assistantFirstName}! Welcome to your AI Executive Inbox Copilot.\n\nYou currently have a fresh workspace with no connected client mailboxes yet. Once you connect an executive client or simulate incoming threads, I will automatically classify emails (Client to Reply vs. Assistant to Reply), extract meeting proposals, and compose contextual drafts.\n\nAsk me anytime about how inbox triage works, or connect a mailbox to get started!`;
  };

  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      // ignore JSON parse error
    }
    return [
      {
        sender: 'ai',
        text: getInitialGreeting(),
        suggestedEmails: []
      }
    ];
  });

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestionsDismissed, setSuggestionsDismissed] = useState(false);
  const messagesEndRef = useRef(null);

  // Sync / reload history when active user changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          return;
        }
      }
    } catch (e) {
      // ignore
    }
    setMessages([
      {
        sender: 'ai',
        text: getInitialGreeting(),
        suggestedEmails: []
      }
    ]);
    setSuggestionsDismissed(false);
  }, [storageKey]);

  // Persist messages per user
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(messages));
      } catch (e) {
        // ignore
      }
    }
  }, [messages, storageKey]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  // Dynamic suggested queries based on user's actual connected clients
  const sampleQuestions = useMemo(() => {
    if (clientNames.length > 0) {
      return [
        "Show me emails requiring client attention",
        `What does ${clientNames[0]} need to approve?`,
        "What emails are assigned to me as assistant?",
        "What meetings are coming up across all clients?",
        ...(clientNames.length > 1 ? [`What does ${clientNames[1]} need to sign?`] : [])
      ];
    }
    return [
      "How does automated AI email triage work?",
      "How do I connect an executive client mailbox?",
      "What actions can I perform as an assistant?",
      "How are meeting proposals extracted?"
    ];
  }, [clientNames]);

  // Determine if suggestions should be shown:
  // - User has not dismissed them
  // - Conversation has no user messages yet (fresh chat session)
  const userMessageCount = useMemo(() => {
    return messages.filter(m => m.sender === 'user').length;
  }, [messages]);

  const showSuggestions = !suggestionsDismissed && userMessageCount === 0;

  if (!isOpen) return null;

  const handleClearChat = () => {
    const freshMessages = [
      {
        sender: 'ai',
        text: getInitialGreeting(),
        suggestedEmails: []
      }
    ];
    setMessages(freshMessages);
    setSuggestionsDismissed(false);
    try {
      localStorage.removeItem(storageKey);
    } catch (e) {
      // ignore
    }
  };

  const handleSend = async (questionText) => {
    const q = (questionText || inputQuery).trim();
    if (!q) return;

    const userMessage = { sender: 'user', text: q };
    setMessages(prev => [...prev, userMessage]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const res = await askCopilot(q);
      if (res.success) {
        setMessages(prev => [
          ...prev,
          {
            sender: 'ai',
            text: res.answer,
            suggestedEmails: res.suggestedEmails || []
          }
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          {
            sender: 'ai',
            text: "I encountered an issue querying the inbox model. Please try again.",
            suggestedEmails: []
          }
        ]);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: `Error connecting to AI service: ${err.message}`,
          suggestedEmails: []
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="w-full sm:w-[460px] h-full bg-white border-l border-[#eaedf1] flex flex-col shadow-2xl">
        {/* Drawer Header */}
        <div className="p-4 border-b border-[#eaedf1] flex items-center justify-between bg-[#f8fafd]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#0b57d0] to-[#1e8e3e] flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#1f1f1f] font-poppins flex items-center gap-1.5">
                <span>AI Inbox Copilot</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#c4eed0] text-[#0f5223] font-semibold">Active</span>
              </h2>
              <p className="text-xs text-[#747775] font-lato">
                {clientNames.length > 0 
                  ? `Inboxes: ${clientNames.slice(0, 2).join(', ')}${clientNames.length > 2 ? ` +${clientNames.length - 2}` : ''}`
                  : `${assistantFirstName}'s Copilot`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleClearChat}
              title="Reset conversation"
              className="p-1.5 rounded-full hover:bg-[#eaedf1] text-[#747775] hover:text-[#b3261e] transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-[#eaedf1] text-[#747775] hover:text-[#1f1f1f] transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-[#f8fafd]">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col gap-1.5 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1.5 text-xs text-[#747775] font-poppins">
                {msg.sender === 'ai' ? (
                  <>
                    <Bot className="w-3.5 h-3.5 text-[#0b57d0]" />
                    <span>Inbox Copilot</span>
                  </>
                ) : (
                  <>
                    <User className="w-3.5 h-3.5 text-[#1e8e3e]" />
                    <span>{assistantFirstName}</span>
                  </>
                )}
              </div>

              <div
                className={`p-3.5 rounded-2xl text-sm leading-relaxed max-w-[90%] whitespace-pre-line font-poppins ${
                  msg.sender === 'user'
                    ? 'bg-[#0b57d0] text-white rounded-br-none shadow-xs'
                    : 'bg-white text-[#1f1f1f] border border-[#eaedf1] rounded-bl-none shadow-xs'
                }`}
              >
                {msg.text}

                {/* Clickable suggested email cards */}
                {msg.suggestedEmails && msg.suggestedEmails.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-[#eaedf1] flex flex-col gap-1.5">
                    <span className="text-[11px] font-semibold uppercase text-[#0b57d0] tracking-wider font-poppins">
                      Relevant Conversations:
                    </span>
                    {msg.suggestedEmails.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          onSelectEmail(item.id);
                          onClose();
                        }}
                        className="text-left p-2.5 rounded-xl bg-[#f8fafd] hover:bg-[#eaf1fb] border border-[#eaedf1] text-xs text-[#1f1f1f] transition flex items-center justify-between group"
                      >
                        <div className="truncate pr-2">
                          <span className="font-semibold text-[#1f1f1f] truncate block font-poppins">{item.subject}</span>
                          <span className="text-[11px] text-[#747775] font-lato">{item.sender}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#747775] group-hover:text-[#0b57d0] flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-white border border-[#eaedf1] text-[#747775] text-xs w-fit shadow-xs font-poppins">
              <Sparkles className="w-4 h-4 text-[#0b57d0] animate-spin" />
              <span>Analyzing mailbox data and composing response...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Queries - Only shown when starting fresh, dismissible with X */}
        {showSuggestions && (
          <div className="p-3 border-t border-[#eaedf1] bg-white transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs text-[#747775] font-semibold font-poppins">
                <Lightbulb className="w-3.5 h-3.5 text-[#e37400]" />
                <span>Suggested Inquiries:</span>
              </div>
              <button
                onClick={() => setSuggestionsDismissed(true)}
                className="text-[11px] text-[#747775] hover:text-[#1f1f1f] p-0.5 rounded hover:bg-[#f0f4f9] transition flex items-center gap-0.5"
                title="Dismiss suggestions"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {sampleQuestions.slice(0, 3).map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q)}
                  className="text-xs px-3 py-1.5 rounded-full bg-[#f0f4f9] hover:bg-[#eaf1fb] text-[#1f1f1f] transition text-left font-poppins font-medium border border-transparent hover:border-[#0b57d0]/20"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 border-t border-[#eaedf1] bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={clientNames.length > 0 ? "Ask anything about your clients' inboxes..." : "Ask copilot anything..."}
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 bg-[#f0f4f9] border border-[#eaedf1] rounded-full px-4 py-2 text-sm text-[#1f1f1f] placeholder-[#747775] focus:outline-none focus:border-[#0b57d0] font-poppins"
            />
            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="p-2.5 rounded-full bg-[#0b57d0] hover:bg-[#0842a0] disabled:opacity-50 text-white transition flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

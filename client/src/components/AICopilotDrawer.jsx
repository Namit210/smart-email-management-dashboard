import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  X, 
  ArrowRight, 
  HelpCircle,
  Lightbulb,
  MessageSquare
} from 'lucide-react';
import { askCopilot } from '../services/api';

export default function AICopilotDrawer({ isOpen, onClose, onSelectEmail }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Hello! I am your AI Executive Inbox Copilot. I analyze all connected Gmail and Outlook inboxes in real-time, determine reply responsibilities, extract meetings, and keep Alex Morgan focused on high-leverage decisions.\n\nHow can I help you manage the inbox right now?",
      suggestedEmails: []
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sampleQuestions = [
    "Show me emails that need Alex's attention",
    "What emails are assigned to me as assistant?",
    "What meetings are coming up?",
    "What am I waiting for a response on?",
    "Show me urgent emails requiring action today"
  ];

  if (!isOpen) return null;

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
            text: "I encountered an issue querying the inbox intelligence model. Please try again.",
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
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full sm:w-[480px] h-full bg-slate-900 border-l border-slate-800 flex flex-col shadow-2xl">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/95">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center shadow-sm">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>AI Inbox Copilot</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-teal-500/20 text-teal-300 font-medium">Active</span>
              </h2>
              <p className="text-[11px] text-slate-400">Ask anything across all connected mailboxes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col gap-1.5 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                {msg.sender === 'ai' ? (
                  <>
                    <Bot className="w-3.5 h-3.5 text-teal-400" />
                    <span>Inbox Copilot</span>
                  </>
                ) : (
                  <>
                    <User className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Assistant</span>
                  </>
                )}
              </div>

              <div
                className={`p-3.5 rounded-2xl text-xs leading-relaxed max-w-[90%] whitespace-pre-line ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none'
                    : 'bg-slate-800/80 text-slate-200 border border-slate-700/80 rounded-bl-none'
                }`}
              >
                {msg.text}

                {/* Clickable suggested email cards */}
                {msg.suggestedEmails && msg.suggestedEmails.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-700/80 flex flex-col gap-1.5">
                    <span className="text-[10px] font-semibold uppercase text-teal-400 tracking-wider">
                      Relevant Conversations:
                    </span>
                    {msg.suggestedEmails.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          onSelectEmail(item.id);
                          onClose();
                        }}
                        className="text-left p-2 rounded-lg bg-slate-900/80 hover:bg-slate-950 border border-slate-700 hover:border-indigo-500 text-xs text-slate-200 transition flex items-center justify-between group"
                      >
                        <div className="truncate pr-2">
                          <span className="font-medium text-white truncate block">{item.subject}</span>
                          <span className="text-[10px] text-slate-400">{item.sender}</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-800/60 text-slate-400 text-xs w-fit">
              <Sparkles className="w-4 h-4 text-teal-400 animate-spin" />
              <span>Analyzing inboxes and synthesizing answer...</span>
            </div>
          )}
        </div>

        {/* Quick Suggested Queries */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold mb-2">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>Suggested Inquiries:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {sampleQuestions.slice(0, 3).map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition text-left"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-800 bg-slate-900">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything about Alex's inbox..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white transition flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

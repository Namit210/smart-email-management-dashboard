import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  X, 
  ArrowRight, 
  Lightbulb
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
              <p className="text-xs text-[#747775] font-lato">Ask anything across all connected mailboxes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#eaedf1] text-[#747775] hover:text-[#1f1f1f] transition"
          >
            <X className="w-4 h-4" />
          </button>
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
                    <span>Assistant</span>
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
              <span>Analyzing mailbox data and composing briefing...</span>
            </div>
          )}
        </div>

        {/* Suggested Queries */}
        <div className="p-3 border-t border-[#eaedf1] bg-white">
          <div className="flex items-center gap-1.5 text-xs text-[#747775] font-semibold mb-2 font-poppins">
            <Lightbulb className="w-3.5 h-3.5 text-[#e37400]" />
            <span>Suggested Inquiries:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {sampleQuestions.slice(0, 3).map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                className="text-xs px-3 py-1.5 rounded-full bg-[#f0f4f9] hover:bg-[#eaf1fb] text-[#1f1f1f] transition text-left font-poppins font-medium"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

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
              placeholder="Ask anything about Alex's inboxes..."
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

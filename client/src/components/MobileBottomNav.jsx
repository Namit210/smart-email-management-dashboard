import React from 'react';
import { 
  Inbox, 
  Bot, 
  UserCheck, 
  Sparkles, 
  User, 
  Plus
} from 'lucide-react';

export default function MobileBottomNav({
  activeSegment,
  onSelectSegment,
  currentView,
  setCurrentView,
  onOpenCopilot,
  onOpenSimulate,
  toggleRightSidebar,
  clientPendingCount,
  assistantCount
}) {
  return (
    <>
      {/* Floating Action Button (FAB) for Simulate Email (above bottom bar, right side) */}
      <div className="fixed bottom-20 right-4 z-40 lg:hidden">
        <button
          onClick={onOpenSimulate}
          className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-[#c2e7ff] hover:bg-[#b3e0ff] text-[#001d35] font-poppins font-medium text-xs shadow-lg shadow-[#0b57d0]/15 active:scale-95 transition-all"
          title="Simulate incoming email"
        >
          <Plus className="w-5 h-5 text-[#001d35]" />
          <span>Simulate</span>
        </button>
      </div>

      {/* Sticky Bottom Navigation Bar (like Mobile Gmail) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#eaedf1] px-2 py-1.5 flex items-center justify-around lg:hidden shadow-lg shadow-slate-900/10">
        
        {/* All Inboxes */}
        <button
          onClick={() => {
            setCurrentView('assistant');
            onSelectSegment('all');
          }}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition ${
            currentView === 'assistant' && activeSegment === 'all'
              ? 'text-[#0b57d0]'
              : 'text-[#5e5e5e] hover:text-[#1f1f1f]'
          }`}
        >
          <div className={`p-1 rounded-full ${currentView === 'assistant' && activeSegment === 'all' ? 'bg-[#d3e3fd]' : ''}`}>
            <Inbox className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-medium font-poppins mt-0.5">Inbox</span>
        </button>

        {/* Assistant to Reply */}
        <button
          onClick={() => {
            setCurrentView('assistant');
            onSelectSegment('assistant_reply');
          }}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition relative ${
            currentView === 'assistant' && activeSegment === 'assistant_reply'
              ? 'text-[#0b57d0]'
              : 'text-[#5e5e5e] hover:text-[#1f1f1f]'
          }`}
        >
          <div className={`p-1 rounded-full ${currentView === 'assistant' && activeSegment === 'assistant_reply' ? 'bg-[#d3e3fd]' : ''}`}>
            <Bot className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-medium font-poppins mt-0.5">Assistant</span>
          {assistantCount > 0 && (
            <span className="absolute top-1 right-2.5 w-2 h-2 rounded-full bg-[#0b57d0]"></span>
          )}
        </button>

        {/* Client Queue Drawer Trigger */}
        <button
          onClick={toggleRightSidebar}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[#5e5e5e] hover:text-[#1f1f1f] transition relative"
        >
          <div className="p-1 rounded-full">
            <UserCheck className="w-5 h-5 text-[#b06000]" />
          </div>
          <span className="text-[10px] font-medium font-poppins mt-0.5 text-[#b06000]">Client Queue</span>
          {clientPendingCount > 0 && (
            <span className="absolute top-1 right-2.5 px-1 py-0.2 rounded-full bg-[#b06000] text-white text-[9px] font-bold">
              {clientPendingCount}
            </span>
          )}
        </button>

        {/* Ask AI Copilot */}
        <button
          onClick={onOpenCopilot}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[#5e5e5e] hover:text-[#1f1f1f] transition"
        >
          <div className="p-1 rounded-full">
            <Sparkles className="w-5 h-5 text-[#0b57d0]" />
          </div>
          <span className="text-[10px] font-medium font-poppins mt-0.5">Ask AI</span>
        </button>

        {/* Full Client Portal */}
        <button
          onClick={() => setCurrentView('client')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition ${
            currentView === 'client'
              ? 'text-[#1e8e3e]'
              : 'text-[#5e5e5e] hover:text-[#1f1f1f]'
          }`}
        >
          <div className={`p-1 rounded-full ${currentView === 'client' ? 'bg-[#c4eed0]' : ''}`}>
            <User className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-medium font-poppins mt-0.5">Client Portal</span>
        </button>
      </nav>
    </>
  );
}

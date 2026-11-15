import React from 'react';
import { 
  Sparkles, 
  RefreshCw, 
  User, 
  ShieldCheck, 
  Plus, 
  RotateCcw, 
  HelpCircle,
  Search,
  ChevronDown,
  Menu,
  SlidersHorizontal,
  X
} from 'lucide-react';

export default function Header({
  currentView,
  setCurrentView,
  accounts,
  selectedAccount,
  setSelectedAccount,
  onSync,
  isSyncing,
  onOpenSimulate,
  onOpenCopilot,
  onOpenOnboarding,
  onResetData,
  onOpenConnectModal,
  searchQuery,
  setSearchQuery,
  toggleRightSidebar,
  rightSidebarOpen,
  clientPendingCount
}) {
  return (
    <header className="sticky top-0 z-30 bg-[#f6f8fc] border-b border-[#eaedf1] px-4 lg:px-6 py-2.5">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Brand & Logo */}
        <div className="flex items-center gap-3 min-w-[220px]">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0b57d0] to-[#1e8e3e] flex items-center justify-center text-white shadow-sm shadow-[#0b57d0]/20 flex-shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#1f1f1f] text-base tracking-tight font-poppins">
                OmniMail
              </span>
              <span className="text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-[#d3e3fd] text-[#041e49]">
                AI Assistant
              </span>
            </div>
            <p className="text-xs text-[#747775] font-lato hidden sm:block">Executive Email Management</p>
          </div>
        </div>

        {/* Center: Google-Style Search Bar */}
        <div className="flex-1 max-w-2xl mx-auto">
          <div className="relative flex items-center w-full">
            <Search className="w-5 h-5 text-[#444746] absolute left-4 pointer-events-none" />
            <input
              type="text"
              placeholder="Search in emails, senders, or AI classifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#eaf1fb] hover:bg-[#dfe9f8] focus:bg-white text-[#1f1f1f] placeholder-[#5e5e5e] text-sm font-poppins rounded-full pl-12 pr-10 py-2.5 transition border border-transparent focus:border-[#c2e7ff] focus:shadow-md focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 p-1 rounded-full hover:bg-slate-200 text-[#444746]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Controls & Perspective Switcher */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          
          {/* Perspective Switcher (Assistant vs Client) */}
          <div className="flex items-center bg-[#eaedf1] p-1 rounded-full">
            <button
              onClick={() => setCurrentView('assistant')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold font-poppins transition ${
                currentView === 'assistant'
                  ? 'bg-white text-[#0b57d0] shadow-sm'
                  : 'text-[#444746] hover:text-[#1f1f1f]'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="hidden md:inline">Assistant</span>
            </button>
            <button
              onClick={() => setCurrentView('client')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold font-poppins transition ${
                currentView === 'client'
                  ? 'bg-[#1e8e3e] text-white shadow-sm'
                  : 'text-[#444746] hover:text-[#1f1f1f]'
              }`}
            >
              <User className="w-4 h-4" />
              <span className="hidden md:inline">Client (Alex)</span>
              {clientPendingCount > 0 && (
                <span className={`w-2 h-2 rounded-full ${currentView === 'client' ? 'bg-white' : 'bg-[#b06000]'} animate-pulse`}></span>
              )}
            </button>
          </div>

          {/* Account Selector */}
          <div className="relative hidden xl:block">
            <select
              value={selectedAccount}
              onChange={(e) => {
                if (e.target.value === '__add_new__') {
                  onOpenConnectModal();
                } else {
                  setSelectedAccount(e.target.value);
                }
              }}
              className="bg-white text-[#444746] border border-[#eaedf1] hover:bg-[#f0f4f9] rounded-full px-3 py-1.5 pr-8 text-xs font-medium cursor-pointer appearance-none focus:outline-none"
            >
              <option value="all">All Connected Inboxes</option>
              {accounts.map((acc) => (
                <option key={acc._id} value={acc.email}>
                  {acc.provider === 'gmail' ? 'Google: ' : 'Outlook: '}
                  {acc.email}
                </option>
              ))}
              <option value="__add_new__">+ Connect Account...</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#747775] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Sync Mailbox Button */}
          <button
            onClick={onSync}
            disabled={isSyncing}
            title="Sync Inboxes with AI"
            className="p-2 rounded-full bg-white hover:bg-[#f0f4f9] text-[#444746] border border-[#eaedf1] transition disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-[#0b57d0] ${isSyncing ? 'animate-spin' : ''}`} />
          </button>

          {/* AI Copilot Button */}
          <button
            onClick={onOpenCopilot}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#d3e3fd] hover:bg-[#c2e7ff] text-[#041e49] text-xs font-semibold font-poppins transition shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#0b57d0]" />
            <span className="hidden sm:inline">Ask AI</span>
          </button>

          {/* Toggle Client Sidebar */}
          <button
            onClick={toggleRightSidebar}
            title={rightSidebarOpen ? 'Hide Client Queue' : 'Show Client Queue'}
            className={`p-2 rounded-full border transition flex items-center justify-center relative ${
              rightSidebarOpen
                ? 'bg-[#ffe7d6] border-[#ffd8bf] text-[#b06000]'
                : 'bg-white border-[#eaedf1] text-[#444746] hover:bg-[#f0f4f9]'
            }`}
          >
            <User className="w-4 h-4" />
            {clientPendingCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#b06000] text-white text-[9px] font-bold flex items-center justify-center">
                {clientPendingCount}
              </span>
            )}
          </button>

          {/* Guide Walkthrough */}
          <button
            onClick={onOpenOnboarding}
            title="Overview & Guide"
            className="p-2 rounded-full bg-white hover:bg-[#f0f4f9] text-[#747775] border border-[#eaedf1] transition hidden sm:flex"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Reset Demo Data */}
          <button
            onClick={onResetData}
            title="Reset to Original Demo State"
            className="p-2 rounded-full bg-white hover:bg-rose-50 text-[#747775] hover:text-[#b3261e] border border-[#eaedf1] transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

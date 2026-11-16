import React from 'react';
import { 
  Sparkles, 
  RefreshCw, 
  User, 
  ShieldCheck, 
  RotateCcw, 
  HelpCircle,
  Search,
  ChevronDown,
  Menu,
  X,
  Plus,
  LogOut
} from 'lucide-react';

export default function Header({
  currentView,
  setCurrentView,
  accounts,
  selectedAccount,
  setSelectedAccount,
  selectedClient,
  setSelectedClient,
  clientList = [],
  clientPortalUser,
  setClientPortalUser,
  assistantUser,
  onLogout,
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
  clientPendingCount,
  onToggleMobileMenu
}) {
  return (
    <header className="sticky top-0 z-30 bg-[#f6f8fc] border-b border-[#eaedf1] px-3 sm:px-4 lg:px-6 py-2.5">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Hamburger (Three lines for mobile) + Brand & Logo */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Three Lines Hamburger Button for Mobile (like Gmail) */}
          <button
            onClick={onToggleMobileMenu}
            className="p-2 rounded-full hover:bg-[#eaedf1] text-[#444746] hover:text-[#1f1f1f] transition lg:hidden"
            title="Open navigation menu"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-gradient-to-tr from-[#0b57d0] to-[#1e8e3e] flex items-center justify-center text-white shadow-xs flex-shrink-0">
              <Sparkles className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </div>
            <div className="hidden xs:block sm:block">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-[#1f1f1f] text-sm sm:text-base tracking-tight font-poppins">
                  OmniMail
                </span>
                <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.2 rounded-full bg-[#d3e3fd] text-[#041e49] hidden md:inline">
                  AI Assistant
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Google-Style Search Bar */}
        <div className="flex-1 max-w-2xl mx-1 sm:mx-4">
          <div className="relative flex items-center w-full">
            <Search className="w-4 h-4 text-[#444746] absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search in mail..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#eaf1fb] hover:bg-[#dfe9f8] focus:bg-white text-[#1f1f1f] placeholder-[#5e5e5e] text-xs sm:text-sm font-poppins rounded-full pl-10 sm:pl-11 pr-8 sm:pr-10 py-2 sm:py-2.5 transition border border-transparent focus:border-[#c2e7ff] focus:shadow-sm focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 p-1 rounded-full hover:bg-slate-200 text-[#444746]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Controls, Multi-Client Switcher & Perspective Switcher */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
          
          {/* Multi-Client Filter Dropdown (Assistant View) */}
          {currentView === 'assistant' && (
            <div className="hidden lg:flex items-center gap-1 bg-white border border-[#dadce0] rounded-full px-2.5 py-1 text-xs shadow-2xs hover:border-[#0b57d0] transition">
              <User className="w-3.5 h-3.5 text-[#0b57d0]" />
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="bg-transparent font-semibold text-[#1f1f1f] focus:outline-none cursor-pointer font-poppins pr-1 text-xs"
                title="Filter inbox by client"
              >
                <option value="all">👥 All Clients ({clientList.length})</option>
                {clientList.map((c) => (
                  <option key={c.name} value={c.name}>
                    👤 {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Perspective Switcher (Assistant vs Client) */}
          <div className="flex items-center bg-[#eaedf1] p-0.5 sm:p-1 rounded-full">
            <button
              onClick={() => setCurrentView('assistant')}
              className={`flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold font-poppins transition ${
                currentView === 'assistant'
                  ? 'bg-white text-[#0b57d0] shadow-xs'
                  : 'text-[#444746] hover:text-[#1f1f1f]'
              }`}
              title="Assistant Workspace (Multi-Client Unified Management)"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Assistant</span>
            </button>
            <button
              onClick={() => setCurrentView('client')}
              className={`flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold font-poppins transition ${
                currentView === 'client'
                  ? 'bg-[#1e8e3e] text-white shadow-xs'
                  : 'text-[#444746] hover:text-[#1f1f1f]'
              }`}
              title="Executive Client View"
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden md:inline">
                {currentView === 'client' ? (clientPortalUser ? clientPortalUser.split(' ')[0] : 'Client') : 'Client'}
              </span>
              {clientPendingCount > 0 && (
                <span className={`w-1.5 h-1.5 rounded-full ${currentView === 'client' ? 'bg-white' : 'bg-[#b06000]'} animate-pulse`}></span>
              )}
            </button>
          </div>

          {/* Sync Mailbox Button */}
          <button
            onClick={onSync}
            disabled={isSyncing}
            title="Sync Inboxes with AI"
            className="p-1.5 sm:p-2 rounded-full bg-white hover:bg-[#f0f4f9] text-[#444746] border border-[#eaedf1] transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0b57d0] ${isSyncing ? 'animate-spin' : ''}`} />
          </button>

          {/* AI Copilot Button (desktop & tablet) */}
          <button
            onClick={onOpenCopilot}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#d3e3fd] hover:bg-[#c2e7ff] text-[#041e49] text-xs font-semibold font-poppins transition shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#0b57d0]" />
            <span>Ask AI</span>
          </button>

          {/* Toggle Client Sidebar */}
          <button
            onClick={toggleRightSidebar}
            title={rightSidebarOpen ? 'Hide Client Queue' : 'Show Client Queue'}
            className={`p-1.5 sm:p-2 rounded-full border transition flex items-center justify-center relative ${
              rightSidebarOpen
                ? 'bg-[#ffe7d6] border-[#ffd8bf] text-[#b06000]'
                : 'bg-white border-[#eaedf1] text-[#444746] hover:bg-[#f0f4f9]'
            }`}
          >
            <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {clientPendingCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#b06000] text-white text-[9px] font-bold flex items-center justify-center">
                {clientPendingCount}
              </span>
            )}
          </button>

          {/* Reset Demo Data */}
          <button
            onClick={onResetData}
            title="Reset to Original Demo State"
            className="p-1.5 sm:p-2 rounded-full bg-white hover:bg-rose-50 text-[#747775] hover:text-[#b3261e] border border-[#eaedf1] transition hidden sm:flex"
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Assistant User Profile & Logout */}
          {assistantUser && (
            <div className="flex items-center gap-1 sm:gap-2 pl-1 sm:pl-2 border-l border-[#eaedf1]">
              <div 
                className="flex items-center gap-2 px-1.5 py-1 rounded-full bg-white border border-[#eaedf1] hover:bg-[#f8fafd] transition"
                title={`Logged in as ${assistantUser.name} (${assistantUser.title || 'Assistant'})`}
              >
                <img
                  src={assistantUser.avatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=128&q=80"}
                  alt={assistantUser.name}
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover border border-[#dadce0]"
                />
                <div className="hidden xl:flex flex-col text-left pr-1">
                  <span className="text-xs font-semibold text-[#1f1f1f] font-poppins leading-tight truncate max-w-[110px]">
                    {assistantUser.name}
                  </span>
                  <span className="text-[10px] text-[#747775] truncate max-w-[110px]">
                    {assistantUser.title?.split('/')[0] || 'Assistant'}
                  </span>
                </div>
              </div>

              <button
                onClick={onLogout}
                title="Sign Out of Assistant Account"
                className="p-1.5 sm:p-2 rounded-full hover:bg-[#f9dedc] text-[#747775] hover:text-[#b3261e] transition border border-transparent hover:border-[#f2b8b5]"
              >
                <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

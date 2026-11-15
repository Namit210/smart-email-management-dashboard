import React from 'react';
import { 
  Sparkles, 
  RefreshCw, 
  User, 
  ShieldCheck, 
  PlusCircle, 
  RotateCcw, 
  HelpCircle,
  Mail,
  ChevronDown,
  CheckCircle2
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
  onOpenConnectModal
}) {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 lg:px-6 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand & Perspective Switcher */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-teal-400 p-[2px] shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-teal-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-white text-base tracking-tight">OmniMail AI</h1>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
                  Assistant Platform
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Intelligent Inbox Triage & Delegation</p>
            </div>
          </div>

          {/* Perspective Switcher */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 shadow-inner">
            <button
              onClick={() => setCurrentView('assistant')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentView === 'assistant'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Assistant Dashboard</span>
            </button>
            <button
              onClick={() => setCurrentView('client')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentView === 'client'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Client Portal</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </button>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          {/* Account Selector */}
          <div className="relative group">
            <select
              value={selectedAccount}
              onChange={(e) => {
                if (e.target.value === '__add_new__') {
                  onOpenConnectModal();
                } else {
                  setSelectedAccount(e.target.value);
                }
              }}
              className="bg-slate-800 text-slate-200 border border-slate-700/80 rounded-lg px-3 py-1.5 pr-8 text-xs font-medium focus:outline-none focus:border-indigo-500 cursor-pointer appearance-none"
            >
              <option value="all">All Inboxes (Connected)</option>
              {accounts.map((acc) => (
                <option key={acc._id} value={acc.email}>
                  {acc.provider === 'gmail' ? 'Google: ' : 'Outlook: '}
                  {acc.email}
                </option>
              ))}
              <option value="__add_new__">+ Connect New Account...</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Sync status & trigger */}
          <button
            onClick={onSync}
            disabled={isSyncing}
            title="Sync Mailbox with AI Re-analysis"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/80 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-teal-400 ${isSyncing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isSyncing ? 'Syncing...' : 'Sync'}</span>
          </button>

          {/* Simulate incoming email */}
          <button
            onClick={onOpenSimulate}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/90 hover:bg-indigo-600 text-white font-medium shadow-sm transition"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Simulate Email</span>
          </button>

          {/* AI Copilot trigger */}
          <button
            onClick={onOpenCopilot}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-teal-500/20 to-indigo-500/20 hover:from-teal-500/30 hover:to-indigo-500/30 text-teal-300 border border-teal-500/30 font-medium transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Ask AI</span>
          </button>

          {/* Quick Guide Tour */}
          <button
            onClick={onOpenOnboarding}
            title="Prototype Guide & Overview"
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/80 transition"
          >
            <HelpCircle className="w-4 h-4 text-slate-400" />
          </button>

          {/* Reset Demo Data */}
          <button
            onClick={onResetData}
            title="Reset to Original Demo State"
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-900/30 hover:text-rose-400 text-slate-400 border border-slate-700/80 transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

import React from 'react';
import { 
  Inbox, 
  Bot, 
  UserCheck, 
  CheckCheck, 
  AlertCircle, 
  Clock, 
  Calendar, 
  Star, 
  Archive,
  Plus,
  Circle,
  Sparkles,
  Layers
} from 'lucide-react';

export default function Sidebar({
  activeSegment,
  onSelectSegment,
  stats,
  accounts,
  onOpenConnectModal
}) {
  const navItems = [
    { id: 'all', label: 'All Conversations', icon: Inbox, count: stats?.totalEmails },
    { id: 'assistant_reply', label: 'Assistant to Reply', icon: Bot, count: stats?.assistantReplyCount, badgeColor: 'bg-blue-500/20 text-blue-400' },
    { id: 'client_reply', label: 'Client to Reply', icon: UserCheck, count: stats?.clientPendingCount || stats?.clientReplyCount, badgeColor: 'bg-amber-500/20 text-amber-400 font-semibold' },
    { id: 'no_reply_needed', label: 'No Reply Needed', icon: CheckCheck, count: stats?.noReplyNeededCount, badgeColor: 'bg-slate-700 text-slate-400' },
    { id: 'action_required', label: 'Action Required', icon: AlertCircle, count: stats?.urgentCount, badgeColor: 'bg-rose-500/20 text-rose-400' },
    { id: 'waiting_response', label: 'Waiting for Response', icon: Clock, count: 2, badgeColor: 'bg-slate-700 text-slate-400' },
    { id: 'meetings', label: 'Meetings & Calendar', icon: Calendar, count: stats?.meetingsCount, badgeColor: 'bg-teal-500/20 text-teal-400' },
    { id: 'starred', label: 'Starred & VIP', icon: Star, count: null },
    { id: 'archived', label: 'Archived', icon: Archive, count: null }
  ];

  return (
    <aside className="w-full lg:w-64 flex-shrink-0 flex flex-col gap-6">
      {/* Navigation Links */}
      <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-2xl p-3 shadow-sm">
        <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
          <span>Inbox Triage</span>
          <Layers className="w-3.5 h-3.5 text-slate-500" />
        </div>
        <nav className="flex flex-col gap-1 mt-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSegment === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectSegment(item.id)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.count !== null && item.count !== undefined && (
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : item.badgeColor || 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Connected Accounts Card */}
      <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-2xl p-3 shadow-sm">
        <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
          <span>Connected Inboxes</span>
          <button
            onClick={onOpenConnectModal}
            title="Connect Account"
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-teal-400 transition"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex flex-col gap-2 mt-1">
          {accounts.map((acc) => (
            <div
              key={acc._id}
              className="px-3 py-2 rounded-xl bg-slate-800/40 border border-slate-800/80 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2 truncate">
                <div className="relative">
                  <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center font-bold text-[10px] text-teal-400 uppercase">
                    {acc.provider === 'gmail' ? 'G' : 'O'}
                  </div>
                  <Circle className="w-2 h-2 text-emerald-400 fill-emerald-400 absolute -bottom-0.5 -right-0.5" />
                </div>
                <div className="truncate text-left">
                  <div className="font-medium text-slate-200 truncate text-[11px]">{acc.email}</div>
                  <div className="text-[10px] text-slate-400 capitalize">{acc.provider} • Active</div>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 font-medium px-1.5 py-0.5 rounded bg-slate-800">
                {acc.unreadCount || 0} new
              </span>
            </div>
          ))}
          <button
            onClick={onOpenConnectModal}
            className="w-full py-2 px-3 border border-dashed border-slate-700/80 hover:border-slate-600 rounded-xl text-center text-xs text-slate-400 hover:text-slate-200 transition flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Connect Account</span>
          </button>
        </div>
      </div>

      {/* AI Automation Benchmark Card */}
      <div className="bg-gradient-to-br from-indigo-950/40 to-slate-900/80 border border-indigo-500/20 rounded-2xl p-3.5 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-teal-400" />
          <span className="text-xs font-semibold text-slate-200">AI Triage Efficiency</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
          AI has automatically classified 84% of conversations, saving approximately 14 hours of triage time this week.
        </p>
        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div className="bg-gradient-to-r from-teal-400 to-indigo-500 h-1.5 rounded-full w-[84%]"></div>
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
          <span>Confidence: 91%</span>
          <span>Zero Missed Client Tasks</span>
        </div>
      </div>
    </aside>
  );
}

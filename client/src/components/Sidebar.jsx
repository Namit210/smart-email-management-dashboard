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
  ChevronRight
} from 'lucide-react';

export default function Sidebar({
  activeSegment,
  onSelectSegment,
  stats,
  accounts,
  onOpenConnectModal,
  onOpenSimulate
}) {
  const navItems = [
    { id: 'all', label: 'All Inboxes', icon: Inbox, count: stats?.totalEmails },
    { id: 'assistant_reply', label: 'Assistant to Reply', icon: Bot, count: stats?.assistantReplyCount, badgeColor: 'bg-[#d3e3fd] text-[#041e49]' },
    { id: 'client_reply', label: 'Client to Reply', icon: UserCheck, count: stats?.clientPendingCount || stats?.clientReplyCount, badgeColor: 'bg-[#ffe7d6] text-[#b06000] font-semibold' },
    { id: 'no_reply_needed', label: 'No Reply Needed', icon: CheckCheck, count: stats?.noReplyNeededCount, badgeColor: 'bg-[#eaedf1] text-[#444746]' },
    { id: 'action_required', label: 'Action Required', icon: AlertCircle, count: stats?.urgentCount, badgeColor: 'bg-[#f9dedc] text-[#b3261e]' },
    { id: 'meetings', label: 'Meetings & Calendar', icon: Calendar, count: stats?.meetingsCount, badgeColor: 'bg-[#c4eed0] text-[#0f5223]' },
    { id: 'waiting_response', label: 'Waiting for Response', icon: Clock, count: 2, badgeColor: 'bg-[#eaedf1] text-[#444746]' },
    { id: 'starred', label: 'Starred & VIP', icon: Star, count: null },
    { id: 'archived', label: 'Archived', icon: Archive, count: null }
  ];

  return (
    <aside className="w-full lg:w-64 flex-shrink-0 flex flex-col gap-4 p-1">
      {/* Google-Style Compose / Simulate Button */}
      <button
        onClick={onOpenSimulate}
        className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-[#c2e7ff] hover:bg-[#b3e0ff] text-[#001d35] font-poppins font-medium text-sm shadow-sm hover:shadow transition-all w-fit mb-1"
      >
        <Plus className="w-5 h-5 text-[#001d35]" />
        <span>Simulate Email</span>
      </button>

      {/* Main Navigation - Google Material 3 Pill Rows */}
      <nav className="flex flex-col gap-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSegment === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectSegment(item.id)}
              className={`flex items-center justify-between px-4 py-2.5 rounded-full text-sm font-poppins transition-all text-left ${
                isActive
                  ? 'bg-[#d3e3fd] text-[#041e49] font-semibold shadow-xs'
                  : 'text-[#444746] hover:bg-[#eaedf1] hover:text-[#1f1f1f]'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-[#0b57d0]' : 'text-[#5e5e5e]'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.count !== null && item.count !== undefined && (
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-medium ml-2 ${
                    isActive
                      ? 'bg-white/80 text-[#041e49]'
                      : item.badgeColor || 'bg-[#eaedf1] text-[#444746]'
                  }`}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-[#eaedf1] my-1"></div>

      {/* Connected Accounts */}
      <div className="px-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#747775] font-poppins">
            Connected Inboxes
          </span>
          <button
            onClick={onOpenConnectModal}
            className="p-1 rounded-full hover:bg-[#eaedf1] text-[#444746] transition"
            title="Connect Account"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col gap-1.5">
          {accounts.map((acc) => (
            <div
              key={acc._id}
              className="px-3 py-2 rounded-xl bg-white border border-[#eaedf1] flex items-center justify-between text-xs hover:bg-[#f0f4f9] transition"
            >
              <div className="flex items-center gap-2 truncate">
                <div className="w-5 h-5 rounded-full bg-[#eaf1fb] text-[#0b57d0] font-bold flex items-center justify-center text-[10px] flex-shrink-0">
                  {acc.provider === 'gmail' ? 'G' : 'O'}
                </div>
                <div className="truncate text-left">
                  <span className="font-medium text-[#1f1f1f] text-xs truncate block font-poppins">
                    {acc.email}
                  </span>
                  <span className="text-[11px] text-[#747775] capitalize">
                    {acc.provider} • Connected
                  </span>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={onOpenConnectModal}
            className="w-full py-2 px-3 border border-dashed border-[#c2e7ff] hover:bg-[#f0f4f9] rounded-xl text-center text-xs text-[#0b57d0] font-medium font-poppins transition flex items-center justify-center gap-1.5 mt-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Connect Account</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

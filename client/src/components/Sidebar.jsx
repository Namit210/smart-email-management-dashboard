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
  X,
  Sparkles
} from 'lucide-react';

export default function Sidebar({
  activeSegment,
  onSelectSegment,
  stats,
  accounts,
  clientList = [],
  selectedClient = 'all',
  onSelectClient,
  onOpenConnectModal,
  onOpenSimulate,
  isMobileOpen,
  onCloseMobile
}) {
  const navItems = [
    { id: 'all', label: 'All Inboxes', icon: Inbox, count: stats?.totalEmails },
    { id: 'assistant_reply', label: 'Assigned to Me (Assistant)', icon: Bot, count: stats?.assistantReplyCount, badgeColor: 'bg-[#d3e3fd] text-[#041e49]' },
    { id: 'client_reply', label: 'Escalated to Clients', icon: UserCheck, count: stats?.clientPendingCount || stats?.clientReplyCount, badgeColor: 'bg-[#ffe7d6] text-[#b06000] font-semibold' },
    { id: 'meetings', label: 'Meetings to Schedule', icon: Calendar, count: stats?.meetingsCount, badgeColor: 'bg-[#c4eed0] text-[#0f5223]' },
    { id: 'action_required', label: 'Urgent Action Items', icon: AlertCircle, count: stats?.urgentCount, badgeColor: 'bg-[#f9dedc] text-[#b3261e]' },
    { id: 'no_reply_needed', label: 'No Reply Needed', icon: CheckCheck, count: stats?.noReplyNeededCount, badgeColor: 'bg-[#eaedf1] text-[#444746]' },
    { id: 'waiting_response', label: 'Waiting for External Reply', icon: Clock, count: stats?.waitingResponseCount, badgeColor: 'bg-[#eaedf1] text-[#444746]' },
    { id: 'starred', label: 'Starred & VIP', icon: Star, count: stats?.starredCount },
    { id: 'archived', label: 'Archived', icon: Archive, count: stats?.archivedCount }
  ];

  const sidebarContent = (
    <div className="flex flex-col gap-4 p-3 sm:p-1 h-full overflow-y-auto pr-1">
      {/* Mobile Drawer Top Bar with Brand and Close Button */}
      <div className="flex items-center justify-between pb-2 border-b border-[#eaedf1] lg:hidden">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0b57d0] to-[#1e8e3e] flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-bold text-[#1f1f1f] text-base font-poppins">OmniMail AI</span>
        </div>
        <button
          onClick={onCloseMobile}
          className="p-1.5 rounded-full hover:bg-[#eaedf1] text-[#747775]"
          title="Close drawer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Google-Style Compose / Simulate Button */}
      <button
        onClick={() => {
          onOpenSimulate();
          if (onCloseMobile) onCloseMobile();
        }}
        className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-[#c2e7ff] hover:bg-[#b3e0ff] text-[#001d35] font-poppins font-medium text-sm shadow-xs hover:shadow transition-all w-fit mb-1"
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
              onClick={() => {
                onSelectSegment(item.id);
                if (onCloseMobile) onCloseMobile();
              }}
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
              {typeof item.count === 'number' && item.count > 0 && (
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
      <div className="px-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#747775] font-poppins">
            Connected Inboxes
          </span>
          <button
            onClick={() => {
              onOpenConnectModal();
              if (onCloseMobile) onCloseMobile();
            }}
            className="p-1 rounded-full hover:bg-[#eaedf1] text-[#444746] transition"
            title="Connect Account"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col gap-1.5">
          {accounts.length === 0 && (
            <div className="p-3 rounded-xl bg-white border border-[#eaedf1] text-center text-xs text-[#747775]">
              <span className="text-[11px] block text-[#1f1f1f] font-semibold font-poppins">No clients connected</span>
              <span className="text-[10px] block mt-0.5 text-[#747775] font-lato">Click below to connect your first executive</span>
            </div>
          )}

          {accounts.map((acc) => {
            const isSelected = selectedClient === acc.clientName;
            return (
              <div
                key={acc._id}
                onClick={() => {
                  if (onSelectClient) {
                    onSelectClient(isSelected ? 'all' : (acc.clientName || 'all'));
                    if (onCloseMobile) onCloseMobile();
                  }
                }}
                className={`px-3 py-2 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition ${
                  isSelected
                    ? 'bg-[#d3e3fd] border-[#b8d4fb] text-[#041e49]'
                    : 'bg-white border-[#eaedf1] hover:bg-[#f0f4f9] text-[#1f1f1f]'
                }`}
                title={`Filter inbox by ${acc.clientName}`}
              >
                <div className="flex items-center gap-2 truncate">
                  <div className="w-5 h-5 rounded-full bg-[#eaf1fb] text-[#0b57d0] font-bold flex items-center justify-center text-[10px] flex-shrink-0">
                    {acc.provider === 'gmail' ? 'G' : 'O'}
                  </div>
                  <div className="truncate text-left">
                    <span className="font-semibold text-xs truncate block font-poppins">
                      {acc.clientName || acc.email}
                    </span>
                    <span className="text-[10px] text-[#747775] truncate block">
                      {acc.role || acc.email}
                    </span>
                  </div>
                </div>
                {acc.totalEmails > 0 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#eaedf1] text-[#444746] font-medium flex-shrink-0">
                    {acc.totalEmails}
                  </span>
                )}
              </div>
            );
          })}

          <button
            onClick={() => {
              onOpenConnectModal();
              if (onCloseMobile) onCloseMobile();
            }}
            className="w-full py-2 px-3 border border-dashed border-[#c2e7ff] hover:bg-[#f0f4f9] rounded-xl text-center text-xs text-[#0b57d0] font-medium font-poppins transition flex items-center justify-center gap-1.5 mt-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Connect Account</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Left Sidebar (lg and up) - Static & Sticky to Viewport */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 flex-col sticky top-[70px] h-[calc(100vh-82px)] self-start">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-Over Drawer with Dimmed Backdrop (below lg) */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden animate-fade-in">
          {/* Dimmed Backdrop */}
          <div 
            onClick={onCloseMobile}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            aria-hidden="true"
          />

          {/* Drawer Sheet */}
          <div className="relative w-72 max-w-[85vw] h-full bg-[#f6f8fc] border-r border-[#eaedf1] shadow-2xl flex flex-col z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}

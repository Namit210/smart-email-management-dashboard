import React from 'react';
import { 
  Star, 
  Calendar, 
  Bot, 
  UserCheck, 
  CheckCheck, 
  AlertCircle, 
  Inbox
} from 'lucide-react';

export default function EmailList({
  emails,
  onSelectEmail,
  activeFilter,
  setActiveFilter,
  onToggleFlag,
  onQuickOverride,
  isLoading,
  activeSegment,
  onSelectSegment
}) {
  const getBadge = (classification, confidence, manualOverride) => {
    switch (classification) {
      case 'client_reply':
        return (
          <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#ffe7d6] text-[#b06000] border border-[#ffd8bf] whitespace-nowrap font-poppins">
            <UserCheck className="w-3 h-3 text-[#b06000]" />
            <span>Client to Reply</span>
            {manualOverride ? (
              <span className="text-[9px] opacity-80">(Manual)</span>
            ) : (
              <span className="text-[9px] opacity-80">{confidence}%</span>
            )}
          </span>
        );
      case 'assistant_reply':
        return (
          <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#d3e3fd] text-[#041e49] border border-[#b8d4fb] whitespace-nowrap font-poppins">
            <Bot className="w-3 h-3 text-[#0b57d0]" />
            <span>Assistant to Reply</span>
            {manualOverride ? (
              <span className="text-[9px] opacity-80">(Manual)</span>
            ) : (
              <span className="text-[9px] opacity-80">{confidence}%</span>
            )}
          </span>
        );
      case 'no_reply_needed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#eaedf1] text-[#444746] whitespace-nowrap font-poppins">
            <CheckCheck className="w-3 h-3 text-[#747775]" />
            <span>No Reply Needed</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#f2daff] text-[#491069] whitespace-nowrap font-poppins">
            <AlertCircle className="w-3 h-3 text-[#6750a4]" />
            <span>Needs Review</span>
          </span>
        );
    }
  };

  const formatRelativeTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMins = Math.round((now - date) / (1000 * 60));
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.round(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex-1 bg-white border border-[#eaedf1] rounded-2xl overflow-hidden shadow-xs flex flex-col mb-16 lg:mb-0">
      {/* Google-Style List Toolbar */}
      <div className="px-3 sm:px-4 py-2.5 border-b border-[#eaedf1] flex flex-col sm:flex-row gap-2.5 items-center justify-between bg-white">
        
        {/* Triage Filter Tabs (Google Style) */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All Mail' },
            { id: 'assistant_reply', label: 'For Assistant to Handle' },
            { id: 'client_reply', label: 'Escalated to Clients' },
            { id: 'meetings', label: 'Meetings to Book' },
            { id: 'no_reply_needed', label: 'No Action Needed' }
          ].map((tab) => {
            const isActive = activeSegment === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectSegment(tab.id)}
                className={`px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-xs font-semibold font-poppins transition whitespace-nowrap ${
                  isActive
                    ? 'bg-[#d3e3fd] text-[#041e49]'
                    : 'text-[#444746] hover:bg-[#f0f4f9] hover:text-[#1f1f1f]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Sub-Filters (Unread, Urgent) */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto text-xs text-[#5e5e5e]">
          {['all', 'unread', 'urgent'].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize transition ${
                activeFilter === f
                  ? 'bg-[#eaedf1] text-[#1f1f1f] font-semibold'
                  : 'text-[#747775] hover:bg-[#f0f4f9]'
              }`}
            >
              {f}
            </button>
          ))}
          <span className="text-[#c7c7c7] mx-1">|</span>
          <span className="text-xs font-medium text-[#747775] whitespace-nowrap font-poppins">
            {emails.length} threads
          </span>
        </div>
      </div>

      {/* Gmail-Style Email Rows */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#eaedf1]">
        {isLoading ? (
          <div className="p-16 text-center text-[#747775] text-sm flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-[#0b57d0] border-t-transparent rounded-full animate-spin"></div>
            <span className="font-poppins">Synchronizing and triaging inbox with AI...</span>
          </div>
        ) : emails.length === 0 ? (
          <div className="p-16 text-center text-[#747775] flex flex-col items-center justify-center gap-3">
            <div className="p-4 bg-[#f0f4f9] rounded-full">
              <Inbox className="w-10 h-10 text-[#747775]" />
            </div>
            <div>
              <p className="text-base font-semibold text-[#1f1f1f] font-poppins">No emails in this view</p>
              <p className="text-xs text-[#747775] mt-1 font-lato">Try switching categories or clearing search filters.</p>
            </div>
          </div>
        ) : (
          emails.map((email) => {
            const isUnread = !email.isRead;

            return (
              <div
                key={email._id}
                onClick={() => onSelectEmail(email._id)}
                className={`group px-3 sm:px-4 py-3 cursor-pointer transition-all flex flex-col md:flex-row md:items-center justify-between gap-1.5 sm:gap-2.5 email-row-hover ${
                  isUnread
                    ? 'bg-[#ffffff] font-semibold shadow-xs'
                    : 'bg-[#f8fafd] hover:bg-white text-[#444746]'
                }`}
              >
                {/* Mobile Layout (top row on mobile) */}
                <div className="flex items-center justify-between gap-2 md:hidden">
                  <div className="flex items-center gap-2 truncate">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFlag(email._id, 'isStarred');
                      }}
                      className={`p-0.5 rounded-full transition ${
                        email.isStarred ? 'text-[#e37400]' : 'text-[#747775] opacity-60'
                      }`}
                    >
                      <Star className={`w-4 h-4 ${email.isStarred ? 'fill-[#e37400]' : ''}`} />
                    </button>
                    {isUnread && <span className="w-2 h-2 rounded-full bg-[#0b57d0]"></span>}
                    <span className={`text-sm truncate font-poppins ${isUnread ? 'text-[#1f1f1f] font-semibold' : 'text-[#444746] font-medium'}`}>
                      {email.sender.name}
                    </span>
                    {email.clientName && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#e8def8] text-[#381e72] font-semibold whitespace-nowrap">
                        {email.clientName.split(' ')[0]}
                      </span>
                    )}
                  </div>
                  <span className={`text-[11px] font-poppins whitespace-nowrap ${isUnread ? 'text-[#1f1f1f] font-bold' : 'text-[#747775]'}`}>
                    {formatRelativeTime(email.receivedAt)}
                  </span>
                </div>

                {/* Desktop Left: Star, Sender */}
                <div className="hidden md:flex items-center gap-3 min-w-[200px] max-w-[260px]">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFlag(email._id, 'isStarred');
                    }}
                    className={`p-1 rounded-full hover:bg-[#eaedf1] transition ${
                      email.isStarred ? 'text-[#e37400]' : 'text-[#747775] opacity-60 group-hover:opacity-100'
                    }`}
                  >
                    <Star className={`w-4 h-4 ${email.isStarred ? 'fill-[#e37400]' : ''}`} />
                  </button>

                  <div className="w-2 flex-shrink-0">
                    {isUnread && (
                      <span className="w-2 h-2 rounded-full bg-[#0b57d0] inline-block"></span>
                    )}
                  </div>

                  <div className="truncate">
                    <span className={`text-sm font-poppins truncate ${isUnread ? 'text-[#1f1f1f] font-semibold' : 'text-[#444746] font-medium'}`}>
                      {email.sender.name}
                    </span>
                  </div>
                </div>

                {/* Middle: Badge, Subject, Snippet */}
                <div className="flex-1 flex flex-col md:flex-row md:items-center gap-1.5 md:gap-2.5 overflow-hidden">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                      {getBadge(email.classification, email.confidence, email.manualOverride)}
                    </div>

                    {email.clientName && (
                      <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#e8def8] text-[#381e72] border border-[#d0bcff] whitespace-nowrap">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#6750a4]"></span>
                        <span>{email.clientName.split(' ')[0]}</span>
                      </span>
                    )}

                    {email.extractedMeeting?.detected && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#c4eed0] text-[#0f5223] whitespace-nowrap">
                        <Calendar className="w-3 h-3 text-[#1e8e3e]" />
                        <span>{email.extractedMeeting.date}</span>
                      </span>
                    )}

                    {email.urgency === 'urgent' && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#f9dedc] text-[#b3261e] border border-[#f2b8b5] whitespace-nowrap">
                        URGENT
                      </span>
                    )}
                  </div>

                  {/* Subject and Snippet */}
                  <div className="truncate text-xs sm:text-sm">
                    <span className={`font-poppins mr-1.5 ${isUnread ? 'text-[#1f1f1f] font-semibold' : 'text-[#303030]'}`}>
                      {email.subject}
                    </span>
                    <span className="text-[#747775] font-lato text-xs">
                      — {email.snippet}
                    </span>
                  </div>
                </div>

                {/* Desktop Right: Quick Override & Date */}
                <div className="hidden md:flex items-center gap-3 flex-shrink-0 pl-2">
                  <div className="opacity-0 group-hover:opacity-100 transition" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={email.classification}
                      onChange={(e) => onQuickOverride(email._id, e.target.value)}
                      className="text-xs bg-[#f0f4f9] hover:bg-[#eaf1fb] text-[#444746] border border-[#eaedf1] rounded-full px-2 py-1 cursor-pointer focus:outline-none"
                      title="Quick Change AI Classification"
                    >
                      <option value="assistant_reply">→ Assistant</option>
                      <option value="client_reply">→ Client</option>
                      <option value="no_reply_needed">→ No Reply</option>
                      <option value="needs_review">→ Review</option>
                    </select>
                  </div>

                  <span className={`text-xs font-poppins whitespace-nowrap ${isUnread ? 'text-[#1f1f1f] font-bold' : 'text-[#747775]'}`}>
                    {formatRelativeTime(email.receivedAt)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

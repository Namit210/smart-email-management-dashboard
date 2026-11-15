import React from 'react';
import { 
  Search, 
  Star, 
  Calendar, 
  Bot, 
  UserCheck, 
  CheckCheck, 
  AlertCircle,
  MoreVertical,
  ChevronRight,
  Sparkles,
  Inbox
} from 'lucide-react';

export default function EmailList({
  emails,
  selectedEmailId,
  onSelectEmail,
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
  onToggleFlag,
  onQuickOverride,
  isLoading
}) {
  const getBadge = (classification, confidence, manualOverride) => {
    switch (classification) {
      case 'client_reply':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <UserCheck className="w-3 h-3 text-amber-400" />
            <span>Client to Reply</span>
            {manualOverride ? (
              <span className="text-[9px] text-amber-400/80 font-normal">(Manual)</span>
            ) : (
              <span className="text-[9px] text-amber-400/80 font-normal">{confidence}%</span>
            )}
          </span>
        );
      case 'assistant_reply':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30">
            <Bot className="w-3 h-3 text-blue-400" />
            <span>Assistant to Reply</span>
            {manualOverride ? (
              <span className="text-[9px] text-blue-400/80 font-normal">(Manual)</span>
            ) : (
              <span className="text-[9px] text-blue-400/80 font-normal">{confidence}%</span>
            )}
          </span>
        );
      case 'no_reply_needed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-700/50 text-slate-400 border border-slate-700">
            <CheckCheck className="w-3 h-3 text-slate-400" />
            <span>No Reply Needed</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
            <AlertCircle className="w-3 h-3 text-purple-400" />
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
    <div className="flex-1 flex flex-col bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
      {/* Search & Sub-Filter Header */}
      <div className="p-3 border-b border-slate-800 flex flex-col sm:flex-row gap-2.5 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search subject, sender, body..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['all', 'unread', 'urgent'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize whitespace-nowrap transition ${
                activeFilter === filter
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              {filter}
            </button>
          ))}
          <span className="text-slate-600 text-xs px-1">|</span>
          <span className="text-xs text-slate-400 whitespace-nowrap">
            {emails.length} conversations
          </span>
        </div>
      </div>

      {/* Email Items List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-3">
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Analyzing and synchronizing email threads...</span>
          </div>
        ) : emails.length === 0 ? (
          <div className="p-16 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
            <div className="p-3 bg-slate-800/50 rounded-2xl border border-slate-800">
              <Inbox className="w-8 h-8 text-slate-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-300">No emails match the selected view</p>
              <p className="text-xs text-slate-500 mt-1">Try switching segments or resetting your search query.</p>
            </div>
          </div>
        ) : (
          emails.map((email) => {
            const isSelected = selectedEmailId === email._id;
            const isUnread = !email.isRead;

            return (
              <div
                key={email._id}
                onClick={() => onSelectEmail(email._id)}
                className={`p-3.5 sm:p-4 cursor-pointer transition-all flex flex-col gap-2 relative group ${
                  isSelected
                    ? 'bg-indigo-950/30 border-l-4 border-l-indigo-500'
                    : 'hover:bg-slate-800/40 border-l-4 border-l-transparent'
                } ${isUnread ? 'bg-slate-850/40 font-medium' : ''}`}
              >
                {/* Top Row: Sender Info & Date */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 truncate">
                    {/* Read indicator dot */}
                    <div className="w-2 flex-shrink-0">
                      {isUnread && (
                        <span className="w-2 h-2 rounded-full bg-teal-400 inline-block shadow-sm shadow-teal-400/50"></span>
                      )}
                    </div>

                    {/* Sender Avatar */}
                    {email.sender.avatar ? (
                      <img
                        src={email.sender.avatar}
                        alt={email.sender.name}
                        className="w-6 h-6 rounded-full object-cover flex-shrink-0 border border-slate-700"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-300 flex-shrink-0">
                        {email.sender.name.charAt(0)}
                      </div>
                    )}

                    <span className={`text-xs truncate ${isUnread ? 'text-white font-semibold' : 'text-slate-300'}`}>
                      {email.sender.name}
                    </span>

                    <span className="text-[11px] text-slate-500 truncate hidden md:inline">
                      &lt;{email.sender.email}&gt;
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[11px] text-slate-400">
                      {formatRelativeTime(email.receivedAt)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFlag(email._id, 'isStarred');
                      }}
                      className={`p-1 rounded hover:bg-slate-800 transition ${
                        email.isStarred ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${email.isStarred ? 'fill-amber-400' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Subject Line */}
                <div className="flex items-center justify-between gap-3">
                  <h3 className={`text-xs truncate ${isUnread ? 'text-white font-bold' : 'text-slate-200 font-medium'}`}>
                    {email.subject}
                  </h3>
                </div>

                {/* Snippet Preview */}
                <p className="text-xs text-slate-400 line-clamp-1 leading-relaxed">
                  {email.snippet}
                </p>

                {/* Badges & Actions Footer */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <div className="flex items-center flex-wrap gap-1.5">
                    {getBadge(email.classification, email.confidence, email.manualOverride)}

                    {email.extractedMeeting?.detected && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-teal-500/10 text-teal-300 border border-teal-500/20">
                        <Calendar className="w-3 h-3 text-teal-400" />
                        <span>Meeting: {email.extractedMeeting.date}</span>
                      </span>
                    )}

                    {email.urgency === 'urgent' && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        URGENT
                      </span>
                    )}

                    {email.clientAttention?.handled && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        ✓ Handled by Client
                      </span>
                    )}
                  </div>

                  {/* 1-Click Classification Quick Override Menu */}
                  <div className="relative group/menu" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={email.classification}
                      onChange={(e) => onQuickOverride(email._id, e.target.value)}
                      className="text-[10px] bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/80 rounded px-1.5 py-0.5 cursor-pointer focus:outline-none"
                      title="Quick Override AI Classification"
                    >
                      <option value="assistant_reply">→ Set Assistant</option>
                      <option value="client_reply">→ Set Client</option>
                      <option value="no_reply_needed">→ Set No Reply</option>
                      <option value="needs_review">→ Set Review</option>
                    </select>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

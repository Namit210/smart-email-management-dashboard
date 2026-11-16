import React from 'react';
import { 
  Bot, 
  UserCheck, 
  CheckCheck, 
  Calendar, 
  AlertCircle,
  Inbox,
  ArrowRight
} from 'lucide-react';

export default function KPICards({ stats, activeSegment, onSelectSegment }) {
  if (!stats) return null;

  const cards = [
    {
      id: 'assistant_reply',
      title: 'Assistant to Reply',
      count: stats.assistantReplyCount || 0,
      label: 'Delegated to you',
      icon: Bot,
      color: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30 text-blue-400',
      tagColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      activeBorder: 'border-blue-500 bg-blue-500/10'
    },
    {
      id: 'client_reply',
      title: 'Client to Reply',
      count: stats.clientPendingCount || stats.clientReplyCount || 0,
      label: 'Executive Attention Needed',
      icon: UserCheck,
      color: 'from-amber-500/20 to-rose-500/20 border-amber-500/30 text-amber-400',
      tagColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      activeBorder: 'border-amber-500 bg-amber-500/10'
    },
    {
      id: 'action_required',
      title: 'Action Required',
      count: stats.urgentCount || 3,
      label: 'Urgent follow-ups',
      icon: AlertCircle,
      color: 'from-rose-500/20 to-orange-500/20 border-rose-500/30 text-rose-400',
      tagColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      activeBorder: 'border-rose-500 bg-rose-500/10'
    },
    {
      id: 'meetings',
      title: 'Upcoming Meetings',
      count: stats.meetingsCount || 0,
      label: 'Calendar detected',
      icon: Calendar,
      color: 'from-teal-500/20 to-emerald-500/20 border-teal-500/30 text-teal-400',
      tagColor: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
      activeBorder: 'border-teal-500 bg-teal-500/10'
    },
    {
      id: 'no_reply_needed',
      title: 'No Reply Needed',
      count: stats.noReplyNeededCount || 0,
      label: 'Auto-filtered',
      icon: CheckCheck,
      color: 'from-slate-700/30 to-slate-800/30 border-slate-700/50 text-slate-400',
      tagColor: 'bg-slate-800 text-slate-400 border-slate-700',
      activeBorder: 'border-slate-500 bg-slate-800/50'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = activeSegment === card.id;

        return (
          <button
            key={card.id}
            onClick={() => onSelectSegment(card.id)}
            className={`p-3.5 rounded-xl border transition-all text-left flex flex-col justify-between group relative overflow-hidden bg-slate-900/60 backdrop-blur-sm ${
              isSelected ? card.activeBorder : 'border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400 truncate pr-1">
                {card.title}
              </span>
              <div className={`p-1.5 rounded-lg border bg-gradient-to-br ${card.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-bold tracking-tight text-white">
                {card.count}
              </span>
              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${card.tagColor}`}>
                {card.label}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

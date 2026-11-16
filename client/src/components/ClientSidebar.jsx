import React from 'react';
import { 
  UserCheck, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  X,
  ChevronRight
} from 'lucide-react';

export default function ClientSidebar({
  isOpen,
  onClose,
  clientEmails,
  clientList = [],
  selectedClient = 'all',
  onSelectClient,
  onSelectEmail,
  onClientAction,
  onOpenClientPortal
}) {
  if (!isOpen) return null;

  // Filter pending emails based on selectedClient
  const allPending = clientEmails.filter(e => !e.clientAttention?.handled);
  const pendingEmails = selectedClient === 'all'
    ? allPending
    : allPending.filter(e => e.clientName === selectedClient);

  const activeClientObj = clientList.find(c => c.name === selectedClient);

  const panelContent = (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 border-b border-[#eaedf1] flex items-center justify-between bg-[#f8fafd]">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={activeClientObj?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80"}
              alt={selectedClient === 'all' ? 'All Clients' : selectedClient}
              className="w-10 h-10 rounded-full object-cover border border-[#eaedf1]"
            />
            <span className="w-2.5 h-2.5 rounded-full bg-[#1e8e3e] border-2 border-white absolute bottom-0 right-0"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm text-[#1f1f1f] font-poppins">
                {selectedClient === 'all' ? 'Client Approvals Tracker' : `${selectedClient}'s Queue`}
              </h3>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#ffe7d6] text-[#b06000]">
                {pendingEmails.length} Awaiting
              </span>
            </div>
            <p className="text-xs text-[#747775] truncate max-w-[180px]">
              {selectedClient === 'all' ? 'Monitoring decisions for 3 clients' : (activeClientObj?.role || 'Executive Principal')}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-[#eaedf1] text-[#747775] hover:text-[#1f1f1f] transition"
          title="Close Client Queue"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Client Quick Filter Pills */}
      {clientList.length > 0 && onSelectClient && (
        <div className="px-3 py-2 bg-white border-b border-[#eaedf1] flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <button
            onClick={() => onSelectClient('all')}
            className={`px-2.5 py-1 rounded-full text-xs font-medium font-poppins whitespace-nowrap transition ${
              selectedClient === 'all'
                ? 'bg-[#0b57d0] text-white shadow-2xs'
                : 'bg-[#f0f4f9] text-[#444746] hover:bg-[#eaf1fb]'
            }`}
          >
            All ({allPending.length})
          </button>
          {clientList.map((c) => {
            const count = allPending.filter(e => e.clientName === c.name).length;
            const isSel = selectedClient === c.name;
            return (
              <button
                key={c.name}
                onClick={() => onSelectClient(c.name)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium font-poppins whitespace-nowrap transition flex items-center gap-1 ${
                  isSel
                    ? 'bg-[#b06000] text-white shadow-2xs font-semibold'
                    : 'bg-[#f0f4f9] text-[#444746] hover:bg-[#eaf1fb]'
                }`}
              >
                <span>{c.name.split(' ')[0]}</span>
                {count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSel ? 'bg-white text-[#b06000]' : 'bg-[#ffe7d6] text-[#b06000]'} font-bold`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Subheader / Mode switcher */}
      <div className="px-4 py-2 bg-[#f0f4f9] border-b border-[#eaedf1] flex items-center justify-between text-xs">
        <span className="font-medium text-[#444746] flex items-center gap-1.5 font-poppins">
          <UserCheck className="w-4 h-4 text-[#b06000]" />
          <span>Requires Executive Action</span>
        </span>
        <button
          onClick={onOpenClientPortal}
          className="text-[#0b57d0] hover:underline font-semibold text-xs flex items-center gap-0.5"
        >
          <span>Open Portal</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Pending Items List */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
        {pendingEmails.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#747775] flex flex-col items-center justify-center gap-2">
            <CheckCircle2 className="w-8 h-8 text-[#1e8e3e]" />
            <p className="font-medium text-[#1f1f1f] font-poppins">All Caught Up!</p>
            <p className="text-[11px] text-[#747775]">No items currently require personal response in this queue.</p>
          </div>
        ) : (
          pendingEmails.map((email) => (
            <div
              key={email._id}
              className="p-3.5 rounded-2xl bg-white border border-[#eaedf1] hover:border-[#c2e7ff] hover:shadow-xs transition-all flex flex-col gap-2 group"
            >
              {/* Client & Sender & Timestamp */}
              <div className="flex items-center justify-between gap-1 text-xs">
                <div className="flex items-center gap-1.5 truncate">
                  {email.clientName && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#e8def8] text-[#381e72] font-semibold flex-shrink-0">
                      {email.clientName.split(' ')[0]}
                    </span>
                  )}
                  <span className="font-semibold text-[#1f1f1f] truncate font-poppins">
                    {email.sender.name}
                  </span>
                </div>
                <span className="text-[11px] text-[#747775] whitespace-nowrap">
                  {new Date(email.receivedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {/* Subject */}
              <button
                onClick={() => onSelectEmail(email._id)}
                className="text-left font-medium text-xs text-[#1f1f1f] hover:text-[#0b57d0] line-clamp-2 leading-snug transition font-poppins"
              >
                {email.subject}
              </button>

              {/* Why client response needed */}
              <div className="p-2.5 rounded-xl bg-[#fff8f2] border border-[#ffe7d6] text-[11px] text-[#b06000] flex items-start gap-1.5 leading-tight">
                <AlertTriangle className="w-3.5 h-3.5 text-[#b06000] flex-shrink-0 mt-0.5" />
                <span className="line-clamp-2 font-lato">
                  {email.clientAttention?.reason || email.classificationReason || 'Requires client personal sign-off.'}
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#f0f4f9] text-xs">
                <button
                  onClick={() => onSelectEmail(email._id)}
                  className="text-[#0b57d0] hover:underline font-semibold text-[11px] flex items-center gap-1 font-poppins"
                >
                  <span>Open</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onClientAction(email._id, { action: 'mark_handled' })}
                    title="Mark as Handled"
                    className="p-1 px-2.5 rounded-full bg-[#f0f4f9] hover:bg-[#c4eed0] text-[#1f1f1f] text-[11px] font-medium transition"
                  >
                    ✓ Handled
                  </button>
                  <button
                    onClick={() => onClientAction(email._id, {
                      action: 'delegate_to_assistant',
                      note: 'Assistant please handle response'
                    })}
                    title="Delegate to Assistant"
                    className="p-1 px-2.5 rounded-full bg-[#d3e3fd] hover:bg-[#c2e7ff] text-[#041e49] text-[11px] font-medium transition"
                  >
                    Take Over
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Right Panel (xl and up) */}
      <aside className="hidden xl:flex w-80 2xl:w-96 flex-shrink-0 border-l border-[#eaedf1] flex-col h-[calc(100vh-65px)] sticky top-[65px] shadow-xs">
        {panelContent}
      </aside>

      {/* Mobile / Tablet Slide-Over Drawer with Backdrop (below xl) */}
      <div className="fixed inset-0 z-50 flex justify-end xl:hidden animate-fade-in">
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
          aria-hidden="true"
        />
        <div className="relative w-80 sm:w-96 max-w-[90vw] h-full shadow-2xl flex flex-col z-10">
          {panelContent}
        </div>
      </div>
    </>
  );
}

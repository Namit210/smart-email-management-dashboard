import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import EmailList from './components/EmailList';
import EmailDetail from './components/EmailDetail';
import ClientPortal from './components/ClientPortal';
import ClientSidebar from './components/ClientSidebar';
import MobileBottomNav from './components/MobileBottomNav';
import AICopilotDrawer from './components/AICopilotDrawer';
import SimulateEmailModal from './components/SimulateEmailModal';
import OnboardingModal from './components/OnboardingModal';
import ConnectAccountModal from './components/ConnectAccountModal';
import AuthPage from './components/AuthPage';
import {
  fetchAccounts,
  fetchEmails,
  fetchStats,
  syncAccount,
  connectAccount,
  updateClassification,
  clientAction,
  sendReply,
  toggleEmailFlag,
  deleteEmail,
  toggleActionItem,
  saveDraft,
  simulateIncomingEmail,
  resetInboxData,
  getStoredUser,
  clearStoredToken,
  clearStoredUser,
  fetchCurrentAssistant
} from './services/api';

export default function App() {
  const [currentAssistantUser, setCurrentAssistantUser] = useState(() => getStoredUser());
  const [currentView, setCurrentView] = useState('assistant'); // 'assistant' | 'client'
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('all');
  const [selectedClient, setSelectedClient] = useState('all');
  const [clientPortalUser, setClientPortalUser] = useState('');
  const [emails, setEmails] = useState([]);
  const [selectedEmailId, setSelectedEmailId] = useState(null);
  const [stats, setStats] = useState(null);
  const [activeSegment, setActiveSegment] = useState('all');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'unread' | 'urgent'
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Modals state
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [simulateOpen, setSimulateOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [connectModalOpen, setConnectModalOpen] = useState(false);

  // Extract unique clients strictly from this assistant's connected accounts
  const clientList = useMemo(() => {
    const map = new Map();
    accounts.forEach(a => {
      if (a.clientName && !map.has(a.clientName)) {
        map.set(a.clientName, {
          name: a.clientName,
          role: a.role,
          email: a.email,
          avatar: a.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(a.clientName)}`
        });
      }
    });
    return Array.from(map.values());
  }, [accounts]);

  // Keep clientPortalUser in sync with available clients
  useEffect(() => {
    if (clientList.length > 0) {
      if (!clientList.some(c => c.name === clientPortalUser)) {
        setClientPortalUser(clientList[0].name);
      }
    } else {
      setClientPortalUser('');
    }
  }, [clientList]);

  // Verify stored session on mount
  useEffect(() => {
    async function verifyAuth() {
      if (getStoredUser()) {
        try {
          const res = await fetchCurrentAssistant();
          if (res.success && res.user) {
            setCurrentAssistantUser(res.user);
          }
        } catch (e) {
          // ignore error
        }
      }
    }
    verifyAuth();
  }, []);

  const handleLogout = () => {
    clearStoredToken();
    clearStoredUser();
    setCurrentAssistantUser(null);
    setEmails([]);
    setAccounts([]);
    setStats(null);
    setSelectedEmailId(null);
  };

  // Set default right sidebar open on wide screens
  useEffect(() => {
    if (window.innerWidth >= 1280) {
      setRightSidebarOpen(true);
    }
  }, []);

  // Initial / user change load
  useEffect(() => {
    if (currentAssistantUser) {
      loadAllData();
    }
  }, [currentAssistantUser?.id || currentAssistantUser?.email]);

  // Reload emails when segment, client, account, view or client portal user changes
  useEffect(() => {
    loadEmails();
  }, [selectedAccount, selectedClient, activeSegment, activeFilter, searchQuery, currentView, clientPortalUser]);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [accRes, statsRes] = await Promise.all([
        fetchAccounts(),
        fetchStats(selectedClient !== 'all' ? { client: selectedClient } : {})
      ]);
      if (accRes.success) setAccounts(accRes.accounts);
      if (statsRes.success) setStats(statsRes.stats);
      await loadEmails();
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadEmails = async () => {
    try {
      const params = {};
      if (currentView === 'client') {
        if (clientPortalUser) params.client = clientPortalUser;
      } else {
        if (selectedAccount !== 'all') params.account = selectedAccount;
        if (selectedClient !== 'all') params.client = selectedClient;
        if (activeSegment !== 'all') params.segment = activeSegment;
        if (activeFilter === 'unread') params.status = 'active';
      }
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const emailRes = await fetchEmails(params);
      if (emailRes.success) {
        let filtered = emailRes.emails;
        if (currentView === 'assistant') {
          if (activeFilter === 'unread') {
            filtered = filtered.filter(e => !e.isRead);
          } else if (activeFilter === 'urgent') {
            filtered = filtered.filter(e => e.urgency === 'urgent');
          }
        }
        setEmails(filtered);
      }
    } catch (err) {
      console.error('Failed to fetch emails:', err);
    }
  };

  const refreshStats = async () => {
    try {
      const params = {};
      if (selectedClient !== 'all') params.client = selectedClient;
      const res = await fetchStats(params);
      if (res.success) setStats(res.stats);
    } catch (err) {
      console.error('Failed to update stats:', err);
    }
  };

  // Selected email object
  const selectedEmail = useMemo(() => {
    return emails.find(e => e._id === selectedEmailId) || null;
  }, [emails, selectedEmailId]);

  // Client view emails: all emails requiring client reply
  const clientEmails = useMemo(() => {
    return emails.filter(e => e.classification === 'client_reply' || e.clientAttention?.required);
  }, [emails]);

  const clientPendingCount = useMemo(() => {
    return clientEmails.filter(e => !e.clientAttention?.handled).length;
  }, [clientEmails]);

  // Handlers
  const handleSync = async () => {
    setIsSyncing(true);
    try {
      if (accounts.length > 0) {
        await syncAccount(accounts[0]._id);
      }
      await loadEmails();
      await refreshStats();
    } catch (err) {
      console.error('Sync failed:', err);
    } finally {
      setTimeout(() => setIsSyncing(false), 800);
    }
  };

  const handleUpdateClassification = async (emailId, newClassification, reason) => {
    try {
      const res = await updateClassification(emailId, newClassification, reason);
      if (res.success) {
        setEmails(prev => prev.map(e => e._id === emailId ? res.email : e));
        await refreshStats();
      }
    } catch (err) {
      console.error('Override failed:', err);
    }
  };

  const handleClientAction = async (emailId, actionData) => {
    try {
      const res = await clientAction(emailId, actionData);
      if (res.success) {
        setEmails(prev => prev.map(e => e._id === emailId ? res.email : e));
        await refreshStats();
      }
    } catch (err) {
      console.error('Client action failed:', err);
    }
  };

  const handleSendReply = async (emailId, replyData) => {
    try {
      const res = await sendReply(emailId, replyData);
      if (res.success) {
        setEmails(prev => prev.map(e => e._id === emailId ? res.email : e));
        await refreshStats();
      }
    } catch (err) {
      console.error('Send reply failed:', err);
    }
  };

  const handleMarkEmailRead = async (id) => {
    const targetEmail = emails.find(e => e._id === id);
    if (targetEmail && !targetEmail.isRead) {
      // Optimistically update frontend state so unread dot clears immediately
      setEmails(prev => prev.map(e => e._id === id ? { ...e, isRead: true } : e));

      // Persist read status in backend database
      try {
        const res = await toggleEmailFlag(id, 'markRead');
        if (res.success && res.email) {
          setEmails(prev => prev.map(e => e._id === id ? res.email : e));
        }
        await refreshStats();
      } catch (err) {
        console.error('Mark email read failed:', err);
      }
    }
  };

  const handleSelectEmail = async (id) => {
    setSelectedEmailId(id);
    await handleMarkEmailRead(id);
  };

  const handleToggleFlag = async (emailId, field) => {
    try {
      const res = await toggleEmailFlag(emailId, field);
      if (res.success) {
        setEmails(prev => prev.map(e => e._id === emailId ? res.email : e));
        await refreshStats();
      }
    } catch (err) {
      console.error('Toggle flag failed:', err);
    }
  };

  const handleDeleteEmail = async (emailId) => {
    try {
      const res = await deleteEmail(emailId);
      if (res.success) {
        setEmails(prev => prev.filter(e => e._id !== emailId));
        setSelectedEmailId(null);
        await refreshStats();
      }
    } catch (err) {
      console.error('Delete email failed:', err);
    }
  };

  const handleToggleActionItem = async (emailId, itemIndex, completed) => {
    try {
      const res = await toggleActionItem(emailId, itemIndex, completed);
      if (res.success) {
        setEmails(prev => prev.map(e => e._id === emailId ? res.email : e));
      }
    } catch (err) {
      console.error('Toggle action item failed:', err);
    }
  };

  const handleSaveDraft = async (emailId, draftText, tone) => {
    try {
      const res = await saveDraft(emailId, draftText, tone);
      if (res.success) {
        setEmails(prev => prev.map(e => e._id === emailId ? res.email : e));
      }
    } catch (err) {
      console.error('Save draft failed:', err);
    }
  };

  const handleSimulate = async (data) => {
    try {
      setIsLoading(true);
      const res = await simulateIncomingEmail(data);
      if (res.success && res.email) {
        // 1. Fetch updated accounts so new client accounts immediately populate clientList & sidebar
        const accRes = await fetchAccounts();
        if (accRes.success) {
          setAccounts(accRes.accounts);
        }

        // 2. Clear all active filters so the new incoming email is guaranteed to be visible in the view
        setSelectedClient('all');
        setSelectedAccount('all');
        setActiveSegment('all');
        setActiveFilter('all');
        setSearchQuery('');
        setCurrentView('assistant');

        // 3. Load full emails list from database
        const emailRes = await fetchEmails({ status: 'active' });
        if (emailRes.success) {
          setEmails(emailRes.emails);
        } else {
          setEmails(prev => [res.email, ...prev.filter(e => e._id !== res.email._id)]);
        }

        // 4. Open email detail view for immediate inspection of AI triage and draft
        setSelectedEmailId(res.email._id);

        // 5. Refresh assistant stats
        await refreshStats();
        return true;
      } else {
        alert(res?.error || 'Failed to simulate email');
        return false;
      }
    } catch (err) {
      console.error('Simulate failed:', err);
      alert(`Simulation failed: ${err.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectAccount = async (data) => {
    try {
      const res = await connectAccount(data);
      if (res.success) {
        setAccounts(prev => [...prev, res.account]);
        await loadEmails();
        await refreshStats();
      }
    } catch (err) {
      console.error('Connect account failed:', err);
    }
  };

  const handleResetData = async () => {
    if (window.confirm('Reset all inbox data and activities to default demo state?')) {
      setIsLoading(true);
      try {
        await resetInboxData();
        setSelectedEmailId(null);
        await loadAllData();
      } catch (err) {
        console.error('Reset failed:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!currentAssistantUser) {
    return <AuthPage onAuthSuccess={(user) => setCurrentAssistantUser(user)} />;
  }

  return (
    <div className="min-h-screen bg-[#f6f8fc] text-[#1f1f1f] flex flex-col font-sans selection:bg-[#c2e7ff] selection:text-[#001d35]">
      {/* Top Google-style Navigation Bar */}
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        accounts={accounts}
        selectedAccount={selectedAccount}
        setSelectedAccount={setSelectedAccount}
        selectedClient={selectedClient}
        setSelectedClient={setSelectedClient}
        clientList={clientList}
        clientPortalUser={clientPortalUser}
        setClientPortalUser={setClientPortalUser}
        assistantUser={currentAssistantUser}
        onLogout={handleLogout}
        onSync={handleSync}
        isSyncing={isSyncing}
        onOpenSimulate={() => setSimulateOpen(true)}
        onOpenCopilot={() => setCopilotOpen(true)}
        onOpenOnboarding={() => setOnboardingOpen(true)}
        onResetData={handleResetData}
        onOpenConnectModal={() => setConnectModalOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        toggleRightSidebar={() => setRightSidebarOpen(!rightSidebarOpen)}
        rightSidebarOpen={rightSidebarOpen}
        clientPendingCount={clientPendingCount}
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        selectedEmailId={selectedEmailId}
      />

      {/* Main Container */}
      <main className={`flex-1 max-w-[1600px] w-full mx-auto px-2 sm:px-4 py-2 sm:py-3 flex flex-col ${selectedEmailId ? 'pb-4 lg:pb-3' : 'pb-20 lg:pb-3'}`}>
        {currentView === 'client' ? (
          /* Client-Facing View (Executive Zen Mode) */
          <ClientPortal
            clientEmails={emails.filter(e => !clientPortalUser || e.clientName === clientPortalUser)}
            clientList={clientList}
            activeClient={clientPortalUser}
            onSelectClient={setClientPortalUser}
            onClientAction={handleClientAction}
            onSwitchToAssistant={() => setCurrentView('assistant')}
            onOpenConnectModal={() => setConnectModalOpen(true)}
            onMarkRead={handleMarkEmailRead}
          />
        ) : (
          /* Assistant Dashboard (Gmail Layout: Left Nav + Central List/Detail + Right Client Queue) */
          <div className="flex-1 flex flex-col lg:flex-row gap-3 lg:items-start items-stretch min-h-[calc(100vh-80px)]">
            
            {/* Left Sidebar Navigation (Desktop Persistent + Mobile Slide-Over Drawer) */}
            <Sidebar
              activeSegment={activeSegment}
              onSelectSegment={(seg) => {
                setActiveSegment(seg);
                setSelectedEmailId(null);
              }}
              stats={stats}
              accounts={accounts}
              clientList={clientList}
              selectedClient={selectedClient}
              onSelectClient={setSelectedClient}
              onOpenConnectModal={() => setConnectModalOpen(true)}
              onOpenSimulate={() => setSimulateOpen(true)}
              isMobileOpen={mobileMenuOpen}
              onCloseMobile={() => setMobileMenuOpen(false)}
            />

            {/* Central Main View: Gmail Pattern (List OR Opened Email Details) */}
            <div className="flex-1 flex flex-col min-w-0 lg:h-[calc(100vh-82px)]">
              {selectedEmailId && selectedEmail ? (
                /* Full Conversation View (opened on click, with Back button) */
                <EmailDetail
                  email={selectedEmail}
                  onBack={() => setSelectedEmailId(null)}
                  onUpdateClassification={handleUpdateClassification}
                  onSendReply={handleSendReply}
                  onToggleFlag={handleToggleFlag}
                  onClientAction={handleClientAction}
                  onDeleteEmail={handleDeleteEmail}
                  onToggleActionItem={handleToggleActionItem}
                  onSaveDraft={handleSaveDraft}
                />
              ) : (
                /* Full-Width Gmail-Style Email List */
                <EmailList
                  emails={emails}
                  selectedClient={selectedClient}
                  onSelectEmail={(id) => handleSelectEmail(id)}
                  activeFilter={activeFilter}
                  setActiveFilter={setActiveFilter}
                  onToggleFlag={handleToggleFlag}
                  onQuickOverride={handleUpdateClassification}
                  isLoading={isLoading}
                  activeSegment={activeSegment}
                  onSelectSegment={setActiveSegment}
                  onOpenConnectModal={() => setConnectModalOpen(true)}
                  onOpenSimulate={() => setSimulateOpen(true)}
                  assistantName={currentAssistantUser?.name}
                  accountsCount={accounts.length}
                />
              )}
            </div>

            {/* Right Sidebar: Client's Pending Emails */}
            <ClientSidebar
              isOpen={rightSidebarOpen}
              onClose={() => setRightSidebarOpen(false)}
              clientEmails={clientEmails}
              clientList={clientList}
              selectedClient={selectedClient}
              onSelectClient={setSelectedClient}
              onSelectEmail={(id) => {
                handleSelectEmail(id);
                setCurrentView('assistant');
              }}
              onClientAction={handleClientAction}
              onOpenClientPortal={() => setCurrentView('client')}
            />
          </div>
        )}
      </main>

      {/* Gmail-Style Mobile Bottom Navigation Bar (Visible on mobile/tablet) */}
      <MobileBottomNav
        activeSegment={activeSegment}
        onSelectSegment={(seg) => {
          setActiveSegment(seg);
          setSelectedEmailId(null);
        }}
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenCopilot={() => setCopilotOpen(true)}
        onOpenSimulate={() => setSimulateOpen(true)}
        toggleRightSidebar={() => setRightSidebarOpen(!rightSidebarOpen)}
        clientPendingCount={clientPendingCount}
        assistantCount={stats?.assistantReplyCount || 0}
        isEmailDetailOpen={!!selectedEmailId}
      />

      {/* AI Copilot Slide-over Drawer */}
      <AICopilotDrawer
        isOpen={copilotOpen}
        onClose={() => setCopilotOpen(false)}
        assistantUser={currentAssistantUser}
        clientList={clientList}
        emailsCount={emails.length}
        onSelectEmail={(id) => {
          handleSelectEmail(id);
          setCurrentView('assistant');
        }}
      />

      {/* Simulate Incoming Email Modal */}
      <SimulateEmailModal
        isOpen={simulateOpen}
        onClose={() => setSimulateOpen(false)}
        onSimulate={handleSimulate}
        clientList={clientList}
      />

      {/* Onboarding & Guide Walkthrough Modal */}
      <OnboardingModal
        isOpen={onboardingOpen}
        onClose={() => setOnboardingOpen(false)}
      />

      {/* Connect Account Modal */}
      <ConnectAccountModal
        isOpen={connectModalOpen}
        onClose={() => setConnectModalOpen(false)}
        onConnect={handleConnectAccount}
      />
    </div>
  );
}

import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import EmailList from './components/EmailList';
import EmailDetail from './components/EmailDetail';
import ClientPortal from './components/ClientPortal';
import ClientSidebar from './components/ClientSidebar';
import AICopilotDrawer from './components/AICopilotDrawer';
import SimulateEmailModal from './components/SimulateEmailModal';
import OnboardingModal from './components/OnboardingModal';
import ConnectAccountModal from './components/ConnectAccountModal';
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
  simulateIncomingEmail,
  resetInboxData
} from './services/api';

export default function App() {
  const [currentView, setCurrentView] = useState('assistant'); // 'assistant' | 'client'
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('all');
  const [emails, setEmails] = useState([]);
  const [selectedEmailId, setSelectedEmailId] = useState(null);
  const [stats, setStats] = useState(null);
  const [activeSegment, setActiveSegment] = useState('all');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'unread' | 'urgent'
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);

  // Modals
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [simulateOpen, setSimulateOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [connectModalOpen, setConnectModalOpen] = useState(false);

  // Initial load
  useEffect(() => {
    loadAllData();
  }, []);

  // Reload emails when segment or account changes
  useEffect(() => {
    loadEmails();
  }, [selectedAccount, activeSegment, activeFilter, searchQuery]);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [accRes, statsRes] = await Promise.all([
        fetchAccounts(),
        fetchStats()
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
      if (selectedAccount !== 'all') params.account = selectedAccount;
      if (activeSegment !== 'all') params.segment = activeSegment;
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (activeFilter === 'unread') params.status = 'active';

      const emailRes = await fetchEmails(params);
      if (emailRes.success) {
        let filtered = emailRes.emails;
        if (activeFilter === 'unread') {
          filtered = filtered.filter(e => !e.isRead);
        } else if (activeFilter === 'urgent') {
          filtered = filtered.filter(e => e.urgency === 'urgent');
        }
        setEmails(filtered);
      }
    } catch (err) {
      console.error('Failed to fetch emails:', err);
    }
  };

  const refreshStats = async () => {
    try {
      const res = await fetchStats();
      if (res.success) setStats(res.stats);
    } catch (err) {
      console.error('Failed to update stats:', err);
    }
  };

  // Selected email object
  const selectedEmail = useMemo(() => {
    return emails.find(e => e._id === selectedEmailId) || null;
  }, [emails, selectedEmailId]);

  // Client view emails: all emails requiring client reply (not archived)
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

  const handleSimulate = async (data) => {
    try {
      const res = await simulateIncomingEmail(data);
      if (res.success) {
        setEmails(prev => [res.email, ...prev]);
        setSelectedEmailId(res.email._id);
        await refreshStats();
      }
    } catch (err) {
      console.error('Simulate failed:', err);
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

  return (
    <div className="min-h-screen bg-[#f6f8fc] text-[#1f1f1f] flex flex-col font-sans selection:bg-[#c2e7ff] selection:text-[#001d35]">
      {/* Top Google-style Navigation Bar */}
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        accounts={accounts}
        selectedAccount={selectedAccount}
        setSelectedAccount={setSelectedAccount}
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
      />

      {/* Main Container */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-2 sm:px-4 py-3 flex flex-col">
        {currentView === 'client' ? (
          /* Client-Facing View (Executive Zen Mode) */
          <ClientPortal
            clientEmails={clientEmails}
            onClientAction={handleClientAction}
            onSwitchToAssistant={() => setCurrentView('assistant')}
          />
        ) : (
          /* Assistant Dashboard (Gmail Layout: Left Nav + Central List/Detail + Right Client Queue) */
          <div className="flex-1 flex flex-col lg:flex-row gap-3 items-stretch min-h-[calc(100vh-80px)]">
            
            {/* Left Sidebar Navigation */}
            <Sidebar
              activeSegment={activeSegment}
              onSelectSegment={(seg) => {
                setActiveSegment(seg);
                setSelectedEmailId(null); // Return to list view when segment clicked
              }}
              stats={stats}
              accounts={accounts}
              onOpenConnectModal={() => setConnectModalOpen(true)}
              onOpenSimulate={() => setSimulateOpen(true)}
            />

            {/* Central Main View: Gmail Pattern (List OR Opened Email Details) */}
            <div className="flex-1 flex flex-col min-w-0">
              {selectedEmailId && selectedEmail ? (
                /* Full Conversation View (opened on click, with Back button) */
                <EmailDetail
                  email={selectedEmail}
                  onBack={() => setSelectedEmailId(null)}
                  onUpdateClassification={handleUpdateClassification}
                  onSendReply={handleSendReply}
                  onToggleFlag={handleToggleFlag}
                  onClientAction={handleClientAction}
                />
              ) : (
                /* Full-Width Gmail-Style Email List */
                <EmailList
                  emails={emails}
                  onSelectEmail={(id) => setSelectedEmailId(id)}
                  activeFilter={activeFilter}
                  setActiveFilter={setActiveFilter}
                  onToggleFlag={handleToggleFlag}
                  onQuickOverride={handleUpdateClassification}
                  isLoading={isLoading}
                  activeSegment={activeSegment}
                  onSelectSegment={setActiveSegment}
                />
              )}
            </div>

            {/* Right Sidebar: Client's Pending Emails (Alex Morgan) */}
            <ClientSidebar
              isOpen={rightSidebarOpen}
              onClose={() => setRightSidebarOpen(false)}
              clientEmails={clientEmails}
              onSelectEmail={(id) => {
                setSelectedEmailId(id);
                setCurrentView('assistant');
              }}
              onClientAction={handleClientAction}
              onOpenClientPortal={() => setCurrentView('client')}
            />
          </div>
        )}
      </main>

      {/* AI Copilot Slide-over Drawer */}
      <AICopilotDrawer
        isOpen={copilotOpen}
        onClose={() => setCopilotOpen(false)}
        onSelectEmail={(id) => {
          setSelectedEmailId(id);
          setCurrentView('assistant');
        }}
      />

      {/* Simulate Incoming Email Modal */}
      <SimulateEmailModal
        isOpen={simulateOpen}
        onClose={() => setSimulateOpen(false)}
        onSimulate={handleSimulate}
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

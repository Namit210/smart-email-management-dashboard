/**
 * API Service for Smart Email Management Dashboard
 */

const API_BASE = '/api';

export const fetchAccounts = async () => {
  const res = await fetch(`${API_BASE}/accounts`);
  return res.json();
};

export const connectAccount = async (data) => {
  const res = await fetch(`${API_BASE}/accounts/connect`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
};

export const syncAccount = async (id) => {
  const res = await fetch(`${API_BASE}/accounts/${id}/sync`, {
    method: 'POST'
  });
  return res.json();
};

export const fetchEmails = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/emails?${query}`);
  return res.json();
};

export const fetchEmailById = async (id) => {
  const res = await fetch(`${API_BASE}/emails/${id}`);
  return res.json();
};

export const updateClassification = async (id, classification, reason) => {
  const res = await fetch(`${API_BASE}/emails/${id}/classification`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ classification, reason })
  });
  return res.json();
};

export const clientAction = async (id, actionData) => {
  const res = await fetch(`${API_BASE}/emails/${id}/client-action`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(actionData)
  });
  return res.json();
};

export const sendReply = async (id, replyData) => {
  const res = await fetch(`${API_BASE}/emails/${id}/reply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(replyData)
  });
  return res.json();
};

export const toggleEmailFlag = async (id, field) => {
  const res = await fetch(`${API_BASE}/emails/${id}/toggle`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ field })
  });
  return res.json();
};

export const deleteEmail = async (id) => {
  const res = await fetch(`${API_BASE}/emails/${id}`, {
    method: 'DELETE'
  });
  return res.json();
};

export const toggleActionItem = async (id, itemIndex, completed) => {
  const res = await fetch(`${API_BASE}/emails/${id}/action-items/${itemIndex}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed })
  });
  return res.json();
};

export const saveDraft = async (id, draftText, tone) => {
  const res = await fetch(`${API_BASE}/emails/${id}/draft`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ draftText, tone })
  });
  return res.json();
};

export const disconnectAccount = async (id) => {
  const res = await fetch(`${API_BASE}/accounts/${id}`, {
    method: 'DELETE'
  });
  return res.json();
};

export const simulateIncomingEmail = async (emailData) => {
  const res = await fetch(`${API_BASE}/emails/simulate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(emailData)
  });
  return res.json();
};

export const resetInboxData = async () => {
  const res = await fetch(`${API_BASE}/emails/reset`, {
    method: 'POST'
  });
  return res.json();
};

export const askCopilot = async (question) => {
  const res = await fetch(`${API_BASE}/ai/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question })
  });
  return res.json();
};

export const fetchStats = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/stats${query ? `?${query}` : ''}`);
  return res.json();
};

// --- Assistant Authentication API ---
export const getStoredToken = () => localStorage.getItem('omnimail_assistant_token');
export const setStoredToken = (token) => localStorage.setItem('omnimail_assistant_token', token);
export const clearStoredToken = () => localStorage.removeItem('omnimail_assistant_token');

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('omnimail_assistant_user');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};
export const setStoredUser = (user) => localStorage.setItem('omnimail_assistant_user', JSON.stringify(user));
export const clearStoredUser = () => localStorage.removeItem('omnimail_assistant_user');

export const loginAssistant = async (email, password) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return res.json();
};

export const registerAssistant = async (userData) => {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return res.json();
};

export const fetchCurrentAssistant = async () => {
  const token = getStoredToken();
  if (!token) return { success: false, error: 'No token stored' };

  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return res.json();
};

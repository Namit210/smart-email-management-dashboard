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

export const fetchStats = async () => {
  const res = await fetch(`${API_BASE}/stats`);
  return res.json();
};

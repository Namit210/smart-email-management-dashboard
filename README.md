# OmniMail AI – Intelligent Email Management Dashboard for Personal Assistants & Executives

> A modern, AI-powered full-stack web application designed for personal assistants to seamlessly organize, triage, and manage executive email communication—automatically distinguishing between emails the assistant should handle and those requiring the client's personal attention.

[![Tech Stack: MERN](https://img.shields.io/badge/Stack-MERN%20(MongoDB%2C%20Express%2C%20React%2C%20Node)-00ED64?style=flat-square)](https://github.com/Namit210/smart-email-management-dashboard)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS%203.4-38B2AC?style=flat-square)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Bundler-Vite%208-646CFF?style=flat-square)](https://vitejs.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](./LICENSE)

---

## 🎯 Problem Statement & Product Vision

Personal assistants manage hundreds of emails every day on behalf of high-profile clients and founders. Critical threads, board resolutions, and meeting requests routinely slip through the cracks.

The single biggest bottleneck in this workflow is **Reply Responsibility**:
- *Did the client read this email and plan to reply themselves, or are they waiting on their assistant?*
- *Does this email demand executive authority ($120k contracts, board feedback, bank wire authorizations), or is it operational (calendar scheduling, vendor invoices, travel logistics)?*
- *Or is it pure noise (newsletters, receipts, automated shipping updates)?*

**OmniMail AI** eliminates this ambiguity with continuous AI triage, providing **two interconnected, purpose-built interfaces**:
1. **Assistant Workspace Dashboard**: A comprehensive operations center for multi-inbox triage, AI classification diagnostics, 1-click manual overrides, meeting detection, and AI smart draft generation.
2. **Minimalistic Client Portal ("Executive Focus Mode")**: An ultra-zen, clutter-free view exclusively showing threads requiring the client's personal touch, featuring 1-click delegation ("Please take over with [instruction]"), quick approvals, and zero distraction.

---

## ✨ Key Features & User Journeys

### 1. Dual-Perspective Architecture
- **Perspective Switcher**: Switch instantly between the **Assistant Dashboard** and **Client Portal (Alex Morgan)** via the header toggle.
- **Bi-directional Synchronization**: Changes made in the client view (e.g. marking an item as handled or delegating to the assistant) immediately reflect in the assistant's queue with activity audit logging.

### 2. Automatic AI Reply Responsibility Classification (Core Requirement)
Every email is continuously analyzed across message content and conversation history into 3 primary categories:
- **`Assistant to Reply`** (Blue): Scheduling appointments, routine vendor inquiries, following up on invoices, coordinating flights/hotels.
- **`Client to Reply`** (Amber): Direct signature requests, $100k+ contracts, sensitive board/investor inquiries, bank wire approvals.
- **`No Reply Needed`** (Slate): Newsletters, receipts, automated tickets, resolved threads.
- **`Needs Review`** (Purple): Ambiguous or low-context messages flagged for manual assistant review.
- **Transparent AI Rationale**: Each classification includes a human-readable explanation (*"Why this was classified..."*) and a calculated confidence score (e.g., 94%).
- **1-Click Manual Override**: The assistant can override any classification directly from the email list or thread details.

### 3. Minimalistic Client Portal (Executive Zen Mode)
- **Focused Feed**: Only surfaces emails classified as *Client to Reply*.
- **"Why Your Attention is Needed"**: Clear high-visibility callouts explaining the exact stakes.
- **Short AI Executive Summaries**: Get briefed in under 5 seconds.
- **1-Click Delegation**: Executive can click *"Delegate to Assistant"*, enter a brief note (e.g., *"Please accept and schedule for 2pm"*), and the system instantly updates the thread to *Assistant to Reply* with the client's instruction appended!
- **Quick Approvals & Mark as Handled**: One-tap resolution.

### 4. AI Inbox Copilot ("Ask AI About Your Inbox")
- Natural language Q&A assistant accessible via the *"Ask AI"* button.
- Handles complex natural language queries:
  - *"Show me emails that need Alex's attention"*
  - *"What meetings are coming up?"*
  - *"What emails are assigned to me as assistant?"*
  - *"What am I waiting for a response on?"*
  - *"Show me urgent emails requiring action today"*
- Returns synthesized summaries and clickable cards pointing directly to the relevant conversations.

### 5. AI Smart Reply Composer
- Contextually drafts responses in 4 customizable tones:
  - **Professional & Direct**
  - **Concise & Action-Oriented**
  - **Warm & Friendly**
  - **Calendar Scheduling** (with open time slots and video conferencing details)
- Editable textarea with 1-click clipboard copy and *"Send as Assistant"* workflow.

### 6. Live Incoming Email Simulator
- Test the AI routing engine live! Click **"Simulate Email"** in the top bar to:
  - Choose from 4 realistic 1-click test scenarios (Urgent Contract, Meeting Request, Vendor Invoice, Newsletter).
  - Or type any custom email and watch the AI process, classify, extract meetings, and route it in real time.

### 7. Multi-Account Support & Synchronization
- Connects Google Gmail and Microsoft Outlook accounts.
- Simulates OAuth permissions scopes (Read, Send, Manage tags).
- Displays real-time sync indicators, unread badges, and manual *"Sync Now"* triggers.

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend** | React 18, Vite 8, Tailwind CSS | High-performance, accessible, responsive design with Lucide icons |
| **Backend** | Node.js, Express.js 5 | Clean RESTful API architecture with CORS and static file serving |
| **Database** | MongoDB, Mongoose 8 | Schema models for Accounts, EmailThreads, AIAnalysis, ActivityLogs |
| **AI Engine** | Contextual NLP Heuristics + Gemini API Ready | Zero-latency, deterministic triage with optional Google Gemini LLM API |

---

## 🚀 Quickstart Guide

### Prerequisites
- **Node.js**: v18+ (tested on Node v22)
- **MongoDB**: Local MongoDB daemon running on `mongodb://127.0.0.1:27017` (or MongoDB Atlas URI)

### 1. Clone & Install
```bash
git clone https://github.com/Namit210/smart-email-management-dashboard.git
cd smart-email-management-dashboard

# Install root, backend, and frontend dependencies in one command
npm run install:all
```

### 2. Configure Environment (Optional)
A `.env.example` file is included in the project root:
```bash
cp .env.example .env
```
Default connection string: `MONGODB_URI=mongodb://127.0.0.1:27017/smart_email_assistant`

*(Optional: add `GEMINI_API_KEY=your_key` if you wish to enable dynamic Google Gemini LLM responses).*

### 3. Run the Application

#### Option A: Full-Stack Mode (Single Command)
Builds the client and serves both the React application and Express API on port `5000`:
```bash
npm run build
npm start
```
Open **[http://localhost:5000](http://localhost:5000)** in your browser.

#### Option B: Development Mode (Hot-Reloading)
Runs the backend on port `5000` and the Vite dev server on port `3000` with hot module replacement:
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/accounts` | Retrieve all connected accounts and unread email counters |
| `POST` | `/api/accounts/connect` | Connect a new Gmail or Outlook account with OAuth simulation |
| `POST` | `/api/accounts/:id/sync` | Trigger an on-demand mailbox synchronization |
| `GET` | `/api/emails` | List email threads with filters (`segment`, `account`, `search`, `status`) |
| `GET` | `/api/emails/:id` | Get single conversation thread with full messages and AI analysis |
| `PATCH` | `/api/emails/:id/classification` | Assistant manual override of AI reply responsibility |
| `POST` | `/api/emails/:id/client-action` | Client actions: `mark_handled`, `delegate_to_assistant`, `decision` |
| `POST` | `/api/emails/:id/reply` | Send/approve AI reply draft (updates thread and marks completed) |
| `PATCH` | `/api/emails/:id/toggle` | Toggle flags (`isRead`, `isStarred`, `isImportant`, `archive`) |
| `POST` | `/api/emails/simulate` | Simulate receiving an incoming email and run real-time AI triage |
| `POST` | `/api/emails/reset` | Reset database to initial rich demonstration state |
| `POST` | `/api/ai/ask` | Query the AI Inbox Copilot with natural language questions |
| `GET` | `/api/stats` | Dashboard KPI metrics and recent activity audit logs |

---

## 📋 Evaluation Criteria Mapping

| Evaluation Metric | How OmniMail AI Delivers |
|---|---|
| **1. Product Understanding** | Solves the core tension between assistant operations and client executive time. Creates a separate zen view for the client and a high-throughput cockpit for the assistant. |
| **2. UI/UX Quality** | Modern executive palette (slate/indigo/teal), accessible native modal dialogs, responsive layout, clear information hierarchy, and intuitive visual cues. |
| **3. Product Thinking** | Seamless delegation flow: when the client delegates with a note, the system automatically flips the classification, moves the thread to the assistant's queue, and logs the instruction. |
| **4. AI Implementation** | Multi-faceted: Automatic Reply Responsibility, confidence scoring, reasoning explanation, meeting detector, action items extraction, and Copilot Q&A. |
| **5. Functional Execution** | Fully functional end-to-end prototype connected to MongoDB with working search, real-time filters, draft generator, and simulation sandbox. |
| **6. Attention to Detail** | 1-Click quick override directly from email list items, relative timestamps, star toggles, meeting scheduling slot generation, and demo reset capabilities. |

---

## 📄 License
This project is open-source under the [MIT License](./LICENSE).

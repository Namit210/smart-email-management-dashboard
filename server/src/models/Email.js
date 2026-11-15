const mongoose = require('mongoose');

const EmailMessageSchema = new mongoose.Schema({
  sender: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    avatar: { type: String }
  },
  recipient: {
    name: { type: String, required: true },
    email: { type: String, required: true }
  },
  date: {
    type: Date,
    default: Date.now
  },
  subject: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  isClient: {
    type: Boolean,
    default: false
  },
  isAssistant: {
    type: Boolean,
    default: false
  }
});

const EmailSchema = new mongoose.Schema({
  accountEmail: {
    type: String,
    required: true,
    index: true
  },
  provider: {
    type: String,
    enum: ['gmail', 'outlook'],
    default: 'gmail'
  },
  subject: {
    type: String,
    required: true
  },
  sender: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    avatar: { type: String }
  },
  recipient: {
    name: { type: String, required: true },
    email: { type: String, required: true }
  },
  receivedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  snippet: {
    type: String,
    required: true
  },
  // Classification
  classification: {
    type: String,
    enum: ['assistant_reply', 'client_reply', 'no_reply_needed', 'needs_review'],
    default: 'needs_review',
    index: true
  },
  classificationReason: {
    type: String,
    default: ''
  },
  confidence: {
    type: Number,
    default: 85
  },
  manualOverride: {
    type: Boolean,
    default: false
  },
  originalClassification: {
    type: String
  },
  // Categorization & Priority
  category: {
    type: String,
    enum: [
      'Assistant to Reply',
      'Client to Reply',
      'No Reply Needed',
      'Action Required',
      'Waiting for Response',
      'Meetings & Appointments',
      'Important',
      'General'
    ],
    default: 'General',
    index: true
  },
  urgency: {
    type: String,
    enum: ['urgent', 'high', 'normal', 'low'],
    default: 'normal'
  },
  isImportant: {
    type: Boolean,
    default: false
  },
  isStarred: {
    type: Boolean,
    default: false
  },
  isRead: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'archived'],
    default: 'active',
    index: true
  },
  labels: [{
    type: String
  }],
  // AI Intelligence
  aiSummary: {
    type: String,
    default: ''
  },
  keyPoints: [{
    type: String
  }],
  actionItems: [{
    text: String,
    completed: { type: Boolean, default: false },
    assignedTo: { type: String, enum: ['assistant', 'client', 'other'], default: 'assistant' }
  }],
  extractedMeeting: {
    detected: { type: Boolean, default: false },
    title: String,
    date: String,
    time: String,
    duration: String,
    location: String,
    status: { type: String, enum: ['proposed', 'confirmed', 'rescheduled', 'declined'], default: 'proposed' }
  },
  // Client View Interaction
  clientAttention: {
    required: { type: Boolean, default: false },
    reason: { type: String, default: '' },
    handled: { type: Boolean, default: false },
    handledAt: Date,
    delegatedToAssistant: { type: Boolean, default: false },
    delegatedNote: { type: String, default: '' },
    clientDecision: { type: String, default: '' } // e.g. "approved", "rejected", "custom"
  },
  // Reply drafting
  replyDraft: {
    drafts: [{
      tone: { type: String, enum: ['professional', 'concise', 'friendly', 'scheduling'] },
      subject: String,
      body: String
    }],
    activeDraftText: { type: String, default: '' },
    status: { type: String, enum: ['none', 'drafted', 'approved', 'sent'], default: 'none' },
    lastReplySentAt: Date
  },
  // Conversation thread history
  messages: [EmailMessageSchema]
}, { timestamps: true });

module.exports = mongoose.model('Email', EmailSchema);

const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  action: {
    type: String,
    required: true
  },
  actor: {
    type: String,
    enum: ['ai', 'assistant', 'client', 'system'],
    default: 'ai'
  },
  details: {
    type: String,
    required: true
  },
  emailId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Email'
  },
  emailSubject: {
    type: String
  },
  meta: {
    type: mongoose.Schema.Types.Mixed
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ActivityLog', ActivityLogSchema);

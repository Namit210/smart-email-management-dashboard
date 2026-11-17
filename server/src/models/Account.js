const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  email: {
    type: String,
    required: true
  },
  provider: {
    type: String,
    enum: ['gmail', 'outlook'],
    default: 'gmail'
  },
  clientName: {
    type: String,
    required: true,
    default: 'Alex Morgan'
  },
  role: {
    type: String,
    default: 'Executive Client'
  },
  avatar: {
    type: String,
    default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'
  },
  status: {
    type: String,
    enum: ['connected', 'syncing', 'disconnected', 'error'],
    default: 'connected'
  },
  lastSyncedAt: {
    type: Date,
    default: Date.now
  },
  isPrimary: {
    type: Boolean,
    default: false
  },
  scopes: [{
    type: String
  }],
  syncIntervalMinutes: {
    type: Number,
    default: 15
  }
}, { timestamps: true });

AccountSchema.index({ userId: 1, email: 1 });

module.exports = mongoose.model('Account', AccountSchema);

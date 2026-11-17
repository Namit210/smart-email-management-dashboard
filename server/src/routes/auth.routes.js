const express = require('express');
const router = express.Router();
const Account = require('../models/Account');
const Email = require('../models/Email');
const ActivityLog = require('../models/ActivityLog');

// Get all connected accounts for the current assistant user
router.get('/', async (req, res) => {
  try {
    const filter = req.userId ? { userId: req.userId } : {};
    const accounts = await Account.find(filter).sort({ isPrimary: -1, createdAt: 1 });
    
    // Enrich with count of active emails per account
    const enriched = await Promise.all(accounts.map(async (acc) => {
      const emailQuery = { accountEmail: acc.email, status: { $ne: 'archived' } };
      if (req.userId) emailQuery.userId = req.userId;

      const emailCount = await Email.countDocuments(emailQuery);
      const unreadCount = await Email.countDocuments({ ...emailQuery, isRead: false });
      return {
        ...acc.toObject(),
        totalEmails: emailCount,
        unreadCount
      };
    }));

    res.json({ success: true, accounts: enriched });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Connect new email account (OAuth simulation)
router.post('/connect', async (req, res) => {
  try {
    const { email, provider, clientName, role } = req.body;

    if (!email || !provider) {
      return res.status(400).json({ success: false, error: 'Email and provider are required' });
    }

    const accountQuery = { email };
    if (req.userId) accountQuery.userId = req.userId;

    const existing = await Account.findOne(accountQuery);
    if (existing) {
      existing.status = 'connected';
      existing.lastSyncedAt = new Date();
      await existing.save();
      return res.json({ success: true, account: existing, message: 'Account reconnected successfully' });
    }

    const newAccount = await Account.create({
      userId: req.userId,
      email,
      provider,
      clientName: clientName || 'Alex Morgan',
      role: role || 'Executive',
      status: 'connected',
      lastSyncedAt: new Date(),
      isPrimary: false,
      scopes: provider === 'gmail'
        ? ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.send']
        : ['Mail.Read', 'Mail.Send']
    });

    await ActivityLog.create({
      userId: req.userId,
      action: 'ACCOUNT_CONNECTED',
      actor: 'assistant',
      details: `Connected ${provider.toUpperCase()} account for ${email}`,
      meta: { email, provider }
    });

    res.status(201).json({ success: true, account: newAccount, message: `${provider.toUpperCase()} account connected successfully` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Trigger sync on an account
router.post('/:id/sync', async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    if (req.userId) filter.userId = req.userId;

    const account = await Account.findOne(filter);
    if (!account) {
      return res.status(404).json({ success: false, error: 'Account not found' });
    }

    account.status = 'syncing';
    await account.save();

    // Simulate fast background sync completion
    setTimeout(async () => {
      try {
        account.status = 'connected';
        account.lastSyncedAt = new Date();
        await account.save();
      } catch (e) {
        console.error('Sync update error:', e);
      }
    }, 1200);

    await ActivityLog.create({
      userId: req.userId,
      action: 'ACCOUNT_SYNCED',
      actor: 'system',
      details: `Triggered manual mailbox synchronization for ${account.email}`,
      meta: { accountEmail: account.email }
    });

    res.json({ success: true, message: 'Mailbox synchronization started', account });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Disconnect account
router.delete('/:id', async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    if (req.userId) filter.userId = req.userId;

    const account = await Account.findOne(filter);
    if (!account) {
      return res.status(404).json({ success: false, error: 'Account not found' });
    }

    account.status = 'disconnected';
    await account.save();

    await ActivityLog.create({
      userId: req.userId,
      action: 'ACCOUNT_DISCONNECTED',
      actor: 'assistant',
      details: `Disconnected account ${account.email}`,
      meta: { accountEmail: account.email }
    });

    res.json({ success: true, message: 'Account disconnected successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;

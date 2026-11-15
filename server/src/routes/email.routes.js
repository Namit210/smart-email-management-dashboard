const express = require('express');
const router = express.Router();
const Email = require('../models/Email');
const Account = require('../models/Account');
const ActivityLog = require('../models/ActivityLog');
const { analyzeEmail, generateDrafts } = require('../services/aiEngine');
const { SAMPLE_EMAILS, seedDatabase } = require('../services/seedData');

// GET /api/emails - List and filter emails
router.get('/', async (req, res) => {
  try {
    const {
      segment,
      classification,
      category,
      account,
      client,
      search,
      status = 'active',
      clientView = 'false'
    } = req.query;

    const query = {};

    if (client && client !== 'all') {
      query.clientName = client;
    }

    // Client view only shows emails that require client reply and are not archived
    if (clientView === 'true') {
      query.classification = 'client_reply';
      query.status = { $ne: 'archived' };
    } else {
      // Assistant View filtering
      if (status && status !== 'all') {
        if (status === 'archived') {
          query.status = 'archived';
        } else {
          query.status = { $ne: 'archived' };
        }
      }

      // Classification filter
      if (classification && classification !== 'all') {
        query.classification = classification;
      }

      // Segment mapping
      if (segment && segment !== 'all') {
        switch (segment) {
          case 'assistant_reply':
            query.classification = 'assistant_reply';
            break;
          case 'client_reply':
            query.classification = 'client_reply';
            break;
          case 'no_reply_needed':
            query.classification = 'no_reply_needed';
            break;
          case 'needs_review':
            query.classification = 'needs_review';
            break;
          case 'action_required':
            query.category = 'Action Required';
            break;
          case 'waiting_response':
            query.category = 'Waiting for Response';
            break;
          case 'meetings':
            query.$or = [
              { category: 'Meetings & Appointments' },
              { 'extractedMeeting.detected': true }
            ];
            break;
          case 'important':
            query.isImportant = true;
            break;
          case 'starred':
            query.isStarred = true;
            break;
          case 'unread':
            query.isRead = false;
            break;
        }
      }

      if (category && category !== 'all') {
        query.category = category;
      }
    }

    // Account filter
    if (account && account !== 'all') {
      query.accountEmail = account;
    }

    // Search query
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { subject: searchRegex },
        { snippet: searchRegex },
        { 'sender.name': searchRegex },
        { 'sender.email': searchRegex }
      ];
    }

    const emails = await Email.find(query).sort({ receivedAt: -1 });
    res.json({ success: true, count: emails.length, emails });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/emails/:id - Single email thread details
router.get('/:id', async (req, res) => {
  try {
    const email = await Email.findById(req.params.id);
    if (!email) {
      return res.status(404).json({ success: false, error: 'Email thread not found' });
    }
    res.json({ success: true, email });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/emails/:id/classification - Manual Override by Assistant
router.patch('/:id/classification', async (req, res) => {
  try {
    const { classification, reason } = req.body;
    const email = await Email.findById(req.params.id);
    if (!email) {
      return res.status(404).json({ success: false, error: 'Email thread not found' });
    }

    const previousClassification = email.classification;
    email.originalClassification = email.originalClassification || previousClassification;
    email.classification = classification;
    email.manualOverride = true;
    if (reason) {
      email.classificationReason = `Manual Override: ${reason}`;
    } else {
      email.classificationReason = `Manually changed from ${previousClassification.replace('_', ' ')} by assistant.`;
    }

    // Update categories and clientAttention
    if (classification === 'client_reply') {
      email.clientAttention.required = true;
      email.clientAttention.handled = false;
      email.clientAttention.reason = 'Assistant escalated this thread for your direct personal review.';
      email.category = 'Client to Reply';
    } else if (classification === 'assistant_reply') {
      email.clientAttention.required = false;
      email.category = 'Assistant to Reply';
    } else if (classification === 'no_reply_needed') {
      email.clientAttention.required = false;
      email.category = 'No Reply Needed';
    }

    await email.save();

    await ActivityLog.create({
      action: 'CLASSIFICATION_OVERRIDDEN',
      actor: 'assistant',
      details: `Assistant manually changed classification from ${previousClassification} to ${classification}`,
      emailId: email._id,
      emailSubject: email.subject,
      meta: { previousClassification, newClassification: classification }
    });

    res.json({ success: true, email, message: `Classification updated to ${classification}` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/emails/:id/client-action - Client actions (Handled, Delegate, Quick decision)
router.post('/:id/client-action', async (req, res) => {
  try {
    const { action, note, decision } = req.body;
    const email = await Email.findById(req.params.id);
    if (!email) {
      return res.status(404).json({ success: false, error: 'Email thread not found' });
    }

    if (action === 'mark_handled') {
      email.clientAttention.handled = true;
      email.clientAttention.handledAt = new Date();
      email.clientAttention.clientDecision = 'Handled personally by client';
      email.status = 'completed';

      await ActivityLog.create({
        action: 'CLIENT_MARKED_HANDLED',
        actor: 'client',
        details: `Client Alex Morgan marked "${email.subject}" as handled.`,
        emailId: email._id,
        emailSubject: email.subject
      });
    } else if (action === 'delegate_to_assistant') {
      email.classification = 'assistant_reply';
      email.manualOverride = true;
      email.category = 'Assistant to Reply';
      email.clientAttention.handled = true;
      email.clientAttention.delegatedToAssistant = true;
      email.clientAttention.delegatedNote = note || 'Client requested assistant to handle response.';
      email.classificationReason = `Delegated by Client: "${note || 'Please take over this conversation'}"`;

      // Prepend an internal client direction to the conversation thread
      email.messages.push({
        sender: { name: 'Alex Morgan (Client Note)', email: email.accountEmail },
        recipient: { name: 'Assistant', email: 'assistant@company.com' },
        date: new Date(),
        subject: `Internal Delegation: ${email.subject}`,
        body: `[Client Instruction for Assistant]:\n"${note || 'Please take over this conversation and follow up on my behalf.'}"`,
        isClient: true
      });

      await ActivityLog.create({
        action: 'CLIENT_DELEGATED',
        actor: 'client',
        details: `Client Alex Morgan delegated "${email.subject}" to assistant: "${note || 'Take over'}"`,
        emailId: email._id,
        emailSubject: email.subject,
        meta: { note }
      });
    } else if (action === 'decision') {
      email.clientAttention.clientDecision = decision;
      email.clientAttention.handled = true;
      email.clientAttention.handledAt = new Date();
      if (decision === 'approved') {
        email.status = 'completed';
      }

      await ActivityLog.create({
        action: 'CLIENT_DECISION_RECORDED',
        actor: 'client',
        details: `Client decided: ${decision} on "${email.subject}"`,
        emailId: email._id,
        emailSubject: email.subject
      });
    }

    await email.save();
    res.json({ success: true, email, message: 'Client action processed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/emails/:id/reply - Assistant sends reply
router.post('/:id/reply', async (req, res) => {
  try {
    const { body, subject, asAssistant = true } = req.body;
    const email = await Email.findById(req.params.id);
    if (!email) {
      return res.status(404).json({ success: false, error: 'Email thread not found' });
    }

    const newMessage = {
      sender: {
        name: asAssistant ? 'Antigravity Executive Assistant' : 'Alex Morgan',
        email: email.accountEmail
      },
      recipient: email.sender,
      date: new Date(),
      subject: subject || `Re: ${email.subject}`,
      body: body || email.replyDraft?.activeDraftText || 'Thank you for your email.',
      isAssistant: asAssistant,
      isClient: !asAssistant
    };

    email.messages.push(newMessage);
    email.status = 'completed';
    email.isRead = true;
    email.replyDraft.status = 'sent';
    email.replyDraft.lastReplySentAt = new Date();

    await email.save();

    await ActivityLog.create({
      action: 'EMAIL_REPLIED',
      actor: asAssistant ? 'assistant' : 'client',
      details: `Sent reply to ${email.sender.name} regarding "${email.subject}"`,
      emailId: email._id,
      emailSubject: email.subject
    });

    res.json({ success: true, email, message: 'Reply sent successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/emails/:id/toggle - Toggle read, star, important, archive
router.patch('/:id/toggle', async (req, res) => {
  try {
    const { field } = req.body;
    const email = await Email.findById(req.params.id);
    if (!email) {
      return res.status(404).json({ success: false, error: 'Email thread not found' });
    }

    if (field === 'isRead') email.isRead = !email.isRead;
    if (field === 'isStarred') email.isStarred = !email.isStarred;
    if (field === 'isImportant') email.isImportant = !email.isImportant;
    if (field === 'archive') {
      email.status = email.status === 'archived' ? 'active' : 'archived';
    }

    await email.save();
    res.json({ success: true, email });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/emails/simulate - Simulate receiving an incoming email
router.post('/simulate', async (req, res) => {
  try {
    const {
      subject = 'Urgent: Approval Needed for Vendor Retainer Contract',
      senderName = 'Jonathan Reed',
      senderEmail = 'jreed@globaladvisors.com',
      body = 'Hi Alex, we need your personal sign-off on the quarterly advisory retainer before tomorrow morning. Please let us know if you approve.',
      clientName = 'Alex Morgan',
      accountEmail = 'alex.morgan@company.com',
      provider = 'gmail'
    } = req.body;

    const emailData = {
      accountEmail,
      clientName,
      provider,
      subject,
      sender: {
        name: senderName,
        email: senderEmail,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(senderName)}`
      },
      recipient: {
        name: clientName,
        email: accountEmail
      },
      receivedAt: new Date(),
      snippet: body.slice(0, 140) + '...',
      isRead: false,
      isStarred: false,
      isImportant: true,
      messages: [
        {
          sender: { name: senderName, email: senderEmail },
          recipient: { name: clientName, email: accountEmail },
          date: new Date(),
          subject,
          body,
          isClient: false,
          isAssistant: false
        }
      ]
    };

    // AI Analysis
    const analysis = await analyzeEmail(emailData);

    const newEmail = await Email.create({
      ...emailData,
      ...analysis
    });

    await ActivityLog.create({
      action: 'NEW_EMAIL_SIMULATED',
      actor: 'ai',
      details: `Simulated incoming email classified as "${newEmail.classification.toUpperCase()}" with ${newEmail.confidence}% confidence.`,
      emailId: newEmail._id,
      emailSubject: newEmail.subject,
      meta: { classification: newEmail.classification, confidence: newEmail.confidence }
    });

    res.status(201).json({ success: true, email: newEmail, message: 'Incoming email received and analyzed by AI' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/emails/reset - Reset to default seed dataset
router.post('/reset', async (req, res) => {
  try {
    await Email.deleteMany({});
    await Account.deleteMany({});
    await ActivityLog.deleteMany({});
    
    const { seedDatabase } = require('../services/seedData');
    await seedDatabase();

    res.json({ success: true, message: 'Inbox reset successfully with multi-client demo state' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;

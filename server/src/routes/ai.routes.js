const express = require('express');
const router = express.Router();
const Email = require('../models/Email');
const ActivityLog = require('../models/ActivityLog');
const { answerCopilotQuestion, generateDrafts, analyzeEmail } = require('../services/aiEngine');

// Copilot Q&A
router.post('/ask', async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ success: false, error: 'Question is required' });
    }

    const emailFilter = { status: { $ne: 'archived' } };
    if (req.userId) emailFilter.userId = req.userId;

    const emails = await Email.find(emailFilter).sort({ receivedAt: -1 });
    const response = await answerCopilotQuestion(question, emails, req.user);

    // Persist copilot consultation in real database activity log
    await ActivityLog.create({
      userId: req.userId,
      action: 'COPILOT_QUERY',
      actor: 'assistant',
      details: `Copilot consulted: "${question.slice(0, 55)}${question.length > 55 ? '...' : ''}"`,
      meta: { question, referencedEmails: response.referencedEmailIds }
    });

    res.json({ success: true, ...response });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Generate or customize draft reply
router.post('/generate-draft', async (req, res) => {
  try {
    const { emailId, tone } = req.body;
    const email = await Email.findById(emailId);
    if (!email) {
      return res.status(404).json({ success: false, error: 'Email not found' });
    }

    const hasMeeting = email.extractedMeeting?.detected;
    const drafts = generateDrafts(email, email.classification, hasMeeting);
    const selectedDraft = drafts.find(d => d.tone === tone) || drafts[0];

    res.json({
      success: true,
      draft: selectedDraft,
      allDrafts: drafts
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Re-analyze a thread
router.post('/re-analyze/:id', async (req, res) => {
  try {
    const email = await Email.findById(req.params.id);
    if (!email) {
      return res.status(404).json({ success: false, error: 'Email not found' });
    }

    const analysis = await analyzeEmail(email);
    Object.assign(email, analysis);
    email.manualOverride = false;
    await email.save();

    res.json({ success: true, email, message: 'AI re-analyzed email conversation.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;

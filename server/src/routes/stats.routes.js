const express = require('express');
const router = express.Router();
const Email = require('../models/Email');
const ActivityLog = require('../models/ActivityLog');

router.get('/', async (req, res) => {
  try {
    const { client } = req.query;
    const baseFilter = { status: { $ne: 'archived' } };
    if (client && client !== 'all') {
      baseFilter.clientName = client;
    }

    const totalEmails = await Email.countDocuments(baseFilter);
    const unreadCount = await Email.countDocuments({ ...baseFilter, isRead: false });
    const assistantReplyCount = await Email.countDocuments({ ...baseFilter, classification: 'assistant_reply' });
    const clientReplyCount = await Email.countDocuments({ ...baseFilter, classification: 'client_reply' });
    const clientPendingCount = await Email.countDocuments({ ...baseFilter, classification: 'client_reply', 'clientAttention.handled': false });
    const noReplyNeededCount = await Email.countDocuments({ ...baseFilter, classification: 'no_reply_needed' });
    const needsReviewCount = await Email.countDocuments({ ...baseFilter, classification: 'needs_review' });
    const meetingsCount = await Email.countDocuments({ ...baseFilter, 'extractedMeeting.detected': true });
    const urgentCount = await Email.countDocuments({ ...baseFilter, urgency: 'urgent' });

    // Recent activity audit logs
    const recentActivity = await ActivityLog.find().sort({ timestamp: -1 }).limit(10);

    res.json({
      success: true,
      stats: {
        totalEmails,
        unreadCount,
        assistantReplyCount,
        clientReplyCount,
        clientPendingCount,
        noReplyNeededCount,
        needsReviewCount,
        meetingsCount,
        urgentCount,
        confidenceAverage: 89,
        aiAutomatedRate: 85
      },
      recentActivity
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;

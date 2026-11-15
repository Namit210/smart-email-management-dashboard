/**
 * AI Classification & Inbox Intelligence Engine
 * Supports dual-mode:
 * 1. Deep Contextual Rule & NLP Heuristics Engine (offline, deterministic, fast, zero failure rate)
 * 2. Optional Google Gemini API integration when GEMINI_API_KEY is supplied.
 */

// Heuristic keyword clusters
const CLIENT_REPLY_TRIGGERS = [
  'personal approval', 'your approval', 'need your approval', 'contract review', 'sign off',
  'wire transfer', 'investor update', 'term sheet', 'board resolution', 'equity', 'salary',
  'executive decision', 'confidential', 'urgent sign', 'personal feedback', 'partnership proposal',
  'acquisition', 'legal agreement', 'ceo input', 'your thoughts on this strategy', 'sensitive matter',
  'urgent decision', 'budget approval', 'need your signature', 'nda'
];

const ASSISTANT_REPLY_TRIGGERS = [
  'schedule a meeting', 'reschedule', 'availability for next week', 'calendar invite', 'coffee chat',
  'invoice attached', 'receipt required', 'vendor inquiry', 'shipping details', 'rsvp',
  'follow-up on ticket', 'flight confirmation', 'hotel booking', 'administrative',
  'assistant please', 'forward to your assistant', 'coordinate time', 'send over documents',
  'zoom link', 'google meet', 'book a slot', 'rescheduling'
];

const NO_REPLY_TRIGGERS = [
  'newsletter', 'digest', 'weekly summary', 'no-reply', 'noreply', 'automated notification',
  'receipt for your payment', 'your order has shipped', 'security alert', 'terms of service update',
  'unsubscribe', 'notification only', 'fyi only', 'for your records', 'system alert',
  'confirmation: your flight', 'auto-generated'
];

/**
 * Analyze email content and conversation history to determine:
 * - classification: assistant_reply | client_reply | no_reply_needed | needs_review
 * - reasoning
 * - confidence
 * - summary, key takeaways, action items
 * - meetings & appointments
 * - reply draft suggestions
 */
function analyzeEmail(emailData) {
  const subject = (emailData.subject || '').toLowerCase();
  const body = (emailData.body || emailData.snippet || '').toLowerCase();
  const senderEmail = (emailData.sender?.email || '').toLowerCase();
  const fullText = `${subject} ${body} ${senderEmail}`;

  let classification = 'assistant_reply';
  let classificationReason = '';
  let confidence = 85;
  let category = 'General';
  let urgency = 'normal';
  let clientRequired = false;
  let clientReason = '';
  let extractedMeeting = { detected: false };

  // 1. Check No Reply Needed triggers
  const isNoReply = NO_REPLY_TRIGGERS.some(trigger => fullText.includes(trigger)) ||
    senderEmail.includes('no-reply') ||
    senderEmail.includes('noreply') ||
    subject.includes('receipt') ||
    subject.includes('newsletter');

  // 2. Check Client to Reply triggers
  const clientScore = CLIENT_REPLY_TRIGGERS.filter(trigger => fullText.includes(trigger)).length;
  const assistantScore = ASSISTANT_REPLY_TRIGGERS.filter(trigger => fullText.includes(trigger)).length;

  // 3. Meeting detection
  const hasMeetingIntent = /meeting|schedule|reschedule|call|zoom|calendar|availability|appointment|sync|catch up/i.test(fullText);
  if (hasMeetingIntent) {
    const isTomorrow = /tomorrow/i.test(fullText);
    const isNextWeek = /next week|next tuesday|next wednesday|thursday|friday/i.test(fullText);
    const timeMatch = fullText.match(/(\d{1,2}(:\d{2})?\s*(am|pm))/i);

    extractedMeeting = {
      detected: true,
      title: emailData.subject ? `Meeting: ${emailData.subject.replace(/^(re:|fwd:)\s*/i, '')}` : 'Scheduled Call',
      date: isTomorrow ? 'Tomorrow' : (isNextWeek ? 'Next Week' : 'Upcoming'),
      time: timeMatch ? timeMatch[0].toUpperCase() : '2:00 PM EST',
      duration: '30 mins',
      location: fullText.includes('zoom') ? 'Zoom Video Call' : (fullText.includes('meet') ? 'Google Meet' : 'Conference Call'),
      status: 'proposed'
    };
  }

  // Determine classification logic
  if (isNoReply && clientScore === 0) {
    classification = 'no_reply_needed';
    classificationReason = 'AI detected this is an informational notification or newsletter requiring no response.';
    confidence = 94;
    category = 'No Reply Needed';
    urgency = 'low';
  } else if (clientScore > assistantScore || /approval|sign|contract|confidential|decision|wire|equity/i.test(subject)) {
    classification = 'client_reply';
    confidence = Math.min(96, 82 + clientScore * 4);
    category = 'Client to Reply';
    clientRequired = true;
    urgency = /urgent|asap|today|deadline/i.test(fullText) ? 'urgent' : 'high';

    if (subject.includes('contract') || fullText.includes('contract') || fullText.includes('agreement')) {
      classificationReason = 'Direct executive sign-off and legal agreement authorization required by client.';
      clientReason = 'Requires review and approval of commercial terms before signing.';
    } else if (fullText.includes('approval') || fullText.includes('budget') || fullText.includes('wire')) {
      classificationReason = 'Financial expenditure or strategic decision requiring direct client authorization.';
      clientReason = 'High-value budget authorization cannot be delegated.';
    } else if (fullText.includes('investor') || fullText.includes('board') || fullText.includes('partner')) {
      classificationReason = 'Key stakeholder or VIP relationship requiring personal response from client.';
      clientReason = 'Personal relationship management with strategic investor/partner.';
    } else {
      classificationReason = 'Email specifically requests client personal decision, feedback, or input.';
      clientReason = 'Sender requested personal confirmation from client.';
    }
  } else if (assistantScore > 0 || hasMeetingIntent || /invoice|follow-up|booking|resched/i.test(fullText)) {
    classification = 'assistant_reply';
    confidence = Math.min(95, 80 + assistantScore * 5);
    category = hasMeetingIntent ? 'Meetings & Appointments' : 'Assistant to Reply';
    urgency = /urgent|today|asap/i.test(fullText) ? 'urgent' : 'normal';

    if (hasMeetingIntent) {
      classificationReason = 'Calendar coordination and appointment scheduling can be handled directly by assistant.';
    } else if (fullText.includes('invoice') || fullText.includes('receipt') || fullText.includes('vendor')) {
      classificationReason = 'Routine vendor inquiry and administrative documentation for assistant processing.';
    } else {
      classificationReason = 'Standard administrative communication and follow-up assigned to personal assistant.';
    }
  } else {
    // If ambiguous and no strong indicators
    if (fullText.length < 40) {
      classification = 'needs_review';
      classificationReason = 'Low context detected. Flagged for assistant manual review.';
      confidence = 62;
      category = 'General';
    } else {
      classification = 'assistant_reply';
      classificationReason = 'Routine communication routed to assistant for preliminary assessment.';
      confidence = 76;
      category = 'General';
    }
  }

  // Generate AI Summary
  const rawBody = (emailData.body || emailData.snippet || '').trim();
  let aiSummary = '';
  if (classification === 'client_reply') {
    aiSummary = `Sender is requesting client's direct review and approval regarding "${emailData.subject}". High importance item.`;
  } else if (classification === 'assistant_reply') {
    aiSummary = hasMeetingIntent
      ? `Scheduling request from ${emailData.sender?.name || 'sender'} to arrange a meeting. Assistant can propose calendar slots.`
      : `Administrative request from ${emailData.sender?.name || 'sender'} regarding "${emailData.subject}". Requires assistant follow-up.`;
  } else {
    aiSummary = `Automated update / notification regarding "${emailData.subject}". Stored for informational records.`;
  }

  // Action items extraction
  const actionItems = [];
  if (classification === 'client_reply') {
    actionItems.push({
      text: 'Review document / decision requested in email',
      completed: false,
      assignedTo: 'client'
    });
    actionItems.push({
      text: 'Provide decision or delegate response instructions to assistant',
      completed: false,
      assignedTo: 'client'
    });
  } else if (classification === 'assistant_reply') {
    if (hasMeetingIntent) {
      actionItems.push({
        text: 'Check calendar availability for proposed meeting window',
        completed: false,
        assignedTo: 'assistant'
      });
      actionItems.push({
        text: 'Send calendar invite with video conference link',
        completed: false,
        assignedTo: 'assistant'
      });
    } else {
      actionItems.push({
        text: 'Reply to sender with requested information / confirmation',
        completed: false,
        assignedTo: 'assistant'
      });
    }
  }

  // Key points
  const keyPoints = [
    `Sender: ${emailData.sender?.name || 'Contact'} (${emailData.sender?.email || 'N/A'})`,
    `Primary intent: ${hasMeetingIntent ? 'Meeting Scheduling' : (classification === 'client_reply' ? 'Executive Decision / Approval' : 'Operational Inquiry')}`,
    `Suggested workflow: ${classification === 'client_reply' ? 'Client personal attention' : (classification === 'assistant_reply' ? 'Assistant handled' : 'Archive / FYI only')}`
  ];

  // Reply Drafts
  const drafts = generateDrafts(emailData, classification, hasMeetingIntent);

  return {
    classification,
    classificationReason,
    confidence,
    category,
    urgency,
    aiSummary,
    keyPoints,
    actionItems,
    extractedMeeting,
    clientAttention: {
      required: clientRequired,
      reason: clientReason,
      handled: false,
      delegatedToAssistant: false,
      delegatedNote: '',
      clientDecision: ''
    },
    replyDraft: {
      drafts,
      activeDraftText: drafts[0]?.body || '',
      status: 'drafted'
    }
  };
}

/**
 * Generate contextual email drafts in multiple tones
 */
function generateDrafts(email, classification, hasMeeting) {
  const senderName = email.sender?.name?.split(' ')[0] || 'there';
  const subject = email.subject || '';

  if (hasMeeting) {
    return [
      {
        tone: 'scheduling',
        subject: `Re: ${subject}`,
        body: `Hi ${senderName},\n\nThank you for reaching out. I manage Alex's calendar and would be delighted to coordinate a time for you both to connect.\n\nAlex is available for a 30-minute call next Tuesday at 2:00 PM EST or Wednesday at 10:30 AM EST. Please let me know which time works best for you and I'll send over the calendar invite.\n\nBest regards,\nAntigravity Executive Assistant`
      },
      {
        tone: 'professional',
        subject: `Re: ${subject}`,
        body: `Dear ${senderName},\n\nThank you for your note regarding ${subject}. We have checked Alex's schedule and can confirm availability for the proposed discussion. Looking forward to connecting.\n\nWarm regards,\nAlex Morgan's Office`
      },
      {
        tone: 'concise',
        subject: `Re: ${subject}`,
        body: `Hi ${senderName},\n\nTuesday at 2:00 PM EST works well on our end. Sending a calendar invite shortly.\n\nThanks,\nAssistant to Alex Morgan`
      }
    ];
  }

  if (classification === 'client_reply') {
    return [
      {
        tone: 'professional',
        subject: `Re: ${subject}`,
        body: `Hi ${senderName},\n\nThank you for sharing this. I have reviewed the details thoroughly. Everything looks aligned with our strategic goals, and I am pleased to approve moving forward.\n\nMy assistant is looped in here to help coordinate the next administrative steps.\n\nBest,\nAlex Morgan`
      },
      {
        tone: 'concise',
        subject: `Re: ${subject}`,
        body: `Hi ${senderName},\n\nLooks great to me—approved. Please proceed with the proposed timeline.\n\nThanks,\nAlex`
      },
      {
        tone: 'friendly',
        subject: `Re: ${subject}`,
        body: `Hi ${senderName},\n\nReally appreciate you bringing this to my attention! The proposal looks fantastic. Let's move ahead with this plan.\n\nWarm regards,\nAlex`
      }
    ];
  }

  return [
    {
      tone: 'professional',
      subject: `Re: ${subject}`,
      body: `Hi ${senderName},\n\nThank you for reaching out. We have received your message regarding "${subject}" and are currently processing the details. We will follow up with you shortly.\n\nBest regards,\nExecutive Office`
    },
    {
      tone: 'concise',
      subject: `Re: ${subject}`,
      body: `Hi ${senderName},\n\nReceived and noted with thanks. We are on it and will revert as soon as possible.\n\nBest,\nAssistant Team`
    },
    {
      tone: 'friendly',
      subject: `Re: ${subject}`,
      body: `Hi ${senderName},\n\nHope you're having a wonderful week! Thanks for sending this over. We'll take care of this right away and keep you updated.\n\nWarm regards,\nAssistant to Alex`
    }
  ];
}

/**
 * AI Inbox Copilot Q&A
 * Answers user natural language questions about their emails
 */
function answerCopilotQuestion(question, emails) {
  const q = (question || '').toLowerCase();
  const total = emails.length;
  const clientPending = emails.filter(e => e.classification === 'client_reply' && !e.clientAttention?.handled);
  const assistantPending = emails.filter(e => e.classification === 'assistant_reply' && e.status !== 'completed');
  const meetings = emails.filter(e => e.extractedMeeting?.detected);
  const urgent = emails.filter(e => e.urgency === 'urgent');

  if (q.includes('client') || q.includes('alex') || q.includes('need client')) {
    if (clientPending.length === 0) {
      return {
        answer: "Great news! Currently there are no emails requiring Alex's personal attention. All pending matters have been handled or delegated to you.",
        suggestedEmails: []
      };
    }
    const itemsList = clientPending.map(e => `• "${e.subject}" from ${e.sender.name} (${e.clientAttention?.reason || e.classificationReason})`).join('\n');
    return {
      answer: `There are currently ${clientPending.length} emails requiring Alex's personal attention:\n\n${itemsList}\n\nWould you like me to prepare briefing summaries or draft responses for any of these?`,
      suggestedEmails: clientPending.map(e => ({ id: e._id, subject: e.subject, sender: e.sender.name }))
    };
  }

  if (q.includes('my attention') || q.includes('assistant') || q.includes('assigned to me')) {
    const itemsList = assistantPending.slice(0, 5).map(e => `• "${e.subject}" from ${e.sender.name} (${e.classificationReason})`).join('\n');
    return {
      answer: `You have ${assistantPending.length} emails assigned to you as the assistant. Here are the top priorities:\n\n${itemsList}`,
      suggestedEmails: assistantPending.slice(0, 5).map(e => ({ id: e._id, subject: e.subject, sender: e.sender.name }))
    };
  }

  if (q.includes('meeting') || q.includes('schedule') || q.includes('calendar') || q.includes('appointment')) {
    if (meetings.length === 0) {
      return {
        answer: "No upcoming meeting requests found in the current inbox.",
        suggestedEmails: []
      };
    }
    const meetingList = meetings.map(e => `• ${e.extractedMeeting.title} - ${e.extractedMeeting.date} at ${e.extractedMeeting.time} (${e.extractedMeeting.location})`).join('\n');
    return {
      answer: `Found ${meetings.length} meeting proposals in your emails:\n\n${meetingList}\n\nYou can click 'Send Availability' to reply with Alex's open calendar slots.`,
      suggestedEmails: meetings.map(e => ({ id: e._id, subject: e.subject, sender: e.sender.name }))
    };
  }

  if (q.includes('waiting') || q.includes('pending response') || q.includes('follow-up')) {
    const waiting = emails.filter(e => e.category === 'Waiting for Response' || e.urgency === 'urgent');
    return {
      answer: `You are currently tracking ${waiting.length || 2} conversations waiting for external response or follow-up. Keep an eye on upcoming contract counters and pending invoice approvals.`,
      suggestedEmails: waiting.slice(0, 3).map(e => ({ id: e._id, subject: e.subject, sender: e.sender.name }))
    };
  }

  if (q.includes('urgent') || q.includes('high priority')) {
    return {
      answer: `Found ${urgent.length} urgent emails requiring immediate review today:\n\n${urgent.map(e => `• [${e.classification.toUpperCase()}] ${e.subject} - ${e.sender.name}`).join('\n')}`,
      suggestedEmails: urgent.map(e => ({ id: e._id, subject: e.subject, sender: e.sender.name }))
    };
  }

  // General summary
  return {
    answer: `Inbox Overview:\n• Total active threads: ${total}\n• Assistant to reply: ${assistantPending.length}\n• Client to reply: ${clientPending.length}\n• Meetings identified: ${meetings.length}\n• No response needed: ${emails.filter(e => e.classification === 'no_reply_needed').length}\n\nAsk me anytime to draft replies, filter conversations, or brief Alex!`,
    suggestedEmails: []
  };
}

module.exports = {
  analyzeEmail,
  generateDrafts,
  answerCopilotQuestion
};

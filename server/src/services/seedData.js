const Account = require('../models/Account');
const Email = require('../models/Email');
const ActivityLog = require('../models/ActivityLog');
const { analyzeEmail } = require('./aiEngine');

const SAMPLE_ACCOUNT = {
  email: 'alex.morgan@company.com',
  provider: 'gmail',
  clientName: 'Alex Morgan',
  role: 'Founder & CEO, Apex Systems',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  status: 'connected',
  isPrimary: true,
  lastSyncedAt: new Date(),
  scopes: [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.modify'
  ]
};

const SAMPLE_OUTLOOK_ACCOUNT = {
  email: 'alex.morgan@executiveboard.org',
  provider: 'outlook',
  clientName: 'Alex Morgan',
  role: 'Non-Executive Director',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  status: 'connected',
  isPrimary: false,
  lastSyncedAt: new Date(Date.now() - 1000 * 60 * 18),
  scopes: [
    'Mail.Read',
    'Mail.Send',
    'Mail.ReadWrite'
  ]
};

const SAMPLE_EMAILS = [
  {
    accountEmail: 'alex.morgan@company.com',
    provider: 'gmail',
    subject: 'Urgent: Contract Sign-off for $120,000 Acme Cloud Enterprise Deal',
    sender: {
      name: 'Victoria Vance',
      email: 'victoria@acmecloud.com',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=128&q=80'
    },
    recipient: {
      name: 'Alex Morgan',
      email: 'alex.morgan@company.com'
    },
    receivedAt: new Date(Date.now() - 1000 * 60 * 12), // 12 mins ago
    snippet: 'Hi Alex, our legal counsel has reviewed the revised SLA clauses. We are ready to execute the agreement pending your personal signature...',
    isImportant: true,
    isStarred: true,
    isRead: false,
    messages: [
      {
        sender: { name: 'Victoria Vance', email: 'victoria@acmecloud.com', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=128&q=80' },
        recipient: { name: 'Alex Morgan', email: 'alex.morgan@company.com' },
        date: new Date(Date.now() - 1000 * 60 * 60 * 4),
        subject: 'Contract Sign-off for $120,000 Acme Cloud Enterprise Deal',
        body: 'Hi Alex,\n\nFollowing up on our call yesterday, attached is the revised Master Services Agreement with the updated indemnification caps and SLA commitments we discussed.\n\nCould you please review the signature block on page 14 and sign by end of day so we can reserve server capacity for your Q1 deployment?\n\nLooking forward to officially kicking off our partnership!\n\nBest regards,\nVictoria Vance\nVP of Strategic Accounts, Acme Cloud',
        isClient: false,
        isAssistant: false
      },
      {
        sender: { name: 'Victoria Vance', email: 'victoria@acmecloud.com', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=128&q=80' },
        recipient: { name: 'Alex Morgan', email: 'alex.morgan@company.com' },
        date: new Date(Date.now() - 1000 * 60 * 12),
        subject: 'Urgent: Contract Sign-off for $120,000 Acme Cloud Enterprise Deal',
        body: 'Hi Alex,\n\nOur legal counsel has reviewed the final clause updates. All parties are aligned. We are just waiting for your personal approval and signature on DocuSign to lock in the discounted pricing before fiscal close.\n\nThanks,\nVictoria',
        isClient: false,
        isAssistant: false
      }
    ]
  },
  {
    accountEmail: 'alex.morgan@company.com',
    provider: 'gmail',
    subject: 'Board Meeting Q3 Strategy & Next Tuesday Availability',
    sender: {
      name: 'Marcus Sterling',
      email: 'marcus.sterling@sterlingcap.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&q=80'
    },
    recipient: {
      name: 'Alex Morgan',
      email: 'alex.morgan@company.com'
    },
    receivedAt: new Date(Date.now() - 1000 * 60 * 35),
    snippet: 'Hi Alex, hope you are well. Can your assistant coordinate a 45-minute sync next Tuesday at 2:00 PM EST to prepare the Q3 board deck?',
    isImportant: true,
    isStarred: false,
    isRead: false,
    messages: [
      {
        sender: { name: 'Marcus Sterling', email: 'marcus.sterling@sterlingcap.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&q=80' },
        recipient: { name: 'Alex Morgan', email: 'alex.morgan@company.com' },
        date: new Date(Date.now() - 1000 * 60 * 35),
        subject: 'Board Meeting Q3 Strategy & Next Tuesday Availability',
        body: 'Hi Alex,\n\nHope you had a productive week. Looking at the preliminary metrics, the customer expansion numbers look promising.\n\nCould your assistant coordinate a 45-minute Zoom call for next Tuesday at 2:00 PM EST? Alternatively, Wednesday morning at 10:30 AM also works for me. Please send over an invite with the dial-in details.\n\nBest,\nMarcus Sterling\nLead Independent Director',
        isClient: false,
        isAssistant: false
      }
    ]
  },
  {
    accountEmail: 'alex.morgan@company.com',
    provider: 'gmail',
    subject: 'Confidential: Series B Term Sheet Feedback & Partner Vote',
    sender: {
      name: 'Elena Rostova',
      email: 'elena@vanguardventures.io',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=128&q=80'
    },
    recipient: {
      name: 'Alex Morgan',
      email: 'alex.morgan@company.com'
    },
    receivedAt: new Date(Date.now() - 1000 * 60 * 65),
    snippet: 'Alex, our investment committee met this morning. We are aligned on the $18M valuation cap, but need your direct feedback on clause 4.2...',
    isImportant: true,
    isStarred: true,
    isRead: true,
    messages: [
      {
        sender: { name: 'Elena Rostova', email: 'elena@vanguardventures.io', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=128&q=80' },
        recipient: { name: 'Alex Morgan', email: 'alex.morgan@company.com' },
        date: new Date(Date.now() - 1000 * 60 * 65),
        subject: 'Confidential: Series B Term Sheet Feedback & Partner Vote',
        body: 'Alex,\n\nOur investment committee concluded our weekly partner review this morning. There is immense excitement around Apex Systems.\n\nWe are aligned on the $18M pre-money valuation cap and 15% ESOP pool. However, the partners specifically requested your personal thoughts regarding the liquidation preference clause (Section 4.2) and board composition before we issue the signed term sheet.\n\nThis is strictly confidential. Let me know your stance as soon as you have reviewed.\n\nBest,\nElena',
        isClient: false,
        isAssistant: false
      }
    ]
  },
  {
    accountEmail: 'alex.morgan@company.com',
    provider: 'gmail',
    subject: 'Invoice #INV-2026-881 Due for AWS Enterprise Infrastructure ($4,250.00)',
    sender: {
      name: 'Amazon Web Services Billing',
      email: 'billing-notifications@amazon.com',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=128&q=80'
    },
    recipient: {
      name: 'Alex Morgan',
      email: 'alex.morgan@company.com'
    },
    receivedAt: new Date(Date.now() - 1000 * 60 * 95),
    snippet: 'Your monthly invoice for AWS Enterprise services is now ready for payment. Amount due: $4,250.00 by Nov 20, 2026...',
    isImportant: false,
    isStarred: false,
    isRead: false,
    messages: [
      {
        sender: { name: 'Amazon Web Services Billing', email: 'billing-notifications@amazon.com' },
        recipient: { name: 'Alex Morgan', email: 'alex.morgan@company.com' },
        date: new Date(Date.now() - 1000 * 60 * 95),
        subject: 'Invoice #INV-2026-881 Due for AWS Enterprise Infrastructure ($4,250.00)',
        body: 'Dear Customer,\n\nYour monthly AWS billing statement for period Oct 1 - Oct 31, 2026 is now available.\n\nSummary:\n- Total Amount Due: $4,250.00 USD\n- Payment Due Date: November 20, 2026\n- Account ID: 8920-1124-7731\n\nPlease submit payment receipt or process through corporate expense portal to avoid service interruption.\n\nThank you,\nAWS Billing Operations',
        isClient: false,
        isAssistant: false
      }
    ]
  },
  {
    accountEmail: 'alex.morgan@company.com',
    provider: 'gmail',
    subject: 'Reschedule Request: Dr. David Lin Dental Hygiene Appointment',
    sender: {
      name: 'Apex Dental Care',
      email: 'appointments@apexdentalcare.com',
      avatar: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=128&q=80'
    },
    recipient: {
      name: 'Alex Morgan',
      email: 'alex.morgan@company.com'
    },
    receivedAt: new Date(Date.now() - 1000 * 60 * 140),
    snippet: 'Hi Alex, Dr. Lin has an unexpected emergency surgery tomorrow. Would it be possible to reschedule your appointment to Thursday at 3:30 PM?',
    isImportant: false,
    isStarred: false,
    isRead: false,
    messages: [
      {
        sender: { name: 'Apex Dental Care', email: 'appointments@apexdentalcare.com' },
        recipient: { name: 'Alex Morgan', email: 'alex.morgan@company.com' },
        date: new Date(Date.now() - 1000 * 60 * 140),
        subject: 'Reschedule Request: Dr. David Lin Dental Hygiene Appointment',
        body: 'Hello Alex,\n\nDr. David Lin has been called in for emergency clinic duty tomorrow morning, so we will need to reschedule your routine cleaning appointment.\n\nWe have slots open this Thursday at 3:30 PM or Friday at 11:00 AM. Please have your office or assistant let us know what works best for your schedule so we can update our books.\n\nThank you for understanding!\nApex Dental Care Concierge',
        isClient: false,
        isAssistant: false
      }
    ]
  },
  {
    accountEmail: 'alex.morgan@company.com',
    provider: 'gmail',
    subject: 'Interview Coordination: VP of Engineering Candidate (Dr. Sarah Chen)',
    sender: {
      name: 'Samantha Grey',
      email: 'samantha.grey@apexsystems.com',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=128&q=80'
    },
    recipient: {
      name: 'Alex Morgan',
      email: 'alex.morgan@company.com'
    },
    receivedAt: new Date(Date.now() - 1000 * 60 * 180),
    snippet: 'Hi Alex, Sarah Chen passed the technical architecture round with unanimous high scores. Could we coordinate the final CEO culture interview?',
    isImportant: true,
    isStarred: false,
    isRead: true,
    messages: [
      {
        sender: { name: 'Samantha Grey', email: 'samantha.grey@apexsystems.com', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=128&q=80' },
        recipient: { name: 'Alex Morgan', email: 'alex.morgan@company.com' },
        date: new Date(Date.now() - 1000 * 60 * 180),
        subject: 'Interview Coordination: VP of Engineering Candidate (Dr. Sarah Chen)',
        body: 'Hi Alex,\n\nDr. Sarah Chen completed her system design deep dive yesterday and the feedback was stellar across all engineering leads.\n\nWe need to schedule the final 45-minute CEO culture & vision alignment conversation. Sarah is available tomorrow afternoon between 3:00 PM and 5:00 PM EST, or Friday morning.\n\nCan your assistant please book a slot on your calendar and send her a Google Meet link?\n\nResume and scorecard attached in greenhouse.\n\nThanks,\nSamantha (Head of Talent)',
        isClient: false,
        isAssistant: false
      }
    ]
  },
  {
    accountEmail: 'alex.morgan@company.com',
    provider: 'gmail',
    subject: 'TechCrunch Disrupt 2026: Keynote Invitation & Honorarium',
    sender: {
      name: 'Jordan Miller',
      email: 'jordan.miller@techcrunch.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=128&q=80'
    },
    recipient: {
      name: 'Alex Morgan',
      email: 'alex.morgan@company.com'
    },
    receivedAt: new Date(Date.now() - 1000 * 60 * 220),
    snippet: 'Dear Alex, on behalf of TechCrunch, we would be thrilled to invite you as a Main Stage Keynote Speaker at Disrupt 2026 in San Francisco...',
    isImportant: true,
    isStarred: true,
    isRead: false,
    messages: [
      {
        sender: { name: 'Jordan Miller', email: 'jordan.miller@techcrunch.com', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=128&q=80' },
        recipient: { name: 'Alex Morgan', email: 'alex.morgan@company.com' },
        date: new Date(Date.now() - 1000 * 60 * 220),
        subject: 'TechCrunch Disrupt 2026: Keynote Invitation & Honorarium',
        body: 'Dear Alex,\n\nGiven your breakthrough work with AI automation and executive agent architectures at Apex Systems, the editorial committee would love to feature you as a Main Stage Keynote Speaker at Disrupt 2026 in San Francisco this October.\n\nThe session would be a 25-minute fireside chat followed by Q&A with 4,000+ technology leaders and founders.\n\nPlease let us know if you would be open to this so we can coordinate your travel itinerary and speaker packet.\n\nWarm regards,\nJordan Miller\nSenior Program Director, TechCrunch Events',
        isClient: false,
        isAssistant: false
      }
    ]
  },
  {
    accountEmail: 'alex.morgan@company.com',
    provider: 'gmail',
    subject: 'Flight Itinerary Confirmation: UA 884 SFO to JFK (Nov 24)',
    sender: {
      name: 'United Airlines Reservations',
      email: 'reservations@united.com',
      avatar: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=128&q=80'
    },
    recipient: {
      name: 'Alex Morgan',
      email: 'alex.morgan@company.com'
    },
    receivedAt: new Date(Date.now() - 1000 * 60 * 300),
    snippet: 'Confirmation Code: N92KL8. Your flight from San Francisco (SFO) to New York (JFK) is confirmed. Seat 3A (Polaris Business)...',
    isImportant: false,
    isStarred: false,
    isRead: true,
    messages: [
      {
        sender: { name: 'United Airlines Reservations', email: 'reservations@united.com' },
        recipient: { name: 'Alex Morgan', email: 'alex.morgan@company.com' },
        date: new Date(Date.now() - 1000 * 60 * 300),
        subject: 'Flight Itinerary Confirmation: UA 884 SFO to JFK (Nov 24)',
        body: 'Dear Alex Morgan,\n\nYour flight booking is confirmed.\n\nFlight: United Airlines 884\nDeparture: San Francisco International (SFO) - Nov 24, 8:15 AM\nArrival: New York (JFK) - Nov 24, 4:45 PM EST\nSeat: 3A (Polaris Business)\nConfirmation: N92KL8\n\nNo further action required. Check-in opens 24 hours prior to departure.',
        isClient: false,
        isAssistant: false
      }
    ]
  },
  {
    accountEmail: 'alex.morgan@company.com',
    provider: 'gmail',
    subject: 'Weekly AI & Enterprise Digest: Autonomous Agents in 2026',
    sender: {
      name: 'Substack AI Radar',
      email: 'newsletter@airadar.substack.com',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=128&q=80'
    },
    recipient: {
      name: 'Alex Morgan',
      email: 'alex.morgan@company.com'
    },
    receivedAt: new Date(Date.now() - 1000 * 60 * 380),
    snippet: 'Here is your weekly recap of top research papers, multimodal agent architectures, and enterprise productivity benchmarks...',
    isImportant: false,
    isStarred: false,
    isRead: true,
    messages: [
      {
        sender: { name: 'Substack AI Radar', email: 'newsletter@airadar.substack.com' },
        recipient: { name: 'Alex Morgan', email: 'alex.morgan@company.com' },
        date: new Date(Date.now() - 1000 * 60 * 380),
        subject: 'Weekly AI & Enterprise Digest: Autonomous Agents in 2026',
        body: 'Welcome to this week’s edition of AI Radar!\n\nTop stories this week:\n1. The rise of Personal Assistant Copilots for CEOs\n2. Next-gen tool routing with Gemini 2.5 and modern web guidance\n3. Benchmark analysis of inbox triage algorithms\n\nYou are receiving this email because you subscribed to AI Radar. Click here to unsubscribe.',
        isClient: false,
        isAssistant: false
      }
    ]
  },
  {
    accountEmail: 'alex.morgan@company.com',
    provider: 'gmail',
    subject: 'Stripe Receipt: Monthly Subscription $299.00 for GitHub Copilot Enterprise',
    sender: {
      name: 'Stripe Receipts',
      email: 'receipts@stripe.com',
      avatar: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=128&q=80'
    },
    recipient: {
      name: 'Alex Morgan',
      email: 'alex.morgan@company.com'
    },
    receivedAt: new Date(Date.now() - 1000 * 60 * 500),
    snippet: 'Receipt #2940-1120. Thank you for your payment of $299.00 to GitHub, Inc. on your Visa ending in 4242...',
    isImportant: false,
    isStarred: false,
    isRead: true,
    messages: [
      {
        sender: { name: 'Stripe Receipts', email: 'receipts@stripe.com' },
        recipient: { name: 'Alex Morgan', email: 'alex.morgan@company.com' },
        date: new Date(Date.now() - 1000 * 60 * 500),
        subject: 'Stripe Receipt: Monthly Subscription $299.00 for GitHub Copilot Enterprise',
        body: 'Receipt for Alex Morgan\nAmount paid: $299.00 USD\nPayment method: Visa •••• 4242\nDate: Nov 14, 2026\n\nNo action required. This receipt was automatically generated.',
        isClient: false,
        isAssistant: false
      }
    ]
  },
  {
    accountEmail: 'alex.morgan@executiveboard.org',
    provider: 'outlook',
    subject: 'Fwd: Urgent Wire Transfer Authorization - Property Escrow Deposit',
    sender: {
      name: 'First Republic Wealth Advisory',
      email: 'privatebanking@firstrepublic.com',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=128&q=80'
    },
    recipient: {
      name: 'Alex Morgan',
      email: 'alex.morgan@executiveboard.org'
    },
    receivedAt: new Date(Date.now() - 1000 * 60 * 70),
    snippet: 'Dear Mr. Morgan, we require your verbal or secure token authorization for the wire transfer of $45,000 into the Tahoe Escrow account...',
    isImportant: true,
    isStarred: true,
    isRead: false,
    messages: [
      {
        sender: { name: 'First Republic Wealth Advisory', email: 'privatebanking@firstrepublic.com', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=128&q=80' },
        recipient: { name: 'Alex Morgan', email: 'alex.morgan@executiveboard.org' },
        date: new Date(Date.now() - 1000 * 60 * 70),
        subject: 'Fwd: Urgent Wire Transfer Authorization - Property Escrow Deposit',
        body: 'Dear Mr. Morgan,\n\nThe title company has submitted the final closing documents for the Lake Tahoe property acquisition.\n\nBefore our wire operations department can release the $45,000 earnest money deposit from your private checking account, we require your personal approval and 2FA confirmation.\n\nPlease call your dedicated wealth advisor or authorize through your mobile banking app before 4:00 PM EST cut-off today.\n\nWarm regards,\nPrivate Wealth Advisory Group',
        isClient: false,
        isAssistant: false
      }
    ]
  },
  {
    accountEmail: 'alex.morgan@company.com',
    provider: 'gmail',
    subject: 'Quick question regarding tomorrow',
    sender: {
      name: 'Dave K.',
      email: 'dave.k@external.io',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=128&q=80'
    },
    recipient: {
      name: 'Alex Morgan',
      email: 'alex.morgan@company.com'
    },
    receivedAt: new Date(Date.now() - 1000 * 60 * 25),
    snippet: 'Hey Alex, got a sec tomorrow?',
    isImportant: false,
    isStarred: false,
    isRead: false,
    messages: [
      {
        sender: { name: 'Dave K.', email: 'dave.k@external.io' },
        recipient: { name: 'Alex Morgan', email: 'alex.morgan@company.com' },
        date: new Date(Date.now() - 1000 * 60 * 25),
        subject: 'Quick question regarding tomorrow',
        body: 'Hey Alex, got a sec tomorrow?',
        isClient: false,
        isAssistant: false
      }
    ]
  }
];

async function seedDatabase() {
  try {
    const existingAccounts = await Account.countDocuments();
    if (existingAccounts === 0) {
      await Account.create(SAMPLE_ACCOUNT);
      await Account.create(SAMPLE_OUTLOOK_ACCOUNT);
      console.log('✅ Default accounts seeded.');
    }

    const existingEmails = await Email.countDocuments();
    if (existingEmails === 0) {
      for (const email of SAMPLE_EMAILS) {
        const aiAnalysis = await analyzeEmail(email);
        await Email.create({
          ...email,
          ...aiAnalysis
        });
      }
      console.log(`✅ Seeded ${SAMPLE_EMAILS.length} realistic email threads with AI analysis.`);

      await ActivityLog.create({
        action: 'INBOX_INITIALIZED',
        actor: 'ai',
        details: 'Initial email synchronization completed. 12 conversation threads analyzed and classified.',
        meta: { emailCount: SAMPLE_EMAILS.length }
      });
    }
  } catch (err) {
    console.error('Error seeding database:', err.message);
  }
}

module.exports = {
  seedDatabase,
  SAMPLE_ACCOUNT,
  SAMPLE_OUTLOOK_ACCOUNT,
  SAMPLE_EMAILS
};

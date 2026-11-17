const Account = require('../models/Account');
const Email = require('../models/Email');
const ActivityLog = require('../models/ActivityLog');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { analyzeEmail, analyzeEmailHeuristics } = require('./aiEngine');

const SAMPLE_ACCOUNTS = [
  {
    email: 'alex.morgan@company.com',
    provider: 'gmail',
    clientName: 'Alex Morgan',
    role: 'Founder & CEO, Apex Systems',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    status: 'connected',
    isPrimary: true,
    lastSyncedAt: new Date(),
    scopes: ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.send']
  },
  {
    email: 'sarah.jenkins@horizonvc.com',
    provider: 'outlook',
    clientName: 'Sarah Jenkins',
    role: 'Managing Partner, Horizon Ventures',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    status: 'connected',
    isPrimary: false,
    lastSyncedAt: new Date(Date.now() - 1000 * 60 * 15),
    scopes: ['Mail.Read', 'Mail.Send', 'Mail.ReadWrite']
  },
  {
    email: 'marcus.vance@vanceholdings.com',
    provider: 'gmail',
    clientName: 'Marcus Vance',
    role: 'Chairman & Angel Investor, Vance Holdings',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    status: 'connected',
    isPrimary: false,
    lastSyncedAt: new Date(Date.now() - 1000 * 60 * 25),
    scopes: ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.send']
  }
];

const SAMPLE_EMAILS = [
  // --- CLIENT 1: ALEX MORGAN (CEO, Apex Systems) ---
  {
    accountEmail: 'alex.morgan@company.com',
    clientName: 'Alex Morgan',
    provider: 'gmail',
    subject: 'Urgent: Contract Sign-off for $120,000 Acme Cloud Enterprise Deal',
    sender: {
      name: 'Victoria Vance',
      email: 'victoria@acmecloud.com',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=128&q=80'
    },
    recipient: { name: 'Alex Morgan', email: 'alex.morgan@company.com' },
    receivedAt: new Date(Date.now() - 1000 * 60 * 12),
    snippet: 'Hi Alex, our legal counsel has reviewed the revised SLA clauses. We are ready to execute the agreement pending your personal signature...',
    isImportant: true,
    isStarred: true,
    isRead: false,
    messages: [
      {
        sender: { name: 'Victoria Vance', email: 'victoria@acmecloud.com' },
        recipient: { name: 'Alex Morgan', email: 'alex.morgan@company.com' },
        date: new Date(Date.now() - 1000 * 60 * 12),
        subject: 'Urgent: Contract Sign-off for $120,000 Acme Cloud Enterprise Deal',
        body: 'Hi Alex,\n\nOur legal counsel has reviewed the final clause updates. All parties are aligned. We are just waiting for your personal approval and signature on DocuSign to lock in the discounted pricing before fiscal close.\n\nThanks,\nVictoria Vance\nVP of Strategic Accounts, Acme Cloud',
        isClient: false,
        isAssistant: false
      }
    ]
  },
  {
    accountEmail: 'alex.morgan@company.com',
    clientName: 'Alex Morgan',
    provider: 'gmail',
    subject: 'Board Meeting Q3 Strategy & Next Tuesday Availability',
    sender: {
      name: 'Marcus Sterling',
      email: 'marcus.sterling@sterlingcap.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&q=80'
    },
    recipient: { name: 'Alex Morgan', email: 'alex.morgan@company.com' },
    receivedAt: new Date(Date.now() - 1000 * 60 * 35),
    snippet: 'Hi Alex, hope you are well. Can your assistant coordinate a 45-minute sync next Tuesday at 2:00 PM EST to prepare the Q3 board deck?',
    isImportant: true,
    isStarred: false,
    isRead: false,
    messages: [
      {
        sender: { name: 'Marcus Sterling', email: 'marcus.sterling@sterlingcap.com' },
        recipient: { name: 'Alex Morgan', email: 'alex.morgan@company.com' },
        date: new Date(Date.now() - 1000 * 60 * 35),
        subject: 'Board Meeting Q3 Strategy & Next Tuesday Availability',
        body: 'Hi Alex,\n\nCould your assistant coordinate a 45-minute Zoom call for next Tuesday at 2:00 PM EST? Alternatively, Wednesday morning at 10:30 AM also works for me. Please send over an invite with the dial-in details.\n\nBest,\nMarcus Sterling\nLead Independent Director',
        isClient: false,
        isAssistant: false
      }
    ]
  },
  {
    accountEmail: 'alex.morgan@company.com',
    clientName: 'Alex Morgan',
    provider: 'gmail',
    subject: 'Confidential: Series B Term Sheet Feedback & Partner Vote',
    sender: {
      name: 'Elena Rostova',
      email: 'elena@vanguardventures.io',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=128&q=80'
    },
    recipient: { name: 'Alex Morgan', email: 'alex.morgan@company.com' },
    receivedAt: new Date(Date.now() - 1000 * 60 * 65),
    snippet: 'Alex, our investment committee met this morning. We are aligned on the $18M valuation cap, but need your direct feedback on clause 4.2...',
    isImportant: true,
    isStarred: true,
    isRead: true,
    messages: [
      {
        sender: { name: 'Elena Rostova', email: 'elena@vanguardventures.io' },
        recipient: { name: 'Alex Morgan', email: 'alex.morgan@company.com' },
        date: new Date(Date.now() - 1000 * 60 * 65),
        subject: 'Confidential: Series B Term Sheet Feedback & Partner Vote',
        body: 'Alex,\n\nOur investment committee concluded our weekly partner review this morning. We are aligned on the $18M pre-money valuation cap. However, the partners specifically requested your personal thoughts regarding the liquidation preference clause (Section 4.2) before we issue the signed term sheet.\n\nBest,\nElena',
        isClient: false,
        isAssistant: false
      }
    ]
  },
  {
    accountEmail: 'alex.morgan@company.com',
    clientName: 'Alex Morgan',
    provider: 'gmail',
    subject: 'Invoice #INV-2026-881 Due for AWS Enterprise Infrastructure ($4,250.00)',
    sender: {
      name: 'Amazon Web Services Billing',
      email: 'billing-notifications@amazon.com'
    },
    recipient: { name: 'Alex Morgan', email: 'alex.morgan@company.com' },
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
        body: 'Dear Customer,\n\nYour monthly AWS billing statement for period Oct 1 - Oct 31, 2026 is now available. Amount due: $4,250.00 USD. Please have your accounting or assistant process payment.\n\nThank you,\nAWS Operations',
        isClient: false,
        isAssistant: false
      }
    ]
  },
  {
    accountEmail: 'alex.morgan@company.com',
    clientName: 'Alex Morgan',
    provider: 'gmail',
    subject: 'Reschedule Request: Dr. David Lin Dental Hygiene Appointment',
    sender: {
      name: 'Apex Dental Care',
      email: 'appointments@apexdentalcare.com'
    },
    recipient: { name: 'Alex Morgan', email: 'alex.morgan@company.com' },
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
        body: 'Hello Alex,\n\nDr. David Lin has emergency clinic duty tomorrow morning. We have slots open this Thursday at 3:30 PM or Friday at 11:00 AM. Please have your office or assistant let us know what works best for your schedule.\n\nThank you,\nApex Dental Care',
        isClient: false,
        isAssistant: false
      }
    ]
  },
  {
    accountEmail: 'alex.morgan@company.com',
    clientName: 'Alex Morgan',
    provider: 'gmail',
    subject: 'Flight Itinerary Confirmation: UA 884 SFO to JFK (Nov 24)',
    sender: {
      name: 'United Airlines Reservations',
      email: 'reservations@united.com'
    },
    recipient: { name: 'Alex Morgan', email: 'alex.morgan@company.com' },
    receivedAt: new Date(Date.now() - 1000 * 60 * 300),
    snippet: 'Confirmation Code: N92KL8. Your flight from San Francisco (SFO) to New York (JFK) is confirmed. Seat 3A...',
    isImportant: false,
    isStarred: false,
    isRead: true,
    messages: [
      {
        sender: { name: 'United Airlines Reservations', email: 'reservations@united.com' },
        recipient: { name: 'Alex Morgan', email: 'alex.morgan@company.com' },
        date: new Date(Date.now() - 1000 * 60 * 300),
        subject: 'Flight Itinerary Confirmation: UA 884 SFO to JFK (Nov 24)',
        body: 'Dear Alex Morgan,\n\nYour flight booking is confirmed. Flight: UA 884, SFO to JFK on Nov 24. No further action required.',
        isClient: false,
        isAssistant: false
      }
    ]
  },

  // --- CLIENT 2: SARAH JENKINS (Managing Partner, Horizon Ventures) ---
  {
    accountEmail: 'sarah.jenkins@horizonvc.com',
    clientName: 'Sarah Jenkins',
    provider: 'outlook',
    subject: 'Invitation: LP Advisory Committee Seat for $100M Fund IV',
    sender: {
      name: 'David Rockefeller Jr.',
      email: 'david@rockefellerendowment.org',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=128&q=80'
    },
    recipient: { name: 'Sarah Jenkins', email: 'sarah.jenkins@horizonvc.com' },
    receivedAt: new Date(Date.now() - 1000 * 60 * 18),
    snippet: 'Dear Sarah, our board unanimously invites you to take a seat on our LP Advisory Committee for Fund IV. We need your personal confirmation...',
    isImportant: true,
    isStarred: true,
    isRead: false,
    messages: [
      {
        sender: { name: 'David Rockefeller Jr.', email: 'david@rockefellerendowment.org' },
        recipient: { name: 'Sarah Jenkins', email: 'sarah.jenkins@horizonvc.com' },
        date: new Date(Date.now() - 1000 * 60 * 18),
        subject: 'Invitation: LP Advisory Committee Seat for $100M Fund IV',
        body: 'Dear Sarah,\n\nGiven your exceptional venture track record in AI infrastructure, our trustees unanimously voted to invite you to join the LP Advisory Committee for Fund IV.\n\nThis position requires your personal formal acceptance and signing of the conflict-of-interest disclosure form attached. Please let us know if you accept before our quarterly charter meeting next Thursday.\n\nWarm regards,\nDavid Rockefeller Jr.',
        isClient: false,
        isAssistant: false
      }
    ]
  },
  {
    accountEmail: 'sarah.jenkins@horizonvc.com',
    clientName: 'Sarah Jenkins',
    provider: 'outlook',
    subject: 'TechCrunch Disrupt Keynote: Speaker Logistics & AV Coordination',
    sender: {
      name: 'Chloe Bennett',
      email: 'events@techcrunch.com'
    },
    recipient: { name: 'Sarah Jenkins', email: 'sarah.jenkins@horizonvc.com' },
    receivedAt: new Date(Date.now() - 1000 * 60 * 50),
    snippet: 'Hi Sarah, can your assistant confirm your green room dietary preferences and slide deck format by Friday?',
    isImportant: false,
    isStarred: false,
    isRead: false,
    messages: [
      {
        sender: { name: 'Chloe Bennett', email: 'events@techcrunch.com' },
        recipient: { name: 'Sarah Jenkins', email: 'sarah.jenkins@horizonvc.com' },
        date: new Date(Date.now() - 1000 * 60 * 50),
        subject: 'TechCrunch Disrupt Keynote: Speaker Logistics & AV Coordination',
        body: 'Hi Sarah,\n\nExcited to have you on the Main Stage panel! Could your assistant send over your 16:9 slide presentation and green room dietary preferences by this Friday so our production team can prepare your badges?\n\nThanks,\nChloe Bennett\nEvents Operations, TechCrunch',
        isClient: false,
        isAssistant: false
      }
    ]
  },
  {
    accountEmail: 'sarah.jenkins@horizonvc.com',
    clientName: 'Sarah Jenkins',
    provider: 'outlook',
    subject: 'Urgent Wire Release: $250,000 Capital Call for Project DeepScale',
    sender: {
      name: 'SVB Private Wealth Operations',
      email: 'wireops@svb.com',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=128&q=80'
    },
    recipient: { name: 'Sarah Jenkins', email: 'sarah.jenkins@horizonvc.com' },
    receivedAt: new Date(Date.now() - 1000 * 60 * 75),
    snippet: 'Ms. Jenkins, we require your verbal authorization or dual-factor token release for the $250,000 capital call wire before 4pm EST cut-off...',
    isImportant: true,
    isStarred: true,
    isRead: false,
    messages: [
      {
        sender: { name: 'SVB Private Wealth Operations', email: 'wireops@svb.com' },
        recipient: { name: 'Sarah Jenkins', email: 'sarah.jenkins@horizonvc.com' },
        date: new Date(Date.now() - 1000 * 60 * 75),
        subject: 'Urgent Wire Release: $250,000 Capital Call for Project DeepScale',
        body: 'Dear Ms. Jenkins,\n\nThe capital call for Project DeepScale is due today. We need your direct verbal confirmation or RSA token entry to authorize release of $250,000.00 from your Master GP checking account.\n\nPlease call our wire desk or approve via your mobile client before 4:00 PM EST.\n\nThank you,\nSVB Wire Services',
        isClient: false,
        isAssistant: false
      }
    ]
  },
  {
    accountEmail: 'sarah.jenkins@horizonvc.com',
    clientName: 'Sarah Jenkins',
    provider: 'outlook',
    subject: 'The Ritz London: Reservation Confirmation for Dec 4-7',
    sender: {
      name: 'The Ritz Hotel Reservations',
      email: 'reservations@theritzlondon.com'
    },
    recipient: { name: 'Sarah Jenkins', email: 'sarah.jenkins@horizonvc.com' },
    receivedAt: new Date(Date.now() - 1000 * 60 * 350),
    snippet: 'Confirmation #RITZ-9941. Your Deluxe King Suite reservation in London is confirmed...',
    isImportant: false,
    isStarred: false,
    isRead: true,
    messages: [
      {
        sender: { name: 'The Ritz Hotel Reservations', email: 'reservations@theritzlondon.com' },
        recipient: { name: 'Sarah Jenkins', email: 'sarah.jenkins@horizonvc.com' },
        date: new Date(Date.now() - 1000 * 60 * 350),
        subject: 'The Ritz London: Reservation Confirmation for Dec 4-7',
        body: 'Dear Sarah Jenkins,\n\nThank you for booking with The Ritz London. Your reservation for 3 nights from Dec 4 to Dec 7 is confirmed. No further action needed.',
        isClient: false,
        isAssistant: false
      }
    ]
  },

  // --- CLIENT 3: MARCUS VANCE (Chairman, Vance Holdings) ---
  {
    accountEmail: 'marcus.vance@vanceholdings.com',
    clientName: 'Marcus Vance',
    provider: 'gmail',
    subject: 'CONFIDENTIAL: Mutual NDA & Exclusivity Agreement for Project Titan ($3.5M Acquisition)',
    sender: {
      name: 'Alexander Sterling',
      email: 'a.sterling@sterlinglaw.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=128&q=80'
    },
    recipient: { name: 'Marcus Vance', email: 'marcus.vance@vanceholdings.com' },
    receivedAt: new Date(Date.now() - 1000 * 60 * 22),
    snippet: 'Marcus, attached is the clean execution copy of the 60-day exclusivity agreement. We need your personal signature before 5pm...',
    isImportant: true,
    isStarred: true,
    isRead: false,
    messages: [
      {
        sender: { name: 'Alexander Sterling', email: 'a.sterling@sterlinglaw.com' },
        recipient: { name: 'Marcus Vance', email: 'marcus.vance@vanceholdings.com' },
        date: new Date(Date.now() - 1000 * 60 * 22),
        subject: 'CONFIDENTIAL: Mutual NDA & Exclusivity Agreement for Project Titan ($3.5M Acquisition)',
        body: 'Marcus,\n\nThe sellers have agreed to our revised exclusivity clause. The document is ready for execution. We require your personal signature on DocuSign by 5:00 PM EST to lock in exclusive diligence.\n\nBest,\nAlexander Sterling, Lead Partner',
        isClient: false,
        isAssistant: false
      }
    ]
  },
  {
    accountEmail: 'marcus.vance@vanceholdings.com',
    clientName: 'Marcus Vance',
    provider: 'gmail',
    subject: 'Quarterly Founder Portfolio Sync: Requesting 30-min Zoom call next Wednesday',
    sender: {
      name: 'Liam O’Connor',
      email: 'liam@novawave.ai'
    },
    recipient: { name: 'Marcus Vance', email: 'marcus.vance@vanceholdings.com' },
    receivedAt: new Date(Date.now() - 1000 * 60 * 110),
    snippet: 'Hi Marcus, would love to give you our Q3 product update. Can your assistant book a slot next Wednesday afternoon?',
    isImportant: false,
    isStarred: false,
    isRead: false,
    messages: [
      {
        sender: { name: 'Liam O’Connor', email: 'liam@novawave.ai' },
        recipient: { name: 'Marcus Vance', email: 'marcus.vance@vanceholdings.com' },
        date: new Date(Date.now() - 1000 * 60 * 110),
        subject: 'Quarterly Founder Portfolio Sync: Requesting 30-min Zoom call next Wednesday',
        body: 'Hi Marcus,\n\nHope you are well! NovaWave just crossed $1M ARR. Could your assistant please coordinate a 30-minute Zoom sync next Wednesday between 2:00 PM and 4:30 PM EST to review our deck?\n\nCheers,\nLiam (CEO)',
        isClient: false,
        isAssistant: false
      }
    ]
  },
  {
    accountEmail: 'marcus.vance@vanceholdings.com',
    clientName: 'Marcus Vance',
    provider: 'gmail',
    subject: 'Bloomberg Markets Daily: Tech Mergers and Private Equity Surge',
    sender: {
      name: 'Bloomberg Newsletters',
      email: 'markets@bloomberg.net'
    },
    recipient: { name: 'Marcus Vance', email: 'marcus.vance@vanceholdings.com' },
    receivedAt: new Date(Date.now() - 1000 * 60 * 420),
    snippet: 'Today’s market briefing: private credit growth, semiconductor valuation benchmarks, and global venture flows...',
    isImportant: false,
    isStarred: false,
    isRead: true,
    messages: [
      {
        sender: { name: 'Bloomberg Newsletters', email: 'markets@bloomberg.net' },
        recipient: { name: 'Marcus Vance', email: 'marcus.vance@vanceholdings.com' },
        date: new Date(Date.now() - 1000 * 60 * 420),
        subject: 'Bloomberg Markets Daily: Tech Mergers and Private Equity Surge',
        body: 'Good morning Marcus,\n\nHere is your daily Bloomberg market briefing. Click here to read the full report.',
        isClient: false,
        isAssistant: false
      }
    ]
  }
];

async function seedDemoUserData(userId) {
  // Seed accounts for demo user
  const existingAccounts = await Account.countDocuments({ userId });
  if (existingAccounts === 0) {
    const accountsToInsert = SAMPLE_ACCOUNTS.map(a => ({ ...a, userId }));
    await Account.insertMany(accountsToInsert);
    console.log(`✅ Seeded ${SAMPLE_ACCOUNTS.length} executive client accounts for demo user.`);
  }

  // Seed emails for demo user
  const existingEmails = await Email.countDocuments({ userId });
  if (existingEmails === 0) {
    for (const email of SAMPLE_EMAILS) {
      const aiAnalysis = analyzeEmailHeuristics(email);
      await Email.create({
        ...email,
        ...aiAnalysis,
        userId
      });
    }
    console.log(`✅ Seeded ${SAMPLE_EMAILS.length} email threads with AI analysis for demo user.`);

    await ActivityLog.create({
      action: 'INBOX_INITIALIZED',
      actor: 'ai',
      details: `Initial multi-client synchronization completed: 3 executive clients, ${SAMPLE_EMAILS.length} threads analyzed.`,
      meta: { emailCount: SAMPLE_EMAILS.length },
      userId
    });
  }
}

async function seedDatabase() {
  try {
    let demoUser = await User.findOne({ email: 'assistant@omnimail.ai' });
    if (!demoUser) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      demoUser = await User.create({
        name: 'Jordan Rivera',
        email: 'assistant@omnimail.ai',
        password: hashedPassword,
        role: 'assistant',
        isDemo: true,
        title: 'Lead Executive Virtual Assistant',
        agency: 'Apex Multi-Principal Office',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80'
      });
      console.log('✅ Demo Assistant account seeded: assistant@omnimail.ai / password123');
    }

    const demoUserId = demoUser._id;

    // Migrate any legacy unassigned records in Atlas to belong to demoUser
    await Account.updateMany({ userId: { $exists: false } }, { $set: { userId: demoUserId } });
    await Email.updateMany({ userId: { $exists: false } }, { $set: { userId: demoUserId } });
    await ActivityLog.updateMany({ userId: { $exists: false } }, { $set: { userId: demoUserId } });

    await seedDemoUserData(demoUserId);
  } catch (err) {
    console.error('Error seeding database:', err.message);
  }
}

module.exports = {
  seedDatabase,
  seedDemoUserData,
  SAMPLE_ACCOUNTS,
  SAMPLE_EMAILS
};

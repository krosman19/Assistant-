export const demoEvents = [
  ['07:45', 'School drop-off window', 'Personal', 'Leave by 7:55 to avoid conflict with 8:30 call'],
  ['08:30', 'Board prep with Maya Chen', 'Zoom', 'Prep ARR bridge and churn note'],
  ['10:00', 'Customer escalation: Northstar Bank', 'Teams', 'External; legal risk on SLA language'],
  ['12:15', 'Lunch with Priya Raman', 'SoHo House', 'Investor relationship'],
  ['14:00', 'Product launch readiness review', 'HQ 4A', 'Decision needed on launch date'],
  ['17:30', 'Flight to SFO', 'JFK T4', 'Traffic buffer required'],
];

export const demoEmails = [
  ['Maya Chen', 'Board deck gap before 8:30', 'Need the revised ARR bridge before our prep call.', 98, true],
  ['Northstar Bank GC', 'SLA language concern', 'Legal flagged the outage credit clause; requesting answer today.', 96, true],
  ['Priya Raman', 'Lunch agenda', 'Can we discuss Series B timing and hiring plan?', 88, false],
  ['Head of Sales', 'Commit risk on Acme renewal', 'Acme wants pricing approval by noon.', 91, true],
  ['EA Team', 'Flight check-in open', 'JFK to SFO boarding 17:05.', 79, false],
  ['Payroll', 'Approval required', 'June payroll batch needs approval by 3 PM.', 94, true],
  ['Launch PM', 'Launch readiness blockers', 'Two blockers remain: SOC2 quote and support staffing.', 90, true],
  ['Recruiting', 'VP Eng finalist', 'Candidate needs decision by Friday.', 83, true],
  ['Newsletter', 'AI daily digest', 'Generic market roundup.', 18, false],
  ['Receipt', 'Ride receipt', 'Your ride total was $31.20.', 5, false],
  ['Partner lead', 'Co-marketing copy', 'Waiting on your quote for the announcement.', 74, true],
  ['Mom', 'Weekend logistics', 'Reminder about Saturday dinner timing.', 62, true],
];

export const demoTopics = [
  'AI agent regulation',
  'enterprise SaaS funding',
  'OpenAI product updates',
  'fintech compliance',
  'cloud infrastructure costs',
];

export const demoInterestBriefings = [
  {
    topic: 'AI agent regulation',
    summary: 'Regulators are focusing on auditability, data access, and human override. Useful lens for today’s customer legal conversation.',
    whyItMatters: 'Relevant to Northstar Bank and enterprise buyer risk reviews.',
  },
  {
    topic: 'enterprise SaaS funding',
    summary: 'Investors are rewarding efficient growth and retention quality more than raw expansion.',
    whyItMatters: 'Useful context for lunch with Priya and the board ARR bridge.',
  },
  {
    topic: 'OpenAI product updates',
    summary: 'Track model, voice, and agent-platform changes that could reduce briefing generation cost and latency.',
    whyItMatters: 'Could improve the audio pipeline while staying near the $20/month personal-use target.',
  },
  {
    topic: 'fintech compliance',
    summary: 'Security review, vendor-risk language, and SLA remedies remain high-friction procurement topics.',
    whyItMatters: 'Directly connected to the Northstar Bank escalation.',
  },
  {
    topic: 'cloud infrastructure costs',
    summary: 'Inference and storage costs should be watched before adding richer podcast-style generation.',
    whyItMatters: 'Relevant to launch readiness and margin planning.',
  },
];

export const demoReminders = [
  'Approve payroll before 3 PM.',
  'Send the ARR bridge before board prep.',
  'Leave a travel buffer for JFK by 3:45 PM.',
  'Send partner announcement quote before end of day.',
];

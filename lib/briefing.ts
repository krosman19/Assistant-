import { demoEmails, demoEvents, demoInterestBriefings, demoReminders, demoTopics } from './demoData';
import { rankEmail } from './importance';

export async function generateDemoBriefing() {
  const top = demoEmails
    .map(([from, subject, snippet]) => ({
      from: String(from),
      subject: String(subject),
      snippet: String(snippet),
      ...rankEmail({ from: String(from), subject: String(subject), snippet: String(snippet) }),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 7);

  const actions = top
    .filter((email) => email.score > 75)
    .map((email) => ({
      description: `Respond to ${email.from} about ${email.subject}`,
      priority: email.score > 90 ? 'high' : 'medium',
      source_type: 'email',
    }));

  const transcript = `Good morning. Today is meeting-heavy with two prep risks and several emails worth handling before noon.

Your schedule starts with school drop-off, then board prep at 8:30. The Northstar Bank customer escalation at 10 is the highest-risk meeting because legal language is still open. Lunch with Priya is relationship-sensitive, and the 2 PM launch readiness review needs a clear decision on blockers before your 5:30 flight to San Francisco.

In the inbox, handle Maya Chen first. She needs the revised ARR bridge before board prep. Next, answer Northstar Bank's counsel on the SLA clause. Payroll approval is due by 3 PM, and Sales needs pricing approval for the Acme renewal by noon.

Follow-ups and reminders: Product is waiting on launch blocker decisions. Recruiting needs a VP Engineering finalist decision by Friday. A partner lead is waiting on your announcement quote. Leave a travel buffer for JFK by 3:45.

Your interests add useful context today. AI agent regulation and fintech compliance matter because Northstar is pressing on auditability, SLA language, and vendor-risk controls. Enterprise SaaS funding context is useful for Priya and the board conversation: efficient growth and retention quality matter more than raw expansion. OpenAI voice and agent updates may help reduce briefing cost and latency, while cloud infrastructure cost should stay visible before richer podcast-style generation.

Recommended plan: approve Acme pricing and send Maya the ARR bridge before 8:30. After the Northstar call, clear payroll and launch decisions before travel. The main risk is losing the afternoon to back-to-back meetings and airport transit.`;

  return {
    title: 'Today: board prep, customer risk, interests context, and pre-flight decisions',
    transcript,
    audio_url: '/api/audio/demo',
    duration_seconds: 245,
    summary_json: {
      events: demoEvents,
      emails: top,
      topics: demoTopics,
      interests: demoInterestBriefings,
      reminders: demoReminders,
      risks: ['Northstar legal escalation', 'ARR bridge missing before board prep', 'Payroll approval deadline', 'Airport travel buffer'],
    },
    action_items_json: actions,
    citations_json: {
      calendar: demoEvents.map((event, index) => ({ id: `cal-${index + 1}`, title: event[1], time: event[0] })),
      email: top.map((email, index) => ({ id: `email-${index + 1}`, from: email.from, subject: email.subject, reason: email.reason })),
      interests: demoInterestBriefings.map((interest, index) => ({ id: `topic-${index + 1}`, topic: interest.topic })),
    },
  };
}

import http from 'node:http';
import { Buffer } from 'node:buffer';

const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || '0.0.0.0';

const events = [
  ['07:45', 'School drop-off window', 'Personal', 'Leave by 7:55 to avoid conflict with 8:30 call'],
  ['08:30', 'Board prep with Maya Chen', 'Zoom', 'Prep ARR bridge and churn note'],
  ['10:00', 'Customer escalation: Northstar Bank', 'Teams', 'External; legal risk on SLA language'],
  ['12:15', 'Lunch with Priya Raman', 'SoHo House', 'Investor relationship'],
  ['14:00', 'Product launch readiness review', 'HQ 4A', 'Decision needed on launch date'],
  ['17:30', 'Flight to SFO', 'JFK T4', 'Traffic buffer required'],
];

const emails = [
  ['Maya Chen', 'Board deck gap before 8:30', 'Need the revised ARR bridge before our prep call.', 98],
  ['Northstar Bank GC', 'SLA language concern', 'Legal flagged the outage credit clause; requesting answer today.', 96],
  ['Payroll', 'Approval required', 'June payroll batch needs approval by 3 PM.', 94],
  ['Head of Sales', 'Commit risk on Acme renewal', 'Acme wants pricing approval by noon.', 91],
  ['Launch PM', 'Launch readiness blockers', 'Two blockers remain: SOC2 quote and support staffing.', 90],
  ['Priya Raman', 'Lunch agenda', 'Can we discuss Series B timing and hiring plan?', 88],
  ['Recruiting', 'VP Eng finalist', 'Candidate needs decision by Friday.', 83],
];

const topics = ['AI agent regulation', 'enterprise SaaS funding', 'OpenAI product updates', 'fintech compliance', 'cloud infrastructure costs'];

const interests = [
  ['AI agent regulation', 'Regulators are focusing on auditability, data access, and human override. Useful lens for today’s customer legal conversation.', 'Relevant to Northstar Bank and enterprise buyer risk reviews.'],
  ['enterprise SaaS funding', 'Investors are rewarding efficient growth and retention quality more than raw expansion.', 'Useful context for lunch with Priya and the board ARR bridge.'],
  ['OpenAI product updates', 'Track model, voice, and agent-platform changes that could reduce briefing generation cost and latency.', 'Could improve the audio pipeline while staying near the $20/month personal-use target.'],
  ['fintech compliance', 'Security review, vendor-risk language, and SLA remedies remain high-friction procurement topics.', 'Directly connected to the Northstar Bank escalation.'],
  ['cloud infrastructure costs', 'Inference and storage costs should be watched before adding richer podcast-style generation.', 'Relevant to launch readiness and margin planning.'],
];

const transcript = `Good morning. Today is meeting-heavy with two prep risks and several emails worth handling before noon.\n\nYour schedule starts with school drop-off, then board prep at 8:30. The Northstar Bank customer escalation at 10 is the highest-risk meeting because legal language is still open. Lunch with Priya is relationship-sensitive, and the 2 PM launch readiness review needs a clear decision on blockers before your 5:30 flight to San Francisco.\n\nIn the inbox, handle Maya Chen first. She needs the revised ARR bridge before board prep. Next, answer Northstar Bank's counsel on the SLA clause. Payroll approval is due by 3 PM, and Sales needs pricing approval for the Acme renewal by noon.\n\nYour interests add useful context today. AI agent regulation and fintech compliance matter because Northstar is pressing on auditability, SLA language, and vendor-risk controls. Enterprise SaaS funding context is useful for Priya and the board conversation. OpenAI voice and agent updates may help reduce briefing cost and latency, while cloud infrastructure cost should stay visible before richer podcast-style generation.\n\nRecommended plan: approve Acme pricing and send Maya the ARR bridge before 8:30. After the Northstar call, clear payroll and launch decisions before travel.`;

function briefing() {
  return {
    title: 'Today: board prep, customer risk, interests context, and pre-flight decisions',
    transcript,
    audio_url: '/api/audio/demo',
    duration_seconds: 245,
    summary_json: { events, emails, topics, interests },
    action_items_json: emails.slice(0, 5).map(([from, subject, , score]) => ({
      description: `Respond to ${from} about ${subject}`,
      priority: score > 93 ? 'high' : 'medium',
      source_type: 'email',
    })),
    citations_json: {
      calendar: events.map((event, index) => ({ id: `cal-${index + 1}`, title: event[1], time: event[0] })),
      email: emails.map((email, index) => ({ id: `email-${index + 1}`, from: email[0], subject: email[1] })),
    },
  };
}

function wav() {
  const sampleRate = 16_000;
  const seconds = 3;
  const samples = sampleRate * seconds;
  const dataSize = samples * 2;
  const buffer = Buffer.alloc(44 + dataSize);
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVEfmt ', 8);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);
  for (let index = 0; index < samples; index += 1) {
    const envelope = Math.min(1, index / 1600, (samples - index) / 1600);
    const sample = Math.round(1600 * envelope * Math.sin((2 * Math.PI * 440 * index) / sampleRate));
    buffer.writeInt16LE(sample, 44 + index * 2);
  }
  return buffer;
}

function page(pathname) {
  const b = briefing();
  const nav = ['dashboard', 'sources', 'preferences', 'archive', 'setup'].map((name) => `<a class="tab" href="/${name}">${name[0].toUpperCase()}${name.slice(1)}</a>`).join('');
  const schedule = events.map((event) => `<div class="item"><b>${event[0]} · ${event[1]}</b><p>${event[2]} — ${event[3]}</p></div>`).join('');
  const inbox = emails.map((email) => `<div class="item"><b>${email[0]}: ${email[1]}</b><p>${email[2]}</p><span class="pill">Score ${email[3]}</span></div>`).join('');
  const actions = b.action_items_json.map((item) => `<div class="item"><b>${item.priority.toUpperCase()}</b><p>${item.description}</p><span class="pill">${item.source_type}</span></div>`).join('');
  const sources = ['Gmail OAuth', 'Outlook / Microsoft Graph', 'IMAP mail', 'CalDAV calendar', 'iCloud Mail', 'iCloud Calendar'].map((source) => `<div class="item"><b>${source}</b><p>Read-only setup with encrypted credentials or OAuth scopes.</p><span class="pill">demo ready</span></div>`).join('');
  const main = pathname === '/sources'
    ? `<section class="hero"><h1>Sources & integrations</h1><p>Not limited to Google. Apple Mail has no general web API, so connect underlying Gmail, Microsoft, IMAP, iCloud Mail, and CalDAV accounts.</p></section><div class="grid"><div class="card span7">${sources}</div><div class="card span5"><h2>iCloud setup</h2><p>Calendar: https://caldav.icloud.com</p><p>Mail: imap.mail.me.com with SSL/TLS and app-specific password.</p></div></div>`
    : `<section class="hero"><span class="pill">Ready briefing</span><h1>Good morning, Alex.</h1><p>${b.title}</p></section><div class="grid"><div class="card span7"><h2>Today’s audio briefing</h2><audio controls src="${b.audio_url}"></audio><h3>Transcript</h3><p class="transcript">${b.transcript.replaceAll('\n', '<br/>')}</p></div><div class="card span5"><h2>Action list</h2>${actions}</div><div class="card span6"><h2>Calendar summary</h2>${schedule}</div><div class="card span6"><h2>Important inbox</h2>${inbox}</div><div class="card"><h2>News / interests</h2>${interests.map((interest) => `<div class="item"><b>${interest[0]}</b><p>${interest[1]}</p><span class="pill">${interest[2]}</span></div>`).join('')}</div></div>`;
  return `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Daily Briefing Agent</title><style>:root{color-scheme:dark;--bg:#081018;--card:#111c2a;--muted:#8ea1b4;--text:#eef6ff;--accent:#7dd3fc}*{box-sizing:border-box}body{margin:0;background:radial-gradient(circle at top,#17324d,#081018 45%);font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display",Inter,Segoe UI,sans-serif;color:var(--text)}a{color:inherit;text-decoration:none}.shell{max-width:1120px;margin:auto;padding:22px}.nav{display:flex;gap:10px;align-items:center;justify-content:space-between;position:sticky;top:0;backdrop-filter:blur(18px);z-index:2;padding:10px 0}.brand{font-weight:800;letter-spacing:-.03em}.tabs{display:flex;gap:8px;overflow:auto}.tab,.btn{border:1px solid #294059;background:#102033;color:var(--text);border-radius:999px;padding:10px 14px;font-weight:650}.hero{padding:32px 0 18px}.hero h1{font-size:clamp(38px,10vw,76px);line-height:.92;margin:20px 0;letter-spacing:-.07em}.grid{display:grid;grid-template-columns:repeat(12,1fr);gap:16px}.card{grid-column:span 12;background:linear-gradient(180deg,rgba(255,255,255,.07),rgba(255,255,255,.03));border:1px solid rgba(255,255,255,.11);border-radius:28px;padding:20px;box-shadow:0 20px 60px rgba(0,0,0,.22)}@media(min-width:780px){.span5{grid-column:span 5}.span6{grid-column:span 6}.span7{grid-column:span 7}}.pill{display:inline-flex;border:1px solid #31506d;border-radius:999px;padding:6px 10px;color:#cbe7ff;margin:4px 4px 4px 0;font-size:13px}.item{padding:14px;border-radius:18px;background:rgba(7,14,24,.55);border:1px solid rgba(255,255,255,.08);margin:10px 0}audio{width:100%;margin:14px 0}p{color:var(--muted);line-height:1.5}.transcript{color:#d8e8f8}</style></head><body><main class="shell"><div class="nav"><a class="brand" href="/">◐ Daily Briefing Agent</a><div class="tabs">${nav}</div></div>${main}</main></body></html>`;
}

const server = http.createServer((request, response) => {
  const url = new URL(request.url || '/', `http://${request.headers.host}`);
  if (url.pathname === '/api/audio/demo') {
    response.writeHead(200, { 'Content-Type': 'audio/wav', 'Cache-Control': 'public, max-age=3600' });
    response.end(wav());
    return;
  }
  if (url.pathname === '/api/demo' || url.pathname === '/api/briefings') {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(url.pathname === '/api/briefings' ? { briefings: [briefing()] } : briefing()));
    return;
  }
  response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  response.end(page(url.pathname));
});

server.listen(port, host, () => {
  console.log(`Daily Briefing Agent demo running at http://localhost:${port}`);
});

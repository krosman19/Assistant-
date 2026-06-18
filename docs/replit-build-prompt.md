# Replit Build Prompt: Daily Briefing Agent

You are Replit Agent acting as a senior full-stack product engineer. Build a near-final, production-quality MVP of **Daily Briefing Agent** from this repository.

## Product summary

Daily Briefing Agent is an iOS-first web app for busy executives. It generates a daily spoken “AI radio” briefing that helps the user start the day in full context, not just with inbox and calendar summaries. The briefing must synthesize:

1. Today’s calendar and tomorrow’s early calendar risks.
2. Important emails across multiple providers.
3. Follow-ups, commitments, open loops, and unresolved asks.
4. Reminders and tasks.
5. User interests, configured topics, and useful external/news context.
6. Risks, conflicts, likely misses, and one recommended plan for the day.

The app output must include:

- Audio briefing.
- Transcript.
- Structured action list.
- Calendar/email/topic citations where possible.
- Source/integration health.
- Archive of previous briefings.

The expected user experience is a calm, concise personal chief-of-staff podcast, optimized for iPhone and morning use.

## Current repository state

The repo currently contains a dependency-free demo scaffold so it can run even when npm registry access is restricted:

- `scripts/dev-server.mjs`: dependency-free demo server.
- `app/`: Next.js-style pages and API routes to evolve into the production app.
- `lib/demoData.ts`: realistic demo events, emails, interests, and reminders.
- `lib/briefing.ts`: deterministic demo briefing generator.
- `lib/importance.ts`: basic email ranking heuristic.
- `lib/integrations.ts`: provider adapter shape and iCloud setup guidance.
- `lib/security.ts`: AES-GCM credential helper.
- `prisma/schema.prisma`: initial data model.
- `scripts/prisma-fallback.mjs`: no-dependency fallback for restricted demos.
- `README.md`: current setup and troubleshooting notes.

Do not throw this away. Upgrade it into a real full-stack app while preserving the working demo mode.

## Critical product requirements

### Non-Google workflows are mandatory

The app must **not** be limited to Gmail or Google Calendar. Implement provider-level integrations:

- Gmail API for Google mail.
- Microsoft Graph for Outlook / Microsoft 365 mail and calendar.
- IMAP for generic mail accounts.
- IMAP for iCloud Mail using:
  - Host: `imap.mail.me.com`
  - SSL/TLS enabled
  - Apple app-specific password
  - Read-only MVP; SMTP is not needed.
- CalDAV for iCloud Calendar / Apple Calendar workflows using:
  - Server: `https://caldav.icloud.com`
  - Apple ID + app-specific password.
- CalDAV for other Apple Calendar-backed calendars.
- Optional CardDAV for contacts after the main flow works.

Clearly explain in the UI that direct Apple Mail app access is not generally available to third-party web apps. The equivalent web approach is to connect the underlying provider accounts through OAuth, IMAP, and CalDAV.

### Audio is mandatory

The briefing is not just text. Implement audio generation with one of these paths:

1. OpenAI TTS as the preferred production path.
2. ElevenLabs as an optional provider.
3. Browser-native speech synthesis as a low-cost fallback.
4. Keep the current generated WAV tone only as offline demo fallback when no TTS key is configured.

Store audio files locally in development and design the storage abstraction so Replit storage, S3, or Cloudflare R2 can be used later.

### Budget target

Normal personal-use user-facing services should target approximately **$20/month or less** where possible. Prefer:

- Read-only provider scopes.
- Efficient summarization.
- Small model for extraction/ranking where acceptable.
- One TTS generation per scheduled briefing unless the user manually regenerates.
- Cache interest/news summaries.
- Avoid retaining full email bodies longer than necessary.

## MVP flow to build

1. User signs in or enters demo mode.
2. User connects/simulates calendar sources.
3. User connects/simulates email sources.
4. User configures interests/topics, VIPs, priority companies/projects, briefing time, tone, and length.
5. App syncs source data.
6. App generates a daily briefing automatically or on demand.
7. User can play audio, read transcript, inspect action items, and see why items were included.
8. User can browse previous briefings in an archive.

## Frontend pages

Build polished, iOS-first pages. Use responsive layouts, large tap targets, sticky audio controls where useful, and excellent empty/loading/error states.

### 1. Dashboard

Must include:

- Today’s briefing card.
- Prominent audio play button/player.
- Transcript.
- Structured action items with priority, source, and due time.
- Calendar summary.
- Email summary.
- Follow-ups/reminders summary.
- Interests/news summary with “why it matters.”
- Risks/conflicts/likely misses.
- Source citations and confidence/caveat labels.
- “Regenerate briefing” button.
- Last generated time and status.

### 2. Sources / Integrations

Must include cards/actions for:

- Connect Gmail.
- Connect Outlook / Microsoft 365.
- Add IMAP account.
- Add CalDAV calendar.
- iCloud Mail setup.
- iCloud Calendar setup.
- Demo/simulated source toggle.
- Connection health.
- Last sync time.
- Per-source disconnect/delete controls.

Include explicit Apple Mail limitation copy:

> Apple Mail itself does not generally expose a cloud API to web apps. Daily Briefing Agent connects to the underlying accounts instead: Gmail, Outlook/Microsoft 365, IMAP, iCloud Mail, and CalDAV calendars.

### 3. Preferences

Must support:

- Briefing time.
- Briefing length: 3, 5, 8, 12 minutes.
- Tone: executive, casual, analytical, urgent, podcast-style.
- Include/exclude sections.
- Interests/topics.
- VIP people.
- Priority companies/projects.
- Email importance rules.
- Privacy settings.
- Raw email retention window.
- TTS provider selection/fallback.

### 4. Briefing Archive

Must include:

- List of past briefings.
- Audio playback for each.
- Transcript.
- Action items.
- Search/filter.
- Generated date, duration, tone, and sections included.

### 5. Setup Wizard

Must guide the user through:

- Product promise and privacy posture.
- Apple Mail limitation and provider-level connection approach.
- Gmail/Microsoft OAuth.
- IMAP setup.
- iCloud Mail IMAP instructions.
- iCloud Calendar CalDAV instructions.
- Interests/topics setup.
- First demo briefing generation.

## Backend architecture

Implement modular backend services under `lib/` or `server/`:

1. Auth/session management.
2. Integration manager.
3. Credential encryption and token storage.
4. Email ingestion.
5. Calendar ingestion.
6. Reminder/task ingestion or demo/manual task source.
7. Interest/topic/news ingestion.
8. Importance ranking.
9. Commitment/follow-up detection.
10. Briefing planner.
11. Script writer.
12. TTS generator.
13. Audio storage.
14. Scheduler/cron.
15. Privacy/security deletion layer.

Use TypeScript throughout. Keep interfaces clear so each provider can be swapped or mocked.

## Data model

Use Prisma + PostgreSQL when registry access is available. Preserve and improve the current schema. Include these entities at minimum:

### User

- id
- email
- name
- timezone
- briefing_time
- briefing_length
- tone
- preferences JSON
- created_at
- updated_at

### ConnectedAccount

- id
- user_id
- provider: `gmail | microsoft | imap | caldav | icloud | manual`
- display_name
- encrypted_credentials
- scopes
- status
- last_sync_at
- created_at
- updated_at

### EmailMessage

- id
- user_id
- account_id
- provider_message_id
- thread_id
- from
- to
- cc
- subject
- snippet
- body_text or redacted body/summary depending on privacy mode
- received_at
- labels
- has_attachments
- importance_score
- importance_reason
- requires_action
- action_deadline
- created_at

### CalendarEvent

- id
- user_id
- account_id
- provider_event_id
- title
- start_time
- end_time
- location
- attendees JSON
- description
- meeting_url
- source_calendar
- importance_score
- prep_notes
- created_at

### InterestTopic

- id
- user_id
- topic
- keywords
- sources
- priority
- created_at

### Briefing

- id
- user_id
- briefing_date
- status
- title
- transcript
- audio_url
- duration_seconds
- summary_json
- action_items_json
- citations_json
- created_at

### ActionItem

- id
- user_id
- source_type: `email | calendar | task | reminder | topic | manual | inferred`
- source_id
- description
- owner
- deadline
- priority
- status
- created_at

## Briefing generation pipeline

Implement this pipeline as explicit stages with typed inputs/outputs and logs that do **not** include sensitive body text:

1. Fetch today’s calendar events.
2. Fetch tomorrow’s early calendar events if relevant.
3. Fetch unread and recent emails from the last 24–48 hours.
4. Fetch older unresolved emails requiring follow-up.
5. Fetch reminders/tasks.
6. Rank emails and events by importance.
7. Detect commitments, deadlines, questions, and follow-up requests.
8. Fetch/cache interest and news summaries for configured topics.
9. Detect calendar conflicts, travel gaps, prep risks, and back-to-back meetings.
10. Build a structured briefing outline.
11. Generate a natural spoken script.
12. Generate audio.
13. Store transcript, action list, citations, summary JSON, and audio URL.
14. Notify or make available to the user.

## Importance ranking rules

Prioritize:

- VIP senders.
- Direct asks requiring a response.
- Deadlines.
- Investor/board/legal/finance/customer/partner messages.
- Calendar changes.
- External stakeholder meetings.
- Conflicts or back-to-back meetings.
- Unresolved asks from prior days.
- Threads where the user is directly named.
- Travel, money, contracts, launch dates, hiring, payroll, health, or family logistics.

Deprioritize:

- Newsletters.
- Marketing emails.
- Automated receipts.
- Generic notifications.
- Calendar spam.
- Low-signal FYI messages.

## Spoken briefing structure

Generate scripts in this order:

1. Opening
   - Date.
   - Overall day shape.
   - One-sentence headline, e.g. “Today is meeting-heavy with two prep risks and three emails worth handling before noon.”
2. Schedule
   - Key meetings.
   - Conflicts.
   - Prep-needed meetings.
   - Travel/time gaps.
   - Personal appointments.
3. Inbox
   - Top 3–7 important emails.
   - Why each matters.
   - Suggested action.
   - Deadlines.
4. Follow-ups / reminders / tasks
   - Commitments the user owes.
   - People waiting on the user.
   - Open loops and unresolved threads.
5. Interests / external context
   - User-selected topics.
   - Brief useful news/context.
   - Explain why each item matters to today’s schedule, people, or decisions.
   - Avoid generic headlines.
6. Recommended plan
   - What to do first.
   - What can wait.
   - Risks.
   - One clear next action.

## Script generation prompt

Use this internal prompt for script generation:

> You are a trusted executive assistant preparing a spoken morning briefing. Your job is to help the user understand their day, avoid surprises, and focus on what matters. Use only the provided calendar, email, task, reminder, and topic data. Do not invent facts. Clearly flag uncertainty. Prefer useful synthesis over exhaustive detail. Prioritize time-sensitive, high-leverage, and relationship-sensitive items. Write for audio, not for reading. Keep the tone calm, direct, and practical.

## Audio style

- Smart personal chief of staff.
- Concise and calm.
- No fake enthusiasm.
- Natural spoken language.
- Short sentences.
- Avoid robotic list reading.
- Pronounce names and times clearly.
- Include caveats when confidence is low.

## Security requirements

Implement and document:

- Encrypt OAuth tokens and IMAP/CalDAV credentials at rest.
- Never log email body text or credentials.
- Read-only scopes for MVP.
- Per-source disconnect.
- Data deletion controls.
- Minimal raw email retention.
- Store summaries separately from raw messages.
- Clear privacy disclosure in setup and preferences.
- Safe error messages that do not leak secrets.

## Demo mode requirements

Demo mode must keep working without external credentials. It should include:

- 6 calendar events.
- 12 emails.
- 5 interests with useful summaries and why-it-matters context.
- At least 4 reminders/tasks.
- Generated briefing transcript.
- Playable audio.
- Structured action items.
- Calendar/email/topic citations.
- Visible explanation of why important items were included.

## Implementation priorities

### Phase 1: near-final MVP

- Make the existing UI production-polished and mobile-first.
- Preserve dependency-free demo fallback if possible.
- Add real environment-driven OpenAI script/TTS path with demo fallback.
- Add PostgreSQL + Prisma when package installation is available.
- Implement provider abstractions with mock/demo adapters first and real stubs for Gmail, Microsoft, IMAP, and CalDAV.
- Implement briefing generation pipeline as typed stages.
- Implement audio playback, transcript, action list, citations, archive.
- Implement preferences and source configuration persistence.
- Add meaningful tests for ranking, briefing generation, and API responses.

### Phase 2

- Real Gmail OAuth ingestion.
- Real Microsoft Graph ingestion.
- Real IMAP ingestion.
- Real CalDAV ingestion.
- iCloud-specific guided setup wizard.
- VIP list.
- Follow-up detection improvements.
- Recurring daily scheduler.
- Notification email or push-ready abstraction.

### Phase 3

- Apple Shortcuts integration.
- Siri shortcut to play latest briefing.
- CarPlay-friendly audio feed.
- Private podcast RSS feed.
- CardDAV contacts integration.
- User feedback loop: “more like this / less like this.”
- PWA install flow.

## Technical preferences

Use these when available in Replit:

- Next.js App Router.
- TypeScript.
- Prisma.
- PostgreSQL.
- OpenAI SDK for summarization/script generation and TTS.
- ImapFlow for IMAP.
- `tsdav` or similar for CalDAV.
- Google APIs for Gmail.
- Microsoft Graph API for Microsoft mail/calendar.
- Background scheduler suitable for Replit.
- Local filesystem storage in dev; storage adapter for production.

If npm registry access is blocked, keep the current dependency-free server working and implement incremental improvements without breaking quick start.

## Environment variables

Support and document:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/daily_briefing_agent"
APP_URL="http://localhost:3000"
SESSION_SECRET="replace-with-32-byte-secret"
ENCRYPTION_KEY="replace-with-32-byte-base64-key"
OPENAI_API_KEY=""
OPENAI_TTS_MODEL="gpt-4o-mini-tts"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
MICROSOFT_CLIENT_ID=""
MICROSOFT_CLIENT_SECRET=""
REDIS_URL="redis://localhost:6379"
DEMO_MODE="true"
```

## Acceptance criteria

The result is acceptable when:

- `npm install` works in Replit.
- `cp .env.example .env` works.
- `npm run dev` starts the app.
- The app opens on mobile-sized screens and looks intentionally iOS-first.
- A user can enter demo mode or create/sign in as a demo user.
- A user can configure briefing preferences.
- A user can connect or simulate email/calendar sources.
- A user can generate a daily briefing.
- The briefing includes calendar, inbox, follow-ups, reminders/tasks, interests/news, risks, and a recommended plan.
- The user can play audio.
- The user can read transcript.
- The user can see action items.
- The user can see citations and why items were included.
- The user can browse archived briefings.
- The UI clearly supports iCloud, Apple Calendar, iCloud Mail, IMAP, CalDAV, Gmail, and Microsoft workflows.
- The UI clearly states that direct Apple Mail app access is not generally available to web apps.
- Tests or smoke checks cover briefing generation, interest inclusion, audio endpoint, and API responses.

## Important quality bar

Do not produce a thin scaffold. Produce a near-final MVP. Prioritize complete flows, clear code organization, realistic demo behavior, polished mobile UI, security-aware defaults, and maintainable provider abstractions. Keep the core product promise front and center: a whole-day, all-context spoken morning briefing that helps an executive avoid surprises and focus on what matters.

# Daily Briefing Agent

An iOS-first full-stack web app that creates a daily audio briefing from calendars, email, follow-ups, reminders/tasks, and user-selected interests. It is designed for executives who want a calm personal podcast instead of a wall of text.

## What is included

- Next.js + React app router frontend and API routes.
- Prisma PostgreSQL schema for users, connected accounts, email, calendars, topics, briefings, and action items.
- Demo mode with 6 calendar events, 12 realistic emails, 5 interests, a transcript, action list, citations, and playable generated demo audio.
- Integration abstraction for Gmail, Microsoft 365, IMAP, CalDAV, iCloud, and manual sources.
- AES-GCM helper for encrypted credential/token storage.
- Importance-ranking heuristics for executive inbox triage.
- iCloud and Apple Mail setup guidance that clearly explains the web/API limitation.

## Run locally

```bash
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:3000`.

For database-backed production work:

```bash
createdb daily_briefing_agent
npm run prisma:generate
npm run db:push
```

## Replit deployment

1. Import the repo into Replit.
2. Add environment variables from `.env.example`.
3. Set `DEMO_MODE=true` for an immediately usable demo.
4. Run `npm install` and `npm run dev`.
5. For production, attach a managed PostgreSQL database and set `DATABASE_URL`.

## Provider strategy

Apple Mail does not generally provide a cloud API for third-party web apps. Daily Briefing Agent connects to the underlying accounts instead:

- Gmail API for Google mail.
- Microsoft Graph for Outlook/Microsoft 365 mail and calendar.
- IMAP for other mail accounts.
- CalDAV for iCloud Calendar and Apple Calendar-backed calendars.
- iCloud Mail via `imap.mail.me.com` with SSL/TLS and an Apple app-specific password.
- iCloud Calendar via `https://caldav.icloud.com` with an Apple app-specific password.

## OpenAI and TTS

The demo uses a generated WAV placeholder so audio works without paid APIs. In production, wire `lib/briefing.ts` to OpenAI for outline/script generation and OpenAI TTS or ElevenLabs for audio. Keep the script prompt:

> You are a trusted executive assistant preparing a spoken morning briefing. Your job is to help the user understand their day, avoid surprises, and focus on what matters. Use only the provided calendar, email, task, and topic data. Do not invent facts. Clearly flag uncertainty. Prefer useful synthesis over exhaustive detail. Prioritize time-sensitive, high-leverage, and relationship-sensitive items. Write for audio, not for reading. Keep the tone calm, direct, and practical.

## Security checklist

- Encrypt OAuth refresh tokens and IMAP/CalDAV app passwords at rest.
- Never log email body text or credentials.
- Use read-only scopes for MVP.
- Support per-source disconnect and deletion.
- Minimize raw email retention; store summaries separately.
- Keep a clear privacy disclosure in setup and preferences.

## MVP phases

### Phase 1
Manual topics, Gmail OAuth, Microsoft OAuth, IMAP read, CalDAV read, daily briefing generation, audio playback, transcript, archive.

### Phase 2
iCloud-specific setup wizard, VIP list, follow-up detection, recurring scheduler, notifications, better podcast-style voices.

### Phase 3
Apple Shortcuts, Siri shortcut to play latest briefing, CarPlay-friendly audio feed, private podcast RSS, CardDAV contacts, feedback loop, PWA install flow.

## Troubleshooting binary assets and registry access

### Binary files not supported

This repository intentionally does not require committed binary audio. Demo audio is generated at request time by `app/api/audio/demo/route.ts`, and the briefing object points to `/api/audio/demo`. If your review or deployment system rejects binary files, keep generated audio in object storage or behind an API route instead of committing `.wav`, `.mp3`, or `.m4a` files.

### Fixing external npm registry access limitations

A `403 Forbidden` from `https://registry.npmjs.org` is usually caused by the execution environment, corporate policy, proxy configuration, or missing registry credentials. It cannot be fully fixed from application code. Use one of these environment fixes:

```bash
npm config get registry
npm config set registry https://registry.npmjs.org/
unset npm_config_http_proxy npm_config_https_proxy HTTP_PROXY HTTPS_PROXY http_proxy https_proxy
npm cache clean --force
npm install
```

If your network requires a private mirror, configure it explicitly instead:

```bash
npm config set registry https://your-approved-npm-mirror.example.com/
npm login --registry=https://your-approved-npm-mirror.example.com/
npm install
```

In Replit or CI, add the registry token or mirror URL as a secret and avoid relying on local proxy variables.

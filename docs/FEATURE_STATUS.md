# Feature Status

This page separates built functionality from demo support, mocks, and intentional MVP limits.

## Deliberate Completeness For The Hackathon Prompt

These pieces were added so the project feels complete for **Build something that solves a real pain point in your personal life**:

| Addition | Prompt Purpose |
|----------|----------------|
| Weave landing page | Communicates the emotional job-search pain before the tool starts. |
| Demo route `/app` | Lets judges move from pitch to functioning workspace quickly. |
| Profile context | Makes outreach personal to the student's lived background. |
| Company/person finder | Solves the first hard networking question: who should I contact? |
| "Why this person" reasoning | Makes each contact feel credible instead of random. |
| Finder coach | Helps decide who to prioritize. |
| Outreach coach and drafts | Helps say something specific without sounding desperate. |
| Follow-up tracker | Solves the common drop-off after the first message. |
| Cached/seeded search paths | Keeps the demo feasible and complete under time pressure. |

## Built In The App

| Area | Status | Notes |
|------|--------|-------|
| Landing page | Built | `/` shows the Weave landing page and demo entry. |
| Demo workspace route | Built | `/app` renders the main workspace after demo entry. |
| Profile context | Built | Student profile is persisted locally and sent with finder/chat requests. |
| People Finder | Built | Searches by company, role, city, and optional school filter. |
| Company context | Built | Finder response includes company/job/applicant context for outreach. |
| Contact ranking | Built | Results include fit signals, contact tier, and "why this person" rationale. |
| Auto-selection | Built | Finder results can flow into selected contacts for drafting. |
| Finder coach | Built | Separate chat thread for prioritizing search results. |
| Outreach coach | Built | Separate chat thread for writing and refining outreach. |
| Draft generation | Built | Template writer path generates initial outreach and follow-up drafts. |
| Follow-up tracker | Built | Contacts can be tracked in a lightweight CRM pipeline. |
| Shared contracts | Built | Web and server use shared TypeScript types. |

## Demo Reliability Support

| Area | Status | Notes |
|------|--------|-------|
| WestJet sample | Demo-backed | Cached response supports a fast, reliable hackathon demo. |
| Seed people | Demo-backed | Mock people support common company examples. |
| Finder result cache | Demo-backed | Repeat AI searches can reuse cached results. |
| Local storage sessions | Demo-backed | Pins and profile data persist in the browser during demos. |

## Requires API Keys Or Live Services

| Area | Status | Notes |
|------|--------|-------|
| Live AI finder | Available with key | Requires `ANTHROPIC_API_KEY`; can use fallback paths for demos. |
| Streaming AI chat | Available with key | Uses AI SDK providers configured on the server. |
| Live company research | Available with key | Can be skipped or cached depending on environment flags. |

## Intentionally Out Of Scope For MVP

| Area | Reason |
|------|--------|
| Production authentication | Demo login is local-only to keep judging flow simple. |
| Production database | Contacts use JSON/local storage patterns appropriate for MVP demo scope. |
| Automated LinkedIn sending | Weave drafts and tracks outreach; it does not impersonate the user or send on their behalf. |
| Multi-user accounts | Single-user hackathon workspace keeps the core loop focused. |
| Full deployment hardening | The repo prioritizes a working demo, clear architecture, and extensibility. |

## How To Read Open Tasks

[TASKS.md](./TASKS.md) is a working hackathon board, not a list of broken features. Use this file and [SUBMISSION.md](./SUBMISSION.md) to understand what is complete for the judged demo.

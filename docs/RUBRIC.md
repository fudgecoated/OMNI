# Hackathon Rubric Map

This document maps the likely judging dimensions to concrete Weave behavior and repo evidence. It is written for the prompt: **Build something that solves a real pain point in your personal life.**

## Prompt Fit

Weave is built around a personal job-search pain point: applications can feel like sending effort into a void. The problem is not just "students need jobs." The deeper pain is access: people without a warm network do not know who to message, how to sound credible, or how to keep following up after silence.

Deliberate additions for the prompt:

- The landing page starts with the emotional promise: cold applications into warm conversations.
- The profile system captures projects, goals, and motivation so messages reflect a real person.
- The finder focuses on people, not job listings, because networking is the missing bridge.
- Follow-up tracking addresses the post-message anxiety and memory burden.

Evidence:

- Problem overview in [PRODUCT.md](./PRODUCT.md).
- Behavioral rationale in [BEHAVIORAL-SCIENCE.md](./BEHAVIORAL-SCIENCE.md).
- Original PRD pain points in [../HERMES-PRD.md](../HERMES-PRD.md).

## Problem Relevance

The initial wedge is personal and concrete: students and early-career job seekers trying to turn cold applications into human conversations. It began from our own student job-search experience, but it is not limited to Calgary, UCalgary, internships, or new-grad roles. The pain is current and emotionally resonant anywhere effort is not enough because access is missing: ghosted applications, weak networks, generic outreach, and uncertainty about follow-ups.

How Weave maps to the pain:

- "I do not know who to message" -> ranked contacts and tiers.
- "I do not know what to say" -> profile-aware drafts and coach chat.
- "I sound generic" -> company research, project proof, and why-this-person context.
- "I forget to follow up" -> contact pipeline and follow-up status.

## Execution

The judged loop is complete enough to demo:

1. Landing page explains the problem and enters the demo workspace.
2. Candidate profile provides applicant context.
3. Finder search returns company context and contacts.
4. Contacts can be selected for drafting.
5. Finder coach helps prioritize.
6. Outreach chat and draft tools generate messages.
7. Contacts move into follow-up tracking.

Evidence:

- Demo script in [DEMO.md](./DEMO.md).
- Feature matrix in [FEATURE_STATUS.md](./FEATURE_STATUS.md).
- WestJet smoke-test guide in [TESTING-WESTJET.md](./TESTING-WESTJET.md).

## Creativity

Weave avoids the obvious "resume optimizer" or "job board wrapper" shape. It reframes the job search around people and conversations.

Creative decisions:

- One pin equals one company search, keeping research, contacts, chat, and drafts together.
- Two coaches separate prioritization from writing: finder coach for who, outreach coach for what to say.
- Behavioral-science framing turns outreach into a low-shame sequence: proof, relevance, respectful ask, follow-up.
- The interface treats a contact as a relationship candidate, not just a row of data.

Evidence:

- Pin model in [PRODUCT.md](./PRODUCT.md).
- Runtime skill system in [AGENTS.md](./AGENTS.md).
- Landing and workspace flow in [apps/web/src/App.tsx](../apps/web/src/App.tsx) and [apps/web/src/components/landing/WeaveLandingPage.tsx](../apps/web/src/components/landing/WeaveLandingPage.tsx).

## Technical Quality

Weave is a full-stack TypeScript monorepo with shared contracts, a React workspace, an Express API, AI SDK streaming, typed profile/context models, and cache layers for reliable demos.

Evidence:

- System diagram and API map in [ARCHITECTURE.md](./ARCHITECTURE.md).
- Code map in [IMPLEMENTATION.md](./IMPLEMENTATION.md).
- Shared API and data contracts in [packages/shared/src/types.ts](../packages/shared/src/types.ts).
- Finder route orchestration in [apps/server/src/routes/finder.ts](../apps/server/src/routes/finder.ts).
- Web state model in [FRONTEND.md](./FRONTEND.md).

## User Experience

Weave uses a polished landing page for first impression and a structured workspace for the actual job-search loop. The UX is designed to reduce uncertainty: one company at a time, visible selected contacts, clear actions, and context beside the chat.

Evidence:

- Design notes in [DESIGN.md](./DESIGN.md).
- Frontend architecture in [FRONTEND.md](./FRONTEND.md).
- Landing component in [apps/web/src/components/landing/WeaveLandingPage.tsx](../apps/web/src/components/landing/WeaveLandingPage.tsx).
- Main workspace composition in [apps/web/src/components/pages/WorkspacePage.tsx](../apps/web/src/components/pages/WorkspacePage.tsx).

## Impact

Weave can change a candidate's behavior immediately. Even if it does not guarantee replies, it helps them make better attempts:

- They contact more relevant people.
- They write with proof instead of vague enthusiasm.
- They avoid sounding desperate.
- They follow up consistently.
- They feel less alone in an opaque process.

Impact is strongest because the product supports an emotionally hard moment, not just an administrative task.

## Feasibility

The MVP is scoped for a hackathon demo without pretending to be a production networking platform.

Feasibility choices:

- Demo login is local-only.
- WestJet has a cached sample path for reliability.
- Seed data supports common demos.
- JSON/local storage keeps CRM behavior simple.
- Live AI works with API keys, but the demo has fallback paths.
- Automated LinkedIn sending and production auth are intentionally out of scope.

Evidence:

- Feature status in [FEATURE_STATUS.md](./FEATURE_STATUS.md).
- Finder pipeline in [FINDER.md](./FINDER.md).

## Use Of Required Tool/API

AI is not decorative in Weave. It powers the reasoning loop:

- Company research and role context.
- Finder reasoning for live company searches.
- Streaming chat coaching.
- Prompt skills for applicant context, company research, role framing, and outreach messaging.
- Context-aware message drafting and follow-up support.

Evidence:

- Agent skills and tools in [AGENTS.md](./AGENTS.md).
- Finder implementation in [FINDER.md](./FINDER.md).
- Server routes in [ARCHITECTURE.md](./ARCHITECTURE.md).

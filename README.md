# Weave

Weave is a connection workspace for students and early-career job seekers. It helps someone turn cold applications and vague networking advice into useful conversations by finding the right people, drafting specific outreach, and remembering the follow-up.

https://omni-web-peach.vercel.app/app
https://omni-1elwsxw2w-ali-s-projects-omni.vercel.app/

## Naming

- **Weave** is the product name shown in the demo UI and submission materials.
- **OMNI** is the repository/project folder name.
- **Hermes** is the original internal codename and package prefix (`@hermes/*`).

## Why It Matters

Most people are not short on effort. They are short on access.

Job applications often feel like a silent rejection loop: students and early-career candidates spend hours tailoring resumes, click submit, and hear nothing back. The painful part is not only logistics, it is emotional. People know one useful conversation could change their trajectory, but they do not know who to contact, what to say, or how to follow up without sounding generic or desperate.

The hackathon prompt is to build something that solves a real pain point in your personal life. Weave is tailored directly to that prompt: it starts from the lived stress of student job hunting, then generalizes to anyone trying to create warm conversations from cold applications, vague networking advice, cold outreach anxiety, and forgotten follow-ups.

Weave turns that vague anxiety into a concrete outreach sequence:

1. Build a profile from the candidate's projects, skills, goals, and motivation.
2. Research a target company and role.
3. Find people worth contacting, including hiring managers, recruiters, alumni, and connectors.
4. Draft outreach grounded in the candidate's real proof and the contact's likely relevance.
5. Track follow-ups so a promising lead does not vanish after one message.

## Core Demo Loop

1. Open the Weave landing page and enter the demo workspace.
2. Use **People Finder** to search for a target company and role.
3. Review company context and ranked contacts.
4. Ask the finder coach who to prioritize.
5. Draft outreach in the outreach workspace.
6. Move the contact into the follow-up pipeline.

## Rubric Alignment

| Criterion | How Weave Addresses It |
|-----------|-------------------------|
| **Problem relevance** | Solves a personal, specific pain: effort without access disappears into silence, networking starts from zero, and follow-ups fall through during a stressful search. |
| **Execution** | The judged loop is complete: landing page, demo workspace, profile context, finder results, outreach drafting, selected contacts, and follow-up tracking. |
| **Creativity** | Reframes job search from "apply harder" to "start warmer conversations," using people-first discovery, behavioral messaging, and pin-based company workspaces. |
| **Technical quality** | React/Vite client, Express API, shared TypeScript contracts, streaming AI chat, skill-based prompts, finder caching, seed data, and typed cross-package models. |
| **User experience** | Polished Weave landing page, section-scoped workspace, visible contact actions, selected-contact panel, readable cards, and clear demo navigation. |
| **Impact** | Helps candidates act with confidence instead of shame: choose the right person, explain why, ask respectfully, and keep momentum. |
| **Feasibility** | MVP scope is honest: demo login, JSON/local storage, cached WestJet sample, seeded data, and API-key live mode keep the project reliable for judging. |
| **Use of required tool/API** | AI is core to the flow: company research, finder reasoning, chat coaching, prompt skills, and context-aware drafting all use the configured AI provider paths. |

## Deliberate Hackathon Fit

We deliberately added the pieces judges need to see for "Build something that solves a real pain point in your personal life":

- A landing page that states the emotional problem before showing the tool.
- A profile system so outreach is grounded in the candidate's real projects and motivations.
- A company/person finder because the hardest first step is often "who do I message?"
- "Why this person" context so contacts are not just names in a list.
- Separate finder and outreach coaches because deciding who to contact and writing the message are different anxieties.
- Follow-up tracking because the pain continues after the first message.
- Cached/seeded demo paths so the project remains feasible and complete under hackathon judging conditions.

## Submission Docs

Start here if you are reviewing the project:

| Doc | Description |
|-----|-------------|
| [docs/SUBMISSION.md](./docs/SUBMISSION.md) | Judge-facing project packet, demo notes, screenshot checklist |
| [docs/RUBRIC.md](./docs/RUBRIC.md) | Detailed rubric mapping to concrete repo features |
| [docs/FEATURE_STATUS.md](./docs/FEATURE_STATUS.md) | Built, demo-backed, mocked, and out-of-scope capabilities |
| [docs/BEHAVIORAL-SCIENCE.md](./docs/BEHAVIORAL-SCIENCE.md) | Emotional pain point and behavioral design rationale |
| [docs/DESIGN.md](./docs/DESIGN.md) | UX principles, information architecture, screenshot guidance |
| [docs/README.md](./docs/README.md) | Full documentation index |

## Technical Docs

| Doc | Description |
|-----|-------------|
| [HERMES-PRD.md](./HERMES-PRD.md) | Original product requirements and problem framing |
| [docs/PRODUCT.md](./docs/PRODUCT.md) | Product vision and user flows |
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | System and API architecture |
| [docs/IMPLEMENTATION.md](./docs/IMPLEMENTATION.md) | Code map and extension points |
| [docs/FRONTEND.md](./docs/FRONTEND.md) | UI layout and client state |
| [docs/FINDER.md](./docs/FINDER.md) | People Finder pipeline |
| [docs/AGENTS.md](./docs/AGENTS.md) | AI skills and tools |
| [docs/DEMO.md](./docs/DEMO.md) | Presenter script |

## Stack

- **Monorepo:** pnpm + Turborepo
- **Web:** React 19 + Vite (`apps/web`)
- **Server:** Express + TypeScript (`apps/server`)
- **Shared contracts:** TypeScript models and helpers (`packages/shared`)
- **AI:** Anthropic/OpenAI via AI SDK, with seed and cached paths for reliable demos

## Setup

```bash
corepack pnpm install
cp .env.example .env
# Add ANTHROPIC_API_KEY for live AI search. Seed data and the WestJet cache work for demos.
corepack pnpm dev
```

- Web: http://localhost:5173
- Landing page: http://localhost:5173/
- Demo workspace: http://localhost:5173/app
- API health: http://localhost:3002/health

## Scripts

| Command | Description |
|---------|-------------|
| `corepack pnpm dev` | Start web + server |
| `corepack pnpm build` | Build all packages |
| `corepack pnpm test` | Run tests |
| `corepack pnpm typecheck` | Typecheck all packages |
| `./scripts/test-westjet-search.sh` | Smoke test WestJet finder API |

## Repo Layout

```text
apps/web/       -> Weave UI: landing, finder, profile, outreach, follow-ups
apps/server/    -> API, agents, finder, writer, tracker
packages/shared -> TypeScript contracts + profile markdown
data/           -> Mock people + WestJet sample response
docs/           -> Submission, architecture, implementation, and demo guides
```

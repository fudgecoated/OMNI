# Implementation guide

This document maps **where behavior lives** so you can change Hermes without spelunking the whole monorepo.

## Repository map

```
OMNI/
├── apps/web/                 # React UI
│   ├── src/components/       # Feature UI (finder, profile, chat, followups)
│   ├── src/hooks/            # useFinder, useChat, useProfileChat, …
│   ├── src/stores/           # sessionStore, profileStore, hermesStore
│   └── src/lib/              # sectionConfig, api, finderSelection, parsers
├── apps/server/              # Express API
│   ├── src/routes/           # HTTP handlers
│   ├── src/finder/           # Search orchestration
│   ├── src/agents/           # Skills, tools, context builders
│   ├── src/writer/           # Message templates + LLM drafts
│   ├── src/tracker/          # contacts.json CRM
│   └── skills/               # Runtime SKILL.md files
├── packages/shared/          # Types + profileMarkdown + pipeline constants
└── data/                     # mock_people.json, westjet-search-sample.json
```

## Request flows

### People Finder

```
FinderSearchForm → useFinder.search()
  → POST /api/finder/search { company, role, city, school, student }
  → finder.ts → cache | seed | AI
  → applyFinderSelection(all people) → sessionStore + hermesStore
  → FinderWorkspace shows chat; PersonResult shows Selected tab
```

### Outreach chat

```
ChatInterface → useHermesChat → POST /api/chat
  body: { messages, student, selectedTargets, outreachContext }
  → streamText + hermesTools + skills in system prompt
```

### Profile ingest

```
ProfileSources → POST /api/profile/ingest → profileIngest route
  → profile-ingest skill → merges into profileStore
```

## Shared types (`packages/shared`)

| Export | Use |
|--------|-----|
| `StudentProfile`, `normalizeStudentProfile` | Request bodies, applicant context |
| `OutreachTarget`, `OutreachContext` | Finder results + chat context |
| `CompanyResearch`, `JobRoleContext`, `ApplicantContext` | Right-panel brief + prompts |
| `Contact`, `ContactStatus`, `PIPELINE_PHASES` | Follow-up tracker |

## Extension points

| Goal | Where to change |
|------|-----------------|
| New seed company | `mock_people.json`, `companyAliases.ts`, `companyResearch.ts` SEED_BRIEFS |
| New runtime skill | `apps/server/skills/<name>/SKILL.md`, optional tool in `registry.ts` |
| New nav section | `sectionConfig.ts`, `WorkspacePage`, `HermesSidebar`, `ResultsPanel` |
| Faster finder demo | Add `data/<company>-search-sample.json` + logic in `cachedFinderSearch.ts` |
| Message tone | `apps/server/skills/outreach-messaging/SKILL.md`, `messageGenerator.ts` |

## Tests

```bash
pnpm test          # server vitest (loadSkill, finder route, aliases)
pnpm typecheck     # all packages
```

Web unit tests: `apps/web/src/lib/*.test.ts`.

## Local development

```bash
pnpm install && cp .env.example .env
# Set ANTHROPIC_API_KEY for live search (optional for google/amazon/meta/westjet cache)
pnpm dev
```

| Service | URL |
|---------|-----|
| Web | http://localhost:5173 |
| API health | http://localhost:3002/health |

Smoke: `./scripts/test-westjet-search.sh`

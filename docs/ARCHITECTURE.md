# Hermes architecture

Hermes is a **pnpm + Turborepo** monorepo: Vite/React client, Express API, shared TypeScript package. Patterns follow the `multi-turn-chatbot` reference (proxy, resizable split, streaming chat).

## System context

```
┌─────────────┐     /api/* proxy      ┌──────────────────────┐
│  apps/web   │ ────────────────────► │  apps/server         │
│  React UI   │     JSON + SSE        │  Express             │
└─────────────┘                       └──────────┬───────────┘
                                                   │
                    ┌──────────────────────────────┼──────────────────────────────┐
                    ▼                              ▼                              ▼
            Anthropic API                   data/*.json                  apps/server/data/
            (chat, finder,                  mock people,                  contacts.json
             company research)               westjet sample                 (runtime CRM)
```

## Monorepo packages

| Package | Role |
|---------|------|
| `@hermes/web` | UI, Zustand stores, AI SDK chat hooks |
| `@hermes/server` | REST API, agents, finder, writer, tracker |
| `@hermes/shared` | Cross-package types and profile markdown helpers |

## UI architecture (three columns)

See [FRONTEND.md](./FRONTEND.md) for state details.

```
┌──────────────┬────────────────────────────┬─────────────────────┐
│ Sidebar      │ Center (section-specific)  │ ResultsPanel tabs   │
├──────────────┼────────────────────────────┼─────────────────────┤
│ Profile      │ Profile Coach              │ Profile form/MD     │
│ Finder pins  │ Search form OR Finder chat │ Company · Selected  │
│ Chat pins    │ Outreach Coach             │ Message · Contacts  │
│ Follow-ups   │ Planner                    │ Follow-ups          │
└──────────────┴────────────────────────────┴─────────────────────┘
```

**Pinned searches:** `SessionList` + `sessionStore`. **+ New search** is the only control to create a new finder pin.

## API surface

| Method | Path | Module | Notes |
|--------|------|--------|-------|
| GET | `/health` | `index.ts` | Liveness |
| POST | `/api/finder/search` | `routes/finder.ts` | Company + people + context |
| GET | `/api/companies/:company/people` | `finder/mockPeople.ts` | Seed-only legacy |
| POST | `/api/chat` | `routes/chat.ts` | Streaming outreach coach |
| POST | `/api/profile/chat` | `routes/profileChat.ts` | Profile coach |
| POST | `/api/profile/ingest` | `routes/profileIngest.ts` | Resume/link import |
| POST | `/api/messages/generate` | `writer/messageGenerator.ts` | Draft from template |
| POST | `/api/messages/followup` | `writer/messageGenerator.ts` | Follow-up draft |
| GET/POST/PATCH | `/api/contacts` | `tracker/storage.ts` | JSON file CRM |
| GET | `/api/contacts/due` | `tracker/storage.ts` | Due follow-ups |

## People Finder (server)

Detailed flow: [FINDER.md](./FINDER.md).

```
FinderSearchRequest
       │
       ├─► tryCachedFinderSearch (WestJet sample)
       ├─► seed slug → mockPeople + seedCompanyResearch
       └─► AI → buildSearchContext → aiFinderSearch
                 │
                 ▼
         FinderSearchResponse { people, context, source }
```

`OutreachContext` bundles **company**, **jobRole**, and **applicant** blocks formatted for prompts (`formatContextBlock.ts`).

## Agents & skills

Runtime skills: `apps/server/skills/*/SKILL.md` loaded by `loadSkill.ts` into chat system prompts.

Tools: `apps/server/src/agents/tools/registry.ts` (`find_hiring_contacts`, `web_search`, …).

See [AGENTS.md](./AGENTS.md).

## Storage (MVP)

| Data | Location | Committed |
|------|----------|-----------|
| Mock people (G/AM/M) | `data/mock_people.json` | Yes |
| WestJet demo response | `data/westjet-search-sample.json` | Yes |
| User contacts / pipeline | `apps/server/data/contacts.json` | No (gitignored) |
| Sessions + profile | Browser `localStorage` | N/A |

## Configuration

| Variable | Purpose |
|----------|---------|
| `PORT` | Server port (default 3002) |
| `ANTHROPIC_API_KEY` | Claude chat, finder, research |
| `OPENAI_API_KEY` | Fallback (no web search) |
| `HERMES_FINDER_LIVE` | Skip WestJet cache |
| `HERMES_FINDER_FAST` | `0` = full company research before people search |

## Runtime ports

| Service | Port | Command |
|---------|------|---------|
| Web | 5173 | `pnpm --filter @hermes/web dev` |
| Server | 3002 | `pnpm --filter @hermes/server dev` |

Vite proxies `/api` and `/health` with 180s timeout for long AI finder runs.

## Related docs

- [PRODUCT.md](./PRODUCT.md) — why we built it
- [IMPLEMENTATION.md](./IMPLEMENTATION.md) — code map
- [HERMES-PRD.md](../HERMES-PRD.md) — requirements

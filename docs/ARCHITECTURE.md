# Hermes Architecture

Mirrors the `multi-turn-chatbot` monorepo patterns (pnpm + Turborepo + Express + Vite/React).

## Monorepo layout

```
OMNI/
├── apps/
│   ├── web/          # Vite + React 19 + Tailwind (@hermes/web)
│   └── server/       # Express API (@hermes/server)
├── packages/
│   └── shared/       # Shared TypeScript types (@hermes/shared)
├── data/             # Mock people + alumni CSV (committed)
└── docs/
```

## UI layout (3-column)

```
┌──────────────┬─────────────────────┬──────────────────┐
│ Left sidebar │ Center: AI chat     │ Right: results   │
│ People Finder│ Outreach coach      │ Message / Person │
│ + lookup     │ (streaming)         │ / Follow-ups     │
└──────────────┴─────────────────────┴──────────────────┘
```

Center + right use a resizable split (same pattern as multi-turn-chatbot).

## Runtime

| Service | Port | Command |
|---------|------|---------|
| Web | 5173 | `pnpm --filter @hermes/web dev` |
| Server | 3002 | `pnpm --filter @hermes/server dev` |

Vite proxies `/api` and `/health` to the server.

## API routes

| Method | Path | Module |
|--------|------|--------|
| GET | `/health` | `index.ts` |
| POST | `/api/chat` | `routes/chat.ts` (streaming coach + skills + tools) |
| GET | `/api/companies/:company/people` | `finder/mockPeople.ts` |
| POST | `/api/messages/generate` | `writer/messageGenerator.ts` |
| POST | `/api/messages/followup` | `writer/messageGenerator.ts` |
| GET/POST/PATCH | `/api/contacts` | `tracker/storage.ts` |
| GET | `/api/contacts/due` | `tracker/storage.ts` |

## Storage (hackathon MVP)

- **People:** `data/mock_people.json` (Google, Amazon, Meta)
- **Contacts:** `apps/server/data/contacts.json` (gitignored, created at runtime)
- **Alumni:** `data/alumni_sample.csv` (wired in BE milestone)

## LLM & agents

- **Chat agent:** `POST /api/chat` — `streamText` + tools (`find_company_people`, …)
- **Runtime skills:** `apps/server/skills/*/SKILL.md` loaded into system prompt (see [docs/AGENTS.md](./AGENTS.md))
- **Message drafts:** `writer/messageGenerator.ts` (stub or `callLLM`)
- Keys: `ANTHROPIC_API_KEY` or `OPENAI_API_KEY` (chat only; people search uses local seed data)

## Out of scope (weekend)

- Postgres / Drizzle
- Auto-send to LinkedIn
- Multi-user auth

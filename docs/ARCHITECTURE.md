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
| GET | `/api/companies/:company/people` | `finder/mockPeople.ts` |
| POST | `/api/messages/generate` | `writer/messageGenerator.ts` |
| POST | `/api/messages/followup` | `writer/messageGenerator.ts` |
| GET/POST/PATCH | `/api/contacts` | `tracker/storage.ts` |
| GET | `/api/contacts/due` | `tracker/storage.ts` |

## Storage (hackathon MVP)

- **People:** `data/mock_people.json` (Google, Amazon, Meta)
- **Contacts:** `apps/server/data/contacts.json` (gitignored, created at runtime)
- **Alumni:** `data/alumni_sample.csv` (wired in BE milestone)

## LLM

- Vercel AI SDK via `apps/server/src/agents/lib/callLLM.ts`
- Stub templates in `writer/messageGenerator.ts` until AI milestone
- Set `OPENAI_API_KEY` in `.env` (see `.env.example`)

## Out of scope (weekend)

- Postgres / Drizzle
- Auto-send to LinkedIn
- Multi-user auth

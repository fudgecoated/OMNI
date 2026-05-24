# Hermes (OMNI)

Student outreach tool for Calgary SWE undergrads: find people at target companies, write personalized messages, and track follow-ups.

See [HERMES-PRD.md](./HERMES-PRD.md) for product requirements and [docs/TASKS.md](./docs/TASKS.md) for the hackathon task board.

## Stack

- **Monorepo:** pnpm + Turborepo
- **Web:** React 19 + Vite + Tailwind (`apps/web`)
- **Server:** Express + TypeScript (`apps/server`)
- **Shared types:** `packages/shared`

Architecture details: [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)

## Setup

```bash
pnpm install
cp .env.example .env
pnpm dev
```

- Web: http://localhost:5173  
- API: http://localhost:3002/health  

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start web + server |
| `pnpm build` | Build all packages |
| `pnpm test` | Run server tests |
| `pnpm typecheck` | Typecheck all packages |

## Repo layout

```
apps/web/       → UI
apps/server/    → API, finder, writer, tracker
packages/shared → TypeScript contracts
data/           → Mock people + alumni CSV
```

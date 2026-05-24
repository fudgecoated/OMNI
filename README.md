# Hermes (OMNI)

Student outreach tool for Calgary SWE undergrads: find people at target companies, write personalized messages, and track follow-ups.

## Documentation

| Doc | Description |
|-----|-------------|
| [HERMES-PRD.md](./HERMES-PRD.md) | Product requirements |
| [docs/README.md](./docs/README.md) | **Documentation index** |
| [docs/PRODUCT.md](./docs/PRODUCT.md) | Product vision and user flows |
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | System and API architecture |
| [docs/IMPLEMENTATION.md](./docs/IMPLEMENTATION.md) | Code map and extension points |
| [docs/FRONTEND.md](./docs/FRONTEND.md) | UI layout and client state |
| [docs/FINDER.md](./docs/FINDER.md) | People Finder pipeline |
| [docs/AGENTS.md](./docs/AGENTS.md) | AI skills and tools |
| [docs/TASKS.md](./docs/TASKS.md) | Hackathon task board |

## Stack

- **Monorepo:** pnpm + Turborepo
- **Web:** React 19 + Vite + Tailwind (`apps/web`)
- **Server:** Express + TypeScript (`apps/server`)
- **Shared types:** `packages/shared`

## Setup

```bash
pnpm install
cp .env.example .env
# Add ANTHROPIC_API_KEY for live AI search (optional for seed companies + WestJet cache)
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
| `./scripts/test-westjet-search.sh` | Smoke test WestJet finder API |

## Repo layout

```
apps/web/       → UI (finder, profile, outreach, follow-ups)
apps/server/    → API, agents, finder, writer, tracker
packages/shared → TypeScript contracts + profile markdown
data/           → Mock people + WestJet sample response
docs/           → Architecture and implementation guides
```

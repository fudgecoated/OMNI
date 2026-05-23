# Hermes Hackathon Task Board

**Branch:** `develop`  
**Demo path:** Company → 5 people → generate message → copy → log contact → follow-up dashboard

---

## ✅ Done (boilerplate)

- [x] Monorepo scaffold (pnpm + turbo)
- [x] `@hermes/shared` types
- [x] Express server + stub routes
- [x] **3-column UI** (sidebar + chat + results panel)
- [x] `POST /api/chat` streaming outreach coach
- [x] Mock data (`data/mock_people.json`)
- [x] Basic finder API test

---

## You — Product / lead / integration

| Task | Done when | Est. |
|------|-----------|------|
| [ ] Share demo script with team (`docs/DEMO.md`) | 90-sec rehearsed path documented | 30m |
| [ ] Create GitHub issues from unchecked tasks below | Issues assigned + labels | 30m |
| [ ] Integration checkpoint **H+4** | Finder → Writer → Tracker works in browser | — |
| [ ] Integration checkpoint **H+8** | LLM messages + real contact logging | — |
| [ ] Integration checkpoint **H+12** | Demo freeze; mock-only fallback documented | — |
| [ ] Pitch deck / screenshots | 3 screenshots + problem/solution slide | 2h |

---

## BE — `apps/server`

| Task | Done when | Est. |
|------|-----------|------|
| [ ] `finder/alumni_finder.ts` — parse `data/alumni_sample.csv`, boost school matches | Alumni filter returns UCalgary rows | 2h |
| [ ] `finder/relevance_scorer.ts` — score vs student interests | Scores adjust when interests passed | 2h |
| [ ] `finder/linkedin_scraper.ts` — best-effort; **fallback to mock** | `ENABLE_LIVE_SCRAPE=true` optional; never breaks demo | 3h |
| [ ] Wire alumni + scorer into `GET /api/companies/:company/people` | Query params `role`, `school` fully work | 1h |
| [ ] `tracker/followup_scheduler.ts` — mark `unlikely` after 10d, `followup_due` status | `GET /api/contacts/due` correct | 2h |
| [ ] `PATCH /api/contacts/:id` — mark `responded`, clear follow-up | UI can mark responded | 1h |
| [ ] Tests: contacts CRUD + due logic | `pnpm --filter @hermes/server test` green | 2h |

---

## FE — `apps/web`

| Task | Done when | Est. |
|------|-----------|------|
| [x] 3-column shell (sidebar / chat / results) | Matches chatbot layout pattern | — |
| [ ] Student profile editor in sidebar or results | Editable name, year, interests, GitHub | 2h |
| [ ] Tracker: "Mark responded" button per contact | Calls PATCH API | 1h |
| [ ] Follow-up badge count on sidebar nav | Due count on Follow-ups item | 30m |
| [ ] Polish: mobile-friendly layout, Calgary vibe | Looks demo-ready | 2h |
| [ ] Error toasts or inline errors on all API calls | Failed fetch visible | 1h |

---

## AI / QA — LLM + testing

| Task | Done when | Est. |
|------|-----------|------|
| [ ] Replace stub in `messageGenerator.ts` with `callLLM` + templates | Messages feel personalized | 3h |
| [ ] Load few-shot examples from PRD into system prompt | School/domain/project hooks appear | 1h |
| [ ] `POST /api/messages/followup` uses LLM + prior message context | Follow-up references first message | 2h |
| [ ] `fastModel` for drafts; document API cost guardrails | `.env.example` notes GPT-4 optional | 30m |
| [ ] Human-review disclaimer in UI ("Review before sending") | Visible on Writer page | 15m |
| [ ] E2E demo test checklist (3 runs) | `docs/QA.md` with pass/fail | 1h |
| [ ] Vitest: message route returns 200 with valid body | Server test added | 1h |

---

## Everyone — final 2h

- [ ] Run demo script end-to-end on one machine
- [ ] Record backup screen capture
- [ ] Freeze dependencies; no new features after H+18

---

## Ownership summary

| Person | Primary package | Focus |
|--------|-----------------|-------|
| You | `docs/`, integration | Contracts, demo, checkpoints |
| BE | `apps/server/src/finder`, `tracker` | Data, API, persistence |
| FE | `apps/web` | UI/UX, hooks |
| AI/QA | `apps/server/src/writer`, `agents/lib` | LLM, prompts, testing |

---

## Quick commands

```bash
pnpm install
cp .env.example .env   # add OPENAI_API_KEY when ready
pnpm dev               # web :5173 + server :3002
pnpm test              # server tests
pnpm build
```

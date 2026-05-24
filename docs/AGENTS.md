# Hermes agents & skills

People Finder and outreach both consume **OutreachContext** built before search — see [FINDER.md](./FINDER.md) and `apps/server/src/agents/context/`.

Hermes uses **two** skill concepts. They are not the same file in the same place.

| Kind | Where | Who uses it |
|------|--------|-------------|
| **Cursor skill** | `.cursor/skills/<name>/SKILL.md` | Cursor IDE while you code |
| **Runtime skill** | `apps/server/skills/<name>/SKILL.md` | Outreach chat (`POST /api/chat`) |

Your `hiring-manager-finder` skill is wired for **runtime** chat. A copy also lives under `.cursor/skills/` for Cursor.

---

## How runtime skills work

```
User message (center chat)
       ↓
POST /api/chat  →  system prompt = base coach + all SKILL.md bodies
       ↓
LLM can call tools (e.g. find_company_people)
       ↓
Assistant reply streams back to UI
```

1. **`apps/server/skills/<skill-name>/SKILL.md`** — instructions (YAML frontmatter + markdown), same format as Cursor skills.
2. **`loadSkill.ts`** — reads every `skills/*/SKILL.md` and appends them to the system prompt.
3. **`apps/server/src/agents/tools/*.tool.ts`** — executable tools the model can call.
4. **`registry.ts`** — exports `hermesTools` passed into `streamText({ tools })`.

---

## Add a new skill (checklist)

### 1. Add the skill markdown

```bash
mkdir -p apps/server/skills/my-new-skill
# Copy or write SKILL.md with frontmatter:
# ---
# name: my-new-skill
# description: When to use this skill (triggers)
# ---
```

Optional (recommended): mirror for Cursor development:

```bash
mkdir -p .cursor/skills/my-new-skill
cp apps/server/skills/my-new-skill/SKILL.md .cursor/skills/my-new-skill/
```

Restart the server after adding skills — they are loaded at request time from disk.

### 2. Add tools if the skill needs actions

Create `apps/server/src/agents/tools/my_tool.tool.ts`:

```ts
import { tool } from "ai";
import { z } from "zod";

export default tool({
  description: "What this tool does",
  inputSchema: z.object({ query: z.string() }),
  execute: async ({ query }) => {
    // call API, DB, mock data, etc.
    return { query, results: [] };
  },
});
```

Register in `apps/server/src/agents/tools/registry.ts`:

```ts
import myTool from "./my_tool.tool";

export const hermesTools = {
  find_company_people: findCompanyPeople,
  my_tool: myTool,
} as const;
```

### 3. Reference the tool in the skill body

In `SKILL.md`, tell the model to call `my_tool` with specific inputs (like hiring-manager-finder uses `find_company_people`).

### 4. Environment variables

Document any keys in `.env.example`. Chat needs `ANTHROPIC_API_KEY` or `OPENAI_API_KEY` only.

### 5. Try it in the app

```bash
pnpm dev
```

Open the center chat and use a phrase from the skill `description`, e.g.:

> Find the hiring manager at Google for a software engineering intern role in Calgary

---

## Context skills (installed)

| Skill | When it runs | Purpose |
|-------|----------------|---------|
| `company-research` | **Automatically** on every `POST /api/finder/search` (before people finder) | Web research on the company |
| `job-role-context` | Built from role + company brief on search | Frame the target role |
| `applicant-context` | Built from **My Profile** (`buildProfileMarkdown` / Context tab) on every search, chat, and draft | Full student narrative (skills, projects, why, limits) |
| `profile-ingest` | **Import with Hermes** on My Profile | Read resume/links and fill profile + markdown |
| `outreach-messaging` | Chat + **Generate draft** | How to weave company + role + applicant into DMs |
| `hiring-manager-finder` | During people finder + chat lookups | Find contacts |

Context is stored on each **search pin** (`outreachContext` on the session) and sent to chat + message generation.

### Profile → skills pipeline

```
My Profile (form) ──► buildProfileMarkdown() ──► Context (Markdown) tab
        │                        │
        │                        └── narrativeForAI inside buildApplicantContext()
        ▼
POST /api/finder/search  ──► buildSearchContext() ──► outreachContext.applicant
POST /api/chat           ──► resolveOutreachContext(student) ──► system prompt
POST /api/messages/*     ──► outreachContext.applicant on GenerateMessageRequest
```

Editing profile fields updates markdown live; **Save** persists to localStorage. Other skills always read the latest `student` profile from the client on each request.

| Tool | Use |
|------|-----|
| `find_hiring_contacts` | Seed data + suggested LinkedIn queries |
| `research_company` | Refresh company brief in chat |
| `web_search` | Anthropic built-in (chat + finder) |

**Required:** `ANTHROPIC_API_KEY` only.

---

## Cursor vs multi-turn-chatbot `.skill.ts` files

The **multi-turn-chatbot** repo uses TypeScript `*.skill.ts` modules + a skill runner for report cards. Hermes (hackathon) uses **markdown skills + AI SDK tools** in chat — simpler and matches your `SKILL.md` format.

If you later need heavy batch jobs (scrape 50 people offline), add a `*.skill.ts` runner like chatbot; for chat-driven lookup, markdown + tools is enough.

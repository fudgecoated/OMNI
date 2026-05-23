# Hermes agents & skills

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

## hiring-manager-finder (installed)

| Piece | Path |
|-------|------|
| Runtime skill | `apps/server/skills/hiring-manager-finder/SKILL.md` |
| Cursor skill | `.cursor/skills/hiring-manager-finder/SKILL.md` |
| Tool | `find_hiring_contacts` — seed data for Google/Amazon/Meta; **any other company** needs `TAVILY_API_KEY` |

**Required:** `ANTHROPIC_API_KEY` (chat). **Optional:** `TAVILY_API_KEY` for Shopify, Microsoft, etc.

---

## Cursor vs multi-turn-chatbot `.skill.ts` files

The **multi-turn-chatbot** repo uses TypeScript `*.skill.ts` modules + a skill runner for report cards. Hermes (hackathon) uses **markdown skills + AI SDK tools** in chat — simpler and matches your `SKILL.md` format.

If you later need heavy batch jobs (scrape 50 people offline), add a `*.skill.ts` runner like chatbot; for chat-driven lookup, markdown + tools is enough.

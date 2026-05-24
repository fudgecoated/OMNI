import { generateText, stepCountIs, type ToolSet } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import type { FinderSearchRequest, OutreachContext, OutreachTarget } from "@hermes/shared";
import { formatOutreachContextBlock } from "../agents/context/formatContextBlock";
import { hermesTools } from "../agents/tools/registry";
import {
  dedupeTargets,
  parseTargetsFromJsonBlock,
  rawToTarget,
} from "./outreachTargets";

const FINDER_SYSTEM = `You are Hermes People Finder. Find real hiring contacts for the student.

Rules:
1. Read the company, job role, and applicant context below before searching.
2. Call find_hiring_contacts with the company and role filters.
3. If suggestedQueries are returned, run web_search — use company research to pick the best queries (teams, tech, hiring signals).
4. Prefer contacts who match the role level and relevant product teams.
5. Only include people with real linkedin.com/in URLs — never invent profiles.
6. End with a fenced JSON block (and nothing after it):

\`\`\`json
{"people":[{"name":"...","role":"...","team":"...","company":"...","linkedinUrl":"https://linkedin.com/in/...","tier":"exact|adjacent|broad","relevanceScore":0-100}]}
\`\`\`

Include at least 3 people when possible.`;

function extractFromToolResults(
  steps: Array<{ toolResults?: Array<{ toolName: string; output: unknown }> }>,
  company: string
): OutreachTarget[] {
  const people: OutreachTarget[] = [];
  for (const step of steps) {
    for (const tr of step.toolResults ?? []) {
      if (tr.toolName !== "find_hiring_contacts") continue;
      const out = tr.output as {
        company?: string;
        people?: Array<Record<string, unknown>>;
      };
      const co = out.company ?? company;
      for (const raw of out.people ?? []) {
        const t = rawToTarget(
          {
            name: String(raw.name ?? ""),
            role: String(raw.role ?? ""),
            team: String(raw.team ?? ""),
            linkedinUrl: String(raw.linkedinUrl ?? ""),
            schoolConnection:
              raw.schoolConnection != null
                ? String(raw.schoolConnection)
                : null,
            relevanceScore:
              typeof raw.relevanceScore === "number"
                ? raw.relevanceScore
                : undefined,
            tier: raw.tier != null ? String(raw.tier) : undefined,
            contactMethod:
              raw.contactMethod != null ? String(raw.contactMethod) : undefined,
          },
          co
        );
        if (t) people.push(t);
      }
    }
  }
  return dedupeTargets(people);
}

export async function aiFinderSearch(
  req: FinderSearchRequest,
  context: OutreachContext
): Promise<OutreachTarget[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY required for AI company search");
  }

  const company = req.company.trim();
  const role = req.role?.trim() || "software engineering intern";
  const city = req.city?.trim();
  const school = req.school?.trim();

  const anthropic = createAnthropic({ apiKey });
  const tools: ToolSet = {
    ...hermesTools,
    web_search: anthropic.tools.webSearch_20250305({ maxUses: 6 }),
  };

  const locationLine = city ? ` in ${city}` : "";
  const schoolLine = school ? ` Prefer ${school} alumni when possible.` : "";
  const contextBlock = formatOutreachContextBlock(context);

  const result = await generateText({
    model: anthropic("claude-sonnet-4-6"),
    system: FINDER_SYSTEM,
    prompt: `${contextBlock}

---

Find hiring managers and relevant contacts at ${company} for role: ${role}${locationLine}.${schoolLine}`,
    tools,
    stopWhen: stepCountIs(10),
  });

  const fromTools = extractFromToolResults(result.steps, company);
  const fromJson = parseTargetsFromJsonBlock(result.text);

  return dedupeTargets([...fromTools, ...fromJson]);
}

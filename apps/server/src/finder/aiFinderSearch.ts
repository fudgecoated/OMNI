import { generateText, stepCountIs, type ToolSet } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import type {
  CompanyResearch,
  FinderSearchRequest,
  OutreachContext,
  OutreachTarget,
} from "@hermes/shared";
import { formatOutreachContextBlock } from "../agents/context/formatContextBlock";
import { parseJsonBlock } from "../agents/context/parseJsonBlock";
import { hermesTools } from "../agents/tools/registry";
import { AppError } from "../middleware/errorHandler";
import {
  dedupeTargets,
  parseTargetsFromLooseText,
  parseTargetsFromJsonBlock,
  rawToTarget,
} from "./outreachTargets";
import {
  finderMaxSteps,
  finderMaxWebSearchUses,
  finderSearchTimeoutMs,
} from "./finderLimits";

const FINDER_SYSTEM = `You are Weave People Finder. Find real, currently employed outreach contacts for the student.

Rules:
1. Read the company, job role, and applicant context below before searching.
2. Call find_hiring_contacts with the company, role, teamFocus when provided, city, and school filters.
3. If suggestedQueries are returned, run web_search across several exact, adjacent, and connector queries. Do not stop after one weak query.
4. Only include people with real linkedin.com/in URLs. Never invent names, titles, companies, or URLs.
5. Only include someone if search results indicate they currently work at the target company. Good evidence: LinkedIn headline/title says the company, snippet says "Present", or a current company/title is shown. Exclude former employees, ex-interns, advisors, alumni only, and profiles where current employment is unclear.
6. Include a useful mix when possible:
   - exact: hiring managers, engineering managers, directors, team leads for the target role
   - adjacent: technical program managers, project managers, product managers, staff/senior engineers on relevant teams
   - connector: campus/university recruiters, talent acquisition, sourcers
7. Score exact hiring influence highest, then adjacent team relevance, then connector value.
8. Every person must include a short evidence sentence explaining why they appear current and useful.
9. Include a compact companyBrief based only on search results and provided context. Keep it useful for outreach, not a generic company profile.
10. End with a fenced JSON block (and nothing after it):

\`\`\`json
{"companyBrief":{"summary":"...","productsAndTeams":["..."],"cultureValues":["..."],"recentNews":["..."],"techStack":["..."],"hiringSignals":["..."],"internRelevance":"..."},"people":[{"name":"...","role":"...","team":"...","company":"...","linkedinUrl":"https://linkedin.com/in/...","tier":"exact|adjacent|connector","relevanceScore":0-100,"evidence":"Current title/snippet shows ... at COMPANY; useful because ..."}]}
\`\`\`

Target 6-10 people when credible. Return fewer if current employment cannot be verified.`;

function shouldRetryEmptyFinderSearch(): boolean {
  return process.env.HERMES_FINDER_RETRY === "1";
}

type FinderJson = {
  companyBrief?: Partial<Omit<CompanyResearch, "company" | "researchedAt">>;
  people?: Array<Record<string, unknown>>;
};

export type AiFinderSearchResult = {
  people: OutreachTarget[];
  companyResearch?: CompanyResearch;
};

function stringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => String(item ?? "").trim())
    .filter(Boolean)
    .slice(0, 6);
}

function parseCompanyBrief(text: string, company: string): CompanyResearch | undefined {
  const parsed = parseJsonBlock<FinderJson>(text);
  const brief = parsed?.companyBrief;
  const summary = String(brief?.summary ?? "").trim();
  if (!summary) return undefined;

  return {
    company,
    summary,
    productsAndTeams: stringList(brief?.productsAndTeams),
    cultureValues: stringList(brief?.cultureValues),
    recentNews: stringList(brief?.recentNews),
    techStack: stringList(brief?.techStack),
    hiringSignals: stringList(brief?.hiringSignals),
    internRelevance: String(brief?.internRelevance ?? "").trim(),
    researchedAt: new Date().toISOString(),
  };
}

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
            evidence:
              raw.evidence != null ? String(raw.evidence) : undefined,
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
): Promise<AiFinderSearchResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new AppError(
      500,
      "ANTHROPIC_API_KEY required for live People Finder search"
    );
  }

  const company = req.company.trim();
  const role = req.role?.trim() || "software engineering intern";
  const teamFocus = req.teamFocus?.trim();
  const city = req.city?.trim();
  const school = req.school?.trim();

  const anthropic = createAnthropic({ apiKey });
  const maxWebSearchUses = finderMaxWebSearchUses();
  const maxSteps = finderMaxSteps();
  const timeoutMs = finderSearchTimeoutMs();
  const tools: ToolSet = {
    ...hermesTools,
    web_search: anthropic.tools.webSearch_20250305({ maxUses: maxWebSearchUses }),
  };

  const locationLine = city ? ` in ${city}` : "";
  const teamFocusLine = teamFocus
    ? ` Team/product focus: ${teamFocus}. Prioritize contacts connected to this area.`
    : "";
  const schoolLine = school ? ` Prefer ${school} alumni when possible.` : "";
  const contextBlock = formatOutreachContextBlock(context);

  const model = anthropic("claude-sonnet-4-6");
  const prompt = `${contextBlock}

---

Find current hiring managers, hiring-adjacent teammates, project/program/product managers, recruiters, and relationship connectors at ${company} for role: ${role}${locationLine}.${teamFocusLine}${schoolLine}

Prioritize current employees only. Search broadly enough to return exact hiring influencers plus adjacent connectors, but exclude anyone whose current employment at ${company} is not supported by the search result snippet or profile headline.`;

  const runSearch = async (searchPrompt: string, signal: AbortSignal) =>
    generateText({
      model,
      system: FINDER_SYSTEM,
      prompt: searchPrompt,
      tools,
      stopWhen: stepCountIs(maxSteps),
      abortSignal: signal,
    });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  let result;
  try {
    result = await runSearch(prompt, controller.signal);
  } catch (err) {
    const aborted =
      controller.signal.aborted ||
      (err instanceof Error &&
        (err.name === "AbortError" || /aborted/i.test(err.message)));
    if (aborted) {
      throw new AppError(
        504,
        `People Finder timed out after ${Math.round(timeoutMs / 1000)}s. For an instant demo try WestJet or Google. For ${company}, retry with a narrower role or set HERMES_FINDER_TIMEOUT_MS higher locally.`
      );
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }

  const fromTools = extractFromToolResults(result.steps, company);
  const fromJson = parseTargetsFromJsonBlock(result.text);
  const fromLooseText = parseTargetsFromLooseText(result.text, company, role);
  const firstPass = dedupeTargets([...fromTools, ...fromJson, ...fromLooseText]);
  const firstCompanyResearch = parseCompanyBrief(result.text, company);

  if (firstPass.length > 0) {
    return { people: firstPass, companyResearch: firstCompanyResearch };
  }
  if (!shouldRetryEmptyFinderSearch()) {
    return { people: firstPass, companyResearch: firstCompanyResearch };
  }

  const retryController = new AbortController();
  const retryTimer = setTimeout(() => retryController.abort(), timeoutMs);
  let retry;
  try {
    retry = await generateText({
    model,
    system: FINDER_SYSTEM,
    prompt: `${prompt}

The previous search returned no usable contacts. Run broader web searches now. Try combinations like:
- site:linkedin.com/in "${company}" "${role}" "present"
- site:linkedin.com/in "${company}" "engineering manager"
- site:linkedin.com/in "${company}" "technical program manager"
- site:linkedin.com/in "${company}" "project manager" "software"
- site:linkedin.com/in "${company}" "product manager" "software"
- site:linkedin.com/in "${company}" "talent acquisition" "software"
- site:linkedin.com/in "${company}" "university recruiter"
- site:linkedin.com/in "${company}" "campus recruiter" "${city ?? ""}"

    Return only contacts with real linkedin.com/in URLs and evidence of current employment at ${company}. If current employment cannot be verified, return {"people":[]}.`,
    tools,
    stopWhen: stepCountIs(maxSteps),
    abortSignal: retryController.signal,
  });
  } catch (err) {
    const aborted =
      retryController.signal.aborted ||
      (err instanceof Error &&
        (err.name === "AbortError" || /aborted/i.test(err.message)));
    if (aborted) {
      throw new AppError(
        504,
        `People Finder timed out after ${Math.round(timeoutMs / 1000)}s. For an instant demo try WestJet or Google.`
      );
    }
    throw err;
  } finally {
    clearTimeout(retryTimer);
  }

  const retryPeople = dedupeTargets([
    ...extractFromToolResults(retry.steps, company),
    ...parseTargetsFromJsonBlock(retry.text),
    ...parseTargetsFromLooseText(retry.text, company, role),
  ]);
  return {
    people: retryPeople,
    companyResearch: parseCompanyBrief(retry.text, company) ?? firstCompanyResearch,
  };
}

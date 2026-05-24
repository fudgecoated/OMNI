import { generateText, stepCountIs, type ToolSet } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import type { CompanyResearch, CompanySlug } from "@hermes/shared";
import { loadSkillBody } from "../loadSkill";
import { parseJsonBlock } from "./parseJsonBlock";

const SEED_BRIEFS: Record<CompanySlug, Omit<CompanyResearch, "researchedAt">> = {
  google: {
    company: "Google",
    summary:
      "Global technology company focused on search, ads, cloud (GCP), Android, and AI (Gemini). Large intern program with host-matching.",
    productsAndTeams: ["Search", "Ads", "Cloud", "YouTube", "Android", "DeepMind / Gemini"],
    cultureValues: ["user focus", "data-driven", "20% time", "cross-functional collaboration"],
    recentNews: ["Major AI product investments", "Ongoing cloud enterprise growth"],
    techStack: ["C++", "Java", "Go", "Python", "Kubernetes", "TensorFlow"],
    hiringSignals: [
      "Host matching after application",
      "Teams hire SWE interns year-round",
      "Strong systems and ML pipelines",
    ],
    internRelevance:
      "Interns join a host team for a summer; research the product area you message into.",
  },
  amazon: {
    company: "Amazon",
    summary:
      "E-commerce, AWS cloud, and logistics leader. Internships often tied to a specific org (AWS, retail, devices).",
    productsAndTeams: ["AWS", "Retail", "Prime", "Logistics", "Alexa / Devices"],
    cultureValues: ["Leadership Principles", "ownership", "bias for action", "customer obsession"],
    recentNews: ["AWS expansion", "AI services on Bedrock"],
    techStack: ["Java", "Python", "AWS services", "distributed systems"],
    hiringSignals: [
      "Leadership Principles in interviews and outreach",
      "Team-specific hiring managers",
      "Bar raiser process for FTE; interns team-fit focused",
    ],
    internRelevance:
      "Reference the org (e.g. AWS vs retail) when messaging hiring managers.",
  },
  meta: {
    company: "Meta",
    summary:
      "Social and metaverse company (Facebook, Instagram, WhatsApp, Reality Labs). Heavy mobile and ML infrastructure.",
    productsAndTeams: ["Facebook", "Instagram", "WhatsApp", "Reality Labs", "Ads", "Infra"],
    cultureValues: ["move fast", "impact", "metaverse / AI focus"],
    recentNews: ["AI research and open models", "Efficiency-focused org structure"],
    techStack: ["Python", "C++", "React", "HHVM", "PyTorch"],
    hiringSignals: [
      "Product-area hiring",
      "Strong intern cohort in Menlo Park and distributed offices",
    ],
    internRelevance:
      "Tie outreach to a product (Feed, Reels, Infra) when possible.",
  },
};

function withTimestamp(
  partial: Omit<CompanyResearch, "researchedAt">,
  company: string
): CompanyResearch {
  return {
    ...partial,
    company: partial.company || company,
    researchedAt: new Date().toISOString(),
  };
}

type ResearchJson = {
  summary?: string;
  productsAndTeams?: string[];
  cultureValues?: string[];
  recentNews?: string[];
  techStack?: string[];
  hiringSignals?: string[];
  internRelevance?: string;
};

export function seedCompanyResearch(slug: CompanySlug, displayName: string): CompanyResearch {
  return withTimestamp(SEED_BRIEFS[slug], displayName);
}

/** Fast placeholder before the people-finder agent runs (avoids a second full web-research pass). */
export function stubCompanyResearch(
  company: string,
  role: string,
  city?: string
): CompanyResearch {
  return withTimestamp(
    {
      company,
      summary: `${company} — company brief will be refined during contact search.`,
      productsAndTeams: [],
      cultureValues: [],
      recentNews: [],
      techStack: [],
      hiringSignals: [],
      internRelevance: `Targeting ${role}${city ? ` in ${city}` : ""}.`,
    },
    company
  );
}

export async function runCompanyResearch(params: {
  company: string;
  role?: string;
  city?: string;
}): Promise<CompanyResearch> {
  const company = params.company.trim();
  const role = params.role?.trim() || "software engineering intern";
  const city = params.city?.trim();
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return withTimestamp(
      {
        company,
        summary: `${company} — enable ANTHROPIC_API_KEY for live company research.`,
        productsAndTeams: [],
        cultureValues: [],
        recentNews: [],
        techStack: [],
        hiringSignals: [],
        internRelevance: `Targeting ${role}${city ? ` in ${city}` : ""}.`,
      },
      company
    );
  }

  const skillBody = loadSkillBody("company-research");
  const anthropic = createAnthropic({ apiKey });
  const tools: ToolSet = {
    web_search: anthropic.tools.webSearch_20250305({ maxUses: 5 }),
  };

  const locationLine = city ? ` Location focus: ${city}.` : "";

  const result = await generateText({
    model: anthropic("claude-sonnet-4-6"),
    system: `${skillBody}\n\nReturn ONLY a fenced JSON block as specified in the skill.`,
    prompt: `Research ${company} for a student targeting ${role}.${locationLine}`,
    tools,
    stopWhen: stepCountIs(8),
  });

  const parsed = parseJsonBlock<ResearchJson>(result.text);
  if (!parsed?.summary) {
    return withTimestamp(
      {
        company,
        summary: result.text.slice(0, 500) || `${company} (research incomplete)`,
        productsAndTeams: [],
        cultureValues: [],
        recentNews: [],
        techStack: [],
        hiringSignals: [],
        internRelevance: `Targeting ${role}.`,
      },
      company
    );
  }

  return withTimestamp(
    {
      company,
      summary: parsed.summary,
      productsAndTeams: parsed.productsAndTeams ?? [],
      cultureValues: parsed.cultureValues ?? [],
      recentNews: parsed.recentNews ?? [],
      techStack: parsed.techStack ?? [],
      hiringSignals: parsed.hiringSignals ?? [],
      internRelevance: parsed.internRelevance ?? "",
    },
    company
  );
}

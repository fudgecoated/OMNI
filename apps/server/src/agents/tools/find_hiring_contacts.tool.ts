import { tool } from "ai";
import { z } from "zod";
import { resolveCompanySlug, displayCompanyName } from "../../finder/companyAliases";
import { findPeople } from "../../finder/mockPeople";
import {
  hasLiveSearch,
  searchHiringContactsLive,
} from "../../finder/liveSearch";

export default tool({
  description:
    "Find hiring contacts at any company. Uses built-in data for Google/Amazon/Meta; for other companies runs live LinkedIn search when TAVILY_API_KEY is configured. Never invent people.",
  inputSchema: z.object({
    company: z
      .string()
      .min(1)
      .describe('Company name, e.g. "Shopify", "Google", "Microsoft".'),
    roleFilter: z
      .string()
      .optional()
      .describe('Target role, e.g. "software engineering intern".'),
    schoolFilter: z
      .string()
      .optional()
      .describe('School filter, e.g. "ucalgary".'),
    city: z
      .string()
      .optional()
      .describe('City or metro, e.g. "Calgary", "Toronto".'),
  }),
  execute: async ({ company, roleFilter, schoolFilter, city }) => {
    const displayName = displayCompanyName(company);
    const slug = resolveCompanySlug(company);
    const role = roleFilter ?? "software engineer";

    if (slug) {
      const people = findPeople(slug, {
        role: roleFilter,
        school: schoolFilter,
      });
      return {
        company: displayName,
        count: people.length,
        people: people.map((p) => ({
          name: p.name,
          role: p.role,
          team: p.team,
          linkedinUrl: p.linkedinUrl,
          schoolConnection: p.schoolConnection ?? null,
          relevanceScore: p.relevanceScore,
          contactMethod: p.contactMethod,
          tier: schoolFilter ? "exact" : "broad",
        })),
        source: "hermes_seed_data",
      };
    }

    if (!hasLiveSearch()) {
      return {
        company: displayName,
        count: 0,
        people: [],
        source: "none",
        error:
          `No seed data for "${displayName}". Add TAVILY_API_KEY to .env for live search across any company, or use Google, Amazon, or Meta in demo mode.`,
        demoCompanies: ["google", "amazon", "meta"],
      };
    }

    const { hits, queriesRun } = await searchHiringContactsLive(
      displayName,
      role,
      city,
      schoolFilter
    );

    return {
      company: displayName,
      count: hits.length,
      people: hits.map((h) => ({
        name: h.name,
        role: h.title,
        team: "",
        linkedinUrl: h.linkedinUrl,
        schoolConnection: null,
        relevanceScore: h.tier === "exact" ? 90 : h.tier === "adjacent" ? 75 : 60,
        contactMethod: "linkedin" as const,
        tier: h.tier,
        evidence: h.snippet,
      })),
      source: "live_linkedin_search",
      queriesRun,
    };
  },
});

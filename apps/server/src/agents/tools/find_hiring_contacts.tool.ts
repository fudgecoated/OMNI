import { tool } from "ai";
import { z } from "zod";
import { resolveCompanySlug, displayCompanyName } from "../../finder/companyAliases";
import { findPeople } from "../../finder/mockPeople";

function buildLinkedInQueries(
  company: string,
  role: string,
  city?: string,
  school?: string
): string[] {
  const c = company.replace(/"/g, "");
  const r = role.replace(/"/g, "");
  const cityQ = city?.replace(/"/g, "") ?? "";
  const queries: string[] = [];

  if (cityQ) {
    queries.push(`site:linkedin.com/in "${c}" "${r}" "${cityQ}"`);
    queries.push(`site:linkedin.com/in "${c}" "hiring" "${r}" "${cityQ}"`);
    queries.push(`site:linkedin.com/in "${c}" "I'm hiring" "${r}" "${cityQ}"`);
  }
  queries.push(`site:linkedin.com/in "${c}" "${r}" hiring`);
  queries.push(`site:linkedin.com/in "${c}" "Senior Manager" "${r}"`);
  queries.push(`site:linkedin.com/in "${c}" "Director" "${r}" hiring`);
  if (school) {
    queries.push(`site:linkedin.com/in "${c}" "${r}" "${school.replace(/"/g, "")}"`);
  }
  return queries;
}

export default tool({
  description:
    "Look up hiring contacts at a company. Returns seeded profiles for Google/Amazon/Meta; for other companies returns search queries — then use the web_search tool to run them.",
  inputSchema: z.object({
    company: z.string().min(1).describe('Company name, e.g. "Shopify", "Google".'),
    roleFilter: z
      .string()
      .optional()
      .describe('Target role, e.g. "software engineering intern".'),
    schoolFilter: z.string().optional().describe('School filter, e.g. "ucalgary".'),
    city: z.string().optional().describe('City, e.g. "Calgary".'),
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

    const suggestedQueries = buildLinkedInQueries(
      displayName,
      role,
      city,
      schoolFilter
    );

    return {
      company: displayName,
      count: 0,
      people: [],
      source: "claude_web_search",
      nextStep:
        "Run the web_search tool with the suggestedQueries (one or more). Extract real names and linkedin.com/in URLs from results. Do not invent people.",
      suggestedQueries,
    };
  },
});

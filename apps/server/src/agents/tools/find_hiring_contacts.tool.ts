import { tool } from "ai";
import { z } from "zod";
import { resolveCompanySlug, displayCompanyName } from "../../finder/companyAliases";
import { findPeople } from "../../finder/mockPeople";

function buildLinkedInQueries(
  company: string,
  role: string,
  teamFocus?: string,
  city?: string,
  school?: string
): string[] {
  const c = company.replace(/"/g, "");
  const r = role.replace(/"/g, "");
  const team = teamFocus?.replace(/"/g, "") ?? "";
  const cityQ = city?.replace(/"/g, "") ?? "";
  const schoolQ = school?.replace(/"/g, "") ?? "";
  const roleFamily = /software|engineer|developer|swe|frontend|backend/i.test(r)
    ? "software engineering"
    : r;
  const queries: string[] = [];

  if (cityQ) {
    queries.push(`site:linkedin.com/in "${c}" "${r}" "${cityQ}" "present"`);
    queries.push(`site:linkedin.com/in "${c}" "${roleFamily}" "manager" "${cityQ}"`);
    queries.push(`site:linkedin.com/in "${c}" "hiring" "${r}" "${cityQ}"`);
    queries.push(`site:linkedin.com/in "${c}" "recruiter" "${cityQ}" "${roleFamily}"`);
  }

  queries.push(`site:linkedin.com/in "${c}" "${r}" "present"`);
  queries.push(`site:linkedin.com/in "${c}" "${roleFamily}" "engineering manager"`);
  queries.push(`site:linkedin.com/in "${c}" "senior engineering manager"`);
  queries.push(`site:linkedin.com/in "${c}" "director" "${roleFamily}"`);
  queries.push(`site:linkedin.com/in "${c}" "technical lead" "${roleFamily}"`);
  queries.push(`site:linkedin.com/in "${c}" "staff software engineer"`);
  queries.push(`site:linkedin.com/in "${c}" "technical program manager"`);
  queries.push(`site:linkedin.com/in "${c}" "product manager" "${roleFamily}"`);
  queries.push(`site:linkedin.com/in "${c}" "project manager" "${roleFamily}"`);
  queries.push(`site:linkedin.com/in "${c}" "talent acquisition" "${roleFamily}"`);
  queries.push(`site:linkedin.com/in "${c}" "university recruiter"`);
  queries.push(`site:linkedin.com/in "${c}" "campus recruiter"`);
  queries.push(`site:linkedin.com/in "${c}" "I'm hiring" "${roleFamily}"`);

  if (team) {
    queries.push(`site:linkedin.com/in "${c}" "${team}" "${r}"`);
    queries.push(`site:linkedin.com/in "${c}" "${team}" "engineering manager"`);
    queries.push(`site:linkedin.com/in "${c}" "${team}" "product manager"`);
    queries.push(`site:linkedin.com/in "${c}" "${team}" "technical program manager"`);
    queries.push(`site:linkedin.com/in "${c}" "${team}" "recruiter"`);
  }

  if (schoolQ) {
    queries.push(`site:linkedin.com/in "${c}" "${r}" "${schoolQ}"`);
    queries.push(`site:linkedin.com/in "${c}" "${schoolQ}" "recruiter"`);
    queries.push(`site:linkedin.com/in "${c}" "${schoolQ}" "${roleFamily}"`);
  }

  return Array.from(new Set(queries));
}

export default tool({
  description:
    "Look up current hiring contacts, hiring-adjacent contacts, and connector contacts at a company. Returns seeded profiles for Google/Amazon/Meta; for other companies returns search queries, then use the web_search tool to run them.",
  inputSchema: z.object({
    company: z.string().min(1).describe('Company name, e.g. "Shopify", "Google".'),
    roleFilter: z
      .string()
      .optional()
      .describe('Target role, e.g. "software engineering intern".'),
    teamFocus: z
      .string()
      .optional()
      .describe('Target product/team/domain, e.g. "platform", "data", "mobile".'),
    schoolFilter: z.string().optional().describe('School filter, e.g. "ucalgary".'),
    city: z.string().optional().describe('City, e.g. "Calgary".'),
  }),
  execute: async ({ company, roleFilter, teamFocus, schoolFilter, city }) => {
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
          evidence: `${p.role} at ${displayName}`,
        })),
        source: "hermes_seed_data",
      };
    }

    const suggestedQueries = buildLinkedInQueries(
      displayName,
      role,
      teamFocus,
      city,
      schoolFilter
    );

    return {
      company: displayName,
      count: 0,
      people: [],
      source: "claude_web_search",
      nextStep:
        "Run web_search with multiple suggestedQueries. Extract real names, current titles, linkedin.com/in URLs, and evidence that the person currently works at the company. Exclude former employees and unverified profiles.",
      suggestedQueries,
    };
  },
});

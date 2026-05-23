import { tool } from "ai";
import { z } from "zod";
import { findPeople, isValidCompany } from "../../finder/mockPeople";

export default tool({
  description:
    "Search Hermes people database for employees at a target company. Supported companies: google, amazon, meta. Returns names, roles, teams, LinkedIn URLs, school connections, and relevance scores. Use this instead of inventing people.",
  inputSchema: z.object({
    company: z
      .enum(["google", "amazon", "meta"])
      .describe("Target company slug."),
    roleFilter: z
      .string()
      .optional()
      .describe("Filter by role or team substring, e.g. software engineer, distributed systems."),
    schoolFilter: z
      .string()
      .optional()
      .describe("Filter by school connection substring, e.g. ucalgary."),
  }),
  execute: async ({ company, roleFilter, schoolFilter }) => {
    if (!isValidCompany(company)) {
      return { company, people: [], count: 0, error: "Invalid company" };
    }

    const people = findPeople(company, {
      role: roleFilter,
      school: schoolFilter,
    });

    return {
      company,
      count: people.length,
      people: people.map((p) => ({
        name: p.name,
        role: p.role,
        team: p.team,
        linkedinUrl: p.linkedinUrl,
        schoolConnection: p.schoolConnection ?? null,
        relevanceScore: p.relevanceScore,
        contactMethod: p.contactMethod,
      })),
      source: "hermes_seed_data",
    };
  },
});

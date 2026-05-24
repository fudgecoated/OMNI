import { tool } from "ai";
import { z } from "zod";
import { displayCompanyName } from "../../finder/companyAliases";
import { runCompanyResearch } from "../context/companyResearch";

export default tool({
  description:
    "Research a company (products, culture, hiring signals). Use when company context is missing or the student asks about a new company.",
  inputSchema: z.object({
    company: z.string().min(1),
    roleFilter: z.string().optional(),
    city: z.string().optional(),
  }),
  execute: async ({ company, roleFilter, city }) => {
    const displayName = displayCompanyName(company);
    const research = await runCompanyResearch({
      company: displayName,
      role: roleFilter,
      city,
    });
    return { company: displayName, research };
  },
});

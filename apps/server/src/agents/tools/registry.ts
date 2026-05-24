import findHiringContacts from "./find_hiring_contacts.tool";
import researchCompany from "./research_company.tool";

export const hermesTools = {
  find_hiring_contacts: findHiringContacts,
  research_company: researchCompany,
} as const;

export type HermesToolName = keyof typeof hermesTools;

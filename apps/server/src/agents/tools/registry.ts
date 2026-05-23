import findCompanyPeople from "./find_company_people.tool";

/** Claude-only stack: tools use local Hermes data, no third-party search API. */
export const hermesTools = {
  find_company_people: findCompanyPeople,
} as const;

export type HermesToolName = keyof typeof hermesTools;

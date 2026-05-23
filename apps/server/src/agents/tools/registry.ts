import findHiringContacts from "./find_hiring_contacts.tool";

export const hermesTools = {
  find_hiring_contacts: findHiringContacts,
} as const;

export type HermesToolName = keyof typeof hermesTools;

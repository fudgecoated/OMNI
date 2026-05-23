import googleDorkSearch from "./google_dork_search.tool";

export const hermesTools = {
  google_dork_search: googleDorkSearch,
} as const;

export type HermesToolName = keyof typeof hermesTools;

/**
 * Curated finder demos shipped inside the server bundle (works on Vercel without repo /data).
 */
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import type { FinderSearchResponse } from "@hermes/shared";

function normalizeCompanyKey(company: string): string {
  return company.toLowerCase().trim().replace(/[^a-z0-9]/g, "");
}

const bundledDir = join(dirname(fileURLToPath(import.meta.url)), "bundled");

let westjetSample: FinderSearchResponse | null = null;

export function loadWestjetBundledSample(): FinderSearchResponse {
  if (!westjetSample) {
    const path = join(bundledDir, "westjet-search-sample.json");
    westjetSample = JSON.parse(readFileSync(path, "utf-8")) as FinderSearchResponse;
  }
  return westjetSample;
}

/** Companies with instant demo data (no live AI). */
export const DEMO_COMPANY_HINTS = [
  "WestJet (cached contacts + company brief)",
  "Google, Amazon, or Meta (seed profiles)",
] as const;

export function isDemoCompany(company: string): boolean {
  const key = normalizeCompanyKey(company);
  if (key === "westjet") return true;
  return ["google", "amazon", "meta", "alphabet", "aws", "facebook"].includes(key);
}

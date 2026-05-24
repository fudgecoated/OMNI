/**
 * Instant finder responses for demo companies (e.g. WestJet) from data/*-search-sample.json.
 * Set HERMES_FINDER_LIVE=1 to force live Claude search instead.
 */
import { readFileSync } from "fs";
import type { FinderSearchRequest, FinderSearchResponse } from "@hermes/shared";
import { westjetSearchSamplePath } from "../config/dataPaths";
import { loadWestjetBundledSample } from "./bundledSamples";

export function normalizeCompanyKey(company: string): string {
  return company.toLowerCase().trim().replace(/[^a-z0-9]/g, "");
}

/** Use cached WestJet sample unless HERMES_FINDER_LIVE=1 forces live AI. */
export function shouldUseFinderCache(): boolean {
  return process.env.HERMES_FINDER_LIVE !== "1";
}

export function tryCachedFinderSearch(
  req: FinderSearchRequest
): FinderSearchResponse | null {
  if (!shouldUseFinderCache()) return null;
  if (normalizeCompanyKey(req.company) !== "westjet") return null;

  const path = westjetSearchSamplePath();
  if (path) {
    try {
      const raw = readFileSync(path, "utf-8");
      return JSON.parse(raw) as FinderSearchResponse;
    } catch {
      // Fall through to bundled copy (Vercel / production).
    }
  }

  try {
    return loadWestjetBundledSample();
  } catch {
    return null;
  }
}

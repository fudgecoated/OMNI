/**
 * Local repeat-search cache for live AI finder results.
 *
 * This is separate from the curated WestJet sample cache: WestJet guarantees a
 * polished demo path, while this cache makes new company searches repeatable
 * during judging without changing the finder response contract.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { createHash } from "crypto";
import { join } from "path";
import type {
  CompanyResearch,
  FinderSearchRequest,
  OutreachTarget,
} from "@hermes/shared";
import { contactsDataDir } from "../config/paths";
import { isStubCompanyResearch } from "../agents/context/companyResearch";
import { displayCompanyName } from "./companyAliases";
import { dedupeTargets } from "./outreachTargets";

type FinderCacheEntry = {
  key: string;
  savedAt: string;
  company: string;
  role: string;
  city?: string;
  school?: string;
  teamFocus?: string;
  people: OutreachTarget[];
  companyResearch?: CompanyResearch;
};

type FinderCacheFile = {
  version: 1;
  entries: FinderCacheEntry[];
};

export type FinderCacheHit = {
  people: OutreachTarget[];
  companyResearch?: CompanyResearch;
  savedAt: string;
};

function cacheEnabled(): boolean {
  return process.env.HERMES_FINDER_CACHE !== "0";
}

function cacheTtlMs(): number {
  const days = Number(process.env.HERMES_FINDER_CACHE_TTL_DAYS ?? 14);
  const safeDays = Number.isFinite(days) && days > 0 ? days : 14;
  return safeDays * 24 * 60 * 60 * 1000;
}

function cacheFile(): string {
  const dir = contactsDataDir();
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const file = join(dir, "finder-cache.json");
  if (!existsSync(file)) {
    writeFileSync(file, JSON.stringify({ version: 1, entries: [] }, null, 2), "utf-8");
  }
  return file;
}

function normalizePart(value?: string): string {
  return (value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^a-z0-9\s.-]/g, "");
}

export function finderCacheKey(req: FinderSearchRequest): string {
  const parts = [
    displayCompanyName(req.company),
    req.role || "software engineering intern",
    req.teamFocus,
    req.city,
    req.school,
  ].map(normalizePart);

  return createHash("sha256")
    .update(`v3-company-fallback|${parts.join("|")}`)
    .digest("hex")
    .slice(0, 20);
}

function readCache(): FinderCacheFile {
  try {
    const parsed = JSON.parse(readFileSync(cacheFile(), "utf-8")) as FinderCacheFile;
    if (parsed.version === 1 && Array.isArray(parsed.entries)) return parsed;
  } catch {
    // Fall through to a clean cache file if the local cache was hand-edited.
  }
  return { version: 1, entries: [] };
}

function writeCache(cache: FinderCacheFile): void {
  writeFileSync(cacheFile(), JSON.stringify(cache, null, 2), "utf-8");
}

export function getCachedFinderResult(req: FinderSearchRequest): FinderCacheHit | null {
  if (!cacheEnabled()) return null;

  const key = finderCacheKey(req);
  const now = Date.now();
  const cache = readCache();
  const entry = cache.entries.find((item) => item.key === key);
  if (!entry) return null;

  if (now - Date.parse(entry.savedAt) > cacheTtlMs()) {
    writeCache({
      version: 1,
      entries: cache.entries.filter((item) => item.key !== key),
    });
    return null;
  }

  return {
    people: dedupeTargets(entry.people),
    companyResearch: isStubCompanyResearch(entry.companyResearch)
      ? undefined
      : entry.companyResearch,
    savedAt: entry.savedAt,
  };
}

export function saveFinderResult(
  req: FinderSearchRequest,
  people: OutreachTarget[],
  companyResearch?: CompanyResearch
): void {
  if (!cacheEnabled() || people.length === 0) return;

  const key = finderCacheKey(req);
  const entry: FinderCacheEntry = {
    key,
    savedAt: new Date().toISOString(),
    company: displayCompanyName(req.company),
    role: req.role?.trim() || "software engineering intern",
    teamFocus: req.teamFocus?.trim() || undefined,
    city: req.city?.trim() || undefined,
    school: req.school?.trim() || undefined,
    people: dedupeTargets(people),
    companyResearch: isStubCompanyResearch(companyResearch) ? undefined : companyResearch,
  };
  const cache = readCache();
  const next = [entry, ...cache.entries.filter((item) => item.key !== key)].slice(0, 100);
  writeCache({ version: 1, entries: next });
}

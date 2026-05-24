import { readFileSync } from "fs";
import type { CompanySlug, Person, PeopleSearchParams } from "@hermes/shared";
import { mockPeoplePath } from "../config/paths";

const VALID_COMPANIES: CompanySlug[] = ["google", "amazon", "meta"];

type MockPeopleFile = Record<CompanySlug, Person[]>;

let cache: MockPeopleFile | null = null;

export function loadMockPeople(): MockPeopleFile {
  if (!cache) {
    const raw = readFileSync(mockPeoplePath(), "utf-8");
    cache = JSON.parse(raw) as MockPeopleFile;
  }
  return cache;
}

export function isValidCompany(company: string): company is CompanySlug {
  return (VALID_COMPANIES as string[]).includes(company);
}

function searchableTokens(value: string | undefined): Set<string> {
  const normalized = (value ?? "")
    .toLowerCase()
    .replace(/\bswe\b/g, "software engineer")
    .replace(/\bsde\b/g, "software developer")
    .replace(/\bengineering\b/g, "engineer")
    .replace(/[^a-z0-9]+/g, " ");

  return new Set(
    normalized
      .split(/\s+/)
      .map((token) => token.trim())
      .filter((token) => token.length >= 4)
  );
}

function roleMatches(person: Person, roleQ: string | undefined): boolean {
  const queryTokens = searchableTokens(roleQ);
  if (queryTokens.size === 0) return true;

  const personTokens = searchableTokens(`${person.role} ${person.team}`);
  return [...queryTokens].some((token) => personTokens.has(token));
}

function schoolMatches(person: Person, schoolQ: string | undefined): boolean {
  const query = schoolQ?.toLowerCase().trim();
  if (!query) return true;

  const school = person.schoolConnection?.toLowerCase() ?? "";
  return school.includes(query);
}

export function findPeople(
  company: CompanySlug,
  params: PeopleSearchParams = {}
): Person[] {
  const people = [...(loadMockPeople()[company] ?? [])];
  const schoolQ = params.school?.trim();

  const schoolFiltered = people.filter((p) => schoolMatches(p, schoolQ));
  const roleFiltered = schoolFiltered.filter((p) => roleMatches(p, params.role));

  // Treat role text as a relevance hint, not a hard fail. This keeps broad demo
  // searches useful when the seed data says "SWE" or "SDE" instead of the exact words.
  return (roleFiltered.length > 0 ? roleFiltered : schoolFiltered).sort(
    (a, b) => b.relevanceScore - a.relevanceScore
  );
}

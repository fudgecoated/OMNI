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

export function findPeople(
  company: CompanySlug,
  params: PeopleSearchParams = {}
): Person[] {
  const people = [...(loadMockPeople()[company] ?? [])];
  const roleQ = params.role?.toLowerCase().trim();
  const schoolQ = params.school?.toLowerCase().trim();

  return people
    .filter((p) => {
      if (roleQ && !p.role.toLowerCase().includes(roleQ) && !p.team.toLowerCase().includes(roleQ)) {
        return false;
      }
      if (schoolQ) {
        const school = p.schoolConnection?.toLowerCase() ?? "";
        if (!school.includes(schoolQ)) return false;
      }
      return true;
    })
    .sort((a, b) => b.relevanceScore - a.relevanceScore);
}

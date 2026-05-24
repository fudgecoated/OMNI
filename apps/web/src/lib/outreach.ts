import type { CompanySlug, OutreachTarget, Person } from "@hermes/shared";

const SEED_SLUGS: CompanySlug[] = ["google", "amazon", "meta"];

function slugFromCompany(company: string): CompanySlug {
  const key = company.toLowerCase().trim();
  if (key.includes("google") || key.includes("alphabet")) return "google";
  if (key.includes("amazon") || key === "aws") return "amazon";
  if (key.includes("meta") || key.includes("facebook")) return "meta";
  return "google";
}

export function targetToPerson(target: OutreachTarget): Person {
  const company = SEED_SLUGS.includes(target.company.toLowerCase() as CompanySlug)
    ? (target.company.toLowerCase() as CompanySlug)
    : slugFromCompany(target.company);

  return {
    id: target.id,
    name: target.name,
    role: target.role,
    team: target.team,
    company,
    linkedinUrl: target.linkedinUrl,
    schoolConnection: target.schoolConnection,
    contactMethod: target.contactMethod,
    email: target.email,
    relevanceScore: target.relevanceScore ?? 70,
  };
}

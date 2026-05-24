import type { FinderSearchRequest } from "@hermes/shared";

export interface SessionQuery {
  company: string;
  role?: string;
  city?: string;
  school?: string;
  teamFocus?: string;
}

export function toSessionQuery(req: FinderSearchRequest): SessionQuery {
  return {
    company: req.company.trim(),
    role: req.role?.trim() || undefined,
    city: req.city?.trim() || undefined,
    school: req.school?.trim() || undefined,
    teamFocus: req.teamFocus?.trim() || undefined,
  };
}

export function searchTitle(query: SessionQuery): string {
  const parts = [query.company];
  if (query.role) parts.push(query.role);
  if (query.teamFocus) parts.push(query.teamFocus);
  if (query.city) parts.push(query.city);
  if (query.school) parts.push(query.school);
  return parts.join(" - ") || "New search";
}

export function queryKey(query: SessionQuery): string {
  return [
    query.company,
    query.role ?? "",
    query.teamFocus ?? "",
    query.city ?? "",
    query.school ?? "",
  ]
    .join("|")
    .toLowerCase();
}

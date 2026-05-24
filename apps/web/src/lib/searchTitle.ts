import type { FinderSearchRequest } from "@hermes/shared";

export interface SessionQuery {
  company: string;
  role?: string;
  city?: string;
  school?: string;
}

export function toSessionQuery(req: FinderSearchRequest): SessionQuery {
  return {
    company: req.company.trim(),
    role: req.role?.trim() || undefined,
    city: req.city?.trim() || undefined,
    school: req.school?.trim() || undefined,
  };
}

export function searchTitle(query: SessionQuery): string {
  const parts = [query.company];
  if (query.role) parts.push(query.role);
  if (query.city) parts.push(query.city);
  return parts.join(" · ") || "New search";
}

export function queryKey(query: SessionQuery): string {
  return [query.company, query.role ?? "", query.city ?? "", query.school ?? ""]
    .join("|")
    .toLowerCase();
}

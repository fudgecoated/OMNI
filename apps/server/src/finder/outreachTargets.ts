import type { OutreachTarget, Person } from "@hermes/shared";
import { createHash } from "crypto";

export function personToTarget(p: Person): OutreachTarget {
  return {
    id: p.id,
    name: p.name,
    role: p.role,
    team: p.team,
    company: p.company,
    linkedinUrl: p.linkedinUrl,
    schoolConnection: p.schoolConnection,
    contactMethod: p.contactMethod,
    email: p.email,
    relevanceScore: p.relevanceScore,
  };
}

export function targetIdFromLinkedIn(url: string, name: string): string {
  const key = url.trim().toLowerCase() || name.trim().toLowerCase();
  return createHash("sha256").update(key).digest("hex").slice(0, 16);
}

export function rawToTarget(
  raw: {
    name?: string;
    role?: string;
    team?: string;
    linkedinUrl?: string;
    schoolConnection?: string | null;
    relevanceScore?: number;
    tier?: string;
    contactMethod?: string;
    evidence?: string;
  },
  company: string
): OutreachTarget | null {
  const name = raw.name?.trim();
  const linkedinUrl = raw.linkedinUrl?.trim();
  if (!name || !linkedinUrl?.includes("linkedin.com")) return null;

  return {
    id: targetIdFromLinkedIn(linkedinUrl, name),
    name,
    role: raw.role?.trim() || "Unknown role",
    team: raw.team?.trim() || company,
    company,
    linkedinUrl,
    schoolConnection: raw.schoolConnection ?? undefined,
    contactMethod:
      raw.contactMethod === "email" ? "email" : "linkedin",
    relevanceScore: raw.relevanceScore,
    tier: raw.tier,
    evidence: raw.evidence?.trim() || undefined,
  };
}

export function dedupeTargets(people: OutreachTarget[]): OutreachTarget[] {
  const seen = new Set<string>();
  return people.filter((p) => {
    const key = p.linkedinUrl.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function parseTargetsFromJsonBlock(text: string): OutreachTarget[] {
  const match = text.match(/```json\s*([\s\S]*?)```/i);
  if (!match) return [];
  try {
    const data = JSON.parse(match[1]) as {
      people?: Array<Record<string, unknown>>;
    };
    if (!Array.isArray(data.people)) return [];
    return dedupeTargets(
      data.people
        .map((p) =>
          rawToTarget(
            {
              name: String(p.name ?? ""),
              role: String(p.role ?? ""),
              team: String(p.team ?? ""),
              linkedinUrl: String(p.linkedinUrl ?? ""),
              schoolConnection:
                p.schoolConnection != null ? String(p.schoolConnection) : null,
              relevanceScore:
                typeof p.relevanceScore === "number" ? p.relevanceScore : undefined,
              tier: p.tier != null ? String(p.tier) : undefined,
              evidence: p.evidence != null ? String(p.evidence) : undefined,
            },
            String(p.company ?? "Unknown")
          )
        )
        .filter((p): p is OutreachTarget => p !== null)
    );
  } catch {
    return [];
  }
}

function nameFromLinkedInUrl(url: string): string {
  const slug =
    url.match(/linkedin\.com\/in\/([^/?#\s)]+)/i)?.[1] ?? "linkedin-contact";
  return slug
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function normalizeLinkedInUrl(url: string): string {
  return url.replace(/[),.;\]]+$/g, "").replace(/^http:\/\//i, "https://");
}

export function parseTargetsFromLooseText(
  text: string,
  company: string,
  fallbackRole = "Relevant contact"
): OutreachTarget[] {
  const people: OutreachTarget[] = [];
  const byUrl = new Set<string>();
  const markdownLink =
    /\[([^\]\n]{2,80})\]\((https?:\/\/(?:www\.)?linkedin\.com\/in\/[^)\s]+)\)/gi;
  const bareLink =
    /https?:\/\/(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?/gi;

  for (const match of text.matchAll(markdownLink)) {
    const linkedinUrl = normalizeLinkedInUrl(match[2]);
    const key = linkedinUrl.toLowerCase();
    if (byUrl.has(key)) continue;
    byUrl.add(key);

    const target = rawToTarget(
      {
        name: match[1],
        role: fallbackRole,
        team: company,
        linkedinUrl,
        tier: "broad",
      },
      company
    );
    if (target) people.push(target);
  }

  for (const match of text.matchAll(bareLink)) {
    const linkedinUrl = normalizeLinkedInUrl(match[0]);
    const key = linkedinUrl.toLowerCase();
    if (byUrl.has(key)) continue;
    byUrl.add(key);

    const target = rawToTarget(
      {
        name: nameFromLinkedInUrl(linkedinUrl),
        role: fallbackRole,
        team: company,
        linkedinUrl,
        tier: "broad",
      },
      company
    );
    if (target) people.push(target);
  }

  return dedupeTargets(people);
}

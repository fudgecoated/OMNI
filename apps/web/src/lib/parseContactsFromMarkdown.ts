import type { OutreachTarget } from "@hermes/shared";

function targetId(linkedinUrl: string, name: string): string {
  const key = linkedinUrl.toLowerCase() || name.toLowerCase();
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) | 0;
  return `chat-${Math.abs(h).toString(36)}`;
}

function normalizeLinkedIn(url: string): string {
  const trimmed = url.trim().replace(/[)>.,]+$/, "");
  if (trimmed.startsWith("http")) return trimmed;
  return `https://www.linkedin.com/in/${trimmed.replace(/^\/+/, "")}`;
}

function guessCompany(text: string): string {
  const emoji = text.match(/🎯\s*([^—\-\n|]+)/);
  if (emoji) return emoji[1].trim();
  const heading = text.match(
    /(?:^|\n)#+\s*([A-Za-z][A-Za-z0-9\s&.]+?)\s*[—–-]\s*(?:Software|Hiring|Engineering)/im
  );
  if (heading) return heading[1].trim();
  return "Unknown";
}

function nameFromUrl(url: string): string {
  const slug = url.match(/linkedin\.com\/in\/([^/?#]+)/i)?.[1];
  if (!slug) return "LinkedIn contact";
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function parseTableRow(line: string, url: string, company: string): OutreachTarget | null {
  if (!line.includes("|")) return null;
  const cells = line
    .split("|")
    .map((c) => c.trim())
    .filter((c) => c.length > 0 && !/^[-:]+$/.test(c));
  if (cells.length < 2) return null;

  const nameCell =
    cells.find((c) => /\*\*[^*]+\*\*/.test(c)) ??
    cells.find((c) => !/^\d+$/.test(c) && !c.includes("linkedin.com")) ??
    cells[1];
  const name =
    nameCell?.match(/\*\*([^*]+)\*\*/)?.[1]?.trim() ??
    nameCell?.replace(/\[([^\]]+)\].*/, "$1").trim() ??
    nameFromUrl(url);

  const titleCell =
    cells.find(
      (c) =>
        c !== nameCell &&
        !c.includes("linkedin.com") &&
        !/^\d+$/.test(c) &&
        !/^\[.*\]\(http/.test(c)
    ) ?? cells[2];
  const role =
    titleCell
      ?.replace(/\*\*/g, "")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .trim() || "Unknown role";

  const linkedinUrl = normalizeLinkedIn(url);
  return {
    id: targetId(linkedinUrl, name),
    name,
    role,
    team: company,
    company,
    linkedinUrl,
    contactMethod: "linkedin",
    relevanceScore: 75,
  };
}

function parseInlineLink(line: string, company: string): OutreachTarget[] {
  const found: OutreachTarget[] = [];
  const re = /\[([^\]]+)\]\((https?:\/\/[^)]*linkedin\.com\/in\/[^)]+)\)/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line)) !== null) {
    const name = m[1].replace(/\*\*/g, "").trim();
    const linkedinUrl = normalizeLinkedIn(m[2]);
    if (name.toLowerCase().includes("view profile")) continue;
    found.push({
      id: targetId(linkedinUrl, name),
      name: name.length > 2 ? name : nameFromUrl(linkedinUrl),
      role: "Unknown role",
      team: company,
      company,
      linkedinUrl,
      contactMethod: "linkedin",
      relevanceScore: 70,
    });
  }
  return found;
}

export function parseContactsFromMarkdown(text: string): OutreachTarget[] {
  const company = guessCompany(text);
  const linkedInRe =
    /https?:\/\/(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?/gi;
  const byUrl = new Map<string, OutreachTarget>();

  for (const line of text.split("\n")) {
    const urls = line.match(linkedInRe) ?? [];
    for (const rawUrl of urls) {
      const linkedinUrl = normalizeLinkedIn(rawUrl);
      if (byUrl.has(linkedinUrl)) continue;

      const fromTable = parseTableRow(line, rawUrl, company);
      if (fromTable) {
        byUrl.set(linkedinUrl, fromTable);
        continue;
      }

      const inline = parseInlineLink(line, company);
      const match = inline.find((t) => t.linkedinUrl === linkedinUrl);
      if (match) {
        byUrl.set(linkedinUrl, match);
        continue;
      }

      byUrl.set(linkedinUrl, {
        id: targetId(linkedinUrl, nameFromUrl(linkedinUrl)),
        name: nameFromUrl(linkedinUrl),
        role: "Unknown role",
        team: company,
        company,
        linkedinUrl,
        contactMethod: "linkedin",
        relevanceScore: 70,
      });
    }
  }

  return [...byUrl.values()];
}

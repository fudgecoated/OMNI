export interface LiveSearchHit {
  name: string;
  title: string;
  linkedinUrl: string;
  snippet: string;
  tier: "exact" | "adjacent" | "broad";
}

interface TavilyResult {
  title?: string;
  url?: string;
  content?: string;
}

async function tavilySearch(query: string, maxResults = 5): Promise<TavilyResult[]> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) return [];

  const res = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: apiKey,
      query,
      max_results: maxResults,
      include_answer: false,
    }),
  });

  if (!res.ok) {
    console.error("Tavily search failed:", res.status);
    return [];
  }

  const data = (await res.json()) as { results?: TavilyResult[] };
  return data.results ?? [];
}

function parseLinkedInHit(
  r: TavilyResult,
  tier: LiveSearchHit["tier"]
): LiveSearchHit | null {
  const url = r.url ?? "";
  if (!url.includes("linkedin.com/in/")) return null;

  const title = (r.title ?? "").trim();
  const snippet = (r.content ?? "").trim();
  const name =
    title.split("|")[0]?.split(" - ")[0]?.split(" – ")[0]?.trim() ||
    title.split(" on LinkedIn")[0]?.trim() ||
    "Unknown";

  return {
    name,
    title: title || "LinkedIn profile",
    linkedinUrl: url.split("?")[0],
    snippet,
    tier,
  };
}

function dedupeHits(hits: LiveSearchHit[]): LiveSearchHit[] {
  const seen = new Set<string>();
  return hits.filter((h) => {
    if (seen.has(h.linkedinUrl)) return false;
    seen.add(h.linkedinUrl);
    return true;
  });
}

/** Tiered Google dork search via Tavily (any company name). */
export async function searchHiringContactsLive(
  company: string,
  role: string,
  city?: string,
  school?: string
): Promise<{ hits: LiveSearchHit[]; queriesRun: string[] }> {
  const c = company.replace(/"/g, "");
  const r = role.replace(/"/g, "");
  const cityQ = city?.replace(/"/g, "") ?? "";
  const queriesRun: string[] = [];
  const hits: LiveSearchHit[] = [];

  const tier1 = cityQ
    ? [
        `site:linkedin.com/in "${c}" "${r}" "${cityQ}"`,
        `site:linkedin.com/in "${c}" "hiring" "${r}" "${cityQ}"`,
        `site:linkedin.com/in "${c}" "I'm hiring" "${r}" "${cityQ}"`,
      ]
    : [];

  const tier2 = [
    `site:linkedin.com/in "${c}" "${r}" hiring`,
    `site:linkedin.com/in "${c}" "I'm hiring" "${r}"`,
    `site:linkedin.com/in "${c}" "Senior Manager" "${r}"`,
  ];

  const tier3 = [
    `site:linkedin.com/in "${c}" "Director" "${r}"`,
    `site:linkedin.com/in "${c}" "Head of" "${r}"`,
  ];

  const runTier = async (queries: string[], tier: LiveSearchHit["tier"]) => {
    for (const q of queries) {
      if (hits.length >= 8) break;
      queriesRun.push(q);
      const results = await tavilySearch(q, 5);
      for (const row of results) {
        const hit = parseLinkedInHit(row, tier);
        if (hit) hits.push(hit);
      }
    }
  };

  await runTier(tier1, "exact");
  if (hits.length < 3) await runTier(tier2, "adjacent");
  if (hits.length < 3) await runTier(tier3, "broad");

  return { hits: dedupeHits(hits), queriesRun };
}

export function hasLiveSearch(): boolean {
  return Boolean(process.env.TAVILY_API_KEY?.trim());
}

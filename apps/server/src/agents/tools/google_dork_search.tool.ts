import { tool } from "ai";
import { z } from "zod";

export interface DorkSearchResult {
  title: string;
  url: string;
  snippet: string;
}

async function searchTavily(query: string, maxResults: number): Promise<DorkSearchResult[]> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) {
    throw new Error("TAVILY_API_KEY not configured");
  }

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
    throw new Error(`Tavily search failed: ${res.status}`);
  }

  const data = (await res.json()) as {
    results?: Array<{ title?: string; url?: string; content?: string }>;
  };

  return (data.results ?? []).map((r) => ({
    title: r.title ?? "",
    url: r.url ?? "",
    snippet: r.content ?? "",
  }));
}

/** Demo fallback when no search API key — keeps hackathon demo unblocked. */
function mockResults(query: string): DorkSearchResult[] {
  return [
    {
      title: "Mock hiring manager (demo mode)",
      url: "https://linkedin.com/in/example-demo",
      snippet: `[Demo] No TAVILY_API_KEY set. Query was: ${query}. Add TAVILY_API_KEY to .env for live Google dork results.`,
    },
  ];
}

export default tool({
  description:
    "Run a Google-style dork search (e.g. site:linkedin.com/in \"Company\" \"role\" \"city\"). Use for hiring-manager-finder tier searches. Returns titles, URLs, and snippets.",
  inputSchema: z.object({
    query: z
      .string()
      .min(3)
      .describe("Full search query including site:linkedin.com/in dork operators."),
    maxResults: z.number().int().min(1).max(10).default(5),
  }),
  execute: async ({ query, maxResults }) => {
    try {
      const results = process.env.TAVILY_API_KEY
        ? await searchTavily(query, maxResults)
        : mockResults(query);
      return { query, results, live: !!process.env.TAVILY_API_KEY };
    } catch (err) {
      return {
        query,
        results: mockResults(query),
        live: false,
        error: err instanceof Error ? err.message : "Search failed",
      };
    }
  },
});

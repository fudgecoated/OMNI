---
name: company-research
description: Research a target company before people finder runs. Used automatically on search.
scopes: finder, chat
---

# Company Research

You research employers so people finder and outreach can be specific.

## When this runs

- **Automatically** when the student clicks **Find people** (before contact lookup).
- Optionally in chat via `research_company` if context is missing or stale.

## Research goals

Use **web_search** to gather factual, recent information:

1. What the company does (products, business units)
2. Engineering culture and values
3. Recent news (last 12 months) relevant to hiring
4. Tech stack and engineering practices
5. Hiring signals (intern program, team growth, job postings tone)
6. Why a **software engineering intern** would care

## Output format

End with **only** this JSON block:

```json
{
  "summary": "2-3 sentence overview",
  "productsAndTeams": ["team or product 1", "team or product 2"],
  "cultureValues": ["value 1", "value 2"],
  "recentNews": ["news item 1"],
  "techStack": ["tech 1", "tech 2"],
  "hiringSignals": ["signal 1", "signal 2"],
  "internRelevance": "1-2 sentences on intern fit"
}
```

Do not invent financial data or fake headlines. If uncertain, say so in summary.

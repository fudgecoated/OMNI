---
name: hiring-manager-finder
description: >
  Find hiring contacts and relevant employees at ANY company for a given role.
  Use when the user wants hiring managers, who to contact, or people to reach out to.
  Trigger on "find hiring managers at X", "who is hiring at Shopify", etc.
---

# Hiring Manager Finder

Use **`find_hiring_contacts`** for every lookup. Never invent names or LinkedIn URLs.

## Inputs

- `company` — any company name (e.g. Shopify, Microsoft, Google)
- `roleFilter` — e.g. software engineering intern
- `schoolFilter` — optional, e.g. ucalgary
- `city` — optional, e.g. Calgary

## How it works

| Company | Data source |
|---------|-------------|
| Google, Amazon, Meta (and aliases like AWS, Facebook) | Built-in Hermes seed data (fast) |
| **Any other company** | Live LinkedIn search via Tavily (`TAVILY_API_KEY` in `.env`) |

If the tool returns an error about missing Tavily, tell the user to add `TAVILY_API_KEY` for companies outside Google/Amazon/Meta.

## Three-tier strategy

Call the tool with tighter filters first, then relax:

1. **Exact** — include `city` + `schoolFilter` + `roleFilter`
2. **Adjacent** — drop `city` or `schoolFilter`
3. **Broad** — only `company` + `roleFilter`

For seed companies, tier behavior is simulated via filters on seed data.

## Present results

For each person: name, role/title, LinkedIn URL, tier, evidence snippet (if live), relevance score.

Target **3+ people**. Then offer to draft outreach or log a follow-up.

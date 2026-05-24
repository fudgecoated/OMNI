---
name: hiring-manager-finder
description: Find hiring contacts at ANY company. Uses find_hiring_contacts + web_search.
scopes: finder, chat
---

## Company & role context

When **Company research** and **Job role context** are provided in the prompt, use them to:

- Pick better LinkedIn queries (right product area, stack, hiring signals)
- Score contacts higher if they match the role level and team
- Mention specific teams/products in evidence snippets

# Hiring Manager Finder

Never invent names or LinkedIn URLs.

## Step 1 — `find_hiring_contacts`

Always call with `company`, `roleFilter`, and optional `city` / `schoolFilter`.

- **Google, Amazon, Meta** (and AWS, Facebook): returns seeded people immediately.
- **Any other company**: returns `suggestedQueries` — go to Step 2.

## Step 2 — `web_search` (any company not in seed data)

When `suggestedQueries` is returned, run **web_search** for each query (or combine the best 2–3). Use results to extract:

- Real names
- Titles
- `linkedin.com/in/...` URLs
- Evidence snippets

Apply the three-tier mindset from the queries (exact → adjacent → broad).

## Present results

For each person: Name, Title, LinkedIn URL, Tier, Evidence.

Target 3+ people. Then offer to draft outreach.

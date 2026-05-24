---
name: hiring-manager-finder
description: Find current hiring contacts, adjacent contacts, and connector contacts at ANY company. Uses find_hiring_contacts + web_search.
scopes: finder, chat
---

## Company & Role Context

When **Company research** and **Job role context** are provided in the prompt, use them to:

- Pick better LinkedIn queries using the requested team focus, stack, locations, and hiring signals
- Score contacts higher if they match the target role, team, or hiring influence
- Mention specific teams/products in evidence snippets

# Hiring Manager Finder

Never invent names, titles, companies, or LinkedIn URLs.

## Step 1 - `find_hiring_contacts`

Always call with `company`, `roleFilter`, and optional `teamFocus`, `city`, / `schoolFilter`.

- **Google, Amazon, Meta** (and AWS, Facebook): returns seeded people immediately.
- **Any other company**: returns `suggestedQueries` - go to Step 2.

## Step 2 - `web_search` (any company not in seed data)

When `suggestedQueries` is returned, run **web_search** across several exact, adjacent, and connector queries. Use results to extract:

- Real names
- Current titles
- `linkedin.com/in/...` URLs
- Evidence snippets showing current employment at the target company

Only include people when the search result indicates they currently work at the target company. Exclude former employees, profiles where the current company is unclear, and people with only an alumni/school connection.

Use this mix when available:

- exact: hiring managers, engineering managers, directors, relevant team leads
- adjacent: technical program managers, project managers, product managers, staff/senior engineers on relevant teams
- connector: campus recruiters, university recruiters, talent acquisition, sourcers

Apply the three-tier mindset from the queries: exact -> adjacent -> connector.

## Present Results

For each person: Name, Title, LinkedIn URL, Tier, Evidence of current employment.

Target 6-10 people when credible. Then offer to draft outreach.

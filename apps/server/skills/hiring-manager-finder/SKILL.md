---
name: hiring-manager-finder
description: >
  Find the names, titles, and LinkedIn profiles of hiring managers at any company for any role,
  using Google dork searches against LinkedIn. Use this skill whenever the user wants to find
  who is hiring for a specific role at a specific company, identify the hiring manager behind a
  job posting, research who to reach out to for a job application, or find decision-makers in
  a company's hiring process. Trigger on phrases like "find the hiring manager at X for Y role",
  "who is hiring for X at Y", "find me the people hiring product owners at Z", "who should I
  contact about a job at X", or any request to identify people responsible for recruiting or
  hiring a particular role. Always use this skill — don't try to answer from memory or general
  knowledge, because hiring manager information changes frequently and must be searched live.
---

# Hiring Manager Finder

Find the actual names and LinkedIn profiles of hiring managers at any company for any role,
using Google dork searches against LinkedIn.

## Core approach

LinkedIn blocks direct scraping, but Google indexes LinkedIn public profiles and posts.
The trick is to run targeted Google dork queries that surface people who have *posted* about
hiring — which is the strongest signal that they are the actual hiring manager.

## Tool: `google_dork_search`

For **each** dork query below, call the `google_dork_search` tool with the full query string (including `site:linkedin.com/in`). Do not invent results — only report people returned by the tool.

---

## Search Strategy: Three-Tier System

Always work through the tiers in order. Run all queries in a tier before moving to the next.
Only move to the next tier if the current tier yields fewer than 3 confirmed, relevant names.

### Tier 1 — Exact Match (run these first)

These queries require ALL THREE of: company, role, AND location. Run each as a separate search.

```
site:linkedin.com/in "{company}" "{role}" "{city}"
site:linkedin.com/in "{company}" "hiring" "{role}" "{city}"
site:linkedin.com/in "{company}" "I'm hiring" "{role}" "{city}"
site:linkedin.com/in "{company}" "we're hiring" "{role}" "{city}"
site:linkedin.com/in "{company}" "Senior Manager" "{role}" "{city}"
site:linkedin.com/in "{company}" "Director" "{role}" "{city}"
```

**Relevance filter for Tier 1 results:**
- The person's current role at the company must be directly related to the requested role domain
  (e.g. for "Data Engineer", accept: Data Engineering, Data & AI, Analytics, Platform Engineering;
  reject: SAP, Finance, HR, Sales, unrelated consulting practices)
- Location must match (city or metro area specified by the user)
- If a result is ambiguous, skip it — do not include it

---

### Tier 2 — Adjacent Match (only if Tier 1 yields < 3 names)

Drop the location constraint. Keep company + role exact. Run each as a separate search.

```
site:linkedin.com/in "{company}" "{role}" hiring
site:linkedin.com/in "{company}" "I'm hiring" "{role}"
site:linkedin.com/in "{company}" "we're hiring" "{role}"
site:linkedin.com/in "{company}" "Senior Manager" "{role}"
site:linkedin.com/in "{company}" "Director" "{role}" hiring
site:linkedin.com/in "{company}" "VP" "{role domain}" hiring
```

**Relevance filter for Tier 2 results:**
- Same role domain filter as Tier 1 — reject people whose current role is unrelated to the
  requested role (e.g. someone whose title is "SAP Consultant" is NOT a match for "Data Engineer")
- Note in your output that this person may not be in the requested city

---

### Tier 3 — Broad Match (only if Tier 1 + Tier 2 combined yield < 3 names)

Drop both location and exact role. Search by company + seniority level + general domain.

```
site:linkedin.com/in "{company}" "Director" "{role domain}" Canada
site:linkedin.com/in "{company}" "Managing Consultant" "{role domain}"
site:linkedin.com/in "{company}" "Associate Partner" "{role domain}"
site:linkedin.com/in "{company}" "Head of" "{role domain}"
```

**Relevance filter for Tier 3 results:**
- Only include people whose title/profile clearly indicates they lead the relevant domain
- Clearly label these results as "broader match — may not be the direct hiring manager"

---

## Step 2: Extract signal from results

For each search result, evaluate:

1. **Direct hiring posts** — snippets containing "I'm hiring", "we're hiring", "#hiring", or
   "know anyone" are the strongest signal. Extract the person's name and title.
2. **Reporting chain clues** — phrases like "reports into me", "join my team", "my team is hiring"
   confirm the person is the hiring manager.
3. **Title signals** — Senior Manager, Director, VP, Head of, Associate Partner — these are the
   likely hiring managers for individual contributor roles.
4. **LinkedIn profile URLs** — capture the full `linkedin.com/in/...` URL from the result.

**Hard disqualifiers — exclude any result where:**
- The person's title/specialty is clearly a different domain (e.g. SAP, Oracle, Finance, HR)
  and the request is for a technical role like Data Engineer, Software Engineer, etc.
- The company connection is ambiguous or the person no longer works there
- The result is a job board aggregator (indeed, glassdoor, themuse, talent.com, etc.)

---

## Step 3: Present results

Group results by tier. Be transparent about which tier each person came from.

For each person found, display:
- **Name**
- **Title** at the company
- **LinkedIn URL** (linked)
- **Location** (city if known)
- **Tier** — Exact / Adjacent / Broad
- **Evidence** — one sentence from the snippet showing they are hiring or leading the relevant team

If multiple people appear for the same role, list all of them.

**Minimum target: 3 people.** If fewer than 3 are found across all tiers, say so explicitly and
provide the manual search suggestions below.

---

## Step 4: If < 3 names found after all tiers

Tell the user clearly and suggest:
1. Searching manually on LinkedIn: `IBM data engineering Calgary` filtered to "People" + "Current company: IBM"
2. Checking the job posting page on LinkedIn — logged-in users sometimes see the poster's name
3. Using Apollo.io or Hunter.io to find senior data leaders at the company by title
4. Searching `"{company}" "data engineering" "{city}" site:linkedin.com/posts` for recent hiring posts

---

## Step 5: Offer next steps

After presenting results, offer to:
- Draft a personalized LinkedIn outreach message to any of the hiring managers found
- Search for a hiring manager's email using additional dork queries
- Broaden the search to adjacent locations or titles

---

## Example

User: "Find hiring managers at Shopify for a Data Engineer role in Toronto"

**Tier 1 queries:**
```
site:linkedin.com/in "Shopify" "Data Engineer" "Toronto"
site:linkedin.com/in "Shopify" "hiring" "Data Engineer" "Toronto"
site:linkedin.com/in "Shopify" "Senior Manager" "Data Engineer" "Toronto"
site:linkedin.com/in "Shopify" "Director" "Data Engineer" "Toronto"
```

→ If Tier 1 returns 3+ relevant data engineering managers in Toronto: stop and present results.

→ If Tier 1 returns < 3: run Tier 2 (drop "Toronto"):
```
site:linkedin.com/in "Shopify" "hiring" "Data Engineer"
site:linkedin.com/in "Shopify" "Senior Manager" "Data Engineer"
site:linkedin.com/in "Shopify" "Director" "Data" hiring
```

→ If Tier 1 + Tier 2 still < 3: run Tier 3:
```
site:linkedin.com/in "Shopify" "Director" "Data" Canada
site:linkedin.com/in "Shopify" "Head of" "Data Engineering"
```

Then extract names, titles, URLs, evidence snippets — grouped by tier.

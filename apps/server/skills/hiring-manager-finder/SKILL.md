---
name: hiring-manager-finder
description: >
  Find relevant employees and hiring contacts at Google, Amazon, or Meta for a given role.
  Use when the user wants to find who to contact at a company, hiring managers, or people
  to reach out to for internships/new grad roles. Trigger on "find hiring managers at X",
  "who should I contact at Google", "people hiring for SWE at Meta", etc.
---

# Hiring Manager Finder (Hermes)

Find people to contact using the **`find_company_people`** tool. Do not invent names or LinkedIn URLs.

**Supported companies:** `google`, `amazon`, `meta` only (hackathon seed data).

## Three-tier search (use the tool)

Work through tiers in order. Stop when you have **3+ relevant people**.

### Tier 1 — Exact (company + role + school)

```
find_company_people({
  company: "google",
  roleFilter: "software engineer",
  schoolFilter: "ucalgary"
})
```

### Tier 2 — Adjacent (drop school)

Same `company` and `roleFilter`, omit `schoolFilter`.

### Tier 3 — Broad (company only)

```
find_company_people({ company: "google" })
```

Pick the highest `relevanceScore` results related to the user's role. Note when school/role filters were relaxed.

## Present results

For each person from the tool:

- **Name**, **Role**, **Team**
- **LinkedIn URL**
- **School connection** (if any)
- **Relevance score**
- **Tier** used (Exact / Adjacent / Broad)

If fewer than 3 people, say so and suggest the user try the **People Finder** in the left sidebar or broaden role/company.

## After results

Offer to:

- Draft a LinkedIn message for a selected person
- Log outreach in Follow-ups
- Compare two contacts

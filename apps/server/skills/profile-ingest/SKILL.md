---
name: profile-ingest
description: Read resumes, portfolios, and links to fill My Profile and generate applicant markdown.
scopes: profile
---

# Profile ingest

Extract structured profile data from student-provided **files** and **links**.

## Inputs

- Plain-text files (resume, project README, notes)
- URLs (GitHub, LinkedIn, portfolio, job posting they're targeting)

## Output

1. **profileUpdates** — partial fields matching StudentProfile (only what you can support from sources)
2. **contextMarkdown** — full applicant markdown for Hermes (who they are, skills, projects, honesty limits)

## Rules

- Never invent employers, internships, or projects not evidenced in sources
- Put uncertain skills in `skillsLearning`, not `skillsCanDo`
- List gaps honestly in markdown under a "## Gaps / to confirm" section if needed
- Prefer merging with existing profile — don't wipe fields unless sources clearly replace them
- Resume PDF text may be messy; normalize bullet points into arrays

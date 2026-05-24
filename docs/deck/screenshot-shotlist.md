# Screenshot Shotlist

This shotlist is for later capture. Do not mark screenshots as complete until real images are captured from the app.

## Capture Settings

- Capture width: 1280-1440px desktop.
- Prefer browser zoom: 90-100%.
- Use the current confetti Weave UI, not older warm/cream mockups.
- Keep the sidebar visible when capturing `/app`.
- Stage the WestJet cached path first for speed and reliability.
- Avoid empty states unless the slide is intentionally about onboarding.

## Top 5 Submission Screenshots

### 1. Landing Page

| Field | Detail |
|-------|--------|
| Route | `/` |
| State | Logo, hero headline, demo login, and at least part of the three-step path. |
| Caption | "Weave turns cold applications into warm conversations." |
| Rubric | Problem relevance, user experience, feasibility. |
| Setup | No data required. |

### 2. People Finder Search

| Field | Detail |
|-------|--------|
| Route | `/app` -> People Finder |
| State | Search form filled with a target company such as WestJet, target role, city, and optional school/context filter. |
| Caption | "Start with a company and the kind of connection you need." |
| Rubric | Execution, feasibility, user experience. |
| Setup | Enter demo workspace and create or reuse a search pin. |

### 3. Finder Results

| Field | Detail |
|-------|--------|
| Route | `/app` -> People Finder -> Selected tab |
| State | Ranked contacts visible, "Why this person" visible, match score visible, selected state/actions visible. |
| Caption | "Every contact includes a reason to reach out." |
| Rubric | Creativity, problem relevance, execution, impact. |
| Setup | Run WestJet finder search. Use cached sample when possible. |

### 4. Outreach Draft Or Chat

| Field | Detail |
|-------|--------|
| Route | `/app` -> Outreach Chat |
| State | Draft or assistant response referencing candidate proof, company context, and a selected contact. |
| Caption | "Specific messages beat generic networking." |
| Rubric | Required AI/API use, impact, execution, technical quality. |
| Setup | Select at least one contact and generate a draft or send a prompt in Outreach Chat. |

### 5. Follow-Up Pipeline

| Field | Detail |
|-------|--------|
| Route | `/app` -> Follow-ups |
| State | Pipeline/list with several contacts in different statuses, ideally one follow-up due. |
| Caption | "The connection loop continues after the first message." |
| Rubric | Functional completeness, impact, feasibility. |
| Setup | Add selected contacts to pipeline and move statuses before capture. |

## Optional Deck-Only Screenshots

### 6. My Profile

| Field | Detail |
|-------|--------|
| Route | `/app` -> My Profile |
| State | Profile fields populated with projects, skills, goals, and links. |
| Use | Shows that outreach is grounded in a real candidate, not generic AI text. |

### 7. Company Brief

| Field | Detail |
|-------|--------|
| Route | `/app` -> People Finder -> Company tab |
| State | Company summary, hiring signals, role context, and relevant bullets visible. |
| Use | Shows research before outreach. |

### 8. Finder Coach

| Field | Detail |
|-------|--------|
| Route | `/app` -> People Finder after search |
| State | Finder coach answer prioritizing selected contacts. |
| Use | Shows the two-coach model: who to contact vs what to say. |

## Screenshot Prep Checklist

1. Start the app locally.
2. Open `/`, capture the landing page.
3. Enter `/app`.
4. Confirm profile has plausible projects and motivation.
5. Run WestJet or another target-company search.
6. Confirm results have "Why this person" visible.
7. Generate or stage one draft.
8. Populate follow-up statuses.
9. Capture at consistent browser dimensions.
10. Save images later under `docs/deck/screenshots/` with descriptive filenames.

## Proposed Filenames

- `01-landing.png`
- `02-people-finder-search.png`
- `03-finder-results-why-this-person.png`
- `04-outreach-draft.png`
- `05-followups-pipeline.png`
- `06-profile-context.png`
- `07-company-brief.png`
- `08-finder-coach-prioritization.png`

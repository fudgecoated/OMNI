# Weave Submission Packet

## Project

**Name:** Weave

**One-liner:** Weave helps people turn cold applications and vague networking advice into useful conversations.

**Public repo:** https://github.com/fudgecoated/OMNI

**Demo URL:** Add deployed URL here when available. Local demo: http://localhost:5173/

## Concise Description

Weave is a connection workspace for students and early-career candidates navigating internships, co-ops, new-grad roles, part-time roles, referrals, and other relationship-led searches. A candidate enters their profile, searches a target company, gets a company brief, finds relevant people, drafts personalized outreach, and tracks follow-ups in one pin-based workflow.

The emotional pain is real: most people are not short on effort, they are short on access. They submit into a void, second-guess their background, and avoid networking because they do not know who to contact or how to ask without sounding desperate. Weave reframes the task from "please notice me" into a clear sequence: research, choose a person, show proof, make a respectful ask, follow up.

## What To Demo

1. Start at the landing page and click **Enter demo workspace**.
2. Open **People Finder** and search a target company such as WestJet.
3. Show the company brief and ranked contacts in the selected-contact panel.
4. Ask the finder coach who to prioritize.
5. Click **Draft outreach** and show an outreach message grounded in the candidate's profile and the company context.
6. Open **Follow-ups** and show how contacted people move through the pipeline.

## Screenshot Checklist

Upload up to five screenshots for visual review:

1. **Landing page:** Weave logo, hero message, and demo login.
2. **People Finder search:** company, role, city, and school filter ready to run.
3. **Finder results:** ranked contacts with "Why this person" context and visible actions.
4. **Outreach Chat / draft:** profile-aware message using company and contact context.
5. **Follow-ups:** contact pipeline showing the system remembers who needs a nudge.

## Scoring Highlights

| Rubric Area | Submission Point |
|-------------|------------------|
| Problem relevance | Built from the personal pain of student job hunting, then broadened to the larger access problem: invisible applications, cold-start networking, generic messages, and forgotten follow-ups. |
| Execution | Core loop works from landing page to finder results to outreach draft to follow-up tracking. |
| Creativity | People-first workflow that treats outreach as a relationship-building sequence, not a resume rewrite or job-board search. |
| Technical quality | TypeScript monorepo, React/Vite UI, Express API, shared contracts, streaming AI chat, runtime skills, and finder cache paths for demo reliability. |
| User experience | Polished landing page, three-column workspace, selected-contact panel, readable cards, and clear demo navigation. |
| Impact | Helps candidates take action with confidence: choose the right person, write a specific message, and keep momentum after silence. |
| Feasibility | Honest MVP scope with demo login, cached/seeded finder paths, local persistence, and clear out-of-scope production features. |
| Use of required tool/API | AI is central to research, finder reasoning, coaching, prompt skills, and context-aware outreach drafting. |

## Deliberate Prompt Tailoring

The prompt asks for a real personal pain point. We deliberately added:

- **Emotional framing:** the landing page and docs name the silence, shame, and avoidance loop around applications.
- **Profile grounding:** messages use the candidate's real projects, goals, and motivation rather than generic AI text.
- **Contact relevance:** finder results include why a person is worth contacting.
- **Separated anxieties:** finder coach handles prioritization; outreach coach handles wording.
- **Follow-through:** the pipeline keeps the next nudge visible after the first message.
- **Demo reliability:** cached/seeded paths make the complete loop feasible under judging time constraints.

## Built vs Demo Notes

- WestJet has a cached sample path for reliable demos.
- Seed people data exists for common big-tech examples.
- Live AI search can run with `ANTHROPIC_API_KEY`.
- Demo login is intentionally temporary and local-only.
- Production auth, production database, and automated LinkedIn sending are intentionally out of scope.

See [FEATURE_STATUS.md](./FEATURE_STATUS.md) for the full feature matrix.

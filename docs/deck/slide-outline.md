# Weave 5-Slide Deck Outline

This is the recommended main judging deck. It is intentionally short: one emotional hook, one insight, one solution, one proof slide, and one technical/impact close.

## Slide 1: Hook

**Title:** Most people are not short on effort. They are short on access.

**Subtitle:** The right conversation can change your trajectory, but most people do not know who to contact, what to say, or how to follow up.

**Visual:** Weave logo, light confetti canvas, one small network or pin icon.

**Speaker note:** "Weave starts from the painful gap between ambition and access. People often have the effort, skills, and motivation, but no obvious path into the rooms where useful conversations happen."

**Rubric:** Problem relevance, impact, user experience.

## Slide 2: Big Idea

**Title:** The best opportunities are often not posted. They are passed.

**Body:** Weave starts with job search, but the larger product is useful connections: referrals, mentors, collaborators, customers, advisors, and hidden opportunities.

**Supporting line:** Cold outreach increases the surface area of luck.

**Visual:** Simple path from cold network -> relevant people -> useful conversations -> opportunity.

**Evidence:** Weak-ties research and outreach-appreciation research from [source-notes.md](./source-notes.md).

**Rubric:** Creativity, problem relevance, impact.

## Slide 3: Solution

**Title:** Weave makes the first human step concrete.

**Body:** Research the context. Find relevant people. Understand why they matter. Draft a credible message. Follow through.

**Visual:** Product loop:
Profile -> Find people -> Why this person -> Draft outreach -> Follow up.

**Screenshot need:** Landing page or compact product-flow composite.

**Speaker note:** "The wedge is job search because that pain is sharp and personal, but the loop applies to any high-stakes outreach moment."

**Rubric:** Execution, feasibility, user experience.

## Slide 4: Product Proof

**Title:** From cold application to warm conversation.

**Body:** One product slide should show the loop working, not describe it abstractly.

**Visual:** Three-panel screenshot composition:
1. Finder results with "Why this person."
2. Outreach draft grounded in profile + company + contact.
3. Follow-up pipeline.

**Caption:** Every contact becomes a reason, a message, and a next step.

**Speaker note:** "This is what makes it different from a job board or generic AI writer. Weave identifies the person, explains the relevance, helps write the message, and keeps the loop alive."

**Rubric:** Execution, user experience, required AI/API use, impact.

## Slide 5: Technical Quality And Vision

**Title:** AI is inside the connection loop.

**Body:**
- React/Vite frontend and Express/TypeScript backend.
- Shared TypeScript contracts across web and server.
- AI research, finder reasoning, chat coaching, and skill-based prompts.
- Cached/seeded demo paths for reliable judging.
- Starts with job search, expands to any useful connection.

**Visual:** Lightweight architecture diagram:
Profile -> Finder API -> OutreachContext -> Coaches/Drafts -> Follow-ups.

**Close line:** Make useful connections less accidental.

**Evidence:** [../ARCHITECTURE.md](../ARCHITECTURE.md), [../FINDER.md](../FINDER.md), [../AGENTS.md](../AGENTS.md), [../FEATURE_STATUS.md](../FEATURE_STATUS.md).

**Rubric:** Technical quality, feasibility, use of required tool/API, impact.

## Optional Speaker Notes

- "Close friends give you support. Weak ties give you reach."
- "Your future is partly hidden inside conversations with people you have not met yet."
- "The product is not about sending more messages. It is about making better, more specific attempts."
- "We do not claim production auth or automated LinkedIn sending. The MVP is honest and demo-ready."

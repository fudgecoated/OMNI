# Weave Design Notes

Weave's design goal is to make a stressful job-search workflow feel concrete, energetic, and manageable.

## Product Scene

A student or early-career candidate is preparing an outreach sprint on a laptop. The product should feel brighter than a CRM and more specific than a generic AI chatbot. The user should feel: "I know the next person to message, and I know why."

## Information Architecture

The workspace is section-scoped:

| Section | Purpose |
|---------|---------|
| My Profile | Capture the applicant story that powers every prompt. |
| People Finder | Search companies, review company context, select contacts. |
| Outreach Chat | Draft and refine messages using selected contacts. |
| Follow-ups | Keep contacted people moving through the pipeline. |

The three-column workspace keeps the user's mental model stable:

- Left: pinned searches and sections.
- Center: the active coach or form.
- Right: supporting context, selected people, messages, or pipeline.

## Visual Direction

- **Brand:** Weave, using the transparent wordmark and section icons.
- **Tone:** confident, bright, student-friendly, not corporate beige.
- **Palette:** modern confetti colors anchored by blue, with pink, yellow, green, and purple accents.
- **Typography:** Bricolage Grotesque for display, Figtree for UI, Newsreader for conversational/prose surfaces.
- **Layout:** generous whitespace, clear hierarchy, compact result cards, and visible primary actions.

## UX Choices

| Choice | Why It Helps |
|--------|--------------|
| Landing page before workspace | Gives judges and users the story before they enter a tool-heavy app. |
| Demo login | Keeps the hackathon flow fast while making the entry feel realistic. |
| One pin = one company search | Keeps research, contacts, chats, and drafts bundled by target company. |
| Auto-select contacts | Reduces setup friction after a finder search. |
| "Why this person" near the contact identity | Makes relevance visible before the user decides what to do. |
| Separate finder and outreach coaches | Keeps prioritization and message-writing as distinct mental tasks. |

## Screenshot Guidance

For visual review, prioritize screenshots that show both polish and functional flow:

1. Landing page with logo and demo login.
2. People Finder search form.
3. Finder results with selected contacts and contact actions.
4. Outreach Chat with a contextual draft.
5. Follow-up pipeline.

## Accessibility And Usability Notes

- The landing page has explicit labels, form controls, focus states, and responsive stacking.
- Contact actions remain visible in narrow panels.
- Typography choices separate UI controls from longer conversational text.
- The workspace avoids modal-heavy flows so the user can keep context visible.

## Design Evidence In Code

- Landing page: [apps/web/src/components/landing/WeaveLandingPage.tsx](../apps/web/src/components/landing/WeaveLandingPage.tsx)
- Workspace shell: [apps/web/src/App.tsx](../apps/web/src/App.tsx)
- Sidebar: [apps/web/src/components/layout/HermesSidebar.tsx](../apps/web/src/components/layout/HermesSidebar.tsx)
- Main layout: [apps/web/src/components/pages/WorkspacePage.tsx](../apps/web/src/components/pages/WorkspacePage.tsx)
- Theme and responsive rules: [apps/web/src/styles/index.css](../apps/web/src/styles/index.css)

# Hermes — product overview

## Problem

Students and early-career job seekers applying to roles often:

- Do not know **who** to message at a target company (hiring manager vs recruiter vs alumni).
- Send **generic** LinkedIn notes that ignore company context and their own projects.
- Lose track of **who they contacted**, when to follow up, and pipeline stage.

Hermes is a single workspace that combines company research, contact discovery, AI coaching, message drafting, and lightweight CRM.

## Users

Primary wedge: **students and early-career candidates** who are applying to internships, co-ops, new-grad roles, part-time roles, referrals, or other relationship-led opportunities without a warm network.

Initial demo persona: a Calgary/UCalgary software engineering student, because that is the team's personal pain point and gives the hackathon story a concrete starting place.

Secondary: hackathon judges and teammates demoing with WestJet / big-tech examples.

## Core ideas

### 1. One pin = one company search

A **pin** (session) stores:

- Search query (company, role, city, school filter)
- Company research brief
- Discovered contacts
- Separate chat threads: **finder coach** vs **outreach coach**
- Selected contacts for drafting

Pins appear in the left sidebar under **Pinned searches**. **+ New search** in the sidebar is the only way to start a fresh company search (no duplicate buttons in the center or right panels).

### 2. Profile is the source of truth

**My Profile** captures projects, skills, goals, and links. That data is:

- Rendered as markdown context for the user
- Sent to the server as `student` on finder and chat requests
- Injected into `OutreachContext.applicant` for every AI call

### 3. Section-scoped UI

Each nav item owns its center column and right-panel tabs:

| Section | Center | Right tabs |
|---------|--------|------------|
| My Profile | Profile Coach chat | Profile (form + markdown) |
| People Finder | Search form → Search coach chat | Company · Selected |
| Outreach Chat | Outreach coach | Message · Contacts |
| Follow-ups | Planner copy | Follow-ups (list + pipeline) |

### 4. People Finder layout (after search)

1. User runs **Find people** (center form on a new or existing pin).
2. Server returns contacts + `outreachContext`.
3. **All contacts are auto-selected**; UI opens the **Selected** tab on the right.
4. **Center** becomes full-height **Search coach** only (no contact list in the middle).
5. User asks who to prioritize, then **Draft outreach →** opens Outreach Chat with the same pin.

## Out of scope (MVP)

- Sending messages on LinkedIn automatically
- Multi-user accounts / auth
- Production database (contacts use JSON file on disk)

## Success criteria (hackathon)

- Demo WestJet product-owner search with company brief + 5+ contacts in under a few seconds (cached sample).
- Draft a personalized message using profile + company + selected contact.
- Move a contact through the follow-up pipeline.

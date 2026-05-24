# People Finder

## User flow

```
+ New search (sidebar only)
       ↓
Center: search form (company, role, city, school)
       ↓
POST /api/finder/search
       ↓
Right: Company tab (brief) + Selected tab (all contacts, checked)
Center: Search coach (full height)
```

**Adjust search** appears only when a search completes with zero contacts (center empty state). To search a different company on a new pin, use **+ New search** in the left sidebar.

## Server pipeline

`POST /api/finder/search` (`apps/server/src/routes/finder.ts`):

1. **Cache** — If company normalizes to `westjet` and `data/westjet-search-sample.json` exists, return immediately unless `HERMES_FINDER_LIVE=1`. Applicant context is rebuilt from the request `student` profile.
2. **Seed companies** — `google`, `amazon`, `meta` use `data/mock_people.json` + seed company briefs (no API key).
3. **AI path** — `buildSearchContext()` then `aiFinderSearch()`:
   - Context: company research (stub or live), job role, applicant
   - Agent: Claude + `find_hiring_contacts` + `web_search` tools
   - Parses JSON block and tool results into `OutreachTarget[]`

### Environment flags

| Variable | Effect |
|----------|--------|
| `ANTHROPIC_API_KEY` | Required for live AI search and company research |
| `HERMES_FINDER_LIVE=1` | Force full AI for WestJet (skip sample cache) |
| `HERMES_FINDER_FAST=0` | Run live company web research before people search (~90s total) |

Default: fast stub company context + one AI pass; WestJet uses cached sample when present.

## Frontend state

| Piece | Role |
|-------|------|
| `useFinder` | Calls API, updates pin, auto-selects all contacts |
| `applyFinderSelection` | Sets `selectedTargets` + switches to Selected tab |
| `HermesSession.results` | Full contact list for the pin |
| `HermesSession.finderMessages` | Finder coach only (not outreach chat) |
| `finder-${sessionId}` | AI SDK chat id so finder/outreach do not share React state |

## Files

| Path | Purpose |
|------|---------|
| `apps/web/src/components/finder/FinderWorkspace.tsx` | Phases: form / empty / chat-only |
| `apps/web/src/components/finder/FinderSearchForm.tsx` | Search inputs |
| `apps/web/src/components/finder/FinderCoachToolbar.tsx` | Pin title + “View contacts” |
| `apps/web/src/components/results/PersonResult.tsx` | Selected tab list + checkboxes |
| `apps/web/src/lib/finderSelection.ts` | Auto-select helper |
| `apps/server/src/finder/cachedFinderSearch.ts` | WestJet sample loader |
| `apps/server/src/finder/buildSearchContext.ts` | Company + role + applicant context |
| `apps/server/src/finder/aiFinderSearch.ts` | Claude people-finder agent |

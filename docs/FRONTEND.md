# Frontend architecture

Stack: **React 19**, **Vite**, **Zustand** (persisted sessions + profile), **Vercel AI SDK** (`@ai-sdk/react`) for streaming chat.

## Layout

```
┌─────────────────────────────────────────────────────────────┐
│ HermesSidebar (nav + section panel)                         │
├──────────────┬──────────────────────────┬───────────────────┤
│ Pinned       │ WorkspacePage center     │ ResultsPanel      │
│ searches OR  │ (section-specific)       │ (tabs per section)│
│ chat pins    │                          │                   │
└──────────────┴──────────────────────────┴───────────────────┘
```

`ResizableSplit` between center and right (`storageKey: split:hermes-workspace`).

## Navigation sections

Configured in `apps/web/src/lib/sectionConfig.ts` — each section defines nav label, workspace header, center title, and allowed right tabs.

`useHermesStore.sidebarSection` drives which center component `WorkspacePage` renders.

## Session pins (`sessionStore`)

Persisted to `localStorage` key `hermes-sessions-v1`.

A pin is a `HermesSession`:

- **query** — `{ company, role?, city?, school? }`
- **results** — contacts from finder
- **selectedTargets** — subset used for outreach drafts
- **messages** — outreach coach thread
- **finderMessages** — people finder coach thread (separate)
- **outreachContext** — `{ company, jobRole, applicant }` from server

`selectSession` / `createSession` call `syncHermesFromSession` to copy selection into `hermesStore` and auto-select all results when a pin has contacts but empty selection.

## People Finder UI phases

`FinderWorkspace` chooses one view:

| Condition | Center UI |
|-----------|-----------|
| No `searchedAt`, no results | `FinderSearchForm` |
| `searchedAt`, 0 results | Empty state + “Adjust search” |
| `results.length > 0` | `FinderCoachToolbar` + `ChatInterface` (finder) |

**New search** only via `SessionList` **+ New search** → `createSession()`.

## Chat IDs

| Surface | `useHermesChat` id | Persisted field |
|---------|-------------------|-----------------|
| Outreach | `sessionId` | `messages` |
| Finder coach | `finder-${sessionId}` | `finderMessages` |

## Key stores

| Store | Persistence | Purpose |
|-------|-------------|---------|
| `sessionStore` | Yes | Pins, results, both chat threads |
| `profileStore` | Yes | Student profile form + markdown |
| `hermesStore` | No | UI section, tab, selection, loading |

## API client

`apps/web/src/lib/api.ts` — `apiUrl()` + `apiFetch()`:

- **Development:** requests go to `http://127.0.0.1:3002` directly (CORS allowed). This avoids Vite returning `index.html` when the proxy is misconfigured.
- **Production:** same-origin relative `/api/...` unless `VITE_API_URL` is set.

Streaming chat (`useChat`, `useProfileChat`) uses `apiUrl()` for the transport endpoint too.

Vite can still proxy `/api` → `:3002` for tools that use relative URLs; `vite preview` includes the same proxy block.

# Testing Hermes with WestJet (Product Owner)

End-to-end check that **skills + agents** work for a non-seed company. Requires `ANTHROPIC_API_KEY` in `apps/server/.env` or repo root `.env`.

## 1. Start the stack

```bash
pnpm install
pnpm dev
```

Open http://localhost:5173

## 2. My Profile

1. Go to **My Profile**
2. Confirm **Context (Markdown)** updates when you edit the form
3. Optional: **Import with Hermes** — paste `https://www.linkedin.com/in/yourprofile` + a resume `.md`

## 3. People Finder — WestJet product owner

**Fast path:** With `data/westjet-search-sample.json` present (run `./scripts/test-westjet-search.sh` once to create it), WestJet searches return in ~1s unless you set `HERMES_FINDER_LIVE=1` in `.env` to force a full ~90s AI run.

1. **People Finder** → **+ New search**
2. Query:
   - Company: `WestJet`
   - Role: `product owner` (or `digital product`)
   - City: `Calgary`
3. Click **Find people**
4. Expect: company brief on **Company** tab, contacts in center (AI + `web_search` if key set)
5. Select 1–2 contacts → **Selected** tab

## 4. Outreach Chat

1. Open **Outreach Chat** for that pin
2. Ask: `Draft a LinkedIn note for my selected contact as a UCalgary SWE student interested in product-adjacent work`
3. Confirm the draft mentions your profile (projects/skills), not generic filler

## 5. Follow-ups

1. **Follow-ups** → **Log outreach sent** (or **Add to pipeline** first)
2. Change **status** in the dropdown (e.g. Replied → Interview)
3. Open **Pipeline** tab — card should move column when you change status

## API smoke test (optional)

With server on port 3002:

```bash
./scripts/test-westjet-search.sh
```

Creates `data/westjet-search-sample.json` with people + context from the API.

## What works without API key

| Feature | Without key |
|---------|-------------|
| Google / Amazon / Meta finder | Seed data only |
| WestJet finder | Fails or empty |
| Outreach chat | Error |
| Profile import | Error |

## Troubleshooting

- **No people for WestJet** — Check server logs; confirm `ANTHROPIC_API_KEY`
- **Marcus Lee still in tracker** — Old `data/contacts.json`; edit status or delete the row in that file
- **Company shows as google** in old entries — Re-log contact after update (company is now stored as display name)

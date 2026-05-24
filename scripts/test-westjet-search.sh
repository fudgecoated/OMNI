#!/usr/bin/env bash
# Smoke test: WestJet product owner search (needs ANTHROPIC_API_KEY + server on :3002)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/data/westjet-search-sample.json"
PORT="${PORT:-3002}"

if ! curl -sf "http://localhost:${PORT}/health" >/dev/null; then
  echo "Start server first: pnpm --filter @hermes/server dev"
  exit 1
fi

STUDENT='{
  "name": "Alex Student",
  "year": "3rd-year",
  "school": "University of Calgary",
  "location": "Calgary, AB",
  "githubUrl": "https://github.com/example",
  "targetRole": "software engineering internship",
  "jobSearchWhy": "Summer internship to ship real features and learn product-minded engineering.",
  "skillsCanDo": ["Python", "Go", "REST APIs", "SQL"],
  "skillsLearning": ["product discovery", "system design"],
  "skillsAvoid": ["Claiming PM ownership"],
  "projects": [{"name":"Campus queue API","description":"Go API with Redis","tech":["Go"],"highlight":"40% latency win"}],
  "interests": ["backend", "product"]
}'

echo "POST /api/finder/search (WestJet, product owner)…"
curl -sf "http://localhost:${PORT}/api/finder/search" \
  -H "Content-Type: application/json" \
  -d "{\"company\":\"WestJet\",\"role\":\"product owner\",\"city\":\"Calgary\",\"school\":\"ucalgary\",\"student\":$STUDENT}" \
  | tee "$OUT" | head -c 2000

echo ""
echo "Wrote sample to $OUT"
echo "People count: $(jq '.count // 0' "$OUT" 2>/dev/null || echo '?')"

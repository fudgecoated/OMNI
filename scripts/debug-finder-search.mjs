/**
 * One-off finder debug: POST /api/finder/search and print count + sample people.
 * Usage: node scripts/debug-finder-search.mjs "TD Bank" "software engineer" "Toronto"
 */
import { loadEnv } from "../apps/server/dist/config/loadEnv.js";
import { createApp } from "../apps/server/dist/index.js";
import request from "supertest";

loadEnv();
process.env.HERMES_FINDER_TIMEOUT_MS = process.env.HERMES_FINDER_TIMEOUT_MS ?? "300000";

const [company, role = "software engineer", city = ""] = process.argv.slice(2);
if (!company) {
  console.error("Usage: node scripts/debug-finder-search.mjs <company> [role] [city]");
  process.exit(1);
}

const app = createApp();
const body = { company, role, city: city || undefined };

console.log("POST /api/finder/search", body);
const start = Date.now();
const res = await request(app)
  .post("/api/finder/search")
  .send(body)
  .timeout({ deadline: 320_000 });

console.log("Status:", res.status, `(${((Date.now() - start) / 1000).toFixed(1)}s)`);
if (res.body?.error) {
  console.log("Error:", res.body.error);
  process.exit(1);
}
console.log("count:", res.body.count, "source:", res.body.source);
for (const p of (res.body.people ?? []).slice(0, 5)) {
  console.log("-", p.name, "|", p.role, "|", p.linkedinUrl);
}

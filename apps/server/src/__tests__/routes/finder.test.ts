import { describe, it, expect } from "vitest";
import request from "supertest";
import { createApp } from "../../index";

describe("GET /api/companies/:company/people", () => {
  const app = createApp();

  it("returns people for google", async () => {
    const res = await request(app).get("/api/companies/google/people");
    expect(res.status).toBe(200);
    expect(res.body.count).toBeGreaterThanOrEqual(5);
    expect(res.body.people[0]).toHaveProperty("relevanceScore");
  });

  it("rejects unknown company", async () => {
    const res = await request(app).get("/api/companies/acme/people");
    expect(res.status).toBe(400);
  });
});

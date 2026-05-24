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

  it("treats a blank school query as no school filter", async () => {
    const res = await request(app)
      .get("/api/companies/google/people")
      .query({ role: "software engineering intern", school: "" });

    expect(res.status).toBe(200);
    expect(res.body.count).toBeGreaterThan(0);
  });

  it("matches common role wording instead of requiring an exact substring", async () => {
    const res = await request(app)
      .get("/api/companies/google/people")
      .query({ role: "software engineering intern", school: "ucalgary" });

    expect(res.status).toBe(200);
    expect(res.body.count).toBeGreaterThan(0);
    expect(res.body.people[0].schoolConnection).toMatch(/ucalgary/i);
  });

  it("rejects unknown company", async () => {
    const res = await request(app).get("/api/companies/acme/people");
    expect(res.status).toBe(400);
  });
});

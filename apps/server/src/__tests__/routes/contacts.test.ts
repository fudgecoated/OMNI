import { mkdtempSync, rmSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { afterAll, beforeAll, describe, it, expect } from "vitest";
import request from "supertest";
import { createApp } from "../../index";

describe("contacts API", () => {
  const app = createApp();
  let testDataDir: string;

  beforeAll(() => {
    testDataDir = mkdtempSync(join(tmpdir(), "hermes-contacts-test-"));
    process.env.HERMES_CONTACTS_DATA_DIR = testDataDir;
  });

  afterAll(() => {
    delete process.env.HERMES_CONTACTS_DATA_DIR;
    rmSync(testDataDir, { recursive: true, force: true });
  });

  it("GET /api/contacts returns JSON list", async () => {
    const res = await request(app).get("/api/contacts");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(Array.isArray(res.body.contacts)).toBe(true);
  });

  it("GET /api/contacts/due returns JSON list", async () => {
    const res = await request(app).get("/api/contacts/due");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(Array.isArray(res.body.contacts)).toBe(true);
  });

  it("POST and DELETE /api/contacts", async () => {
    const created = await request(app)
      .post("/api/contacts")
      .send({
        company: "WestJet",
        personName: "Test User",
        personRole: "Product Owner",
        linkedinUrl: "https://linkedin.com/in/test-user-hermes",
        status: "prospect",
      });
    expect(created.status).toBe(201);
    expect(created.body.id).toBeTruthy();

    const removed = await request(app).delete(`/api/contacts/${created.body.id}`);
    expect(removed.status).toBe(204);

    const list = await request(app).get("/api/contacts");
    expect(list.body.contacts.some((c: { id: string }) => c.id === created.body.id)).toBe(
      false
    );
  });
});

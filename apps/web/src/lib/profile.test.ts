import { describe, expect, it } from "vitest";
import { normalizeStudentProfile, profileCompleteness } from "@hermes/shared";

describe("profile", () => {
  it("normalizes partial profile", () => {
    const p = normalizeStudentProfile({
      name: "Sam",
      jobSearchWhy: "Want an internship to learn production systems.",
      skillsCanDo: ["Go"],
      projects: [{ name: "API", description: "Built API", tech: ["Go"] }],
    });
    expect(p.projects).toHaveLength(1);
  });

  it("scores completeness", () => {
    const p = normalizeStudentProfile({
      name: "Sam Lee",
      school: "UCalgary",
      targetRole: "SWE intern",
      jobSearchWhy: "I want to grow as a backend engineer this summer.",
      skillsCanDo: ["Python"],
      projects: [{ name: "X", description: "Did Y", tech: [] }],
    });
    expect(profileCompleteness(p).percent).toBeGreaterThanOrEqual(80);
  });
});

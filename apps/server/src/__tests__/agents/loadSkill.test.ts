import { describe, it, expect } from "vitest";
import {
  listSkills,
  loadSkillBody,
  buildSkillsSystemBlock,
} from "../../agents/loadSkill";

describe("loadSkill", () => {
  it("lists core skills", () => {
    const names = listSkills();
    expect(names).toContain("hiring-manager-finder");
    expect(names).toContain("company-research");
    expect(names).toContain("job-role-context");
    expect(names).toContain("applicant-context");
    expect(names).toContain("outreach-messaging");
  });

  it("loads skill body without frontmatter", () => {
    const body = loadSkillBody("hiring-manager-finder");
    expect(body).toContain("find_hiring_contacts");
    expect(body).not.toContain("name: hiring-manager-finder");
  });

  it("buildSkillsSystemBlock includes skill content", () => {
    const block = buildSkillsSystemBlock();
    expect(block).toContain("hiring-manager-finder");
    expect(block).toContain("find_hiring_contacts");
  });
});

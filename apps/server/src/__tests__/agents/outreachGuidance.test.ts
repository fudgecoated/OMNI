import { describe, expect, it } from "vitest";
import { buildOutreachGuidance } from "../../agents/context/outreachGuidance";
import type { OutreachContext } from "@hermes/shared";

const westjetContext: OutreachContext = {
  company: {
    company: "WestJet",
    summary: "Calgary airline.",
    productsAndTeams: ["Disruption Management Solutions (Technology Office)"],
    cultureValues: ["safety"],
    recentNews: ["Sunwing integration 2025"],
    techStack: ["REST APIs", "Agile / Scrum"],
    hiringSignals: ["Active Product Owner posting in Calgary"],
    internRelevance: "Term PO roles suit students with Agile and API fluency.",
    researchedAt: new Date().toISOString(),
  },
  jobRole: {
    roleTitle: "product owner",
    level: "mid",
    summary: "Targeting product owner at WestJet.",
    responsibilities: [],
    skillsToEmphasize: ["communication", "collaboration"],
    talkingPoints: ["Why product owner at WestJet fits your background"],
  },
  applicant: {
    name: "Alex Student",
    school: "University of Calgary",
    year: "3rd-year",
    location: "Calgary, AB",
    targetRole: "software engineering internship",
    interests: [],
    githubUrl: "https://github.com/example",
    summary: "",
    strengths: ["Go"],
    outreachAngles: ["Lead with Campus queue API"],
    whoTheyAre: "",
    jobSearchWhy: "Summer internship to ship real features.",
    careerGoals: "",
    skillsCanDo: ["Go", "Python"],
    skillsLearning: ["product discovery"],
    skillsAvoid: ["Claiming PM ownership"],
    projects: [],
    innovativeWork: "",
    narrativeForAI: "",
  },
};

describe("buildOutreachGuidance", () => {
  it("returns personalized apply, learn, and outreach sections", () => {
    const g = buildOutreachGuidance(westjetContext);
    expect(g.applyApproach.length).toBeGreaterThan(0);
    expect(g.skillsToLearn.length).toBeGreaterThan(0);
    expect(g.outreachStrategy.length).toBeGreaterThan(0);
    expect(g.applyApproach.some((s) => /Apply|careers/i.test(s))).toBe(true);
    expect(g.skillsToLearn.some((s) => /product discovery/i.test(s))).toBe(true);
    expect(g.applyApproach.some((s) => /Do not claim/i.test(s))).toBe(true);
  });
});

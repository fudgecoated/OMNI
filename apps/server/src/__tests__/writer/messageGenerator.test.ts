import { describe, expect, it } from "vitest";
import { generateMessage } from "../../writer/messageGenerator";
import type { GenerateMessageRequest } from "@hermes/shared";

const baseStudent = {
  name: "Alex Student",
  year: "3rd-year",
  school: "University of Calgary",
  location: "Calgary, AB",
  targetRole: "software engineering internship",
  interests: ["distributed systems"],
  skillsCanDo: ["Python", "Go"],
  skillsLearning: ["Kubernetes", "system design interviews"],
  skillsAvoid: [],
  projects: [
    {
      name: "Campus queue API",
      description:
        "Built a wait-time API for campus services with rate limiting and Redis caching.",
      tech: ["Go", "Redis", "PostgreSQL"],
      highlight: "Reduced p95 latency 40% vs naive polling",
    },
  ],
  jobSearchWhy:
    "I want a summer internship to apply what I've learned in distributed systems courses and ship code on real infrastructure.",
  githubUrl: "https://github.com/example",
};

const basePerson = {
  id: "p1",
  name: "Anne-Louise Brooks",
  role: "Product Owner",
  team: "Disruption Management Solutions Team (Technology Office)",
  company: "google" as const,
  linkedinUrl: "https://linkedin.com/in/example",
};

const richContext: GenerateMessageRequest["outreachContext"] = {
  company: {
    company: "Google",
    summary: "Large technology company with many product teams.",
    productsAndTeams: [
      "Disruption Management Solutions Team (Technology Office)",
    ],
    cultureValues: [],
    recentNews: [
      "completed integration of sunwing airlines into westjet operations (2025)",
    ],
    techStack: [
      "Sabre SabreSonic Passenger Service System (PSS)",
      "SabreMosaic cloud-native retailing platform (under evaluation)",
    ],
    hiringSignals: [],
    internRelevance: "",
    researchedAt: new Date().toISOString(),
  },
  applicant: {
    projects: baseStudent.projects,
    jobSearchWhy: baseStudent.jobSearchWhy,
    skillsLearning: baseStudent.skillsLearning,
    innovativeWork:
      "experimenting with a small event-sourced ledger for club budgets – learning CQRS patterns",
  },
};

function makeRequest(
  overrides: Partial<GenerateMessageRequest> = {}
): GenerateMessageRequest {
  return {
    person: basePerson,
    student: baseStudent,
    templateType: "cold_email",
    outreachContext: richContext,
    ...overrides,
  };
}

const dashPattern = /[\u2012\u2013\u2014\u2015]| — | – /;

describe("generateMessage", () => {
  it("keeps subject under 60 characters", () => {
    const { subject } = generateMessage(makeRequest());
    expect(subject.length).toBeLessThanOrEqual(60);
    expect(subject).not.toContain("→");
    expect(subject).not.toMatch(/Technology Office/i);
  });

  it("avoids en/em dashes in subject and body", () => {
    const { subject, body } = generateMessage(makeRequest());
    expect(subject).not.toMatch(dashPattern);
    expect(body).not.toMatch(dashPattern);
  });

  it("formats body with paragraph breaks", () => {
    const { body } = generateMessage(makeRequest());
    expect(body).toContain("\n\n");
    expect(body.startsWith("Hi Anne-Louise,")).toBe(true);
    expect(body).toMatch(/Thanks,\nAlex Student$/);
  });

  it("stays within a reasonable word count", () => {
    const { body } = generateMessage(makeRequest());
    const words = body.split(/\s+/).filter(Boolean).length;
    expect(words).toBeLessThanOrEqual(155);
  });
});

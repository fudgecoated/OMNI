import type { CompanySlug, StudentProfile } from "@hermes/shared";
import { normalizeStudentProfile } from "@hermes/shared";

export const COMPANIES: { id: CompanySlug; label: string }[] = [
  { id: "google", label: "Google" },
  { id: "amazon", label: "Amazon" },
  { id: "meta", label: "Meta" },
];

export const DEFAULT_STUDENT: StudentProfile = normalizeStudentProfile({
  name: "Alex Student",
  year: "3rd-year",
  school: "University of Calgary",
  location: "Calgary, AB",
  linkedinUrl: "",
  githubUrl: "https://github.com/example",
  targetRole: "software engineering internship",
  jobSearchWhy:
    "I want a summer internship to apply what I've learned in distributed systems courses and ship code on real infrastructure.",
  careerGoals:
    "Backend or infrastructure SWE at a product company after graduation, with mentorship and measurable impact.",
  interests: ["distributed systems", "backend engineering"],
  skillsCanDo: [
    "Python",
    "Go",
    "REST APIs",
    "PostgreSQL",
    "Docker",
    "pair programming",
  ],
  skillsLearning: ["Kubernetes", "system design interviews", "gRPC"],
  skillsAvoid: [
    "Claiming ML research depth",
    "Frontend-heavy roles without React portfolio",
  ],
  projects: [
    {
      name: "Campus queue API",
      description:
        "Built a wait-time API for campus services with rate limiting and Redis caching.",
      tech: ["Go", "Redis", "PostgreSQL"],
      link: "https://github.com/example",
      highlight: "Reduced p95 latency 40% vs naive polling",
    },
  ],
  innovativeWork:
    "Experimenting with a small event-sourced ledger for club budgets — learning CQRS patterns.",
});

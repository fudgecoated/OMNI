import type { CompanyResearch, JobRoleContext } from "@hermes/shared";
import { loadSkillBody } from "../loadSkill";

function inferLevel(role: string): string {
  const r = role.toLowerCase();
  if (r.includes("intern")) return "intern";
  if (r.includes("new grad") || r.includes("entry")) return "entry";
  if (r.includes("senior") || r.includes("staff")) return "senior";
  if (r.includes("manager") || r.includes("director")) return "leadership";
  return "mid";
}

function defaultSkills(role: string): string[] {
  const r = role.toLowerCase();
  const skills = ["problem solving", "communication", "collaboration"];
  if (r.includes("software") || r.includes("swe") || r.includes("engineer")) {
    skills.push("data structures", "systems", "at least one of Python/Java/C++");
  }
  if (r.includes("frontend")) skills.push("React", "TypeScript", "UI performance");
  if (r.includes("backend")) skills.push("APIs", "databases", "distributed systems");
  if (r.includes("ml") || r.includes("machine learning")) {
    skills.push("ML fundamentals", "Python", "experimentation");
  }
  return skills;
}

/** Build job-role context using company research (no extra API call). */
export function buildJobRoleContext(params: {
  role: string;
  company: string;
  city?: string;
  companyResearch?: CompanyResearch;
}): JobRoleContext {
  const roleTitle = params.role.trim() || "software engineering intern";
  const level = inferLevel(roleTitle);
  const company = params.companyResearch?.company ?? params.company;
  const cityLine = params.city ? ` in ${params.city}` : "";

  const hiring = params.companyResearch?.hiringSignals ?? [];
  const tech = params.companyResearch?.techStack ?? [];

  const responsibilities: string[] = [];
  if (level === "intern") {
    responsibilities.push(
      "Ship a scoped project with mentor support",
      "Collaborate with a feature team",
      "Learn codebase and review practices"
    );
  } else {
    responsibilities.push(
      "Design and implement features",
      "Participate in code review and on-call (team-dependent)"
    );
  }

  const talkingPoints = [
    `Why ${roleTitle} at ${company} fits your background`,
    hiring[0] ? `Reference: ${hiring[0]}` : `Interest in ${company}'s products`,
    tech.length ? `Align experience with ${tech.slice(0, 3).join(", ")}` : "",
    params.companyResearch?.internRelevance ?? "",
  ].filter(Boolean);

  const summary = [
    `Targeting ${roleTitle} (${level}) at ${company}${cityLine}.`,
    params.companyResearch?.summary
      ? `Company angle: ${params.companyResearch.summary.slice(0, 200)}…`
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  void loadSkillBody("job-role-context");

  return {
    roleTitle,
    level,
    summary,
    responsibilities,
    skillsToEmphasize: defaultSkills(roleTitle),
    talkingPoints,
  };
}

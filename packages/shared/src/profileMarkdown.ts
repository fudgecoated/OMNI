import type { StudentProfile } from "./types";
import { normalizeStudentProfile } from "./profile";

function projectLine(p: StudentProfile["projects"][0]): string {
  const tech = p.tech.length ? ` (${p.tech.join(", ")})` : "";
  const hl = p.highlight ? ` — ${p.highlight}` : "";
  const link = p.link ? ` · [link](${p.link})` : "";
  return `- **${p.name}**: ${p.description}${tech}${hl}${link}`;
}

/** Markdown narrative Hermes uses for outreach, finder, and profile context tab. */
export function buildProfileMarkdown(
  student: StudentProfile,
  companyName?: string
): string {
  const s = normalizeStudentProfile(student);
  const companyLine = companyName ? ` for ${companyName}` : "";

  const whoTheyAre = [
    `${s.name}, ${s.year} at ${s.school}, based in ${s.location}.`,
    s.careerGoals ? `Longer term: ${s.careerGoals}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  const sections: string[] = [
    `# Applicant context${companyLine}`,
    `_Generated from My Profile · ${new Date().toISOString().slice(0, 10)}_`,
    "",
    "## Who they are",
    whoTheyAre || "_Not provided_",
    "",
    "## Links",
    [
      s.githubUrl && `- GitHub: ${s.githubUrl}`,
      s.linkedinUrl && `- LinkedIn: ${s.linkedinUrl}`,
    ]
      .filter(Boolean)
      .join("\n") || "_No links_",
    "",
    "## Target role",
    s.targetRole || "_Not provided_",
    "",
    "## Why job searching",
    s.jobSearchWhy || "_Not provided_",
  ];

  if (s.careerGoals) {
    sections.push("", "## Career goals", s.careerGoals);
  }

  if (s.skillsCanDo.length) {
    sections.push("", "## Can demonstrate", s.skillsCanDo.map((x) => `- ${x}`).join("\n"));
  }

  if (s.skillsLearning.length) {
    sections.push("", "## Currently learning", s.skillsLearning.map((x) => `- ${x}`).join("\n"));
  }

  if (s.skillsAvoid.length) {
    sections.push("", "## Do not claim", s.skillsAvoid.map((x) => `- ${x}`).join("\n"));
  }

  if (s.projects.length) {
    sections.push("", "## Projects", ...s.projects.filter((p) => p.name || p.description).map(projectLine));
  }

  if (s.innovativeWork) {
    sections.push("", "## Innovative work", s.innovativeWork);
  }

  sections.push(
    "",
    "## Outreach rules",
    "- One proof point per message",
    "- Respect skills marked as do not claim",
    "- Connect job-search why to the contact's team when possible"
  );

  return sections.join("\n");
}

import type { ApplicantContext, StudentProfile } from "@hermes/shared";
import { buildProfileMarkdown, normalizeStudentProfile } from "@hermes/shared";
import { loadSkillBody } from "../loadSkill";

const DEFAULT_STUDENT = normalizeStudentProfile({
  name: "Student",
  year: "",
  school: "University of Calgary",
  location: "Calgary, AB",
  githubUrl: "",
  targetRole: "software engineering internship",
  jobSearchWhy: "",
  interests: [],
  skillsCanDo: [],
  skillsLearning: [],
  skillsAvoid: [],
  projects: [],
});

/**
 * Build applicant context from the student's profile.
 *
 * The behavioral goal is to move outreach away from generic flattery and toward
 * honest proof: motivation, projects, strengths, learning edges, and a concrete
 * reason this company/contact makes sense.
 */
export function buildApplicantContext(
  student?: StudentProfile,
  companyName?: string
): ApplicantContext {
  void loadSkillBody("applicant-context");

  const s = normalizeStudentProfile(student ?? DEFAULT_STUDENT);
  const companyLine = companyName ? ` for ${companyName}` : "";

  const whoTheyAre = [
    `${s.name}, ${s.year} at ${s.school}, based in ${s.location}.`,
    s.careerGoals ? `Longer term: ${s.careerGoals}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  const strengths = [
    ...s.skillsCanDo,
    ...s.projects.map((p) => p.name).filter(Boolean),
    s.innovativeWork ? "active side experiments" : "",
  ].filter(Boolean);

  const outreachAngles: string[] = [];
  if (s.jobSearchWhy) {
    outreachAngles.push(`Motivation: ${s.jobSearchWhy.slice(0, 160)}`);
  }
  const topProject = s.projects.find((p) => p.name && p.description);
  if (topProject) {
    outreachAngles.push(`Lead with project "${topProject.name}" and one metric or outcome`);
  }
  if (companyName) {
    outreachAngles.push(
      `Tie ${companyName} to one product/team from company research — not generic praise`
    );
  }
  if (s.skillsLearning.length) {
    outreachAngles.push(`Mention learning ${s.skillsLearning.slice(0, 2).join(" & ")} as growth angle`);
  }
  if (s.githubUrl) outreachAngles.push(`Portfolio: ${s.githubUrl}`);
  if (s.linkedinUrl) outreachAngles.push(`LinkedIn: ${s.linkedinUrl}`);

  const narrativeForAI = buildProfileMarkdown(s, companyName);

  return {
    name: s.name,
    school: s.school,
    year: s.year,
    location: s.location,
    targetRole: s.targetRole,
    interests: s.interests.length ? s.interests : s.skillsCanDo,
    githubUrl: s.githubUrl,
    linkedinUrl: s.linkedinUrl,
    summary: `${s.name} is targeting ${s.targetRole}${companyLine}. ${s.jobSearchWhy.slice(0, 200)}`,
    strengths,
    outreachAngles,
    whoTheyAre,
    jobSearchWhy: s.jobSearchWhy,
    careerGoals: s.careerGoals ?? "",
    skillsCanDo: s.skillsCanDo,
    skillsLearning: s.skillsLearning,
    skillsAvoid: s.skillsAvoid,
    projects: s.projects,
    innovativeWork: s.innovativeWork ?? "",
    narrativeForAI,
  };
}

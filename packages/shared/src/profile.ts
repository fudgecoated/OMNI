import type { StudentProfile } from "./types";

export function normalizeStudentProfile(
  partial: Partial<StudentProfile> = {}
): StudentProfile {
  const interests = partial.interests ?? [];
  return {
    name: partial.name?.trim() || "",
    year: partial.year?.trim() || "",
    school: partial.school?.trim() || "",
    location: partial.location?.trim() || "",
    linkedinUrl: partial.linkedinUrl?.trim() || "",
    githubUrl: partial.githubUrl?.trim() || "",
    targetRole: partial.targetRole?.trim() || "",
    jobSearchWhy: partial.jobSearchWhy?.trim() || "",
    careerGoals: partial.careerGoals?.trim() || "",
    interests,
    skillsCanDo: partial.skillsCanDo?.length
      ? partial.skillsCanDo
      : interests.length
        ? [...interests]
        : [],
    skillsLearning: partial.skillsLearning ?? [],
    skillsAvoid: partial.skillsAvoid ?? [],
    projects: partial.projects ?? [],
    innovativeWork: partial.innovativeWork?.trim() || "",
  };
}

const PROFILE_FIELDS: { key: keyof StudentProfile; label: string; minLen?: number }[] =
  [
    { key: "name", label: "Name", minLen: 2 },
    { key: "school", label: "School", minLen: 2 },
    { key: "targetRole", label: "Target role", minLen: 3 },
    { key: "jobSearchWhy", label: "Why you're job searching", minLen: 20 },
    { key: "skillsCanDo", label: "Skills you can demonstrate" },
    { key: "projects", label: "At least one project" },
  ];

export function profileCompleteness(profile: StudentProfile): {
  percent: number;
  missing: string[];
} {
  const missing: string[] = [];
  let filled = 0;
  const total = PROFILE_FIELDS.length;

  for (const { key, label, minLen } of PROFILE_FIELDS) {
    const val = profile[key];
    let ok = false;
    if (Array.isArray(val)) ok = val.length > 0;
    else if (typeof val === "string") ok = minLen ? val.length >= minLen : val.length > 0;
    if (ok) filled += 1;
    else missing.push(label);
  }

  return {
    percent: Math.round((filled / total) * 100),
    missing,
  };
}

import type { CompanySlug, StudentProfile } from "@hermes/shared";

export const COMPANIES: { id: CompanySlug; label: string }[] = [
  { id: "google", label: "Google" },
  { id: "amazon", label: "Amazon" },
  { id: "meta", label: "Meta" },
];

export const DEFAULT_STUDENT: StudentProfile = {
  name: "Alex Student",
  year: "3rd-year",
  school: "University of Calgary",
  interests: ["distributed systems", "backend engineering"],
  githubUrl: "https://github.com/example",
  location: "Calgary, AB",
  targetRole: "software engineering internship",
};

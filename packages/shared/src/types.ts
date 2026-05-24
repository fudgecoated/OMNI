/**
 * Shared web/server contract surface.
 *
 * Review these types first when tracing a feature end-to-end: the frontend,
 * API routes, finder, writer, and follow-up tracker all exchange these shapes.
 */
export type CompanySlug = "google" | "amazon" | "meta";

export type MessageTemplateType = "connection_request" | "cold_email";

export type ContactStatus =
  | "prospect"
  | "contacted"
  | "followup_due"
  | "responded"
  | "interview"
  | "offer"
  | "rejected"
  /** @deprecated use prospect */
  | "pending"
  /** @deprecated use rejected */
  | "unlikely";

export interface Person {
  id: string;
  name: string;
  role: string;
  team: string;
  company: CompanySlug;
  linkedinUrl: string;
  schoolConnection?: string;
  contactMethod: "linkedin" | "email";
  email?: string;
  relevanceScore: number;
}

/** Person discovered via finder (seed or AI) — company may be any name. */
export interface OutreachTarget {
  id: string;
  name: string;
  role: string;
  team: string;
  company: string;
  linkedinUrl: string;
  schoolConnection?: string;
  contactMethod: "linkedin" | "email";
  email?: string;
  relevanceScore?: number;
  tier?: string;
  evidence?: string;
}

export interface FinderSearchRequest {
  company: string;
  role?: string;
  city?: string;
  school?: string;
  teamFocus?: string;
  student?: StudentProfile;
}

export interface CompanyResearch {
  company: string;
  summary: string;
  productsAndTeams: string[];
  cultureValues: string[];
  recentNews: string[];
  techStack: string[];
  hiringSignals: string[];
  internRelevance: string;
  researchedAt: string;
}

export interface JobRoleContext {
  roleTitle: string;
  level: string;
  summary: string;
  responsibilities: string[];
  skillsToEmphasize: string[];
  talkingPoints: string[];
}

export interface ApplicantProject {
  name: string;
  description: string;
  tech: string[];
  link?: string;
  highlight?: string;
}

export interface ApplicantContext {
  name: string;
  school: string;
  year: string;
  location: string;
  targetRole: string;
  interests: string[];
  githubUrl: string;
  linkedinUrl?: string;
  summary: string;
  strengths: string[];
  outreachAngles: string[];
  whoTheyAre: string;
  jobSearchWhy: string;
  careerGoals: string;
  skillsCanDo: string[];
  skillsLearning: string[];
  skillsAvoid: string[];
  projects: ApplicantProject[];
  innovativeWork: string;
  narrativeForAI: string;
}

export interface StudentProfile {
  name: string;
  year: string;
  school: string;
  location: string;
  linkedinUrl?: string;
  githubUrl: string;
  targetRole: string;
  jobSearchWhy: string;
  careerGoals?: string;
  interests: string[];
  skillsCanDo: string[];
  skillsLearning: string[];
  skillsAvoid: string[];
  projects: ApplicantProject[];
  innovativeWork?: string;
}

/** Bundled context for a search pin / outreach draft. */
export interface OutreachContext {
  company?: CompanyResearch;
  jobRole?: JobRoleContext;
  applicant?: ApplicantContext;
}

export interface FinderSearchResponse {
  company: string;
  count: number;
  people: OutreachTarget[];
  source: "hermes_seed_data" | "claude_ai";
  context: OutreachContext;
}

export interface GenerateMessageRequest {
  person: Person;
  student: StudentProfile;
  templateType: MessageTemplateType;
  outreachContext?: OutreachContext;
}

export interface GenerateMessageResponse {
  subject: string;
  body: string;
  templateType: MessageTemplateType;
}

export interface GenerateFollowupRequest {
  person: Person;
  student: StudentProfile;
  previousMessage: string;
  daysSinceContact: number;
  outreachContext?: OutreachContext;
}

export interface GenerateFollowupResponse {
  subject: string;
  body: string;
}

export interface Contact {
  id: string;
  company: string;
  personName: string;
  personRole: string;
  linkedinUrl: string;
  schoolConnection?: string;
  status: ContactStatus;
  firstContactDate: string;
  followupDate?: string;
  notes?: string;
}

export interface CreateContactRequest {
  company: string;
  personName: string;
  personRole: string;
  linkedinUrl: string;
  schoolConnection?: string;
  notes?: string;
  /** Defaults to contacted when logging outreach; use prospect when adding from finder. */
  status?: ContactStatus;
}

export interface UpdateContactRequest {
  status?: ContactStatus;
  followupDate?: string;
  notes?: string;
}

export interface PeopleSearchParams {
  role?: string;
  school?: string;
}

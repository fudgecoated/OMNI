export type CompanySlug = "google" | "amazon" | "meta";

export type MessageTemplateType = "connection_request" | "cold_email";

export type ContactStatus =
  | "pending"
  | "contacted"
  | "followup_due"
  | "responded"
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

export interface StudentProfile {
  name: string;
  year: string;
  school: string;
  interests: string[];
  githubUrl: string;
  location: string;
  targetRole: string;
}

export interface GenerateMessageRequest {
  person: Person;
  student: StudentProfile;
  templateType: MessageTemplateType;
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
}

export interface GenerateFollowupResponse {
  subject: string;
  body: string;
}

export interface Contact {
  id: string;
  company: CompanySlug;
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
  company: CompanySlug;
  personName: string;
  personRole: string;
  linkedinUrl: string;
  schoolConnection?: string;
  notes?: string;
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

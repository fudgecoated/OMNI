import type { ContactStatus } from "./types";

export interface PipelineColumn {
  id: ContactStatus;
  label: string;
  hint: string;
}

/** Kanban columns for job-hunt pipeline (left → right). */
export const PIPELINE_COLUMNS: PipelineColumn[] = [
  { id: "prospect", label: "Prospect", hint: "Found, not messaged yet" },
  { id: "contacted", label: "Contacted", hint: "Outreach sent" },
  { id: "followup_due", label: "Follow-up", hint: "Time to nudge" },
  { id: "responded", label: "Replied", hint: "They wrote back" },
  { id: "interview", label: "Interview", hint: "Screen / loop scheduled" },
  { id: "offer", label: "Offer", hint: "Offer or final round" },
  { id: "rejected", label: "Closed", hint: "No / passed" },
];

export const CONTACT_STATUS_LABELS: Record<ContactStatus, string> = {
  prospect: "Prospect",
  contacted: "Contacted",
  followup_due: "Follow-up due",
  responded: "Replied",
  interview: "Interview",
  offer: "Offer",
  rejected: "Closed",
  // legacy (migrated on read)
  pending: "Prospect",
  unlikely: "Closed",
};

export function normalizeContactStatus(status: string): ContactStatus {
  const map: Record<string, ContactStatus> = {
    pending: "prospect",
    unlikely: "rejected",
  };
  const s = map[status] ?? status;
  if (CONTACT_STATUS_LABELS[s as ContactStatus]) return s as ContactStatus;
  return "prospect";
}

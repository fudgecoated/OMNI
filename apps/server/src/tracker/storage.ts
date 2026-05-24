import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { randomUUID } from "crypto";
import type {
  Contact,
  ContactStatus,
  CreateContactRequest,
  UpdateContactRequest,
} from "@hermes/shared";
import { normalizeContactStatus } from "@hermes/shared";

function resolveDataDir(dataDir?: string): string {
  return dataDir ?? join(process.cwd(), "data");
}

function contactsFile(dataDir: string): string {
  const dir = resolveDataDir(dataDir);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const file = join(dir, "contacts.json");
  if (!existsSync(file)) {
    writeFileSync(file, "[]", "utf-8");
  }
  return file;
}

function normalizeContact(c: Contact): Contact {
  return {
    ...c,
    company: String(c.company),
    status: normalizeContactStatus(c.status),
  };
}

function readAll(dataDir?: string): Contact[] {
  const raw = readFileSync(contactsFile(resolveDataDir(dataDir)), "utf-8");
  return (JSON.parse(raw) as Contact[]).map(normalizeContact);
}

function writeAll(contacts: Contact[], dataDir?: string): void {
  writeFileSync(
    contactsFile(resolveDataDir(dataDir)),
    JSON.stringify(contacts, null, 2),
    "utf-8"
  );
}

function addDays(isoDate: string, days: number): string {
  const d = new Date(isoDate);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

const TERMINAL: ContactStatus[] = ["responded", "interview", "offer", "rejected"];

export function listContacts(dataDir?: string): Contact[] {
  return readAll(dataDir).sort((a, b) =>
    (b.followupDate ?? b.firstContactDate).localeCompare(
      a.followupDate ?? a.firstContactDate
    )
  );
}

export function getContact(id: string, dataDir?: string): Contact | null {
  return readAll(dataDir).find((c) => c.id === id) ?? null;
}

export function createContact(
  input: CreateContactRequest,
  dataDir?: string
): Contact {
  const today = new Date().toISOString().slice(0, 10);
  const status = input.status ? normalizeContactStatus(input.status) : "contacted";
  const contact: Contact = {
    id: randomUUID(),
    company: input.company.trim(),
    personName: input.personName,
    personRole: input.personRole,
    linkedinUrl: input.linkedinUrl,
    schoolConnection: input.schoolConnection,
    status,
    firstContactDate: today,
    followupDate:
      status === "prospect" || TERMINAL.includes(status) ? undefined : addDays(today, 5),
    notes: input.notes,
  };
  const all = readAll(dataDir);
  all.push(contact);
  writeAll(all, dataDir);
  return contact;
}

export function updateContact(
  id: string,
  patch: UpdateContactRequest,
  dataDir?: string
): Contact | null {
  const all = readAll(dataDir);
  const idx = all.findIndex((c) => c.id === id);
  if (idx < 0) return null;

  const current = all[idx];
  const today = new Date().toISOString().slice(0, 10);
  const status = patch.status
    ? normalizeContactStatus(patch.status)
    : current.status;

  const next: Contact = {
    ...current,
    ...patch,
    status,
  };

  if (status === "contacted" && !next.followupDate) {
    next.followupDate = addDays(today, 5);
  }
  if (status === "followup_due" && !patch.followupDate) {
    next.followupDate = today;
  }
  if (TERMINAL.includes(status)) {
    next.followupDate = undefined;
  }

  all[idx] = next;
  writeAll(all, dataDir);
  return next;
}

export function listDueContacts(withinDays = 0, dataDir?: string): Contact[] {
  const today = new Date().toISOString().slice(0, 10);
  return readAll(dataDir).filter((c) => {
    if (!c.followupDate || TERMINAL.includes(c.status)) {
      return false;
    }
    if (c.status !== "contacted" && c.status !== "followup_due") {
      return false;
    }
    if (withinDays <= 0) {
      return c.followupDate <= today;
    }
    const limit = addDays(today, withinDays);
    return c.followupDate >= today && c.followupDate <= limit;
  });
}

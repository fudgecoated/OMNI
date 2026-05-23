import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { randomUUID } from "crypto";
import type {
  Contact,
  ContactStatus,
  CreateContactRequest,
  UpdateContactRequest,
} from "@hermes/shared";

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

function readAll(dataDir?: string): Contact[] {
  const raw = readFileSync(contactsFile(resolveDataDir(dataDir)), "utf-8");
  return JSON.parse(raw) as Contact[];
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

export function listContacts(dataDir?: string): Contact[] {
  return readAll(dataDir).sort((a, b) =>
    (b.followupDate ?? "").localeCompare(a.followupDate ?? "")
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
  const contact: Contact = {
    id: randomUUID(),
    company: input.company,
    personName: input.personName,
    personRole: input.personRole,
    linkedinUrl: input.linkedinUrl,
    schoolConnection: input.schoolConnection,
    status: "contacted",
    firstContactDate: today,
    followupDate: addDays(today, 5),
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
  const next: Contact = {
    ...current,
    ...patch,
    status: (patch.status ?? current.status) as ContactStatus,
  };

  if (patch.status === "responded") {
    next.followupDate = undefined;
  }

  all[idx] = next;
  writeAll(all, dataDir);
  return next;
}

export function listDueContacts(withinDays = 0, dataDir?: string): Contact[] {
  const today = new Date().toISOString().slice(0, 10);
  return readAll(dataDir).filter((c) => {
    if (!c.followupDate || c.status === "responded" || c.status === "unlikely") {
      return false;
    }
    if (withinDays <= 0) {
      return c.followupDate <= today;
    }
    const limit = addDays(today, withinDays);
    return c.followupDate >= today && c.followupDate <= limit;
  });
}

import { existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const moduleDir = dirname(fileURLToPath(import.meta.url));

/** Resolve `data/mock_people.json` regardless of process.cwd() (turbo / monorepo). */
export function mockPeoplePath(): string {
  const candidates = [
    join(process.cwd(), "data", "mock_people.json"),
    join(process.cwd(), "..", "..", "data", "mock_people.json"),
    join(moduleDir, "..", "..", "..", "..", "data", "mock_people.json"),
  ];
  for (const path of candidates) {
    if (existsSync(path)) return path;
  }
  throw new Error(
    `mock_people.json not found. Tried:\n${candidates.join("\n")}`
  );
}

/** Directory for runtime `contacts.json` (tracker CRM). */
export function contactsDataDir(): string {
  const fromEnv = process.env.HERMES_CONTACTS_DATA_DIR?.trim();
  if (fromEnv) return fromEnv;

  if (process.env.VERCEL || process.env.VERCEL_ENV) {
    return join("/tmp", "hermes-data");
  }

  const candidates = [
    join(process.cwd(), "data"),
    join(process.cwd(), "apps", "server", "data"),
    join(moduleDir, "..", "..", "data"),
  ];
  for (const path of candidates) {
    if (existsSync(path)) return path;
  }
  return join(process.cwd(), "data");
}

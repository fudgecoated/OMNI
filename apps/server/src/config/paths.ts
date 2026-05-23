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

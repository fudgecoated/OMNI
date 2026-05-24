import { existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const moduleDir = dirname(fileURLToPath(import.meta.url));

function resolveDataFile(name: string): string | null {
  const candidates = [
    join(process.cwd(), "data", name),
    join(process.cwd(), "..", "..", "data", name),
    join(moduleDir, "..", "..", "..", "..", "data", name),
  ];
  for (const path of candidates) {
    if (existsSync(path)) return path;
  }
  return null;
}

export function westjetSearchSamplePath(): string | null {
  return resolveDataFile("westjet-search-sample.json");
}

import { config } from "dotenv";
import { existsSync } from "fs";
import { join } from "path";

/** Load repo-root `.env` (works on Node 18+ without --env-file). */
export function loadEnv(): void {
  const candidates = [
    join(process.cwd(), "../../.env"),
    join(process.cwd(), ".env"),
    join(process.cwd(), "../../../.env"),
  ];
  for (const path of candidates) {
    if (existsSync(path)) {
      config({ path, override: true });
      return;
    }
  }
}

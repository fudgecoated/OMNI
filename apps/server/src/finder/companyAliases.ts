import type { CompanySlug } from "@hermes/shared";

/** Map common names → seed-data slug (google | amazon | meta). */
const ALIASES: Record<string, CompanySlug> = {
  google: "google",
  alphabet: "google",
  amazon: "amazon",
  aws: "amazon",
  meta: "meta",
  facebook: "meta",
};

export function resolveCompanySlug(input: string): CompanySlug | null {
  const key = input.toLowerCase().trim().replace(/[^a-z0-9]/g, "");
  return ALIASES[key] ?? null;
}

export function displayCompanyName(input: string): string {
  return input.trim() || "Unknown";
}

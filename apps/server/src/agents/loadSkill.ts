import { existsSync, readFileSync, readdirSync } from "fs";
import { join } from "path";

/** Skills live at apps/server/skills/<name>/SKILL.md (works in dev + production). */
function skillsDir(): string {
  return join(process.cwd(), "skills");
}

function stripFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
  if (!raw.startsWith("---")) return { meta: {}, body: raw.trim() };
  const end = raw.indexOf("---", 3);
  if (end === -1) return { meta: {}, body: raw.trim() };
  const front = raw.slice(3, end).trim();
  const body = raw.slice(end + 3).trim();
  const meta: Record<string, string> = {};
  for (const line of front.split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    meta[key] = value;
  }
  return { meta, body };
}

function parseScopes(meta: Record<string, string>): string[] {
  const raw = meta.scopes ?? meta.scope ?? "chat,outreach,finder";
  return raw.split(/[,\s]+/).map((s) => s.trim().toLowerCase()).filter(Boolean);
}

/** List skill folder names that contain SKILL.md */
export function listSkills(): string[] {
  const dir = skillsDir();
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .filter(
      (d) =>
        d.isDirectory() && existsSync(join(dir, d.name, "SKILL.md"))
    )
    .map((d) => d.name);
}

/** Load one skill's markdown body (without YAML frontmatter). */
export function loadSkillBody(skillName: string): string {
  const path = join(skillsDir(), skillName, "SKILL.md");
  if (!existsSync(path)) return "";
  return stripFrontmatter(readFileSync(path, "utf-8")).body;
}

export function loadSkillMeta(skillName: string): Record<string, string> {
  const path = join(skillsDir(), skillName, "SKILL.md");
  if (!existsSync(path)) return {};
  return stripFrontmatter(readFileSync(path, "utf-8")).meta;
}

export type SkillScope = "chat" | "outreach" | "finder" | "profile";

/** Concatenate skills matching scopes for injection into prompts. */
export function buildSkillsSystemBlock(scopes: SkillScope[] = ["chat", "outreach"]): string {
  const scopeSet = new Set(scopes);
  const names = listSkills().filter((name) => {
    const skillScopes = parseScopes(loadSkillMeta(name));
    return skillScopes.some((s) => scopeSet.has(s as SkillScope));
  });

  if (names.length === 0) return "";

  const blocks = names.map((name) => {
    const body = loadSkillBody(name);
    return `# Runtime skill: ${name}\n\n${body}`;
  });

  return `\n\n---\n# Available agent skills\n\nFollow matching skills exactly. Use tools instead of guessing.\n\n${blocks.join("\n\n---\n\n")}`;
}

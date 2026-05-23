import { existsSync, readFileSync, readdirSync } from "fs";
import { join } from "path";

/** Skills live at apps/server/skills/<name>/SKILL.md (works in dev + production). */
function skillsDir(): string {
  return join(process.cwd(), "skills");
}

function stripFrontmatter(raw: string): string {
  if (!raw.startsWith("---")) return raw.trim();
  const end = raw.indexOf("---", 3);
  if (end === -1) return raw.trim();
  return raw.slice(end + 3).trim();
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
  return stripFrontmatter(readFileSync(path, "utf-8"));
}

/** Concatenate all skills for injection into the chat system prompt. */
export function buildSkillsSystemBlock(): string {
  const names = listSkills();
  if (names.length === 0) return "";

  const blocks = names.map((name) => {
    const body = loadSkillBody(name);
    return `# Runtime skill: ${name}\n\n${body}`;
  });

  return `\n\n---\n# Available agent skills\n\nWhen the user's request matches a skill below, follow that skill exactly. Use tools instead of guessing.\n\n${blocks.join("\n\n---\n\n")}`;
}

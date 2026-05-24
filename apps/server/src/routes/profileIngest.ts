import type { Request, Response } from "express";
import { generateText, stepCountIs } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import type { StudentProfile } from "@hermes/shared";
import { buildProfileMarkdown, normalizeStudentProfile } from "@hermes/shared";
import { buildSkillsSystemBlock } from "../agents/loadSkill";
import { parseJsonBlock } from "../agents/context/parseJsonBlock";
import { AppError } from "../middleware/errorHandler";

const INGEST_SYSTEM = `You are Hermes profile ingest. Read the student's files and links, then fill their applicant profile.

Return ONLY a fenced JSON block:

\`\`\`json
{
  "profileUpdates": {
    "name": "...",
    "skillsCanDo": ["..."],
    "projects": [{"name":"...","description":"...","tech":["..."],"link":"...","highlight":"..."}]
  },
  "contextMarkdown": "# Applicant context\\n\\n..."
}
\`\`\`

profileUpdates: partial StudentProfile fields (only fields you can support from evidence).
contextMarkdown: complete markdown narrative for outreach (sections: Who they are, Target role, Why job searching, Can demonstrate, Learning, Do not claim, Projects, Innovative work).

Never invent experience. If sources are thin, keep profileUpdates minimal and note gaps in contextMarkdown.`;

interface IngestFile {
  name: string;
  text: string;
}

interface ProfileIngestBody {
  profile: StudentProfile;
  links?: string[];
  files?: IngestFile[];
}

interface IngestResult {
  profileUpdates?: Partial<StudentProfile>;
  contextMarkdown?: string;
}

export async function profileIngestRoute(req: Request, res: Response): Promise<void> {
  try {
    const body = req.body as ProfileIngestBody;
    const profile = normalizeStudentProfile(body.profile);
    const links = (body.links ?? []).map((l) => l.trim()).filter(Boolean);
    const files = body.files ?? [];

    if (links.length === 0 && files.length === 0) {
      throw new AppError(400, "Add at least one link or file to import.");
    }

    let model;
    let tools = {};
    if (process.env.ANTHROPIC_API_KEY) {
      const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      model = anthropic("claude-sonnet-4-6");
      tools = { web_search: anthropic.tools.webSearch_20250305({ maxUses: 5 }) };
    } else if (process.env.OPENAI_API_KEY) {
      model = createOpenAI({ apiKey: process.env.OPENAI_API_KEY })("gpt-4o-mini");
    } else {
      throw new AppError(500, "Set ANTHROPIC_API_KEY or OPENAI_API_KEY for profile import.");
    }

    const fileBlock = files
      .map((f) => `### File: ${f.name}\n${f.text.slice(0, 24_000)}`)
      .join("\n\n");
    const linkBlock = links.map((l) => `- ${l}`).join("\n");

    const prompt = [
      "## Current profile (merge, don't discard unless sources replace)",
      JSON.stringify(profile, null, 2),
      "",
      "## Links to read",
      linkBlock || "(none)",
      "",
      "## File contents",
      fileBlock || "(none)",
    ].join("\n");

    const result = await generateText({
      model,
      system: INGEST_SYSTEM + buildSkillsSystemBlock(["profile"]),
      prompt,
      tools,
      stopWhen: stepCountIs(8),
    });

    const parsed = parseJsonBlock<IngestResult>(result.text);
    const profileUpdates = parsed?.profileUpdates
      ? normalizeStudentProfile({ ...profile, ...parsed.profileUpdates })
      : profile;

    const contextMarkdown =
      parsed?.contextMarkdown?.trim() || buildProfileMarkdown(profileUpdates);

    res.json({
      profileUpdates: parsed?.profileUpdates ?? {},
      profile: profileUpdates,
      contextMarkdown,
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error("Profile ingest error:", error instanceof Error ? error.message : error);
    throw new AppError(500, "Could not import profile from sources.");
  }
}

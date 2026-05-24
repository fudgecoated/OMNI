import type { Request, Response } from "express";
import { convertToModelMessages, stepCountIs, streamText } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import type { StudentProfile } from "@hermes/shared";
import { normalizeStudentProfile } from "@hermes/shared";
import { buildApplicantContext } from "../agents/context/applicantContext";
import { formatOutreachContextBlock } from "../agents/context/formatContextBlock";
import { buildSkillsSystemBlock } from "../agents/loadSkill";
import { AppError } from "../middleware/errorHandler";
import { parseJsonBlock } from "../agents/context/parseJsonBlock";

const PROFILE_SYSTEM = `You are Hermes Profile Coach. Help the student build and update their applicant profile for internship outreach.

You can:
- Ask clarifying questions
- Suggest what to add (projects, skills, honest limits)
- Propose concrete profile updates

When you want to change the profile, include a fenced JSON block:

\`\`\`json
{"profileUpdates":{"name":"...","jobSearchWhy":"...","skillsCanDo":["..."],"projects":[{"name":"...","description":"...","tech":["Go"],"highlight":"..."}]}}
\`\`\`

Only include fields you are changing. Never invent employers or fake projects — use what the student told you.

After the JSON block, briefly confirm what you updated in plain language.`;

interface ProfileChatBody {
  messages: import("ai").UIMessage[];
  profile: StudentProfile;
}

export async function profileChatRoute(req: Request, res: Response): Promise<void> {
  try {
    const body = req.body as ProfileChatBody;
    if (!body?.messages?.length) {
      throw new AppError(400, "messages are required");
    }

    const profile = normalizeStudentProfile(body.profile);
    const applicant = buildApplicantContext(profile);
    const contextBlock = formatOutreachContextBlock({ applicant });

    let model;
    if (process.env.ANTHROPIC_API_KEY) {
      model = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY })("claude-sonnet-4-6");
    } else if (process.env.OPENAI_API_KEY) {
      model = createOpenAI({ apiKey: process.env.OPENAI_API_KEY })("gpt-4o-mini");
    } else {
      throw new AppError(500, "Set ANTHROPIC_API_KEY or OPENAI_API_KEY for profile coach.");
    }

    const system =
      PROFILE_SYSTEM +
      buildSkillsSystemBlock(["outreach"]) +
      `\n\nCurrent profile:\n${contextBlock}`;

    const result = streamText({
      model,
      system,
      messages: await convertToModelMessages(body.messages),
      stopWhen: stepCountIs(6),
    });

    const response = result.toUIMessageStreamResponse();
    Object.entries(Object.fromEntries(response.headers.entries())).forEach(
      ([key, value]) => res.setHeader(key, value)
    );
    res.status(response.status);

    const reader = response.body?.getReader();
    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
      res.end();
    } else {
      res.end();
    }
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error("Profile chat error:", error instanceof Error ? error.message : error);
    throw new AppError(500, "Profile coach unavailable.");
  }
}

export function extractProfileUpdates(text: string): Partial<StudentProfile> | null {
  const parsed = parseJsonBlock<{ profileUpdates?: Partial<StudentProfile> }>(text);
  return parsed?.profileUpdates ?? null;
}

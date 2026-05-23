import type { Request, Response } from "express";
import { convertToModelMessages, stepCountIs, streamText, type UIMessage } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import type { LanguageModel } from "ai";
import type { Person, StudentProfile } from "@hermes/shared";
import { buildSkillsSystemBlock } from "../agents/loadSkill";
import { hermesTools } from "../agents/tools/registry";
import { AppError } from "../middleware/errorHandler";

const BASE_SYSTEM_PROMPT = `You are Hermes, an outreach coach for University of Calgary software engineering students targeting Big Tech internships.

Help the student:
- Choose who to contact and why
- Draft and improve cold LinkedIn messages and emails
- Plan polite follow-ups after 5 days

Rules:
- Be concise and actionable
- Never claim you sent messages — the student copies and sends manually
- When a target person is provided, personalize advice to their role and team
- Remind them to review every draft before sending
- When a runtime skill applies, follow its steps and use \`find_company_people\` — never invent names or LinkedIn URLs`;

interface ChatBody {
  messages: UIMessage[];
  student?: StudentProfile;
  selectedPerson?: Person | null;
}

function resolveChatModel(): LanguageModel {
  if (process.env.ANTHROPIC_API_KEY) {
    return createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY })(
      "claude-sonnet-4-6"
    );
  }
  if (process.env.OPENAI_API_KEY) {
    return createOpenAI({ apiKey: process.env.OPENAI_API_KEY })("gpt-4o-mini");
  }
  throw new AppError(
    500,
    "Set ANTHROPIC_API_KEY or OPENAI_API_KEY in .env to use the outreach coach."
  );
}

function buildContextBlock(student?: StudentProfile, person?: Person | null): string {
  const parts: string[] = [];
  if (student) {
    parts.push(
      `Student: ${student.name}, ${student.year} at ${student.school}, interests: ${student.interests.join(", ")}, target: ${student.targetRole}`
    );
  }
  if (person) {
    parts.push(
      `Selected contact: ${person.name}, ${person.role} on ${person.team} at ${person.company}${person.schoolConnection ? `, ${person.schoolConnection}` : ""}`
    );
  }
  return parts.length ? `\n\nContext:\n${parts.join("\n")}` : "";
}

export async function chatRoute(req: Request, res: Response): Promise<void> {
  try {
    const body = req.body as ChatBody;
    if (!body?.messages?.length) {
      throw new AppError(400, "messages are required");
    }

    const system =
      BASE_SYSTEM_PROMPT +
      buildSkillsSystemBlock() +
      buildContextBlock(body.student, body.selectedPerson ?? null);

    const result = streamText({
      model: resolveChatModel(),
      system,
      messages: await convertToModelMessages(body.messages),
      tools: hermesTools,
      stopWhen: stepCountIs(10),
    });

    const response = result.toUIMessageStreamResponse();
    Object.entries(Object.fromEntries(response.headers.entries())).forEach(
      ([key, value]) => res.setHeader(key, value)
    );
    res.status(response.status);

    const reader = response.body?.getReader();
    if (reader) {
      const pump = async () => {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          res.write(value);
        }
        res.end();
      };
      await pump();
    } else {
      res.end();
    }
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error("Chat error:", error instanceof Error ? error.message : error);
    throw new AppError(500, "Something went wrong. Please try again.");
  }
}

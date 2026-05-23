import type { Request, Response } from "express";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import type { Person, StudentProfile } from "@hermes/shared";
import { AppError } from "../middleware/errorHandler";

const SYSTEM_PROMPT = `You are Hermes, an outreach coach for University of Calgary software engineering students targeting Big Tech internships.

Help the student:
- Choose who to contact and why
- Draft and improve cold LinkedIn messages and emails
- Plan polite follow-ups after 5 days

Rules:
- Be concise and actionable
- Never claim you sent messages — the student copies and sends manually
- When a target person is provided, personalize advice to their role and team
- Remind them to review every draft before sending`;

interface ChatBody {
  messages: UIMessage[];
  student?: StudentProfile;
  selectedPerson?: Person | null;
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

    if (!process.env.OPENAI_API_KEY) {
      throw new AppError(
        500,
        "OPENAI_API_KEY not configured. Add it to .env to use the outreach coach."
      );
    }

    const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const system = SYSTEM_PROMPT + buildContextBlock(body.student, body.selectedPerson ?? null);

    const result = streamText({
      model: openai("gpt-4o-mini"),
      system,
      messages: await convertToModelMessages(body.messages),
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

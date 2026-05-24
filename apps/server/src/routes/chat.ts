import type { Request, Response } from "express";
import { convertToModelMessages, stepCountIs, streamText, type UIMessage } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import type { LanguageModel, ToolSet } from "ai";
import type { OutreachContext, OutreachTarget, Person, StudentProfile } from "@hermes/shared";
import { normalizeStudentProfile } from "@hermes/shared";
import { formatOutreachContextBlock } from "../agents/context/formatContextBlock";
import { buildApplicantContext } from "../agents/context/applicantContext";
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
- Use company research, job role context, and applicant context when drafting — be specific, not generic
- When a target person is provided, personalize to their role, team, and company brief
- Remind them to review every draft before sending
- For hiring lookups: use find_hiring_contacts first; if it returns suggestedQueries, run web_search
- Only cite real people with linkedin.com/in URLs — never invent names or URLs`;

interface ChatBody {
  messages: UIMessage[];
  student?: StudentProfile;
  selectedPerson?: Person | null;
  selectedTargets?: OutreachTarget[];
  outreachContext?: OutreachContext;
}

function buildChatTools(): { model: LanguageModel; tools: ToolSet } {
  if (process.env.ANTHROPIC_API_KEY) {
    const anthropic = createAnthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    return {
      model: anthropic("claude-sonnet-4-6"),
      tools: {
        ...hermesTools,
        web_search: anthropic.tools.webSearch_20250305({ maxUses: 8 }),
      },
    };
  }

  if (process.env.OPENAI_API_KEY) {
    return {
      model: createOpenAI({ apiKey: process.env.OPENAI_API_KEY })("gpt-4o-mini"),
      tools: hermesTools,
    };
  }

  throw new AppError(
    500,
    "Set ANTHROPIC_API_KEY or OPENAI_API_KEY in .env to use the outreach coach."
  );
}

function resolveOutreachContext(body: ChatBody): OutreachContext {
  const ctx = { ...(body.outreachContext ?? {}) };
  const companyName =
    ctx.company?.company ?? body.selectedTargets?.[0]?.company;
  if (body.student) {
    ctx.applicant = buildApplicantContext(
      normalizeStudentProfile(body.student),
      companyName
    );
  } else if (!ctx.applicant) {
    ctx.applicant = buildApplicantContext(undefined, companyName);
  }
  return ctx;
}

function buildContextBlock(
  student?: StudentProfile,
  person?: Person | null,
  targets?: OutreachTarget[],
  outreachContext?: OutreachContext
): string {
  const parts: string[] = [];

  const ctx = outreachContext ?? {};
  const formatted = formatOutreachContextBlock(ctx);
  if (formatted) parts.push(formatted);

  if (student && !ctx.applicant) {
    parts.push(
      `Student: ${student.name}, ${student.year} at ${student.school}, interests: ${student.interests.join(", ")}, target: ${student.targetRole}`
    );
  }

  const outreach = targets?.length
    ? targets
    : person
      ? [
          {
            id: person.id,
            name: person.name,
            role: person.role,
            team: person.team,
            company: person.company,
            linkedinUrl: person.linkedinUrl,
            schoolConnection: person.schoolConnection,
            contactMethod: person.contactMethod,
          } satisfies OutreachTarget,
        ]
      : [];

  if (outreach.length) {
    parts.push(
      `Outreach targets (${outreach.length}):\n` +
        outreach
          .map(
            (t, i) =>
              `${i + 1}. ${t.name} — ${t.role} (${t.team}) at ${t.company}${t.schoolConnection ? `, ${t.schoolConnection}` : ""} · ${t.linkedinUrl}`
          )
          .join("\n")
    );
  }
  return parts.length ? `\n\nContext:\n${parts.join("\n\n")}` : "";
}

export async function chatRoute(req: Request, res: Response): Promise<void> {
  try {
    const body = req.body as ChatBody;
    if (!body?.messages?.length) {
      throw new AppError(400, "messages are required");
    }

    const outreachContext = resolveOutreachContext(body);
    const { model, tools } = buildChatTools();
    const system =
      BASE_SYSTEM_PROMPT +
      buildSkillsSystemBlock(["chat", "outreach"]) +
      buildContextBlock(
        body.student,
        body.selectedPerson ?? null,
        body.selectedTargets,
        outreachContext
      );

    const result = streamText({
      model,
      system,
      messages: await convertToModelMessages(body.messages),
      tools,
      stopWhen: stepCountIs(12),
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

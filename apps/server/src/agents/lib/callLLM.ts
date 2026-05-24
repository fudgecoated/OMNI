import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

export interface CallLLMOptions {
  prompt: string;
  system?: string;
  model?: string;
  fastModel?: boolean;
  timeoutMs?: number;
}

/**
 * Shared LLM helper — instantiate client per call (see lessons-learned: env at request time).
 */
export async function callLLM(opts: CallLLMOptions): Promise<string> {
  const modelId =
    opts.model ?? (opts.fastModel ? "gpt-4o-mini" : "gpt-4o-mini");
  const timeoutMs = opts.timeoutMs ?? 60_000;

  const model = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY ?? "",
  })(modelId);

  let timeoutHandle: ReturnType<typeof setTimeout> | undefined;
  try {
    const result = await Promise.race<{ text: string }>([
      generateText({
        model,
        prompt: opts.prompt,
        system: opts.system,
      }),
      new Promise<never>((_, reject) => {
        timeoutHandle = setTimeout(
          () => reject(new Error(`callLLM timeout after ${timeoutMs}ms`)),
          timeoutMs
        );
      }),
    ]);
    return result.text;
  } finally {
    if (timeoutHandle) clearTimeout(timeoutHandle);
  }
}

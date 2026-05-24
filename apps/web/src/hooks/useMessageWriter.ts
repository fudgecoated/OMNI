import { useCallback, useState } from "react";
import type {
  GenerateMessageRequest,
  GenerateMessageResponse,
  MessageTemplateType,
  OutreachContext,
  Person,
  StudentProfile,
} from "@hermes/shared";
import { apiFetch } from "../lib/api";

export function useMessageWriter() {
  const [result, setResult] = useState<GenerateMessageResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(
    async (
      person: Person,
      student: StudentProfile,
      templateType: MessageTemplateType,
      outreachContext?: OutreachContext
    ): Promise<GenerateMessageResponse | null> => {
      setLoading(true);
      setError(null);
      try {
        const body: GenerateMessageRequest = {
          person,
          student,
          templateType,
          outreachContext,
        };
        const data = await apiFetch<GenerateMessageResponse>(
          "/api/messages/generate",
          { method: "POST", body: JSON.stringify(body) }
        );
        setResult(data);
        return data;
      } catch (e) {
        setError(e instanceof Error ? e.message : "Generation failed");
        setResult(null);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { result, loading, error, generate };
}

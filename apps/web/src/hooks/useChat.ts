import { useCallback, useEffect, useMemo, useRef } from "react";
import { useChat as useAISDKChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import type { OutreachContext, OutreachTarget, StudentProfile } from "@hermes/shared";
import { apiUrl } from "../lib/api";

const CHAT_API_URL = apiUrl("/api/chat");

interface UseHermesChatOptions {
  chatId: string;
  initialMessages: UIMessage[];
  student: StudentProfile;
  selectedTargets: OutreachTarget[];
  outreachContext?: OutreachContext;
  onPersist: (messages: UIMessage[]) => void;
}

export function useHermesChat({
  chatId,
  initialMessages,
  student,
  selectedTargets,
  outreachContext,
  onPersist,
}: UseHermesChatOptions) {
  const studentRef = useRef(student);
  studentRef.current = student;
  const targetsRef = useRef(selectedTargets);
  targetsRef.current = selectedTargets;
  const contextRef = useRef(outreachContext);
  contextRef.current = outreachContext;
  const onPersistRef = useRef(onPersist);
  onPersistRef.current = onPersist;

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: CHAT_API_URL,
        body: () => ({
          student: studentRef.current,
          selectedTargets: targetsRef.current,
          outreachContext: contextRef.current,
        }),
      }),
    []
  );

  const {
    messages: uiMessages,
    sendMessage,
    status,
    error,
  } = useAISDKChat({
    id: chatId,
    messages: initialMessages,
    transport,
    onError: (err) => console.error("Chat error:", err),
  });

  const isLoading = status === "submitted" || status === "streaming";

  const persistRef = useRef(uiMessages);
  useEffect(() => {
    if (uiMessages === persistRef.current) return;
    persistRef.current = uiMessages;
    if (uiMessages.length === 0) return;
    onPersistRef.current(uiMessages);
  }, [uiMessages]);

  useEffect(() => {
    if (status === "ready" && uiMessages.length > 0) {
      onPersistRef.current(uiMessages);
    }
  }, [status, uiMessages]);

  const send = useCallback(
    (text: string) => {
      if (!text.trim() || isLoading) return;
      sendMessage({ text: text.trim() });
    },
    [isLoading, sendMessage]
  );

  return {
    uiMessages,
    isLoading,
    error: error?.message ?? null,
    send,
  };
}

export const WELCOME_MESSAGE: UIMessage = {
  id: "welcome",
  role: "assistant",
  parts: [
    {
      type: "text",
      text: "I'm Weave, your outreach coach. Use **People Finder** to search any company, select contacts, then ask me to draft messages or plan follow-ups.",
    },
  ],
};

export const WELCOME_SUGGESTIONS = [
  "Draft a LinkedIn message for my selected contacts",
  "What should I mention as a UCalgary SWE student?",
  "Write a polite 5-day follow-up",
];

export const FINDER_CHAT_SUGGESTIONS = [
  "Who should I message first from these results?",
  "Which contacts best fit my profile?",
  "What should I mention about this company?",
];

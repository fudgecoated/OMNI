import { useCallback, useMemo, useRef } from "react";
import { useChat as useAISDKChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import type { Person, StudentProfile } from "@hermes/shared";

const CHAT_API_URL = "/api/chat";

interface UseHermesChatOptions {
  student: StudentProfile;
  selectedPerson: Person | null;
}

export function useHermesChat({ student, selectedPerson }: UseHermesChatOptions) {
  const studentRef = useRef(student);
  studentRef.current = student;
  const personRef = useRef(selectedPerson);
  personRef.current = selectedPerson;

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: CHAT_API_URL,
        body: () => ({
          student: studentRef.current,
          selectedPerson: personRef.current,
        }),
      }),
    []
  );

  const {
    messages: uiMessages,
    sendMessage,
    status,
    error,
    setMessages,
  } = useAISDKChat({
    transport,
    onError: (err) => console.error("Chat error:", err),
  });

  const isLoading = status === "submitted" || status === "streaming";

  const send = useCallback(
    (text: string) => {
      if (!text.trim() || isLoading) return;
      sendMessage({ text: text.trim() });
    },
    [isLoading, sendMessage]
  );

  const clearChat = useCallback(() => {
    setMessages([]);
  }, [setMessages]);

  return {
    uiMessages,
    isLoading,
    error: error?.message ?? null,
    send,
    clearChat,
  };
}

export const WELCOME_MESSAGE: UIMessage = {
  id: "welcome",
  role: "assistant",
  parts: [
    {
      type: "text",
      text: "I'm Hermes — your outreach coach. Pick someone in People Finder, then ask me to help draft a message or plan a follow-up.",
    },
  ],
};

export const WELCOME_SUGGESTIONS = [
  "Help me draft a LinkedIn message for the selected person",
  "What should I mention as a UCalgary SWE student?",
  "Write a polite 5-day follow-up",
];

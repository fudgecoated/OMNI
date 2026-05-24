import { useCallback, useMemo, useRef } from "react";
import { useChat as useAISDKChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import type { StudentProfile } from "@hermes/shared";
import { getStudentProfile } from "../stores/profileStore";
import { parseJsonBlock } from "../lib/parseJsonBlock";
import { apiUrl } from "../lib/api";

const PROFILE_CHAT_API = apiUrl("/api/profile/chat");

export const PROFILE_WELCOME: UIMessage = {
  id: "profile-welcome",
  role: "assistant",
  parts: [
    {
      type: "text",
      text: "I'm your profile coach. Tell me about your projects, skills, and job goals — I'll help fill in your profile. Try: \"I built a distributed systems lab in Go\" or \"Add a summer internship goal at Big Tech.\"",
    },
  ],
};

export const PROFILE_SUGGESTIONS = [
  "Add my latest hackathon project",
  "I'm strong in Go and distributed systems",
  "Why should I fill in skills I can't claim?",
];

export function useProfileChat(initialMessages: UIMessage[]) {
  const profileRef = useRef(getStudentProfile());
  profileRef.current = getStudentProfile();

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: PROFILE_CHAT_API,
        body: () => ({ profile: profileRef.current }),
      }),
    []
  );

  const { messages, sendMessage, status, error } = useAISDKChat({
    id: "hermes-profile-coach",
    messages: initialMessages,
    transport,
    onError: (err) => console.error("Profile chat error:", err),
  });

  const isLoading = status === "submitted" || status === "streaming";

  const send = useCallback(
    (text: string) => {
      if (!text.trim() || isLoading) return;
      sendMessage({ text: text.trim() });
    },
    [isLoading, sendMessage]
  );

  return {
    messages,
    isLoading,
    error: error?.message ?? null,
    send,
  };
}

export function getProfileUpdatesFromMessages(
  messages: UIMessage[]
): Partial<StudentProfile> | null {
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (msg.role !== "assistant") continue;
    for (const part of msg.parts) {
      if (part.type !== "text") continue;
      const parsed = parseJsonBlock<{ profileUpdates?: Partial<StudentProfile> }>(
        part.text
      );
      if (parsed?.profileUpdates) return parsed.profileUpdates;
    }
  }
  return null;
}

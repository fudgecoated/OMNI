import type { UIMessage } from "ai";

export function messageText(message: UIMessage): string {
  return (
    message.parts
      ?.filter((p) => p.type === "text")
      .map((p) => ("text" in p ? p.text : ""))
      .join("") ?? ""
  );
}

export function conversationTitle(messages: UIMessage[]): string {
  const firstUser = messages.find((m) => m.role === "user");
  if (!firstUser) return "New chat";
  const text = messageText(firstUser).trim().replace(/\s+/g, " ");
  if (!text) return "New chat";
  if (text.length <= 42) return text;
  return `${text.slice(0, 42)}…`;
}
